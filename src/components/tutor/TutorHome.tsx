import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MessageSquare,
  Trophy,
  Star,
  ChevronRight,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useLayoutContext } from "../../hooks/useLayoutContext";

export function TutorHome() {
  const navigate = useNavigate();
  const { language, user } = useLayoutContext();
  const t = {
    dashboard: language === "en" ? "Tutor Dashboard" : "Bảng điều khiển Cố vấn",
    welcome: language === "en" ? "Welcome back" : "Chào mừng trở lại",
    tutor: language === "en" ? "Tutor" : "Cố vấn học tập",
    upcomingSessions:
      language === "en" ? "Upcoming Sessions" : "Buổi tư vấn sắp tới",
    newQuestions: language === "en" ? "New Q&A" : "Câu hỏi mới",
    activeContests:
      language === "en" ? "Active Contests" : "Cuộc thi đang hoạt động",
    avgRating: language === "en" ? "Avg Rating" : "Đánh giá TB",
    viewAll: language === "en" ? "View all" : "Xem tất cả",
    todaySchedule: language === "en" ? "Today's Schedule" : "Lịch hôm nay",
    recentQuestions: language === "en" ? "Recent Questions" : "Câu hỏi gần đây",
    answer: language === "en" ? "Answer" : "Trả lời",
    minutes: language === "en" ? "min ago" : "phút trước",
    students: language === "en" ? "students" : "sinh viên",
    completed: language === "en" ? "Completed" : "Hoàn thành",
    upcoming: language === "en" ? "Upcoming" : "Sắp tới",
    personalInfo:
      language === "en" ? "Personal Information" : "Thông tin cá nhân",
    thisMonth: language === "en" ? "This Month" : "Tháng này",
    sessionsCompleted:
      language === "en" ? "Sessions completed" : "Buổi tư vấn hoàn thành",
    questionsAnswered:
      language === "en" ? "Questions answered" : "Câu hỏi đã trả lời",
  };

  const sessions = [
    {
      id: 1,
      time: "10:00 AM",
      title: "Data Structures - Binary Trees",
      students: 5,
      status: "upcoming" as const,
    },
    {
      id: 2,
      time: "2:00 PM",
      title: "Algorithm Analysis",
      students: 3,
      status: "upcoming" as const,
    },
    {
      id: 3,
      time: "4:00 PM",
      title: "Operating Systems - Deadlock",
      students: 4,
      status: "completed" as const,
    },
  ];

  const questions = [
    {
      id: 1,
      title: "How to implement a binary search tree?",
      student: "Nguyễn Văn A",
      time: "5",
      category: "DSA",
    },
    {
      id: 2,
      title: "Explain process synchronization",
      student: "Trần Thị B",
      time: "12",
      category: "OS",
    },
    {
      id: 3,
      title: "What is dynamic programming?",
      student: "Lê Văn C",
      time: "25",
      category: "Algorithm",
    },
  ];

  return (
    <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Main Content */}
      <div className="flex-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.upcomingSessions}</p>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl text-purple-700 mb-1">5</p>
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
              onClick={() => navigate("/tutor/consultation")}
            >
              {t.viewAll}
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.newQuestions}</p>
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl text-indigo-700 mb-1">8</p>
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
              onClick={() => navigate("/tutor/qa")}
            >
              {t.viewAll}
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.activeContests}</p>
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-3xl text-amber-700 mb-1">2</p>
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
              onClick={() => navigate("/tutor/contests")}
            >
              {t.viewAll}
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.avgRating}</p>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-3xl text-yellow-600">4.8</p>
              <p className="text-sm text-gray-500">/5.0</p>
            </div>
            <p className="text-xs text-gray-500">Based on 24 reviews</p>
          </Card>
        </div>

        {/* Hero Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
          <div className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2 opacity-90">{t.thisMonth}</p>
                <h2 className="text-3xl mb-2">Your Impact</h2>
                <p className="opacity-90">
                  Helping students achieve their goals
                </p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-4xl mb-1">24</p>
                  <p className="text-sm opacity-90">{t.sessionsCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl mb-1">68</p>
                  <p className="text-sm opacity-90">{t.questionsAnswered}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Today's Schedule */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.todaySchedule}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tutor/consultation")}
            >
              {t.viewAll} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Clock className="h-5 w-5 text-purple-600 mb-1 mx-auto" />
                      <p className="text-sm">{session.time}</p>
                    </div>
                    <div className="h-12 w-px bg-gray-200"></div>
                    <div>
                      <h4 className="mb-1">{session.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {session.students} {t.students}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      session.status === "completed"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-purple-300 bg-purple-50 text-purple-700"
                    }
                  >
                    {session.status === "completed" && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {session.status === "completed" ? t.completed : t.upcoming}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.recentQuestions}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tutor/qa")}
            >
              {t.viewAll} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3">
            {questions.map((question) => (
              <Card
                key={question.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="border-purple-300 bg-purple-50 text-purple-700"
                      >
                        {question.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {question.time} {t.minutes}
                      </span>
                    </div>
                    <h4 className="mb-2">{question.title}</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                          {question.student.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {question.student}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => navigate("/tutor/qa")}
                  >
                    {t.answer}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Personal Info Card */}
        <Card className="p-6">
          <h3 className="mb-4">{t.personalInfo}</h3>
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-3xl">
                {user.name}
              </AvatarFallback>
            </Avatar>
            <p className="text-center mb-1">{user.name}</p>
            <p className="text-sm text-gray-500 mb-2">{t.tutor}</p>
            <p className="text-sm text-gray-600">{user.department}</p>
          </div>
        </Card>

        {/* Performance Card */}
        <Card className="p-6">
          <h3 className="mb-4">Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Response Rate</span>
                <span className="text-purple-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Student Satisfaction</span>
                <span className="text-purple-600">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
