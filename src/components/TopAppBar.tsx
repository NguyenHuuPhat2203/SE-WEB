import { useState, useEffect } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

// Define types locally since they are not exported from App.tsx or use any
type Language = "vi" | "en";
type UserRole = "student" | "tutor" | "cod" | "ctsv";

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
  unreadNotifications: initialUnread,
  language,
  onToggleLanguage,
  onLogout,
  onNavigateProfile,
}: TopAppBarProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(initialUnread);
  const [notifications, setNotifications] = useState<any[]>([]);

  const t = {
    notifications: language === 'en' ? 'Notifications' : 'Thông báo',
    profile: language === 'en' ? 'Profile' : 'Hồ sơ cá nhân',
    settings: language === 'en' ? 'Settings' : 'Cài đặt',
    logout: language === 'en' ? 'Logout' : 'Đăng xuất',
    noNotif: language === 'en' ? 'No new notifications' : 'Không có thông báo mới',
    viewAll: language === 'en' ? 'View all' : 'Xem tất cả',
    markAllRead: language === 'en' ? 'Mark all as read' : 'Đánh dấu đã đọc tất cả',
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:3001/api/notifications', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            setNotifications(data.data.slice(0, 5)); // Get top 5
            const unread = data.data.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
        }
    } catch (err) {
        console.error("Failed to fetch notifications", err);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
          const token = localStorage.getItem('token');
          await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
              method: 'PATCH',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          // Update local state
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
          setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
          toast.error("Failed to mark as read");
      }
  };

  const handleNotificationClick = (notif: any) => {
      if (!notif.isRead) handleMarkAsRead(notif.id, { stopPropagation: () => {} } as any);
      // Navigate if needed, currently just opens detailed view via page redirection or modal
      // Ideally link to specific resource. For now, go to notifications page
      navigate(`/${user.role}/notifications`);
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

        {/* Notification Bell with Popover */}
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                    {unreadCount}
                    </Badge>
                )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{t.notifications}</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600">
                            {t.markAllRead}
                        </Button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            {t.noNotif}
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <p className={`text-sm ${!notif.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t border-gray-100">
                    <Button 
                        variant="ghost" 
                        className="w-full text-sm justify-center"
                        onClick={() => navigate(`/${user.role}/notifications`)}
                    >
                        {t.viewAll}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>

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
