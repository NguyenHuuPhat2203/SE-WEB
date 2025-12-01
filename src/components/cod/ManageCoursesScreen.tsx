import { useState } from 'react';
import {
  Plus, Search, Edit, Trash2, FileText,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';

export function ManageCoursesAndRequests({ language }: { language: Language }) {
  const [screen, setScreen] = useState<'list' | 'requests'>('list');

  return (
    <div className="p-6">
      {screen === 'list' ? (
        <ManageCoursesScreen language={language} onNavigate={() => setScreen('requests')} />
      ) : (
        <CourseRequestsScreen language={language} onNavigateBack={() => setScreen('list')} />
      )}
    </div>
  );
}

function ManageCoursesScreen({ language, onNavigate }: { language: Language; onNavigate: () => void }) {
  const [courses, setCourses] = useState([
    { id: 1, code: 'CS101', name: 'Data Structures', department: 'Computer Science', tutors: 3, students: 45 },
    { id: 2, code: 'CS102', name: 'Algorithms', department: 'Computer Science', tutors: 4, students: 52 },
    { id: 3, code: 'CS201', name: 'Database Systems', department: 'Computer Science', tutors: 2, students: 38 },
    { id: 4, code: 'CS301', name: 'Machine Learning', department: 'Computer Science', tutors: 3, students: 41 }
  ]);

  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<null | typeof courses[0]>(null);
  const [search, setSearch] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');

  const t = {
    title: language === 'en' ? 'Manage Courses' : 'Quản lý môn học',
    addCourse: language === 'en' ? 'Add course' : 'Thêm môn học',
    viewRequests: language === 'en' ? 'View all requests' : 'Xem tất cả yêu cầu',
    search: language === 'en' ? 'Search courses...' : 'Tìm kiếm môn học...',
    code: language === 'en' ? 'Course code' : 'Mã môn học',
    name: language === 'en' ? 'Course name' : 'Tên môn học',
    department: language === 'en' ? 'Department' : 'Khoa',
    tutors: language === 'en' ? 'Tutors' : 'Cố vấn',
    students: language === 'en' ? 'Students' : 'Sinh viên',
    actions: language === 'en' ? 'Actions' : 'Thao tác',
    cancel: language === 'en' ? 'Cancel' : 'Hủy',
    save: language === 'en' ? 'Save' : 'Lưu',
    successAdd: language === 'en' ? 'Course added successfully!' : 'Đã thêm môn học!',
    successEdit: language === 'en' ? 'Course updated successfully!' : 'Đã cập nhật môn học!',
    successDelete: language === 'en' ? 'Course deleted successfully!' : 'Đã xóa môn học!'
  };

  const handleSave = () => {
    if (editingCourse) {
      // Edit course
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, code: courseCode, name: courseName } : c));
      toast.success(t.successEdit);
    } else {
      // Add new course
      const newCourse = { id: Date.now(), code: courseCode, name: courseName, department: 'Computer Science', tutors: 0, students: 0 };
      setCourses(prev => [newCourse, ...prev]);
      toast.success(t.successAdd);
    }

    setOpen(false);
    setCourseCode('');
    setCourseName('');
    setEditingCourse(null);
  };

  const handleEdit = (course: typeof courses[0]) => {
    setEditingCourse(course);
    setCourseCode(course.code);
    setCourseName(course.name);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast.success(t.successDelete);
  };

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate()}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            {t.viewRequests}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t.addCourse}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : t.addCourse}</DialogTitle>
                <DialogDescription>{editingCourse ? 'Edit the course details' : 'Add a new course to the department'}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label>{t.code}</Label>
                  <Input value={courseCode} onChange={e => setCourseCode(e.target.value)} />
                </div>

                <div>
                  <Label>{t.name}</Label>
                  <Input value={courseName} onChange={e => setCourseName(e.target.value)} />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpen(false); setEditingCourse(null); }}>{t.cancel}</Button>
                <Button onClick={handleSave}>{t.save}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input className="pl-10" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.code}</TableHead>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.department}</TableHead>
                <TableHead className="text-right">{t.tutors}</TableHead>
                <TableHead className="text-right">{t.students}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell className="text-right">{course.tutors}</TableCell>
                  <TableCell className="text-right">{course.students}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseRequestsScreen({ language, onNavigateBack }: { language: Language; onNavigateBack: () => void }) {
  const [requests, setRequests] = useState([
    { id: 1, studentName: 'Nguyen Huu Phat', studentId: '2011234', courseCode: 'CS301', courseName: 'Machine Learning', requestDate: '2024-11-20', status: 'pending', reason: 'Interested in AI and want to build a strong foundation in ML' },
    { id: 2, studentName: 'Doan Manh Tat', studentId: '2011567', courseCode: 'CS201', courseName: 'Advanced Database Systems', requestDate: '2024-11-22', status: 'pending', reason: 'Need this course for specialization in database management' },
    { id: 3, studentName: 'Nguyen Trong Nghia', studentId: '2012890', courseCode: 'CS302', courseName: 'Computer Vision', requestDate: '2024-11-18', status: 'approved', reason: 'Working on a research project related to image processing' }
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const t = {
    title: 'Course Requests',
    description: 'Review and manage student course requests',
    search: 'Search requests...',
    filter: 'Filter by status',
    all: 'All',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    student: 'Student',
    course: 'Course',
    requestDate: 'Request date',
    reason: 'Reason',
    status: 'Status',
    actions: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    approveSuccess: 'Request approved successfully!',
    rejectSuccess: 'Request rejected!'
  };

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    toast.success(t.approveSuccess);
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    toast.success(t.rejectSuccess);
  };

  const filteredRequests = requests.filter(r => {
    const matches =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.includes(search) ||
      r.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      r.courseName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matches && matchesStatus;
  });

  const getBadge = (status: string) => {
    if (status === 'pending')
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    if (status === 'approved')
      return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
    return <Badge className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>
        <Button variant="outline" onClick={onNavigateBack}>Back</Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input className="pl-10" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder={t.filter} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="pending">{t.pending}</SelectItem>
              <SelectItem value="approved">{t.approved}</SelectItem>
              <SelectItem value="rejected">{t.rejected}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.student}</TableHead>
                <TableHead>{t.course}</TableHead>
                <TableHead>{t.requestDate}</TableHead>
                <TableHead>{t.reason}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10"><AvatarFallback>{req.studentName.charAt(0)}</AvatarFallback></Avatar>
                      <div>
                        <p>{req.studentName}</p>
                        <p className="text-xs text-gray-500">{req.studentId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{req.courseName}</p>
                    <p className="text-xs text-gray-500">{req.courseCode}</p>
                  </TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell><p className="text-sm line-clamp-2 max-w-xs">{req.reason}</p></TableCell>
                  <TableCell>{getBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApprove(req.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> {t.approve}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleReject(req.id)}>
                          <XCircle className="h-4 w-4 mr-1" /> {t.reject}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
