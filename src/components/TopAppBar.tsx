import { Bell, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { Language, UserRole } from '../App';

interface TopAppBarProps {
  user: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  unreadNotifications: number;
  language: Language;
  onToggleLanguage: () => void;
  onLogout: () => void;
  onNavigateProfile?: () => void;
}

const roleLabels: Record<UserRole, { en: string; vi: string }> = {
  student: { en: 'Student', vi: 'Sinh viên' },
  tutor: { en: 'Tutor', vi: 'Cố vấn học tập' },
  cod: { en: 'Chief of Department', vi: 'Trưởng khoa' },
  ctsv: { en: 'CTSV Admin', vi: 'Trưởng phòng CTSV' },
};

export function TopAppBar({
  user,
  unreadNotifications,
  language,
  onToggleLanguage,
  onLogout,
  onNavigateProfile,
}: TopAppBarProps) {
  const t = {
    notifications: language === 'en' ? 'Notifications' : 'Thông báo',
    profile: language === 'en' ? 'Profile' : 'Hồ sơ cá nhân',
    settings: language === 'en' ? 'Settings' : 'Cài đặt',
    logout: language === 'en' ? 'Logout' : 'Đăng xuất',
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: App name */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded flex items-center justify-center shadow-md">
          <span className="text-white font-bold">T</span>
        </div>
        <span className="text-gray-900 font-medium">Tutor Support System</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* 🌐 Language Switcher */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={onToggleLanguage}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              language === 'vi' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            VI
          </button>
          <button
            onClick={onToggleLanguage}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              language === 'en' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            EN
          </button>
        </div>

        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 h-auto py-2 px-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm text-gray-900 font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">
                  {roleLabels[user.role][language]}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onNavigateProfile}>
              <User className="h-4 w-4 mr-2" />
              {t.profile}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>{t.settings}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
