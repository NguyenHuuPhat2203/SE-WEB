import { useState, useEffect } from 'react';
import { Plus, Trophy, Users, Download, FileQuestion, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import type { Language } from '../../App';
import { contestsAPI, authAPI } from '../../services/api';
import { formatContest } from '../../services/dataFormatters';

interface Contest {
  id: string;
  title: string;
  type: 'academic' | 'non-academic';
  status: 'open' | 'closed';
  participants: number;
  period: string;
  questions?: any[];
}

export function TutorContestsScreen({ language }: { language: Language }) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [questionsDialogOpen, setQuestionsDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [results, setResults] = useState<any[]>([]);
  
  // Create contest form
  const [contestType, setContestType] = useState<'academic' | 'non-academic'>('academic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('100');
  const [prize, setPrize] = useState('');
  
  // Questions form
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getAll();
      if (response.success && response.data) {
        const formatted = response.data.map(formatContest);
        setContests(formatted);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
      // Use mock data as fallback
      const mockContests = [
        {
          id: '1',
          title: 'Programming Contest 2024',
          type: 'academic' as const,
          description: 'Annual programming competition',
          startDate: '2024-12-15T09:00',
          endDate: '2024-12-20T17:00',
          maxParticipants: 100,
          participants: ['user1', 'user2'],
          prize: '10,000,000 VND',
          organizer: { id: 'tutor1', name: 'Dr. Smith' },
          status: 'open' as const
        },
        {
          id: '2',
          title: 'Math Challenge',
          type: 'academic' as const,
          description: 'Test your mathematical skills',
          startDate: '2024-12-10T10:00',
          endDate: '2024-12-12T18:00',
          maxParticipants: 50,
          participants: ['user3'],
          prize: 'Certificate',
          organizer: { id: 'tutor1', name: 'Dr. Smith' },
          status: 'closed' as const
        }
      ];
      setContests(mockContests);
      toast.warning(language === 'en' ? 'Using demo data (backend unavailable)' : 'Đang dùng dữ liệu demo (backend chưa kết nối)');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: language === 'en' ? 'Manage Contests' : 'Quản lý cuộc thi',
    create: language === 'en' ? 'Create contest' : 'Tạo cuộc thi',
    name: language === 'en' ? 'Contest title' : 'Tiêu đề cuộc thi',
    description: language === 'en' ? 'Description' : 'Mô tả',
    type: language === 'en' ? 'Contest type' : 'Loại cuộc thi',
    academic: language === 'en' ? 'Academic' : 'Học thuật',
    nonAcademic: language === 'en' ? 'Non-academic' : 'Phi học thuật',
    startDate: language === 'en' ? 'Start date' : 'Ngày bắt đầu',
    endDate: language === 'en' ? 'End date' : 'Ngày kết thúc',
    maxParticipants: language === 'en' ? 'Max participants' : 'Số người tham gia tối đa',
    prize: language === 'en' ? 'Prize' : 'Giải thưởng',
    cancel: language === 'en' ? 'Cancel' : 'Hủy',
    save: language === 'en' ? 'Save' : 'Lưu',
    participants: language === 'en' ? 'participants' : 'người tham gia',
    open: language === 'en' ? 'Open' : 'Đang mở',
    closed: language === 'en' ? 'Closed' : 'Đã đóng',
    addQuestions: language === 'en' ? 'Add questions' : 'Thêm câu hỏi',
    viewResults: language === 'en' ? 'View results' : 'Xem kết quả',
    exportResults: language === 'en' ? 'Export CSV' : 'Xuất CSV',
    success: language === 'en' ? 'Contest created successfully!' : 'Đã tạo cuộc thi!',
    questionsSuccess: language === 'en' ? 'Questions added successfully!' : 'Đã thêm câu hỏi!',
    questionLabel: language === 'en' ? 'Question' : 'Câu hỏi',
    optionLabel: language === 'en' ? 'Option' : 'Lựa chọn',
    correctAnswer: language === 'en' ? 'Correct answer' : 'Đáp án đúng',
    points: language === 'en' ? 'Points' : 'Điểm',
    addQuestion: language === 'en' ? 'Add another question' : 'Thêm câu hỏi',
    removeQuestion: language === 'en' ? 'Remove' : 'Xóa',
    studentName: language === 'en' ? 'Student name' : 'Tên sinh viên',
    studentId: language === 'en' ? 'Student ID' : 'Mã sinh viên',
    score: language === 'en' ? 'Score' : 'Điểm',
    submittedAt: language === 'en' ? 'Submitted at' : 'Nộp bài lúc',
    back: language === 'en' ? 'Back' : 'Quay lại'
  };

  const handleCreateContest = async () => {
    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate questions if any
    if (questions.length > 0 && questions[0].question.trim()) {
      for (const q of questions) {
        if (!q.question.trim() || q.options.some((opt: string) => !opt.trim())) {
          toast.error(language === 'en' ? 'Please fill all question fields' : 'Vui lòng điền đầy đủ câu hỏi');
          return;
        }
      }
    }

    const user = authAPI.getCurrentUser();
    if (!user) {
      toast.error(language === 'en' ? 'Please login first' : 'Vui lòng đăng nhập');
      return;
    }

    try {
      const contestData = {
        title,
        type: contestType,
        description,
        startDate,
        endDate,
        maxParticipants: parseInt(maxParticipants) || 100,
        prize: prize || '',
        rules: '',
        userId: user.id
      };
      
      console.log('Creating contest with data:', contestData);
      
      const response = await contestsAPI.create(contestData);

      if (response.success) {
        // If questions were added, save them
        if (questions.length > 0 && questions[0].question.trim()) {
          const questionResponse = await contestsAPI.addQuestions(response.data._id, questions);
          if (!questionResponse.success) {
            console.error('Failed to add questions');
          }
        }
        
        toast.success(t.success);
        setCreateDialogOpen(false);
        resetCreateForm();
        loadContests();
      }
    } catch (error: any) {
      console.error('Error creating contest:', error);
      toast.error(error.message || (language === 'en' ? 'Failed to create contest' : 'Không thể tạo cuộc thi'));
    }
  };

  const resetCreateForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setMaxParticipants('100');
    setPrize('');
    setContestType('academic');
    setQuestions([]);
  };

  const handleAddQuestions = async () => {
    if (!selectedContest) return;

    // Validate questions
    for (const q of questions) {
      if (!q.question.trim() || q.options.some((opt: string) => !opt.trim())) {
        toast.error(language === 'en' ? 'Please fill all question fields' : 'Vui lòng điền đầy đủ câu hỏi');
        return;
      }
    }

    try {
      const response = await contestsAPI.addQuestions(selectedContest.id, questions);
      if (response.success) {
        toast.success(t.questionsSuccess);
        setQuestionsDialogOpen(false);
        setQuestions([{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          points: 10
        }]);
        loadContests();
      }
    } catch (error) {
      console.error('Error adding questions:', error);
      toast.error(language === 'en' ? 'Failed to add questions' : 'Không thể thêm câu hỏi');
    }
  };

  const handleViewResults = async (contest: Contest) => {
    setSelectedContest(contest);
    try {
      const response = await contestsAPI.getResults(contest.id);
      if (response.success) {
        setResults(response.data || []);
        setResultsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error(language === 'en' ? 'Failed to load results' : 'Không thể tải kết quả');
    }
  };

  const handleExportCSV = () => {
    if (!selectedContest || results.length === 0) return;

    const csv = [
      ['Student Name', 'Student ID', 'Email', 'Score', 'Submitted At'],
      ...results.map(r => [
        r.name,
        r.bknetId,
        r.email,
        r.score,
        new Date(r.submittedAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedContest.title}_results.csv`;
    a.click();
    
    toast.success(language === 'en' ? 'Downloaded' : 'Đã tải xuống');
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-gray-900 mb-6">{t.title}</h1>
        <p className="text-gray-500">Loading contests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t.create}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{t.create}</DialogTitle>
              <DialogDescription>Create a new contest for students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-3" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <div className="space-y-2">
                <Label>{t.type}</Label>
                <RadioGroup value={contestType} onValueChange={(v: any) => setContestType(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="academic" />
                    <Label htmlFor="academic" className="cursor-pointer">{t.academic}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-academic" id="non-academic" />
                    <Label htmlFor="non-academic" className="cursor-pointer">{t.nonAcademic}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>{t.name}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.description}</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.startDate}</Label>
                  <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.endDate}</Label>
                  <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.maxParticipants}</Label>
                <Input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t.prize}</Label>
                <Input value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="e.g., 5,000,000 VND + Certificate" />
              </div>

              {/* Questions Section */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Contest Questions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </div>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 border rounded-md p-2">
                  {questions.map((q, qIndex) => (
                    <Card key={qIndex} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <Label className="text-sm font-medium">Question {qIndex + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newQuestions = questions.filter((_, i) => i !== qIndex);
                              setQuestions(newQuestions);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Enter question text"
                          value={q.question}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[qIndex].question = e.target.value;
                            setQuestions(newQuestions);
                          }}
                        />
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Options (Click radio button to mark as correct answer)</Label>
                          <RadioGroup 
                            value={q.correctAnswer.toString()} 
                            onValueChange={(value) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].correctAnswer = parseInt(value);
                              setQuestions(newQuestions);
                            }}
                          >
                            {q.options.map((opt: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <RadioGroupItem
                                  value={optIndex.toString()}
                                  id={`q${qIndex}-opt${optIndex}`}
                                />
                                <Input
                                  placeholder={`Option ${optIndex + 1}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[qIndex].options[optIndex] = e.target.value;
                                    setQuestions(newQuestions);
                                  }}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground min-w-[50px]">Points:</Label>
                          <Input
                            type="number"
                            value={q.points}
                            onChange={(e) => {
                              const newQuestions = [...questions];
                              newQuestions[qIndex].points = parseInt(e.target.value) || 0;
                              setQuestions(newQuestions);
                            }}
                            className="w-20"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {questions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No questions yet. Click "Add Question" to create questions for this contest.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>{t.cancel}</Button>
              <Button onClick={handleCreateContest}>{t.save}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map((contest) => (
          <Card key={contest.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Trophy className={`h-8 w-8 ${contest.type === 'academic' ? 'text-purple-600' : 'text-indigo-600'}`} />
                <Badge variant={contest.status === 'open' ? 'default' : 'secondary'}>
                  {contest.status === 'open' ? t.open : t.closed}
                </Badge>
              </div>
              <CardTitle className="mt-2">{contest.title}</CardTitle>
              <CardDescription>{contest.period}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{contest.participants} {t.participants}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedContest(contest);
                    setQuestionsDialogOpen(true);
                  }}
                >
                  <FileQuestion className="h-4 w-4 mr-2" />
                  {t.addQuestions}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewResults(contest)}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  {t.viewResults}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {contests.length === 0 && (
          <p className="text-gray-500 col-span-full">No contests yet. Create one to get started!</p>
        )}
      </div>

      {/* Questions Dialog */}
      <Dialog open={questionsDialogOpen} onOpenChange={setQuestionsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.addQuestions}</DialogTitle>
            <DialogDescription>Add questions for {selectedContest?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {questions.map((q, qIndex) => (
              <Card key={qIndex}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>{t.questionLabel} {qIndex + 1}</Label>
                    {questions.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}>
                        {t.removeQuestion}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter question..."
                    rows={2}
                  />
                  <div className="space-y-2">
                    {q.options.map((opt: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          placeholder={`${t.optionLabel} ${optIndex + 1}`}
                        />
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === optIndex}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>{t.points}</Label>
                      <Input
                        type="number"
                        value={q.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t.addQuestion}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionsDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleAddQuestions}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.viewResults} - {selectedContest?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between items-center mt-2">
                <span>{results.length} {t.participants}</span>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  {t.exportResults}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {results.length === 0 ? (
              <p className="text-center text-gray-500">No results yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{t.studentName}</TableHead>
                    <TableHead>{t.studentId}</TableHead>
                    <TableHead className="text-right">{t.score}</TableHead>
                    <TableHead>{t.submittedAt}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.bknetId}</TableCell>
                      <TableCell className="text-right font-bold">{result.score}</TableCell>
                      <TableCell>{new Date(result.submittedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
