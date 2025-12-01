import { ChevronRight, Trophy } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { Language } from '../../App';

interface StudentHomeProps {
  onNavigate: (screen: string, sessionId?: number) => void;
  language: Language;
  user: {
    name: string;
    faculty?: string;
  };
}

export function StudentHome({ onNavigate, language, user }: StudentHomeProps) {
  const t = {
    dashboard: language === 'en' ? 'Student Dashboard' : 'Bảng điều khiển Sinh viên',
    hotContest: language === 'en' ? 'HOT CONTEST' : 'CUỘC THI HOT',
    talentsTitle: "HCMUT's Got Talents",
    joinNow: language === 'en' ? 'Join now' : 'Tham gia ngay',
    personalInfo: language === 'en' ? 'Personal Information' : 'Thông tin cá nhân',
    student: language === 'en' ? 'Student' : 'Sinh viên',
    ongoingContests: language === 'en' ? 'Ongoing contests' : 'Cuộc thi đang diễn ra',
    join: language === 'en' ? 'Join' : 'Tham gia',
    analyticsTitle: language === 'en' ? 'Your Goals' : 'Mục tiêu của bạn',
    goals: language === 'en' ? 'Goals' : 'Mục tiêu',
    progress: language === 'en' ? 'Progress' : 'Tiến độ',
  };

  const contests = [
    { id: 1, title: 'Algorithm Challenge 2025', participants: language === 'en' ? '45 people registering' : '45 người đăng ký' },
    { id: 2, title: 'Data Science Competition', participants: language === 'en' ? '67 people registering' : '67 người đăng ký' },
  ];

  // Sample goals data
  const goals = [
    { id: 1, title: 'Achieve 3.7 GPA this semester', progress: 85, status: 'on-track' },
    { id: 2, title: 'Complete 20 consultation sessions', progress: 60, status: 'on-track' },
    { id: 3, title: 'Master Data Structures', progress: 45, status: 'needs-attention' },
    { id: 4, title: 'Improve Algorithm skills to 90%', progress: 75, status: 'on-track' },
  ];

  return (
    <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white overflow-hidden relative">
          <div className="p-8 relative z-10">
            <p className="text-sm mb-2 opacity-90">{t.hotContest}</p>
            <h2 className="text-3xl mb-4">{t.talentsTitle}</h2>
            <Button
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              onClick={() => onNavigate('contests')}
            >
              {t.joinNow} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Analytics / Goals */}
        <div className="mb-6">
          <h3 className="text-xl mb-4">{t.analyticsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const progressPercent = Math.min((goal.progress / goal.target) * 100, 100);
              return (
                <Card key={goal.id} className="p-4">
                  <p className="text-sm mb-2 font-medium">{goal.title}</p>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-purple-600"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{`${goal.progress}/${goal.target} ${t.progress}`}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Personal Info Card */}
        <Card className="p-6">
          <h3 className="mb-4">{t.personalInfo}</h3>
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-center mb-1">{user.name}</p>
            <p className="text-sm text-gray-500">{t.student}</p>
          </div>
        </Card>

        {/* Ongoing Contests */}
        <Card className="p-6">
          <h3 className="mb-4">{t.ongoingContests}</h3>
          <div className="space-y-3">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onNavigate('contests')}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      <Trophy className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{contest.title}</p>
                    <p className="text-xs text-gray-500">{contest.participants}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('contests');
                  }}
                >
                  {t.join}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
