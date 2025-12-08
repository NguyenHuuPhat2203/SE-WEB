import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Users,
  Trophy,
  Sparkles,
  Calendar,
  BookOpen,
  BarChart3,
  GraduationCap,
  Library,
  LogOut,
  BookMarked,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Language } from "../components/layouts/MainLayout";

interface SidebarProps {
  role: "student" | "tutor" | "cod" | "ctsv";
  language: Language;
}

const studentNav = [
  {
    id: "student",
    icon: Home,
    label: { en: "Home", vi: "Trang chủ" },
    path: "/student",
  },
  {
    id: "find-tutor",
    icon: Search,
    label: { en: "Find Tutor", vi: "Tìm cố vấn" },
    path: "/student/find-tutor",
  },
  {
    id: "consultation-sessions",
    icon: Calendar,
    label: { en: "Consultation Sessions", vi: "Các buổi tư vấn" },
    path: "/student/consultation-sessions",
  },
  {
    id: "request-courses",
    icon: BookMarked,
    label: { en: "Request Courses", vi: "Yêu cầu môn học" },
    path: "/student/request-courses",
  },
  {
    id: "resources",
    icon: Library,
    label: { en: "Resources", vi: "Tài liệu" },
    path: "/student/resources",
  },
  {
    id: "notifications",
    icon: Bell,
    label: { en: "Notifications", vi: "Thông báo" },
    path: "/student/notifications",
  },
  {
    id: "feedback",
    icon: MessageSquare,
    label: { en: "Feedback", vi: "Đánh giá" },
    path: "/student/feedback",
  },
  {
    id: "qa",
    icon: MessageSquare,
    label: { en: "Q&A / Community", vi: "Hỏi đáp / Cộng đồng" },
    path: "/student/qa",
  },
  {
    id: "personalization",
    icon: Sparkles,
    label: { en: "Personalization (AI)", vi: "Cá nhân hóa (AI)" },
    path: "/student/personalization",
  },
  {
    id: "contests",
    icon: Trophy,
    label: { en: "Contests", vi: "Cuộc thi" },
    path: "/student/contests",
  },
];

const tutorNav = [
  {
    id: "tutor",
    icon: Home,
    label: { en: "Home", vi: "Trang chủ" },
    path: "/tutor",
  },
  {
    id: "notifications",
    icon: Bell,
    label: { en: "Notifications", vi: "Thông báo" },
    path: "/tutor/notifications",
  },
  {
    id: "consultation",
    icon: Calendar,
    label: { en: "Consultation", vi: "Tư vấn" },
    path: "/tutor/consultation",
  },
  {
    id: "qa",
    icon: Users,
    label: { en: "Q&A", vi: "Hỏi đáp" },
    path: "/tutor/qa",
  },
  {
    id: "contests",
    icon: Trophy,
    label: { en: "Contests", vi: "Cuộc thi" },
    path: "/tutor/contests",
  },
  {
    id: "personalization",
    icon: Sparkles,
    label: { en: "Personalization (AI)", vi: "Cá nhân hóa (AI)" },
    path: "/tutor/personalization",
  },
];

const codNav = [
  {
    id: "cod",
    icon: Home,
    label: { en: "Home", vi: "Trang chủ" },
    path: "/cod",
  },
  {
    id: "manage-courses",
    icon: BookOpen,
    label: { en: "Manage Courses", vi: "Quản lý môn học" },
    path: "/cod/manage-courses",
  },
  {
    id: "manage-staff",
    icon: Users,
    label: { en: "Manage Staff", vi: "Quản lý nhân sự" },
    path: "/cod/manage-staff",
  },
  {
    id: "reports",
    icon: BarChart3,
    label: { en: "Reports", vi: "Báo cáo" },
    path: "/cod/reports",
  },
];

const ctsvNav = [
  {
    id: "ctsv",
    icon: Home,
    label: { en: "Home", vi: "Trang chủ" },
    path: "/ctsv",
  },
  {
    id: "scholarship",
    icon: GraduationCap,
    label: { en: "Scholarship Evaluation", vi: "Đánh giá học bổng" },
    path: "/ctsv/scholarship",
  },
  {
    id: "reports",
    icon: BarChart3,
    label: { en: "Reports", vi: "Báo cáo" },
    path: "/ctsv/reports",
  },
];

const navigationMap = {
  student: studentNav,
  tutor: tutorNav,
  cod: codNav,
  ctsv: ctsvNav,
};

export function Sidebar({ role, language }: SidebarProps) {
  const { logout } = useAuth();
  const navItems = navigationMap[role];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label[language]}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50 border border-red-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">
            {language === "en" ? "Logout" : "Đăng xuất"}
          </span>
        </button>
      </div>
    </aside>
  );
}
