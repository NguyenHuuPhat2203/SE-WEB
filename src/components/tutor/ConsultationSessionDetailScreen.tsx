import {
  ChevronLeft,
  MapPin,
  Video,
  Users,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useLayoutContext } from "../../hooks/useLayoutContext";

const mockSessionDetails: Record<
  number,
  {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    type: "offline" | "online";
    location: string;
    students: Array<{
      id: number;
      name: string;
      bknetId: string;
      avatar?: string;
      status: "registered" | "attended" | "absent";
    }>;
    objectives: string[];
    materials?: string[];
  }
> = {
  1: {
    id: 1,
    title: "Data Structures - Binary Trees",
    description:
      "This session will cover binary tree concepts, traversal methods, and common algorithms. Students should come prepared with questions about their assignments.",
    date: "Nov 30, 2026",
    time: "14:00 - 15:00",
    type: "offline",
    location: "Room A1-101",
    students: [
      {
        id: 1,
        name: "Doan Manh Tat",
        bknetId: "tat.doanmanh",
        status: "attended",
      },
      { id: 2, name: "Cao Thu Phu", bknetId: "phu.caothu", status: "attended" },
      {
        id: 3,
        name: "Nguyen Minh Khanh",
        bknetId: "student.c",
        status: "attended",
      },
    ],
    objectives: [
      "Understand binary tree structure",
      "Learn tree traversal algorithms",
      "Practice solving tree problems",
      "Review assignment questions",
    ],
    materials: [
      "Binary Trees Lecture Notes.pdf",
      "Practice Problems Set 3.pdf",
    ],
  },
  2: {
    id: 2,
    title: "Algorithm Analysis",
    description:
      "Online session focusing on time and space complexity analysis. We will go through common algorithm patterns and their complexity.",
    date: "Dec 1, 2025",
    time: "10:00 - 11:30",
    type: "online",
    location: "https://teams.microsoft.com/l/meetup-join/...",
    students: [
      {
        id: 1,
        name: "Huynh Huu Nhat",
        bknetId: "nhat.huynhhuu",
        status: "registered",
      },
      {
        id: 2,
        name: "Nguyen Trong Nghia",
        bknetId: "nghia.nguyentrong",
        status: "registered",
      },
      {
        id: 3,
        name: "Nguyen Huu Phat",
        bknetId: "phat.nguyenhuu",
        status: "registered",
      },
    ],
    objectives: [
      "Understand Big O notation",
      "Analyze algorithm complexity",
      "Compare different approaches",
      "Solve complexity problems",
    ],
  },
  3: {
    id: 3,
    title: "Dynamic Programming",
    description:
      "Introduction to dynamic programming concepts and problem-solving strategies.",
    date: "Dec 3, 2025",
    time: "15:00 - 16:00",
    type: "offline",
    location: "Room B2-205",
    students: [
      {
        id: 1,
        name: "Nguyen Huu Phat",
        bknetId: "phat.nguyenhuu",
        status: "registered",
      },
      {
        id: 2,
        name: "Nguyen Trong Nghia",
        bknetId: "nghia.nguyentrong",
        status: "registered",
      },
      {
        id: 3,
        name: "Cao Thu Phu",
        bknetId: "phu.caothu",
        status: "registered",
      },
      {
        id: 4,
        name: "Nguyen Minh Khanh",
        bknetId: "khanh.nguyenminh",
        status: "registered",
      },
      {
        id: 5,
        name: "Doan Manh Tat",
        bknetId: "tat.doanmanh",
        status: "registered",
      },
      {
        id: 6,
        name: "Tran Trung Kien",
        bknetId: "kien.trantrung",
        status: "registered",
      },
      {
        id: 7,
        name: "Huynh Huu Nhat",
        bknetId: "nhat.huynhhuu",
        status: "registered",
      },
    ],
    objectives: [
      "Learn DP principles",
      "Understand memoization",
      "Practice DP problems",
      "Review common patterns",
    ],
  },
};

export function ConsultationSessionDetailScreen() {
  const { language } = useLayoutContext();
  const navigate = useNavigate();
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = Number(sessionIdParam);

  const t = {
    back: language === "en" ? "Back" : "Quay lại",
    description: language === "en" ? "Description" : "Mô tả",
    date: language === "en" ? "Date" : "Ngày",
    time: language === "en" ? "Time" : "Thời gian",
    location: language === "en" ? "Location" : "Địa điểm",
    meetingLink: language === "en" ? "Meeting Link" : "Liên kết cuộc họp",
    students: language === "en" ? "Students" : "Sinh viên",
    registered: language === "en" ? "Registered" : "Đã đăng ký",
    attended: language === "en" ? "Attended" : "Đã tham gia",
    absent: language === "en" ? "Absent" : "Vắng mặt",
    objectives: language === "en" ? "Objectives" : "Mục tiêu",
    materials: language === "en" ? "Materials" : "Tài liệu",
    inPerson: language === "en" ? "In-person" : "Trực tiếp",
    online: language === "en" ? "Online" : "Trực tuyến",
    joinMeeting: language === "en" ? "Join Meeting" : "Tham gia cuộc họp",
  };

  const session =
    mockSessionDetails[sessionId as keyof typeof mockSessionDetails];

  if (!session) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Session not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.back}
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-3">{session.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{session.time}</span>
                </div>
                <Badge
                  variant={session.type === "online" ? "default" : "secondary"}
                >
                  {session.type === "in-person" ? (
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
            </div>
            {session.type === "online" && (
              <Button>
                <Video className="h-4 w-4 mr-2" />
                {t.joinMeeting}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {session.type === "in-person" ? t.location : t.meetingLink}
            </p>
            <p className="font-medium">{session.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t.description}</p>
            <p className="text-gray-700">{session.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t.students} ({session.students.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {session.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.bknetId}@hcmut.edu.vn
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        student.status === "attended"
                          ? "default"
                          : student.status === "registered"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {student.status === "attended"
                        ? t.attended
                        : student.status === "registered"
                        ? t.registered
                        : t.absent}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.objectives}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {session.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {session.materials && session.materials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t.materials}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {session.materials.map((material, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <span className="mr-2">📄</span>
                      {material}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
