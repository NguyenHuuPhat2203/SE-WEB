// import React, { useState, useMemo } from 'react';
// import { Calendar, Plus, Search, Star, Users, Clock } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
// import { Button } from '../ui/button';
// import { Input } from '../ui/input';
// import { Badge } from '../ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// import { Avatar, AvatarFallback } from '../ui/avatar';
// import { toast } from 'sonner';
// import type { Language } from '../../App';

// interface ConsultationSessionsScreenProps {
//   language: Language;
//   onNavigate?: (screen: string, sessionId?: number) => void;
// }

// interface Session {
//   id: number;
//   title: string;
//   subject: string;
//   tutor: string;
//   date: string;
//   participants: number;
//   maxParticipants: number;
//   status: 'upcoming' | 'ongoing';
//   description: string;
//   rating?: number;
//   onlineLink?: string;
//   type: 'online' | 'offline';
// }

// export function ConsultationSessionsScreen({ language, onNavigate }: ConsultationSessionsScreenProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [joinedSessions, setJoinedSessions] = useState<number[]>([]);

//   const t = {
//     title: language === 'en' ? 'Consultation Sessions' : 'Các buổi tư vấn',
//     description: language === 'en' ? 'Join consultation sessions with tutors' : 'Tham gia các buổi tư vấn với cố vấn',
//     mySessions: language === 'en' ? 'My sessions' : 'Buổi tư vấn của tôi',
//     upcoming: language === 'en' ? 'Upcoming' : 'Sắp diễn ra',
//     ongoing: language === 'en' ? 'Ongoing' : 'Đang diễn ra',
//     search: language === 'en' ? 'Search sessions...' : 'Tìm kiếm buổi tư vấn...',
//     participants: language === 'en' ? 'participants' : 'người tham gia',
//     join: language === 'en' ? 'Join' : 'Tham gia',
//     joined: language === 'en' ? 'Joined' : 'Đã tham gia',
//     tutor: language === 'en' ? 'Tutor' : 'Cố vấn',
//     live: language === 'en' ? 'LIVE' : 'ĐANG PHÁT',
//     online: language === 'en' ? 'Online' : 'Trực tuyến',
//     offline: language === 'en' ? 'Offline' : 'Tại chỗ',
//   };

//   const [mySessions, setMySessions] = useState<Session[]>([
//     {
//       id: 1,
//       title: language === 'en' ? 'Assembly programming guide' : 'Hướng dẫn lập trình Assembly',
//       subject: 'Computer Architecture',
//       tutor: 'Le Thanh Van',
//       date: language === 'en' ? 'Tomorrow, 3:00 PM' : 'Ngày mai, 3:00 CH',
//       participants: 12,
//       maxParticipants: 20,
//       status: 'upcoming',
//       description: 'Learn the fundamentals of assembly programming',
//       onlineLink: 'https://zoom.us/j/assembly-session',
//       type: 'online',
//     },
//     {
//       id: 2,
//       title: language === 'en' ? 'Sorting algorithms' : 'Các thuật toán sắp xếp',
//       subject: 'DSA',
//       tutor: 'Le Thanh Sach',
//       date: language === 'en' ? 'Now' : 'Hiện tại',
//       participants: 18,
//       maxParticipants: 25,
//       status: 'ongoing',
//       description: 'Deep dive into sorting algorithms and their complexities',
//       onlineLink: 'https://zoom.us/j/sorting-session',
//       type: 'online',
//     },
//   ]);

//   const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([
//     {
//       id: 3,
//       title: language === 'en' ? 'How to build a semantic checker' : 'Cách xây dựng semantic checker',
//       subject: 'PPL',
//       tutor: 'Nguyen Hua Phung',
//       date: language === 'en' ? 'Friday, 2:00 PM' : 'Thứ 6, 2:00 CH',
//       participants: 8,
//       maxParticipants: 15,
//       rating: 4.9,
//       description: 'Build a semantic checker for a programming language',
//       type: 'offline',
//     },
//     {
//       id: 4,
//       title: language === 'en' ? 'Operating Systems Concepts' : 'Khái niệm Hệ điều hành',
//       subject: 'Operating Systems',
//       tutor: 'Le Thanh Van',
//       date: language === 'en' ? 'Saturday, 10:00 AM' : 'Thứ 7, 10:00 SA',
//       participants: 15,
//       maxParticipants: 30,
//       rating: 4.7,
//       description: 'Understanding process management and scheduling',
//       type: 'online',
//       onlineLink: 'https://zoom.us/j/os-concepts',
//     },
//     {
//       id: 5,
//       title: language === 'en' ? 'Design Pattern Practices' : 'Thực hành Design Pattern',
//       subject: 'Database Systems',
//       tutor: 'Mai Duc Trung',
//       date: language === 'en' ? 'Monday, 4:00 PM' : 'Thứ 2, 4:00 CH',
//       participants: 10,
//       maxParticipants: 20,
//       rating: 4.8,
//       description: 'Learn concepts of design pattern',
//       type: 'offline',
//     },
//   ]);

//   const filteredMySessions = useMemo(() => {
//     if (!searchQuery.trim()) return mySessions;
//     const query = searchQuery.toLowerCase();
//     return mySessions.filter(
//       (s) =>
//         s.title.toLowerCase().includes(query) ||
//         s.subject.toLowerCase().includes(query) ||
//         s.tutor.toLowerCase().includes(query) ||
//         s.description.toLowerCase().includes(query)
//     );
//   }, [mySessions, searchQuery]);

//   const filteredUpcomingSessions = useMemo(() => {
//     const available = upcomingSessions.filter((s) => !joinedSessions.includes(s.id));
//     if (!searchQuery.trim()) return available;
//     const query = searchQuery.toLowerCase();
//     return available.filter(
//       (s) =>
//         s.title.toLowerCase().includes(query) ||
//         s.subject.toLowerCase().includes(query) ||
//         s.tutor.toLowerCase().includes(query) ||
//         s.description.toLowerCase().includes(query)
//     );
//   }, [upcomingSessions, searchQuery, joinedSessions]);

//   const handleJoinSession = (sessionId: number) => {
//     const sessionToMove = upcomingSessions.find((s) => s.id === sessionId);
//     if (!sessionToMove) return;

//     setJoinedSessions((prev) => [...prev, sessionId]);
//     setMySessions((prev) => [...prev, { ...sessionToMove, status: 'upcoming' }]);
//     setUpcomingSessions((prev) => prev.filter((s) => s.id !== sessionId));

//     toast.success(`${sessionToMove.title} ${t.joined}`);
//   };

//   const handleJoinLiveSession = (link: string) => {
//     window.open(link, '_blank');
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="mb-4">
//           <h1 className="text-gray-900 mb-2">{t.title}</h1>
//           <p className="text-gray-600">{t.description}</p>
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder={t.search}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="my-sessions" className="space-y-6">
//         <TabsList className="bg-white border">
//           <TabsTrigger value="my-sessions">{t.mySessions}</TabsTrigger>
//           <TabsTrigger value="upcoming">{t.upcoming}</TabsTrigger>
//         </TabsList>

//         {/* My Sessions Tab */}
//         <TabsContent value="my-sessions" className="space-y-4">
//           {filteredMySessions.map((session) => (
//             <Card
//               key={session.id}
//               className={`hover:shadow-lg transition-shadow cursor-pointer ${session.status === 'ongoing' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-purple-500'
//                 }`}
//             >
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CardTitle className="text-xl">{session.title}</CardTitle>
//                       {session.status === 'ongoing' && <Badge className="bg-green-500 text-white border-0">{t.live}</Badge>}
//                       <Badge variant="outline" className="ml-2">
//                         {session.type === 'online' ? t.online : t.offline}
//                       </Badge>
//                     </div>
//                     <CardDescription>{session.description}</CardDescription>
//                   </div>
//                   <Calendar className="h-5 w-5 text-purple-600" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <Avatar className="h-8 w-8">
//                         <AvatarFallback className="bg-purple-100 text-purple-700">{session.tutor.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="text-sm">{session.tutor}</p>
//                         <p className="text-xs text-gray-500">{t.tutor}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4 text-sm text-gray-600">
//                       <span className="flex items-center gap-1">
//                         <Users className="h-4 w-4" />
//                         {session.participants}/{session.maxParticipants} {t.participants}
//                       </span>
//                       <Badge variant="outline">{session.subject}</Badge>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-purple-600">
//                       <Clock className="h-4 w-4" />
//                       {session.date}
//                     </div>

//                     {session.status === 'ongoing' && session.type === 'online' && session.onlineLink && (
//                       <Button className="w-full mt-2" onClick={() => handleJoinLiveSession(session.onlineLink)}>
//                         {t.join}
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>

//         {/* Upcoming Tab */}
//         <TabsContent value="upcoming" className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredUpcomingSessions.map((session) => {
//               const isJoined = joinedSessions.includes(session.id);
//               return (
//                 <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
//                         <div className="flex gap-2">
//                           <Badge variant="outline">{session.subject}</Badge>
//                           <Badge variant="outline">{session.type === 'online' ? t.online : t.offline}</Badge>
//                         </div>
//                         <CardDescription>{session.description}</CardDescription>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2">
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback className="bg-purple-100 text-purple-700">{session.tutor.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="text-sm">{session.tutor}</p>
//                           <p className="text-xs text-gray-500">{t.tutor}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-4 text-gray-600">
//                           <span className="flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             {session.participants}/{session.maxParticipants}
//                           </span>
//                           {session.rating && (
//                             <span className="flex items-center gap-1">
//                               <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                               {session.rating}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-purple-600">
//                         <Clock className="h-4 w-4" />
//                         {session.date}
//                       </div>

//                       {!isJoined ? (
//                         <Button className="w-full mt-2" onClick={() => handleJoinSession(session.id)}>
//                           {t.join}
//                         </Button>
//                       ) : (
//                         <Button className="w-full mt-2 bg-green-600 text-white" disabled>
//                           {t.joined}
//                         </Button>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { MapPin, Video, Users, Calendar, Clock, User, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';

interface ConsultationSessionsProps {
  language: Language;
  user: User
  onNavigate?: (screen: string, sessionId?: number) => void;
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

export function ConsultationSessionsScreen({ language, user }: ConsultationSessionsProps) {
  const t = {
    title: language === 'en' ? 'Consultation Sessions' : 'Các buổi tư vấn',
    students: language === 'en' ? 'students' : 'sinh viên',
    back: language === 'en' ? 'Back' : 'Quay lại',
    inPerson: language === 'en' ? 'In-person' : 'Trực tiếp',
    online: language === 'en' ? 'Online' : 'Trực tuyến',
    join: language === 'en' ? 'Join session' : 'Tham gia',
    registered: language === 'en' ? 'Registered' : 'Đã đăng ký',
    attended: language === 'en' ? 'Attended' : 'Đã tham gia',
    absent: language === 'en' ? 'Absent' : 'Vắng mặt',
    joinSuccess: language === 'en' ? 'You joined the session!' : 'Tham gia thành công!',
  };

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  // Load session list from backend
  useEffect(() => {
    fetch("http://localhost:3001/api/sessions")
      .then(res => res.json())
      .then(json => {
        if (json.success) setSessions(json.data);
      });
  }, []);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  // POST join session
  // const handleJoin = (id: number) => {
  //   fetch(`http://localhost:3001/api/sessions/${id}/join`, { method: "POST" })
  //     .then(res => res.json())
  //     .then(json => {
  //       if (json.success) {
  //         toast.success(t.joinSuccess);
  //         // update UI
  //         setSessions((prev) =>
  //           prev.map(s => (s.id === id ? json.data : s))
  //         );
  //       }
  //     });
  // };
  const handleJoin = (id: number) => {
  // ví dụ user giả định, bạn thay bằng user thực trong App hoặc AuthContext

    fetch(`http://localhost:3001/api/sessions/${id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          toast.success("Joined successfully!");
          setSessions((prev) => prev.map((s) => (s.id === id ? json.data : s)));
        } else {
          toast.error("Failed to join session");
        }
      })
      .catch((err) => {
        console.error("Join error:", err);
        toast.error("Server error");
      });
  };


  // =================== RENDER ===================

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!selectedSessionId ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-gray-900">{t.title}</h1>
          </div>

          {/* SESSION LIST */}
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
        // SESSION DETAIL
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
              {/* Location / Link */}
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {selectedSession?.type === 'offline' ? t.inPerson : t.online}
                </p>
                <p className="font-medium">{selectedSession?.location}</p>
              </div>

              {/* Description */}
              {selectedSession?.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p>{selectedSession.description}</p>
                </div>
              )}

              {/* Students */}
              <div>
                <h4 className="font-medium mb-2">
                  {t.students} ({selectedSession?.students.length})
                </h4>

                {selectedSession?.students.length ? (
                  <div className="space-y-2">
                    {selectedSession.students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.status}</p>
                          </div>
                        </div>

                        <Badge
                          variant={
                            student.status === 'attended'
                              ? 'default'
                              : student.status === 'registered'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendees yet.</p>
                )}
              </div>

              {/* Join Button */}
              <Button className="w-full" onClick={() => handleJoin(selectedSession.id)}>
                {t.join}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
