import { useState } from 'react';
import { Plus, MapPin, Video, Users, Calendar, Clock, User, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../App';

interface ConsultationProps {
  language: Language;
}

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'offline' | 'online';
  location: string;
  students: Array<{
    id: number;
    name: string;
    status: 'registered' | 'attended' | 'absent';
    avatar?: string;
  }>;
  description?: string;
  objectives?: string[];
  materials?: string[];
}

export function ConsultationScreen({ language }: ConsultationProps) {
  const t = {
    title: language === 'en' ? 'Consultation Sessions' : 'Buổi tư vấn',
    create: language === 'en' ? 'Create consultation session' : 'Tạo buổi tư vấn',
    date: language === 'en' ? 'Date' : 'Ngày',
    time: language === 'en' ? 'Time' : 'Thời gian',
    type: language === 'en' ? 'Type' : 'Loại',
    inPerson: language === 'en' ? 'In-person' : 'Trực tiếp',
    online: language === 'en' ? 'Online' : 'Trực tuyến',
    location: language === 'en' ? 'Location' : 'Địa điểm',
    meetingLink: language === 'en' ? 'Meeting link' : 'Liên kết cuộc họp',
    description: language === 'en' ? 'Description and objectives' : 'Mô tả và mục tiêu',
    cancel: language === 'en' ? 'Cancel' : 'Hủy',
    students: language === 'en' ? 'students' : 'sinh viên',
    success: language === 'en' ? 'Session created successfully!' : 'Đã tạo buổi tư vấn!',
    back: language === 'en' ? 'Back' : 'Quay lại',
    registered: language === 'en' ? 'Registered' : 'Đã đăng ký',
    attended: language === 'en' ? 'Attended' : 'Đã tham gia',
    absent: language === 'en' ? 'Absent' : 'Vắng mặt',
    objectives: language === 'en' ? 'Objectives' : 'Mục tiêu',
    materials: language === 'en' ? 'Materials' : 'Tài liệu',
    joinMeeting: language === 'en' ? 'Join Meeting' : 'Tham gia cuộc họp',
  };

  // ======== State ========
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      title: 'Data Structures - Binary Trees',
      date: 'Dec 20, 2025',
      time: '14:00 - 15:00',
      type: 'offline',
      location: 'Room A1-101',
      students: [],
    },
    {
      id: 2,
      title: 'Algorithm Analysis',
      date: 'Dec 21, 2025',
      time: '10:00 - 11:30',
      type: 'online',
      location: 'https://teams.microsoft.com/...',
      students: [],
    },
    {
      id: 3,
      title: 'Dynamic Programming',
      date: 'Dec 22, 2025',
      time: '15:00 - 16:00',
      type: 'offline',
      location: 'Room B2-205',
      students: [],
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<'in-person' | 'online'>('in-person');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  // ======== Handlers ========
  const handleCreate = () => {
    if (!title || !date || !time || !location) return toast.error('Please fill all required fields');
    const newSession: Session = {
      id: sessions.length + 1,
      title,
      date,
      time,
      type: sessionType === 'in-person' ? 'offline' : 'online',
      location,
      students: [],
      description,
      objectives: [],
      materials: [],
    };
    setSessions([newSession, ...sessions]);
    toast.success(t.success);
    setOpenDialog(false);
    // reset form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setSessionType('in-person');
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  // ======== Render ========
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!selectedSessionId ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-gray-900">{t.title}</h1>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.create}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{t.create}</DialogTitle>
                  <DialogDescription>Schedule a new consultation session</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">{t.date}</Label>
                      <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">{t.time}</Label>
                      <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.type}</Label>
                    <RadioGroup value={sessionType} onValueChange={(v) => setSessionType(v as 'in-person' | 'online')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person">{t.inPerson}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">{t.online}</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{sessionType === 'in-person' ? t.location : t.meetingLink}</Label>
                    <Input
                      id="location"
                      placeholder={sessionType === 'in-person' ? 'Room name or number' : 'https://teams.microsoft.com/...'}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t.description}</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleCreate}>{t.create}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="cursor-pointer" onClick={() => setSelectedSessionId(session.id)}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">{session.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>
                        {session.date} • {session.time}
                      </span>
                      <Badge variant={session.type === 'online' ? 'default' : 'secondary'}>
                        {session.type === 'offline' ? (
                          <>
                            <MapPin className="h-3 w-3 mr-1" />
                            {t.inPerson}
                          </>
                        ) : (
                          <>
                            <Video className="h-3 w-3 mr-1" />
                            {t.online}
                          </>
                        )}
                      </Badge>
                      <span>
                        {session.students.length} {t.students}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{session.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div>
          <Button variant="ghost" onClick={() => setSelectedSessionId(null)} className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl mb-3">{selectedSession?.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {selectedSession?.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedSession?.time}
                </div>
                <Badge variant={selectedSession?.type === 'online' ? 'default' : 'secondary'}>
                  {selectedSession?.type === 'offline' ? (
                    <>
                      <MapPin className="h-3 w-3 mr-1" />
                      {t.inPerson}
                    </>
                  ) : (
                    <>
                      <Video className="h-3 w-3 mr-1" />
                      {t.online}
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{selectedSession?.type === 'offline' ? t.location : t.meetingLink}</p>
                <p className="font-medium">{selectedSession?.location}</p>
              </div>
              {selectedSession?.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.description}</p>
                  <p>{selectedSession.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5" /> {t.students} ({selectedSession?.students.length})
                </h4>
                {selectedSession?.students.length ? (
                  <div className="space-y-2">
                    {selectedSession.students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.status}</p>
                          </div>
                        </div>
                        <Badge
                          variant={student.status === 'attended' ? 'default' : student.status === 'registered' ? 'secondary' : 'destructive'}
                        >
                          {student.status === 'attended'
                            ? t.attended
                            : student.status === 'registered'
                              ? t.registered
                              : t.absent}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendees yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
