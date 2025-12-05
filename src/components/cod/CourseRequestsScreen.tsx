import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';

const mockRequests = [
  {
    id: 1,
    studentName: 'Nguyen Huu Phat',
    studentId: '2011234',
    courseCode: 'CS301',
    courseName: 'Machine Learning',
    requestDate: '2025-11-20',
    status: 'pending',
    reason: 'Interested in AI and want to build a strong foundation in ML',
  },
  {
    id: 2,
    studentName: 'Doan Manh Tat',
    studentId: '2011567',
    courseCode: 'CS201',
    courseName: 'Advanced Database Systems',
    requestDate: '2025-11-22',
    status: 'pending',
    reason: 'Need this course for specialization in database management',
  },
  {
    id: 3,
    studentName: 'Nguyen Trong Nghia',
    studentId: '2012890',
    courseCode: 'CS302',
    courseName: 'Computer Vision',
    requestDate: '2025-11-18',
    status: 'approved',
    reason: 'Working on a research project related to image processing',
  },
  {
    id: 4,
    studentName: 'Phạm Thị D',
    studentId: '2011345',
    courseCode: 'CS202',
    courseName: 'Distributed Systems',
    requestDate: '2025-11-25',
    status: 'pending',
    reason: 'Planning to work in cloud computing after graduation',
  },
  {
    id: 5,
    studentName: 'Huynh Huu Nhat',
    studentId: '2012456',
    courseCode: 'CS203',
    courseName: 'Mobile Application Development',
    requestDate: '2025-11-15',
    status: 'rejected',
    reason: 'Want to develop mobile apps as a career',
  },
  {
    id: 6,
    studentName: 'Tran Trung Kien',
    studentId: '2011678',
    courseCode: 'CS303',
    courseName: 'Natural Language Processing',
    requestDate: '2025-11-24',
    status: 'pending',
    reason: 'Interested in chatbots and language AI applications',
  },
];

export function CourseRequestsScreen({ language }: { language: Language }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const t = {
    title: language === 'en' ? 'Course Requests' : 'Yêu cầu môn học',
    description: language === 'en' ? 'Review and manage student course requests' : 'Xem xét và quản lý yêu cầu môn học của sinh viên',
    search: language === 'en' ? 'Search requests...' : 'Tìm kiếm yêu cầu...',
    filter: language === 'en' ? 'Filter by status' : 'Lọc theo trạng thái',
    all: language === 'en' ? 'All' : 'Tất cả',
    pending: language === 'en' ? 'Pending' : 'Chờ duyệt',
    approved: language === 'en' ? 'Approved' : 'Đã duyệt',
    rejected: language === 'en' ? 'Rejected' : 'Đã từ chối',
    student: language === 'en' ? 'Student' : 'Sinh viên',
    course: language === 'en' ? 'Course' : 'Môn học',
    requestDate: language === 'en' ? 'Request date' : 'Ngày yêu cầu',
    reason: language === 'en' ? 'Reason' : 'Lý do',
    status: language === 'en' ? 'Status' : 'Trạng thái',
    actions: language === 'en' ? 'Actions' : 'Thao tác',
    approve: language === 'en' ? 'Approve' : 'Duyệt',
    reject: language === 'en' ? 'Reject' : 'Từ chối',
    approveSuccess: language === 'en' ? 'Request approved successfully!' : 'Đã duyệt yêu cầu!',
    rejectSuccess: language === 'en' ? 'Request rejected!' : 'Đã từ chối yêu cầu!',
    totalRequests: language === 'en' ? 'Total requests' : 'Tổng yêu cầu',
    pendingRequests: language === 'en' ? 'Pending requests' : 'Yêu cầu chờ duyệt',
    approvedRequests: language === 'en' ? 'Approved requests' : 'Yêu cầu đã duyệt',
  };

  const handleApprove = (id: number) => {
    toast.success(t.approveSuccess);
  };

  const handleReject = (id: number) => {
    toast.success(t.rejectSuccess);
  };

  const filteredRequests = mockRequests.filter(r => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.includes(search) ||
      r.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      r.courseName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {t.pending}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t.approved}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {t.rejected}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.description}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.totalRequests}</p>
                <p className="text-3xl text-purple-700">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.pendingRequests}</p>
                <p className="text-3xl text-yellow-700">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.approvedRequests}</p>
                <p className="text-3xl text-green-700">{stats.approved}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t.filter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="approved">{t.approved}</SelectItem>
                <SelectItem value="rejected">{t.rejected}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
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
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {request.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{request.studentName}</p>
                        <p className="text-xs text-gray-500">{request.studentId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{request.courseName}</p>
                      <p className="text-xs text-gray-500">{request.courseCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{request.requestDate}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-xs">{request.reason}</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t.approve}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {t.reject}
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
