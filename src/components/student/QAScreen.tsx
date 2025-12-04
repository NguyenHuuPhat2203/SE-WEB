import React, { useState, useEffect } from 'react';
import {
  Plus, MessageSquare, Send, User, ChevronLeft, ThumbsUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';
import { questionsAPI, authAPI } from '../../services/api';
import { formatQuestion } from '../../services/dataFormatters';

interface Answer {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  isTutor?: boolean;
}

interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  time: string;
  topic: string;
  tags: string[];
  answers: Answer[];
}

export function QAScreen({ language }: { language: Language }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionTopic, setNewQuestionTopic] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newAnswerContent, setNewAnswerContent] = useState('');

  // Load questions from backend
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      if (response.success) {
        const formatted = response.data.map((q: any) => ({
          ...formatQuestion(q),
          answers: (q.answers || []).map((ans: any) => ({
            id: ans._id,
            author: `${ans.author?.firstName || ''} ${ans.author?.lastName || ''}`.trim() || 'Anonymous',
            content: ans.content,
            time: new Date(ans.createdAt).toLocaleString(),
            likes: ans.upvotes || 0,
            isTutor: ans.author?.role === 'tutor'
          }))
        }));
        setQuestions(formatted);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error(language === 'en' ? 'Failed to load questions' : 'Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handlePostQuestion = async () => {
    if (!newQuestionTitle || !newQuestionTopic || !newQuestionContent) {
      toast.error(language === 'en' ? 'Please fill all fields' : 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const user = authAPI.getCurrentUser();
    if (!user) {
      toast.error(language === 'en' ? 'Please login first' : 'Vui lòng đăng nhập');
      return;
    }

    try {
      const response = await questionsAPI.create({
        title: newQuestionTitle,
        content: newQuestionContent,
        topic: newQuestionTopic,
        tags: [],
        userId: user.id
      });

      if (response.success) {
        setNewQuestionTitle('');
        setNewQuestionTopic('');
        setNewQuestionContent('');
        setNewQuestionDialogOpen(false);
        toast.success(t.successQuestion);
        // Reload questions
        loadQuestions();
      }
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error(language === 'en' ? 'Failed to post question' : 'Không thể đăng câu hỏi');
    }
  };

  const t = {
    title: language === 'en' ? 'Ask a Question' : 'Đặt câu hỏi',
    newQuestion: language === 'en' ? 'Create new topic' : 'Tạo chủ đề mới',
    topic: language === 'en' ? 'Topic' : 'Chủ đề',
    questionTitle: language === 'en' ? 'Question Title' : 'Tiêu đề câu hỏi',
    questionContent: language === 'en' ? 'Question Content' : 'Nội dung câu hỏi',
    post: language === 'en' ? 'Post question' : 'Đăng câu hỏi',
    cancel: language === 'en' ? 'Cancel' : 'Hủy',
    answers: language === 'en' ? 'answers' : 'câu trả lời',
    answered: language === 'en' ? 'Answered' : 'Đã trả lời',
    unanswered: language === 'en' ? 'Unanswered' : 'Chưa trả lời',
    successQuestion: language === 'en' ? 'Question posted successfully!' : 'Đã đăng câu hỏi!',
    back: language === 'en' ? 'Back' : 'Quay lại',
    yourAnswer: language === 'en' ? 'Your answer' : 'Câu trả lời của bạn',
    postAnswer: language === 'en' ? 'Post answer' : 'Đăng câu trả lời',
    successAnswer: language === 'en' ? 'Answer posted successfully!' : 'Đã đăng câu trả lời!',
    noAnswers: language === 'en' ? 'No answers yet. Be the first to answer!' : 'Chưa có câu trả lời. Hãy là người đầu tiên trả lời!'
  };

  const handlePostAnswer = () => {
    if (!newAnswerContent || selectedQuestionId === null) return;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === selectedQuestionId) {
          const newAns: Answer = {
            id: q.answers.length + 1,
            author: 'You',
            content: newAnswerContent,
            time: 'Just now',
            likes: 0
          };
          return { ...q, answers: [...q.answers, newAns] };
        }
        return q;
      })
    );
    setNewAnswerContent('');
    toast.success(t.successAnswer);
  };

  if (selectedQuestionId !== null) {
    const question = questions.find((q) => q.id === selectedQuestionId)!;
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedQuestionId(null)} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" /> {t.back}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{question.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <span>{question.author}</span>
              <span>• {question.time}</span>
              <span>• <Badge>{question.topic}</Badge></span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{question.content}</p>
          </CardContent>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{t.answers} ({question.answers.length})</h2>
          {question.answers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">{t.noAnswers}</CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {question.answers.map((ans) => (
                <Card key={ans.id}>
                  <CardContent className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{ans.author}</span>
                        {ans.isTutor && <Badge variant="default">Tutor</Badge>}
                        <span className="text-sm text-gray-500">• {ans.time}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{ans.content}</p>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" /> {ans.likes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card>
          <CardHeader><CardTitle>{t.yourAnswer}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={newAnswerContent}
                onChange={(e) => setNewAnswerContent(e.target.value)}
                rows={6}
                placeholder={language === 'en' ? 'Type your answer here...' : 'Nhập câu trả lời của bạn...'}
              />
              <Button onClick={handlePostAnswer} disabled={!newAnswerContent.trim()}>
                <Send className="h-4 w-4 mr-2" /> {t.postAnswer}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        <Dialog open={newQuestionDialogOpen} onOpenChange={setNewQuestionDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> {t.newQuestion}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t.newQuestion}</DialogTitle>
              <DialogDescription>Ask a question to the community</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>{t.topic}</label>
                <Select value={newQuestionTopic} onValueChange={setNewQuestionTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                    <SelectItem value="Networks">Networks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>{t.questionTitle}</label>
                <Input value={newQuestionTitle} onChange={(e) => setNewQuestionTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label>{t.questionContent}</label>
                <Textarea value={newQuestionContent} onChange={(e) => setNewQuestionContent(e.target.value)} rows={6} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewQuestionDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={handlePostQuestion}>{t.post}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            {language === 'en' ? 'Loading questions...' : 'Đang tải câu hỏi...'}
          </CardContent>
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            {language === 'en' ? 'No questions yet. Be the first to ask!' : 'Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card key={q.id} className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedQuestionId(q.id)}>
            <CardContent className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{q.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{q.author}</span> <span>•</span>
                  <span>{q.time}</span> <span>•</span>
                  <Badge variant="outline">{q.topic}</Badge>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4" /> <span>{q.answers.length || 0} {t.answers}</span>
                </div>
                <Badge variant={q.answers.length > 0 ? 'default' : 'secondary'}>
                  {q.answers.length > 0 ? t.answered : t.unanswered}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        )}
    </div>
  );
}
