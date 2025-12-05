import { GraduationCap, Users, Trophy, Award, ChevronRight, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import type { Language } from '../../App';

export function CTSVHome({ onNavigate, language, user }: any) {
  const t = {
    dashboard: language === 'en' ? 'CTSV Dashboard' : 'Bảng điều khiển CTSV',
    evaluations: language === 'en' ? 'Evaluations' : 'Đánh giá',
    contests: language === 'en' ? 'Contest Entries' : 'Tham gia cuộc thi',
    notifications: language === 'en' ? 'Notifications' : 'Thông báo',
    participation: language === 'en' ? 'Participation' : 'Tham gia',
    viewAll: language === 'en' ? 'View all' : 'Xem tất cả',
    pendingEvaluations: language === 'en' ? 'Pending Scholarship Evaluations' : 'Đánh giá học bổng chờ xử lý',
    recentActivity: language === 'en' ? 'Recent Activity' : 'Hoạt động gần đây',
    overview: language === 'en' ? 'Student Affairs Overview' : 'Tổng quan Công tác sinh viên',
    manageAll: language === 'en' ? 'Manage all aspects of student affairs' : 'Quản lý mọi khía cạnh công tác sinh viên',
    evaluate: language === 'en' ? 'Evaluate' : 'Đánh giá',
    pending: language === 'en' ? 'Pending' : 'Chờ xử lý',
    approved: language === 'en' ? 'Approved' : 'Đã duyệt',
    personalInfo: language === 'en' ? 'Personal Information' : 'Thông tin cá nhân',
    ctsv: language === 'en' ? 'CTSV_Admin' : 'CTSV_Admin',
    thisMonth: language === 'en' ? 'This month' : 'Tháng này',
    processed: language === 'en' ? 'Processed' : 'Đã xử lý',
    scholarships: language === 'en' ? 'Scholarships' : 'Học bổng',
    reports: language === 'en' ? 'Reports' : 'Báo cáo',
  };

  const pendingEvals = [
    {
      id: 1,
      student: 'Nguyen Huu Phat',
      scholarship: 'Academic Excellence',
      gpa: 3.85,
      date: '2 days ago',
    },
    {
      id: 2,
      student: 'Doan Manh Tat',
      scholarship: 'Merit Scholarship',
      gpa: 3.72,
      date: '3 days ago',
    },
    {
      id: 3,
      student: 'Cao Thu Phu',
      scholarship: 'Need-based Aid',
      gpa: 3.65,
      date: '5 days ago',
    },
  ];

  const activities = [
    { type: 'approved', title: 'Scholarship approved for Huynh Huu Nhat', time: '1h ago' },
    { type: 'contest', title: 'New contest registration: ICPC 2025', time: '3h ago' },
    { type: 'notification', title: 'Reward notification sent to 15 students', time: '6h ago' },
  ];

  return (
    <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
      {/* Main Content */}
      <div className="flex-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.evaluations}</p>
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl text-purple-700 mb-1">12</p>
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-700"
              onClick={() => onNavigate('evaluation')}
            >
              {t.viewAll}
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.contests}</p>
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-3xl text-amber-700 mb-1">89</p>
            <p className="text-xs text-gray-500">Active participants</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.notifications}</p>
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl text-green-700 mb-1">7</p>
            <p className="text-xs text-gray-500">{t.thisMonth}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{t.participation}</p>
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-3xl text-indigo-700">78</p>
              <p className="text-xl text-gray-500">%</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+5% from last month</span>
            </div>
          </Card>
        </div>

        {/* Hero Banner */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          <div className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl mb-2">{t.overview}</h2>
                <p className="opacity-90">{t.manageAll}</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-4xl mb-1">45</p>
                  <p className="text-sm opacity-90">{t.processed}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl mb-1">28</p>
                  <p className="text-sm opacity-90">{t.scholarships}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Evaluations */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.pendingEvaluations}</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('evaluation')}>
              {t.viewAll} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-3">
            {pendingEvals.map((evaluation) => (
              <Card key={evaluation.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {evaluation.student.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{evaluation.student}</h4>
                        <Badge variant="outline" className="border-purple-300 bg-purple-50 text-purple-700">
                          GPA: {evaluation.gpa}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{evaluation.scholarship}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {evaluation.date}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => onNavigate('evaluation')}
                  >
                    {t.evaluate}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">{t.recentActivity}</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('reports')}>
              {t.reports} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${activity.type === 'approved' ? 'bg-green-100 text-green-700' :
                      activity.type === 'contest' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {activity.type === 'approved' && <CheckCircle className="h-5 w-5" />}
                    {activity.type === 'contest' && <Trophy className="h-5 w-5" />}
                    {activity.type === 'notification' && <Award className="h-5 w-5" />}
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
                CT
              </AvatarFallback>
            </Avatar>
            <p className="text-center mb-1">{user.name}</p>
            <p className="text-sm text-gray-500 mb-2">{t.ctsv}</p>
            <p className="text-sm text-gray-600">Student Affairs Office</p>
          </div>
        </Card>

        {/* Performance Card */}
        <Card className="p-6">
          <h3 className="mb-4">Monthly Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Evaluations</span>
                <span className="text-purple-600">45/50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Response Time</span>
                <span className="text-purple-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onNavigate('evaluation')}
            >
              <FileText className="mr-2 h-4 w-4" />
              New Evaluation
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onNavigate('reports')}
            >
              <Award className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
