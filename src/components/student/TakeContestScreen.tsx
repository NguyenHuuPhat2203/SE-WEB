import { useState, useEffect } from 'react';
import { ChevronLeft, Clock, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import type { Language } from '../../App';
import { contestsAPI, authAPI } from '../../services/api';

interface TakeContestScreenProps {
  language: Language;
  onBack: () => void;
  contestId: string;
}

export function TakeContestScreen({ language, onBack, contestId }: TakeContestScreenProps) {
  const [contest, setContest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour default

  useEffect(() => {
    loadContestData();
  }, [contestId]);

  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const loadContestData = async () => {
    try {
      setLoading(true);
      const user = authAPI.getCurrentUser();
      if (!user) {
        toast.error(language === 'en' ? 'Please login first' : 'Vui lòng đăng nhập');
        onBack();
        return;
      }

      // Try to load real contest data
      const response = await contestsAPI.getById(contestId);
      if (response.success && response.data) {
        setContest(response.data);
        setQuestions(response.data.questions || []);
        
        // Load best score
        const resultResponse = await contestsAPI.getUserResult(contestId, user.id);
        if (resultResponse.success && resultResponse.data) {
          setBestScore(resultResponse.data.score);
        }
      } else {
        // Use mock data
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading contest:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockContest = {
      _id: contestId,
      title: 'Programming Contest 2024',
      description: 'Test your programming knowledge',
      questions: [
        {
          question: 'What is the time complexity of binary search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'What does SQL stand for?',
          options: ['Structured Query Language', 'Simple Question Language', 'System Quality Level', 'Software Quality Lab'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Which sorting algorithm has O(n log n) average time complexity?',
          options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
          correctAnswer: 2,
          points: 15
        },
        {
          question: 'In OOP, what is inheritance?',
          options: [
            'A way to hide data',
            'A mechanism to create new classes from existing ones',
            'A method to encrypt data',
            'A type of database'
          ],
          correctAnswer: 1,
          points: 15
        }
      ]
    };
    setContest(mockContest);
    setQuestions(mockContest.questions);
  };

  const handleSubmit = async () => {
    const user = authAPI.getCurrentUser();
    if (!user) {
      toast.error(language === 'en' ? 'Please login first' : 'Vui lòng đăng nhập');
      return;
    }

    // Calculate score
    let totalScore = 0;
    const detailedAnswers = questions.map((q, index) => {
      const selectedAnswer = answers[index];
      const isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        totalScore += q.points;
      }
      return {
        questionIndex: index,
        selectedAnswer: selectedAnswer ?? -1,
        isCorrect
      };
    });

    try {
      // Try to submit to backend
      const response = await contestsAPI.submitAnswers(contestId, user.id, detailedAnswers);
      if (response.success) {
        setResult({
          score: totalScore,
          answers: detailedAnswers,
          submittedAt: new Date().toISOString()
        });
        setSubmitted(true);
        toast.success(language === 'en' ? 'Contest submitted successfully!' : 'Đã nộp bài thành công!');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      // Save result locally as fallback
      setResult({
        score: totalScore,
        answers: detailedAnswers,
        submittedAt: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success(language === 'en' ? 'Contest submitted (demo mode)!' : 'Đã nộp bài (chế độ demo)!');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    timeRemaining: language === 'en' ? 'Time Remaining' : 'Thời gian còn lại',
    question: language === 'en' ? 'Question' : 'Câu hỏi',
    points: language === 'en' ? 'points' : 'điểm',
    submit: language === 'en' ? 'Submit Contest' : 'Nộp bài',
    yourScore: language === 'en' ? 'Your Score' : 'Điểm của bạn',
    correct: language === 'en' ? 'Correct' : 'Đúng',
    incorrect: language === 'en' ? 'Incorrect' : 'Sai',
    notAnswered: language === 'en' ? 'Not Answered' : 'Chưa trả lời',
    correctAnswer: language === 'en' ? 'Correct Answer' : 'Đáp án đúng',
    yourAnswer: language === 'en' ? 'Your Answer' : 'Câu trả lời của bạn',
    submittedAt: language === 'en' ? 'Submitted at' : 'Nộp lúc',
    selectAnswer: language === 'en' ? 'Select your answer' : 'Chọn câu trả lời',
    loading: language === 'en' ? 'Loading contest...' : 'Đang tải bài thi...',
    retryContest: language === 'en' ? 'Try Again' : 'Làm lại',
    newBestScore: language === 'en' ? 'New Best Score!' : 'Điểm cao nhất mới!',
    previousBest: language === 'en' ? 'Previous Best' : 'Điểm cao nhất trước',
    currentAttempt: language === 'en' ? 'Current Score' : 'Điểm lần này'
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Contest not found</p>
      </div>
    );
  }

  // Results view after submission
  if (submitted && result) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <Card className="mb-6">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-2">{t.yourScore}</h2>
            <p className="text-5xl font-bold text-purple-600 mb-4">
              {result.score} / {totalPoints}
            </p>
            
            {bestScore !== null && result.score !== bestScore && (
              <div className="mb-4">
                {result.score > bestScore ? (
                  <div className="p-3 bg-green-50 border border-green-300 rounded-lg">
                    <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {t.newBestScore}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {t.previousBest}: {bestScore}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-orange-50 border border-orange-300 rounded-lg">
                    <p className="text-orange-700 font-semibold">{t.currentAttempt}: {result.score}</p>
                    <p className="text-sm text-orange-600 mt-1">
                      {t.previousBest}: {bestScore}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-gray-600 mb-4">
              {t.submittedAt}: {new Date(result.submittedAt).toLocaleString()}
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={onBack}
              >
                {t.back}
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => {
                  setSubmitted(false);
                  setResult(null);
                  setAnswers({});
                  setTimeLeft(3600);
                  loadContestData();
                }}
              >
                <Trophy className="h-4 w-4 mr-2" />
                {t.retryContest}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {questions.map((q, index) => {
            const answer = result.answers.find((a: any) => a.questionIndex === index);
            const isCorrect = answer?.isCorrect;
            const userAnswer = answer?.selectedAnswer;

            return (
              <Card key={index} className={isCorrect ? 'border-green-300' : userAnswer === -1 ? 'border-gray-300' : 'border-red-300'}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {t.question} {index + 1}
                        <Badge variant="outline" className="ml-2">{q.points} {t.points}</Badge>
                      </CardTitle>
                      <p className="text-gray-700 mt-2">{q.question}</p>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    ) : userAnswer === -1 ? (
                      <XCircle className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {q.options.map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded border ${
                          optIndex === q.correctAnswer
                            ? 'bg-green-50 border-green-300'
                            : userAnswer === optIndex && !isCorrect
                            ? 'bg-red-50 border-red-300'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {optIndex === q.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {userAnswer === optIndex && !isCorrect && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm">
                    {userAnswer !== -1 && (
                      <p className="text-gray-600">
                        {t.yourAnswer}: {q.options[userAnswer]}
                      </p>
                    )}
                    <p className="text-green-700 font-medium">
                      {t.correctAnswer}: {q.options[q.correctAnswer]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Contest taking view
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{contest.title}</CardTitle>
          <p className="text-gray-600">{contest.description}</p>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">
                {t.question} {index + 1}
                <Badge variant="outline" className="ml-2">{q.points} {t.points}</Badge>
              </CardTitle>
              <p className="text-gray-700 mt-2">{q.question}</p>
            </CardHeader>
            <CardContent>
              <Label className="text-sm text-gray-600 mb-3 block">{t.selectAnswer}:</Label>
              <RadioGroup
                value={answers[index]?.toString() ?? ''}
                onValueChange={(value) => {
                  setAnswers({ ...answers, [index]: parseInt(value) });
                }}
              >
                <div className="space-y-3">
                  {q.options.map((option: string, optIndex: number) => (
                    <div
                      key={optIndex}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[index] === optIndex
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setAnswers({ ...answers, [index]: optIndex })}
                    >
                      <RadioGroupItem value={optIndex.toString()} id={`q${index}-opt${optIndex}`} />
                      <Label
                        htmlFor={`q${index}-opt${optIndex}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {t.submit}
        </Button>
      </div>
    </div>
  );
}
