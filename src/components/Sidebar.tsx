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
  TrendingUp,
  LogOut,
  BookMarked
} from 'lucide-react';
import type { UserRole, Language } from '../App';

interface SidebarProps {
  role: UserRole;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  language: Language;
}

const studentNav = [
  { id: 'home', icon: Home, label: { en: 'Home', vi: 'Trang chủ' } },
  { id: 'find-tutor', icon: Search, label: { en: 'Find Tutor', vi: 'Tìm cố vấn' } },
  { id: 'consultation-sessions', icon: Calendar, label: { en: 'Consultation Sessions', vi: 'Các buổi tư vấn' } },
  { id: 'request-courses', icon: BookMarked, label: { en: 'Request Courses', vi: 'Yêu cầu môn học' } },
  { id: 'resources', icon: Library, label: { en: 'Resources', vi: 'Tài liệu' } },
  { id: 'notifications', icon: Bell, label: { en: 'Notifications', vi: 'Thông báo' } },
  { id: 'feedback', icon: MessageSquare, label: { en: 'Feedback', vi: 'Đánh giá' } },
  { id: 'qa', icon: MessageSquare, label: { en: 'Q&A / Community', vi: 'Hỏi đáp / Cộng đồng' } },
  { id: 'personalization', icon: Sparkles, label: { en: 'Personalization (AI)', vi: 'Cá nhân hóa (AI)' } },
  { id: 'contests', icon: Trophy, label: { en: 'Contests', vi: 'Cuộc thi' } }
];

const tutorNav = [
  { id: 'home', icon: Home, label: { en: 'Home', vi: 'Trang chủ' } },
  { id: 'notifications', icon: Bell, label: { en: 'Notifications', vi: 'Thông báo' } },
  { id: 'consultation', icon: Calendar, label: { en: 'Consultation', vi: 'Tư vấn' } },
  { id: 'qa', icon: Users, label: { en: 'Q&A', vi: 'Hỏi đáp' } },
  { id: 'contests', icon: Trophy, label: { en: 'Contests', vi: 'Cuộc thi' } },
  { id: 'personalization', icon: Sparkles, label: { en: 'Personalization (AI)', vi: 'Cá nhân hóa (AI)' } }
];

const codNav = [
  { id: 'home', icon: Home, label: { en: 'Home', vi: 'Trang chủ' } },
  { id: 'manage-courses', icon: BookOpen, label: { en: 'Manage Courses', vi: 'Quản lý môn học' } },
  { id: 'manage-staff', icon: Users, label: { en: 'Manage Staff', vi: 'Quản lý nhân sự' } },
  { id: 'reports', icon: BarChart3, label: { en: 'Reports', vi: 'Báo cáo' } }
];

const ctsvNav = [
  { id: 'home', icon: Home, label: { en: 'Home', vi: 'Trang chủ' } },
  { id: 'scholarship', icon: GraduationCap, label: { en: 'Scholarship Evaluation', vi: 'Đánh giá học bổng' } },
  { id: 'reports', icon: BarChart3, label: { en: 'Reports', vi: 'Báo cáo' } }
];

const navigationMap: Record<UserRole, typeof studentNav> = {
  student: studentNav,
  tutor: tutorNav,
  cod: codNav,
  ctsv: ctsvNav
};

export function Sidebar({ role, currentScreen, onNavigate, onLogout, language }: SidebarProps) {
  const navItems = navigationMap[role];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.label[language]}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50 border border-red-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">{language === 'en' ? 'Logout' : 'Đăng xuất'}</span>
        </button>
      </div>
    </aside>
  );
}