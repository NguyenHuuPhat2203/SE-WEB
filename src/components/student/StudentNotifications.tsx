import { useState } from 'react';
import { Filter, Mail, MailOpen, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';

interface Notification {
  id: number;
  subject: string;
  sender: string;
  time: string;
  unread: boolean;
  type: 'course' | 'consultation' | 'contest' | 'system';
  content: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    subject: 'New consultation session available',
    sender: 'Dr. Le Thanh Sach',
    time: '2 hours ago',
    unread: true,
    type: 'consultation',
    content:
      'A new consultation session on Data Structures is now available. Date: Tomorrow at 2:00 PM.',
  },
  {
    id: 2,
    subject: 'Contest: Algorithm Challenge 2025',
    sender: 'Contest System',
    time: '5 hours ago',
    unread: true,
    type: 'contest',
    content:
      'New algorithm contest is open for registration. Join now to compete with other students!',
  },
  {
    id: 3,
    subject: 'Course material updated',
    sender: 'Mai Duc Trung',
    time: '1 day ago',
    unread: false,
    type: 'course',
    content:
      'New lecture slides for Database Systems have been uploaded to the course portal.',
  },
  {
    id: 4,
    subject: 'System maintenance notification',
    sender: 'System Admin',
    time: '2 days ago',
    unread: false,
    type: 'system',
    content:
      'The tutor support system will undergo maintenance on Saturday from 2:00 AM to 4:00 AM.',
  },
  {
    id: 5,
    subject: 'Q&A answer received',
    sender: 'Dr. Le Thanh Sach',
    time: '3 days ago',
    unread: false,
    type: 'course',
    content:
      'Your question about Machine Learning algorithms has been answered by Dr. Le Thi D.',
  },
];

interface SentNotification {
  id: number;
  to: string;
  subject: string;
  content: string;
  time: string;
}

interface StudentNotificationsProps {
  language: Language;
  onUnreadChange: (count: number) => void;
  allowCompose?: boolean;
}

export function StudentNotifications({
  language,
  onUnreadChange,
  allowCompose,
}: StudentNotificationsProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(notifications[0]);
  const [filter, setFilter] = useState('all');

  // 👇 state cho sent notifications
  const [viewMode, setViewMode] = useState<'inbox' | 'sent'>('inbox');
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>(
    [],
  );
  const [selectedSent, setSelectedSent] =
    useState<SentNotification | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');

  // compose dialog
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');

  const t = {
    title: language === 'en' ? 'Notifications' : 'Thông báo',
    compose:
      language === 'en' ? 'Compose notification' : 'Soạn thông báo',
    filterType:
      language === 'en' ? 'Filter by type' : 'Lọc theo loại',
    all: language === 'en' ? 'All' : 'Tất cả',
    course: language === 'en' ? 'Course' : 'Môn học',
    consultation: language === 'en' ? 'Consultation' : 'Tư vấn',
    contest: language === 'en' ? 'Contest' : 'Cuộc thi',
    system: language === 'en' ? 'System' : 'Hệ thống',
    to: language === 'en' ? 'To' : 'Đến',
    subject: language === 'en' ? 'Subject' : 'Tiêu đề',
    content: language === 'en' ? 'Content' : 'Nội dung',
    send: language === 'en' ? 'Send' : 'Gửi',
    cancel: language === 'en' ? 'Cancel' : 'Hủy',
    from: language === 'en' ? 'From' : 'Từ',
    sentSuccess:
      language === 'en' ? 'Sent successfully!' : 'Gửi thành công!',
    // text mới cho Inbox / Sent
    inbox: language === 'en' ? 'Inbox' : 'Hộp thư đến',
    sent: language === 'en' ? 'Sent' : 'Đã gửi',
    noSent:
      language === 'en'
        ? 'No sent notifications yet'
        : 'Chưa có thông báo đã gửi',
    selectSent:
      language === 'en'
        ? 'Select a sent notification to view and edit'
        : 'Chọn một thông báo đã gửi để xem và chỉnh sửa',
    editSent:
      language === 'en'
        ? 'Edit sent notification'
        : 'Chỉnh sửa thông báo đã gửi',
    saveChanges:
      language === 'en' ? 'Save changes' : 'Lưu thay đổi',
    updatedSuccess:
      language === 'en'
        ? 'Notification updated successfully!'
        : 'Cập nhật thông báo thành công!',
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.unread) {
      const updated = notifications.map((n) =>
        n.id === notification.id ? { ...n, unread: false } : n,
      );
      setNotifications(updated);
      onUnreadChange(updated.filter((n) => n.unread).length);
    }
    setSelectedNotification(notification);
  };

  const handleSend = () => {
    // tạo 1 bản ghi sent mới
    const newSent: SentNotification = {
      id: sentNotifications.length + 1,
      to: composeTo || 'student@hcmut.edu.vn',
      subject: composeSubject || '(No subject)',
      content: composeContent || '',
      time: language === 'en' ? 'Just now' : 'Vừa xong',
    };

    setSentNotifications((prev) => [newSent, ...prev]);
    setSelectedSent(newSent);
    setEditSubject(newSent.subject);
    setEditContent(newSent.content);

    toast.success(t.sentSuccess);
    setComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeContent('');
    setViewMode('sent'); // chuyển sang tab Sent để review luôn
  };

  const handleSentClick = (sent: SentNotification) => {
    setSelectedSent(sent);
    setEditSubject(sent.subject);
    setEditContent(sent.content);
  };

  const handleUpdateSent = () => {
    if (!selectedSent) return;

    const updated = sentNotifications.map((n) =>
      n.id === selectedSent.id
        ? { ...n, subject: editSubject, content: editContent }
        : n,
    );
    setSentNotifications(updated);
    setSelectedSent({
      ...selectedSent,
      subject: editSubject,
      content: editContent,
    });
    toast.success(t.updatedSuccess);
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>

        {allowCompose && (
          <div className="flex items-center gap-2">
            {/* Toggle Inbox / Sent */}
            <div className="flex rounded-md border overflow-hidden">
              <button
                type="button"
                className={`px-3 py-1 text-sm ${viewMode === 'inbox'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setViewMode('inbox')}
              >
                {t.inbox}
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm border-l ${viewMode === 'sent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                onClick={() => setViewMode('sent')}
              >
                {t.sent}
              </button>
            </div>

            {/* Nút compose */}
            <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.compose}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.compose}</DialogTitle>
                  <DialogDescription>
                    Send a notification to students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="to">{t.to}</Label>
                    <Input
                      id="to"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      placeholder="student@hcmut.edu.vn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t.subject}</Label>
                    <Input
                      id="subject"
                      value={composeSubject}
                      onChange={(e) =>
                        setComposeSubject(e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">{t.content}</Label>
                    <Textarea
                      id="content"
                      value={composeContent}
                      onChange={(e) =>
                        setComposeContent(e.target.value)
                      }
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setComposeOpen(false)}
                  >
                    {t.cancel}
                  </Button>
                  <Button onClick={handleSend}>{t.send}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Nếu không cho compose (student), luôn ở Inbox */}
      {!allowCompose && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t.filterType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.all}</SelectItem>
                <SelectItem value="course">{t.course}</SelectItem>
                <SelectItem value="consultation">
                  {t.consultation}
                </SelectItem>
                <SelectItem value="contest">{t.contest}</SelectItem>
                <SelectItem value="system">{t.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Khi allowCompose: hiển thị khác nhau theo viewMode */}
      {allowCompose ? (
        viewMode === 'inbox' ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t.filterType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all}</SelectItem>
                    <SelectItem value="course">{t.course}</SelectItem>
                    <SelectItem value="consultation">
                      {t.consultation}
                    </SelectItem>
                    <SelectItem value="contest">
                      {t.contest}
                    </SelectItem>
                    <SelectItem value="system">{t.system}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Notifications List */}
              <div className="lg:col-span-1 space-y-2">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors ${selectedNotification?.id === notification.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'hover:bg-gray-50'
                      }`}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {notification.unread ? (
                          <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <MailOpen className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`text-sm truncate ${notification.unread
                                  ? ''
                                  : 'text-gray-600'
                                }`}
                            >
                              {notification.subject}
                            </h3>
                            {notification.unread && (
                              <Badge
                                variant="default"
                                className="text-xs flex-shrink-0"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {notification.sender}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Notification Detail */}
              <div className="lg:col-span-2">
                {selectedNotification ? (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-gray-900 mb-4">
                        {selectedNotification.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <span>
                          {t.from}: {selectedNotification.sender}
                        </span>
                        <span>•</span>
                        <span>{selectedNotification.time}</span>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-gray-700">
                          {selectedNotification.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center text-gray-500">
                      Select a notification to view
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        ) : (
          // 🔁 SENT VIEW
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sent list */}
            <div className="lg:col-span-1 space-y-2">
              {sentNotifications.length === 0 ? (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center text-gray-500">
                    {t.noSent}
                  </CardContent>
                </Card>
              ) : (
                sentNotifications.map((s) => (
                  <Card
                    key={s.id}
                    className={`cursor-pointer transition-colors ${selectedSent?.id === s.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'hover:bg-gray-50'
                      }`}
                    onClick={() => handleSentClick(s)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm truncate">
                          {s.subject}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {t.to}: {s.to}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.time}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sent detail + edit */}
            <div className="lg:col-span-2">
              {selectedSent ? (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-gray-900 mb-2">
                      {t.editSent}
                    </h2>
                    <div className="text-sm text-gray-600 mb-2">
                      <span>
                        {t.to}: {selectedSent.to}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{selectedSent.time}</span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-subject">{t.subject}</Label>
                      <Input
                        id="edit-subject"
                        value={editSubject}
                        onChange={(e) =>
                          setEditSubject(e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-content">
                        {t.content}
                      </Label>
                      <Textarea
                        id="edit-content"
                        rows={6}
                        value={editContent}
                        onChange={(e) =>
                          setEditContent(e.target.value)
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // reset về dữ liệu hiện tại nếu cancel
                          setEditSubject(selectedSent.subject);
                          setEditContent(selectedSent.content);
                        }}
                      >
                        {t.cancel}
                      </Button>
                      <Button onClick={handleUpdateSent}>
                        {t.saveChanges}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center text-gray-500">
                    {t.selectSent}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
      ) : (
        // Trường hợp student (không allowCompose): luôn dùng Inbox view
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-1 space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-colors ${selectedNotification?.id === notification.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'hover:bg-gray-50'
                  }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {notification.unread ? (
                      <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <MailOpen className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm truncate ${notification.unread
                              ? ''
                              : 'text-gray-600'
                            }`}
                        >
                          {notification.subject}
                        </h3>
                        {notification.unread && (
                          <Badge
                            variant="default"
                            className="text-xs flex-shrink-0"
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {notification.sender}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notification Detail */}
          <div className="lg:col-span-2">
            {selectedNotification ? (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-gray-900 mb-4">
                    {selectedNotification.subject}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <span>
                      {t.from}: {selectedNotification.sender}
                    </span>
                    <span>•</span>
                    <span>{selectedNotification.time}</span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">
                      {selectedNotification.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center text-gray-500">
                  Select a notification to view
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
