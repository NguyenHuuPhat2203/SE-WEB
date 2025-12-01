import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import type { Language } from '../../App';

const mockStaff = [
  { id: 1, name: 'Dr. Nguyen Duc Dung', role: 'Tutor', department: 'Computer Science', email: 'dung.nguyenduc@hcmut.edu.vn', status: 'Active', sessions: 45, rating: 4.8, avatar: '' },
  { id: 2, name: 'Mai Duc Trung', role: 'Tutor', department: 'Computer Science', email: 'trung.maiduc@hcmut.edu.vn', status: 'Active', sessions: 38, rating: 4.6, avatar: '' },
  { id: 3, name: 'Dr. Le Thanh Sach', role: 'Tutor', department: 'Computer Science', email: 'sach.lethanh@hcmut.edu.vn', status: 'Active', sessions: 52, rating: 4.9, avatar: '' }
];

export function ManageStaffScreen({ language }: { language: Language }) {
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<typeof mockStaff[0] | null>(null);

  const t = {
    title: language === 'en' ? 'Manage Staff' : 'Quản lý nhân sự',
    search: language === 'en' ? 'Search staff...' : 'Tìm kiếm nhân sự...',
    name: language === 'en' ? 'Name' : 'Tên',
    role: language === 'en' ? 'Role' : 'Vai trò',
    department: language === 'en' ? 'Department' : 'Khoa',
    email: 'Email',
    status: language === 'en' ? 'Status' : 'Trạng thái',
    actions: language === 'en' ? 'Actions' : 'Thao tác',
    viewDetail: language === 'en' ? 'View detail' : 'Xem chi tiết',
    sessions: language === 'en' ? 'Total sessions' : 'Tổng buổi tư vấn',
    avgRating: language === 'en' ? 'Average rating' : 'Đánh giá trung bình',
    active: language === 'en' ? 'Active' : 'Hoạt động'
  };

  const filteredStaff = mockStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900">{t.title}</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.role}</TableHead>
                <TableHead>{t.department}</TableHead>
                <TableHead>{t.email}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <span>{staff.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Badge variant="default">{t.active}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedStaff(staff)}>
                      {t.viewDetail}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <SheetContent>
          {selectedStaff && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                    <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedStaff.name}</SheetTitle>
                    <SheetDescription>{selectedStaff.role}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600">{t.department}</p>
                  <p className="text-gray-900">{selectedStaff.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.email}</p>
                  <p className="text-gray-900">{selectedStaff.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.sessions}</p>
                  <p className="text-2xl">{selectedStaff.sessions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t.avgRating}</p>
                  <p className="text-2xl">{selectedStaff.rating}/5</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
