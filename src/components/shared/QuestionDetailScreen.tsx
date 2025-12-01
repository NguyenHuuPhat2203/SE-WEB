import { useState } from 'react';
import { MessageSquare, Send, User, ChevronLeft, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';

interface QuestionDetailScreenProps {
  language: Language;
  questionId: number;
  onBack: () => void;
  isTutor?: boolean;
}

const mockQuestionDetails: Record<
  number,
  {
    id: number;
    title: string;
    content: string;
    author: string;
    authorAvatar?: string;
    time: string;
    topic: string;
    tags: string[];
    answers: Array<{
      id: number;
      author: string;
      authorAvatar?: string;
      content: string;
      time: string;
      likes: number;
      isTutor?: boolean;
    }>;
  }
> = {
  1: {
    id: 1,
    title: 'How to implement Binary Search Tree?',
    content: 'I am struggling with the implementation of BST insert method. Can you help explain the recursive approach? I have tried several times but keep getting errors.',
    author: 'Nguyen Huu Phat',
    time: '2 hours ago',
    topic: 'Data Structures',
    tags: ['BST', 'Trees'],
    answers: [
      {
        id: 1,
        author: 'Tran Ngoc Bao Duy',
        content:
          "The recursive approach for BST insertion is elegant. Here's how it works:\n\n1. If the tree is empty, create a new node\n2. If the value is less than the current node, recursively insert into the left subtree\n3. If the value is greater, recursively insert into the right subtree\n4. Return the node (unchanged if already exists)\n\nThis maintains the BST property automatically.",
        time: '1 hour ago',
        likes: 5,
        isTutor: true
      },
      {
        id: 2,
        author: 'Tran Trung Kien',
        content: 'Great question! I found this video helpful: [link]. The key is understanding the base case.',
        time: '30 minutes ago',
        likes: 2
      }
    ]
  },
  2: {
    id: 2,
    title: 'Explain Dynamic Programming approach',
    content: 'What is the difference between memoization and tabulation in DP?',
    author: 'Nguyen Trong Nghia',
    time: '5 hours ago',
    topic: 'Algorithms',
    tags: ['DP', 'Optimization'],
    answers: [
      {
        id: 1,
        author: 'Huynh Huu Nhat',
        content: 'Memoization is top-down (recursive with caching), while tabulation is bottom-up (iterative with table). Both solve overlapping subproblems but use different approaches.',
        time: '3 hours ago',
        likes: 8,
        isTutor: false
      }
    ]
  },
  3: {
    id: 3,
    title: 'Database normalization best practices?',
    content: 'When should I use 3NF vs BCNF?',
    author: 'Doan Manh Tat',
    time: '1 day ago',
    topic: 'Database',
    tags: ['SQL', 'Normalization'],
    answers: []
  }
};

export function QuestionDetailScreen({ language, questionId, onBack, isTutor }: QuestionDetailScreenProps) {
  const [answer, setAnswer] = useState('');

  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    yourAnswer: language === 'en' ? 'Your answer' : 'Câu trả lời của bạn',
    sendAnswer: language === 'en' ? 'Send answer' : 'Gửi câu trả lời',
    postAnswer: language === 'en' ? 'Post answer' : 'Đăng câu trả lời',
    answers: language === 'en' ? 'Answers' : 'Câu trả lời',
    noAnswers: language === 'en' ? 'No answers yet. Be the first to answer!' : 'Chưa có câu trả lời. Hãy là người đầu tiên trả lời!',
    success: language === 'en' ? 'Answer posted successfully!' : 'Đã đăng câu trả lời!',
    from: language === 'en' ? 'From' : 'Từ',
    likes: language === 'en' ? 'likes' : 'thích'
  };

  const question = mockQuestionDetails[questionId as keyof typeof mockQuestionDetails];

  if (!question) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Question not found</p>
      </div>
    );
  }

  const handlePostAnswer = () => {
    if (!answer.trim()) {
      toast.error(language === 'en' ? 'Please enter an answer' : 'Vui lòng nhập câu trả lời');
      return;
    }
    toast.success(t.success);
    setAnswer('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.back}
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{question.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span>
                  {t.from} {question.author}
                </span>
                <span>•</span>
                <span>{question.time}</span>
                <span>•</span>
                <Badge>{question.topic}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {question.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{question.content}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {t.answers} ({question.answers.length})
        </h2>
        {question.answers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">{t.noAnswers}</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {question.answers.map((answerItem) => (
              <Card key={answerItem.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={answerItem.authorAvatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{answerItem.author}</span>
                        {answerItem.isTutor && (
                          <Badge variant="default" className="bg-purple-100 text-purple-700">
                            {language === 'en' ? 'Tutor' : 'Cố vấn'}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">• {answerItem.time}</span>
                      </div>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{answerItem.content}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {answerItem.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.yourAnswer}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder={language === 'en' ? 'Type your answer here...' : 'Nhập câu trả lời của bạn...'}
            />
            <Button onClick={handlePostAnswer} disabled={!answer.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isTutor ? t.sendAnswer : t.postAnswer}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

