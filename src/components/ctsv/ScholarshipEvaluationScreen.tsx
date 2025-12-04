import { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';
import { reportsAPI } from '../../services/api';

interface StudentActivity {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department?: string;
  consultations: number;
  contests: number;
  questions: number;
  avgEval: number;
  activityScore: number;
}

export function ScholarshipEvaluationScreen({ language }: { language: Language }) {
  const [semester, setSemester] = useState('2025-1');
  const [department, setDepartment] = useState('all');
  const [students, setStudents] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentActivity();
  }, [semester, department]);

  const loadStudentActivity = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getStudentActivity(semester, department);
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error('Error loading student activity:', error);
      toast.error(language === 'en' ? 'Failed to load student data' : 'Không thể tải dữ liệu sinh viên');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: language === 'en' ? 'Scholarship Evaluation' : 'Đánh giá học bổng',
    semester: language === 'en' ? 'Semester' : 'Học kỳ',
    department: language === 'en' ? 'Department' : 'Khoa',
    all: language === 'en' ? 'All' : 'Tất cả',
    export: language === 'en' ? 'Export table' : 'Xuất bảng',
    studentName: language === 'en' ? 'Student name' : 'Tên sinh viên',
    studentId: language === 'en' ? 'Student ID' : 'Mã sinh viên',
    consultations: language === 'en' ? 'Consultations attended' : 'Buổi tư vấn tham gia',
    contests: language === 'en' ? 'Contests joined' : 'Cuộc thi tham gia',
    avgEval: language === 'en' ? 'Avg evaluation' : 'Đánh giá TB',
    activityScore: language === 'en' ? 'Activity score' : 'Điểm hoạt động'
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default">Excellent</Badge>;
    if (score >= 75) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="outline">Fair</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-gray-900">{t.title}</h1>
        <p className="text-gray-500 mt-4">Loading student activity data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900">{t.title}</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-1">{t.semester} 2025-1</SelectItem>
                  <SelectItem value="2024-2">{t.semester} 2024-2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="ee">Electrical Engineering</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            {/* Export Button with Toast */}
            <Button
              variant="outline"
              onClick={() =>
                toast.success(language === 'en' ? 'Downloaded' : 'Đã tải xuống')
              }
            >
              <Download className="h-4 w-4 mr-2" />
              {t.export}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.studentName}</TableHead>
                <TableHead>{t.studentId}</TableHead>
                <TableHead className="text-right">{t.consultations}</TableHead>
                <TableHead className="text-right">{t.contests}</TableHead>
                <TableHead className="text-right">{t.avgEval}</TableHead>
                <TableHead className="text-right">{t.activityScore}</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    {language === 'en' ? 'No student data available' : 'Không có dữ liệu sinh viên'}
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell className="text-right">{student.consultations}</TableCell>
                    <TableCell className="text-right">{student.contests}</TableCell>
                    <TableCell className="text-right">{student.avgEval}</TableCell>
                    <TableCell className="text-right">{student.activityScore}</TableCell>
                    <TableCell className="text-right">{getScoreBadge(student.activityScore)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
