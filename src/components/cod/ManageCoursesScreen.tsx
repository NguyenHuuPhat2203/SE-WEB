import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, FileText,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';

export function ManageCoursesAndRequests({ language }: { language: Language }) {
  const [screen, setScreen] = useState<'list' | 'requests'>('list');
  const [reloadCourses, setReloadCourses] = useState(false); // trigger reload when approving requests

  return (
    <div className="p-6">
      {screen === 'list' ? (
        <ManageCoursesScreen
          language={language}
          onNavigate={() => setScreen('requests')}
          reloadTrigger={reloadCourses}
        />
      ) : (
        <CourseRequestsScreen
          language={language}
          onNavigateBack={() => setScreen('list')}
          onApproved={() => setReloadCourses((r) => !r)}
        />
      )}
    </div>
  );
}

//
// ========== MANAGE COURSES =========
//
function ManageCoursesScreen({
  language,
  onNavigate,
  reloadTrigger,
}: {
  language: Language;
  onNavigate: () => void;
  reloadTrigger: boolean;
}) {
  const [courses, setCourses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('Computer Science');

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
  };

  // Fetch course list
  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/courses');
      const json = await res.json();
      if (json.success) setCourses(json.data);
    } catch {
      toast.error('Cannot load courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [reloadTrigger]);

  const handleSave = async () => {
    if (!courseCode.trim() || !courseName.trim() || !department.trim()) {
      toast.error('Missing fields');
      return;
    }

    const body = { code: courseCode, name: courseName, department };

    if (editingCourse) {
      // PUT update
      const res = await fetch(`http://localhost:3001/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) toast.success('Course updated');
    } else {
      // POST create
      const res = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) toast.success('Course added');
    }

    setOpen(false);
    setEditingCourse(null);
    setCourseCode('');
    setCourseName('');
    setDepartment('Computer Science');
    fetchCourses();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/courses/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) toast.success('Course deleted');
    fetchCourses();
  };

  const filteredCourses = courses.filter(
    (c) =>
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
                <DialogDescription>
                  {editingCourse ? 'Edit course details' : 'Add a new course'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <Label>{t.code}</Label>
                  <Input
                    placeholder="e.g. CS301"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>

                <div>
                  <Label>{t.name}</Label>
                  <Input
                    placeholder="e.g. Machine Learning"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>{t.department}</Label>
                  <Input
                    placeholder="e.g. Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {t.cancel}
                </Button>
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
            <Input
              className="pl-10"
              placeholder={t.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell className="text-right">{course.numTutors}</TableCell>
                  <TableCell className="text-right">{course.numStudents}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCourse(course);
                          setCourseCode(course.code);
                          setCourseName(course.name);
                          setDepartment(course.department || 'Computer Science');
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
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

//
// ========== 2️⃣ COURSE REQUESTS =========
//
function CourseRequestsScreen({
  language,
  onNavigateBack,
  onApproved,
}: {
  language: Language;
  onNavigateBack: () => void;
  onApproved: () => void;
}) {
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRequests = async () => {
    const res = await fetch('http://localhost:3001/api/course-requests');
    const json = await res.json();
    if (json.success) setRequests(json.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/course-requests/${id}/approve`, {
      method: 'PATCH',
    });
    const json = await res.json();
    if (json.success) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
      toast.success('Request approved!');
      onApproved();
    } else toast.error(json.message);
  };

  const handleReject = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/course-requests/${id}/reject`, {
      method: 'PATCH',
    });
    const json = await res.json();
    if (json.success) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
      toast.success('Request rejected!');
    } else toast.error(json.message);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.includes(search) ||
      r.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      r.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBadge = (status: string) => {
    if (status === 'pending')
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    if (status === 'approved')
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Approved
        </Badge>
      );
    return (
      <Badge className="bg-red-50 text-red-700 border-red-200">
        <XCircle className="h-3 w-3 mr-1" /> Rejected
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">Course Requests</h1>
          <p className="text-gray-600">Review and manage student course requests</p>
        </div>
        <Button variant="outline" onClick={onNavigateBack}>
          Back
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Request date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{req.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
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
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-xs">{req.reason}</p>
                  </TableCell>
                  <TableCell>{getBadge(req.status)}</TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleApprove(req.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleReject(req.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
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
