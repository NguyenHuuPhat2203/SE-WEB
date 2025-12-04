import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Plus, Search, Star, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';
import { sessionsAPI, authAPI } from '../../services/api';
import { formatSession } from '../../services/dataFormatters';

interface ConsultationSessionsScreenProps {
  language: Language;
  onNavigate?: (screen: string, sessionId?: number) => void;
}

interface Session {
  id: number;
  title: string;
  subject: string;
  tutor: string;
  date: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing';
  description: string;
  rating?: number;
  onlineLink?: string;
  type: 'online' | 'offline';
}

export function ConsultationSessionsScreen({ language, onNavigate }: ConsultationSessionsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedSessions, setJoinedSessions] = useState<number[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getAll();
      if (response.success && response.data) {
        const formattedSessions = response.data.map(formatSession);
        setAllSessions(formattedSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error(language === 'en' ? 'Failed to load sessions' : 'Không thể tải danh sách buổi tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: language === 'en' ? 'Consultation Sessions' : 'Các buổi tư vấn',
    description: language === 'en' ? 'Join consultation sessions with tutors' : 'Tham gia các buổi tư vấn với cố vấn',
    mySessions: language === 'en' ? 'My sessions' : 'Buổi tư vấn của tôi',
    upcoming: language === 'en' ? 'Upcoming' : 'Sắp diễn ra',
    ongoing: language === 'en' ? 'Ongoing' : 'Đang diễn ra',
    search: language === 'en' ? 'Search sessions...' : 'Tìm kiếm buổi tư vấn...',
    participants: language === 'en' ? 'participants' : 'người tham gia',
    join: language === 'en' ? 'Join' : 'Tham gia',
    joined: language === 'en' ? 'Joined' : 'Đã tham gia',
    tutor: language === 'en' ? 'Tutor' : 'Cố vấn',
    live: language === 'en' ? 'LIVE' : 'ĐANG PHÁT',
    online: language === 'en' ? 'Online' : 'Trực tuyến',
    offline: language === 'en' ? 'Offline' : 'Tại chỗ',
  };

  // Separate sessions into my sessions and upcoming based on user participation
  const mySessions = allSessions.filter(s => joinedSessions.includes(s.id));
  const upcomingSessions = allSessions.filter(s => !joinedSessions.includes(s.id));

  const [oldMySessions] = useState<Session[]>([
    {
      id: 1,
      title: language === 'en' ? 'Assembly programming guide' : 'Hướng dẫn lập trình Assembly',
      subject: 'Computer Architecture',
      tutor: 'Le Thanh Van',
      date: language === 'en' ? 'Tomorrow, 3:00 PM' : 'Ngày mai, 3:00 CH',
      participants: 12,
      maxParticipants: 20,
      status: 'upcoming',
      description: 'Learn the fundamentals of assembly programming',
      onlineLink: 'https://zoom.us/j/assembly-session',
      type: 'online',
    },
    {
      id: 2,
      title: language === 'en' ? 'Sorting algorithms' : 'Các thuật toán sắp xếp',
      subject: 'DSA',
      tutor: 'Le Thanh Sach',
      date: language === 'en' ? 'Now' : 'Hiện tại',
      participants: 18,
      maxParticipants: 25,
      status: 'ongoing',
      description: 'Deep dive into sorting algorithms and their complexities',
      onlineLink: 'https://zoom.us/j/sorting-session',
      type: 'online',
    },
  ]);

  const filteredMySessions = useMemo(() => {
    if (!searchQuery.trim()) return mySessions;
    const query = searchQuery.toLowerCase();
    return mySessions.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.subject.toLowerCase().includes(query) ||
        s.tutor.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    );
  }, [mySessions, searchQuery]);

  const filteredUpcomingSessions = useMemo(() => {
    const available = upcomingSessions.filter((s) => !joinedSessions.includes(s.id));
    if (!searchQuery.trim()) return available;
    const query = searchQuery.toLowerCase();
    return available.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.subject.toLowerCase().includes(query) ||
        s.tutor.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    );
  }, [upcomingSessions, searchQuery, joinedSessions]);

  const handleJoinSession = async (sessionId: number) => {
    const user = authAPI.getCurrentUser();
    if (!user) {
      toast.error(language === 'en' ? 'Please login first' : 'Vui lòng đăng nhập');
      return;
    }

    try {
      const response = await sessionsAPI.join(sessionId, user.id);
      if (response.success) {
        setJoinedSessions((prev) => [...prev, sessionId]);
        toast.success(language === 'en' ? 'Joined session successfully!' : 'Tham gia buổi tư vấn thành công!');
        loadSessions(); // Reload to update participant count
      }
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error(language === 'en' ? 'Failed to join session' : 'Không thể tham gia buổi tư vấn');
    }
  };

  const handleJoinLiveSession = (link: string) => {
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-500">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-sessions" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="my-sessions">{t.mySessions}</TabsTrigger>
          <TabsTrigger value="upcoming">{t.upcoming}</TabsTrigger>
        </TabsList>

        {/* My Sessions Tab */}
        <TabsContent value="my-sessions" className="space-y-4">
          {filteredMySessions.map((session) => (
            <Card
              key={session.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer ${session.status === 'ongoing' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-purple-500'
                }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{session.title}</CardTitle>
                      {session.status === 'ongoing' && <Badge className="bg-green-500 text-white border-0">{t.live}</Badge>}
                      <Badge variant="outline" className="ml-2">
                        {session.type === 'online' ? t.online : t.offline}
                      </Badge>
                    </div>
                    <CardDescription>{session.description}</CardDescription>
                  </div>
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700">{session.tutor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{session.tutor}</p>
                        <p className="text-xs text-gray-500">{t.tutor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.participants}/{session.maxParticipants} {t.participants}
                      </span>
                      <Badge variant="outline">{session.subject}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <Clock className="h-4 w-4" />
                      {session.date}
                    </div>

                    {session.status === 'ongoing' && session.type === 'online' && session.onlineLink && (
                      <Button className="w-full mt-2" onClick={() => handleJoinLiveSession(session.onlineLink)}>
                        {t.join}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUpcomingSessions.map((session) => {
              const isJoined = joinedSessions.includes(session.id);
              return (
                <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{session.subject}</Badge>
                          <Badge variant="outline">{session.type === 'online' ? t.online : t.offline}</Badge>
                        </div>
                        <CardDescription>{session.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-100 text-purple-700">{session.tutor.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{session.tutor}</p>
                          <p className="text-xs text-gray-500">{t.tutor}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.participants}/{session.maxParticipants}
                          </span>
                          {session.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {session.rating}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Clock className="h-4 w-4" />
                        {session.date}
                      </div>

                      {!isJoined ? (
                        <Button className="w-full mt-2" onClick={() => handleJoinSession(session.id)}>
                          {t.join}
                        </Button>
                      ) : (
                        <Button className="w-full mt-2 bg-green-600 text-white" disabled>
                          {t.joined}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
