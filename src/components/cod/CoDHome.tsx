import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  Star,
  Award,
  BarChart3,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useLayoutContext } from "../../hooks/useLayoutContext";

export function CoDHome() {
  const navigate = useNavigate();
  const { language } = useLayoutContext();
  const t = {
    dashboard:
      language === "en"
        ? "Chief of Department Dashboard"
        : "Bảng điều khiển Trưởng khoa",
    tutors: language === "en" ? "Active Tutors" : "Cố vấn hoạt động",
    students: language === "en" ? "Students" : "Sinh viên",
    consultations: language === "en" ? "Consultations" : "Buổi tư vấn",
    avgRating: language === "en" ? "Avg Rating" : "Đánh giá TB",
    viewReports: language === "en" ? "View reports" : "Xem báo cáo",
    manageCourses: language === "en" ? "Manage courses" : "Quản lý khóa học",
    manageStaff: language === "en" ? "Manage staff" : "Quản lý nhân sự",
    overview: language === "en" ? "Department Overview" : "Tổng quan khoa",
    thisWeek: language === "en" ? "This week" : "Tuần này",
    topPerformers:
      language === "en" ? "Top Performing Tutors" : "Cố vấn xuất sắc",
    recentActivity: language === "en" ? "Recent Activity" : "Hoạt động gần đây",
    sessions: language === "en" ? "sessions" : "buổi",
    rating: language === "en" ? "rating" : "đánh giá",
    personalInfo:
      language === "en" ? "Personal Information" : "Thông tin cá nhân",
    chief: language === "en" ? "Chief of Department" : "Trưởng khoa",
    viewAll: language === "en" ? "View all" : "Xem tất cả",
    coursesManaged: language === "en" ? "Courses managed" : "Khóa học quản lý",
    staffMembers: language === "en" ? "Staff members" : "Nhân sự",
  };

  const topTutors = [
    { name: "Dr. Le Thanh Sach", sessions: 48, rating: 4.9 },
    { name: "Dr. Nguyen Duc Dung", sessions: 42, rating: 4.8 },
    { name: "Mai Duc Trung", sessions: 38, rating: 4.7 },
  ];

  const activities = [
    {
      type: "course",
      title: "New course added: Advanced Algorithms",
      time: "2h ago",
    },
    {
      type: "staff",
      title: "Staff member assigned: Dr. CNPM_36",
      time: "5h ago",
    },
    { type: "report", title: "Monthly report generated", time: "1d ago" },
  ];

  return (
    <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Main Content */}
      <div className="flex-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.tutors}</p>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl text-purple-700 mb-1">24</p>
            <p className="text-xs text-gray-500">+3 {t.thisWeek}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.students}</p>
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl text-indigo-700 mb-1">156</p>
            <p className="text-xs text-gray-500">+12 {t.thisWeek}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.consultations}</p>
              <Calendar className="h-5 w-5 text-pink-600" />
            </div>
            <p className="text-3xl text-pink-700 mb-1">32</p>
            <p className="text-xs text-gray-500">{t.thisWeek}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.avgRating}</p>
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-3xl text-yellow-600">4.7</p>
              <p className="text-sm text-gray-500">/5.0</p>
            </div>
            <p className="text-xs text-gray-500">Department average</p>
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
                <h2 className="text-3xl mb-2">{t.overview}</h2>
                <p className="opacity-90">
                  Monitor and manage your department's performance
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  onClick={() => navigate("/cod/courses")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t.manageCourses}
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  onClick={() => navigate("/cod/staff")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t.manageStaff}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Performing Tutors */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.topPerformers}</h3>
            <Button variant="ghost" size="sm">
              {t.viewAll} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topTutors.map((tutor, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white">
                        {tutor.name.charAt(4)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{tutor.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">
                          {tutor.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    #{idx + 1}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {tutor.sessions} {t.sessions}
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.recentActivity}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/shared/reports")}
            >
              {t.viewReports} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      activity.type === "course"
                        ? "bg-purple-100 text-purple-700"
                        : activity.type === "staff"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {activity.type === "course" && (
                      <BookOpen className="h-5 w-5" />
                    )}
                    {activity.type === "staff" && <Users className="h-5 w-5" />}
                    {activity.type === "report" && (
                      <BarChart3 className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p>{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
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
                C
              </AvatarFallback>
            </Avatar>
            <p className="text-center mb-1">Chief of Department</p>
            <p className="text-sm text-gray-500 mb-2">{t.chief}</p>
            <p className="text-sm text-gray-600">Computer Science</p>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h3 className="mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="text-sm">{t.coursesManaged}</span>
              </div>
              <span className="text-lg font-medium">18</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-sm">{t.staffMembers}</span>
              </div>
              <span className="text-lg font-medium">24</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                <span className="text-sm">Awards</span>
              </div>
              <span className="text-lg font-medium">6</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
