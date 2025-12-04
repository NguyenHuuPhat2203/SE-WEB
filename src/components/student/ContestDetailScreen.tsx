import { Trophy, Calendar, Users, Clock, Award, FileText, ChevronLeft, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Language } from '../../App';

interface ContestDetailScreenProps {
  language: Language;
  onBack: () => void;
  contestId: string;
  onStartContest?: () => void;
}

const mockContestDetails = {
  1: {
    id: 1,
    title: 'Algorithm Challenge 2025',
    type: 'academic',
    description: 'Competitive programming contest focusing on algorithms and data structures',
    fullDescription: 'Join us for the most exciting programming competition of the year! Test your skills in algorithmic problem-solving, compete with the best students from HCMUT, and win amazing prizes. This contest covers topics including sorting algorithms, graph theory, dynamic programming, and more.',
    period: 'Nov 25 - Dec 25',
    startDate: 'November 25, 2025 - 9:00 AM',
    endDate: 'December 25, 2025 - 5:00 PM',
    status: 'open',
    participants: 45,
    maxParticipants: 100,
    organizer: 'Computer Science Department',
    location: 'Online (via HCMUT Contest Platform)',
    prizes: [
      { place: '1st Place', prize: '5,000,000 VND + Certificate' },
      { place: '2nd Place', prize: '3,000,000 VND + Certificate' },
      { place: '3rd Place', prize: '2,000,000 VND + Certificate' },
      { place: 'Top 10', prize: 'Certificate of Achievement' },
    ],
    rules: [
      'Individual participation only',
      'Programming languages: C++, Java, Python',
      'No external resources or collaboration allowed',
      'Solutions must be submitted before the deadline',
      'Plagiarism will result in disqualification',
    ],
    timeline: [
      { date: 'Nov 25 - Nov 30', event: 'Registration Period' },
      { date: 'Dec 1, 9:00 AM', event: 'Contest Opens' },
      { date: 'Dec 25, 5:00 PM', event: 'Contest Closes' },
      { date: 'Dec 28', event: 'Results Announcement' },
    ],
    requirements: [
      'Active HCMUT student',
      'Basic knowledge of algorithms and data structures',
      'Proficiency in at least one programming language',
      'Stable internet connection',
    ],
    contacts: [
      { name: 'Dr. Tran Tuan Anh', role: 'Contest Coordinator', email: 'anh.trantuan@hcmut.edu.vn' },
      { name: 'Algorithm Lab', role: 'Support Team', email: 'algo.lab@hcmut.edu.vn' },
    ],
  },
  2: {
    id: 2,
    title: 'Hackathon: Smart City Solutions',
    type: 'non-academic',
    description: 'Build innovative solutions for smart cities',
    fullDescription: 'A 48-hour hackathon challenge where teams develop innovative tech solutions to improve urban living. Focus areas include transportation, energy efficiency, waste management, and citizen services.',
    period: 'Jan 10 - Jan 15',
    startDate: 'January 10, 2025 - 8:00 AM',
    endDate: 'January 15, 2025 - 6:00 PM',
    status: 'Closed',
    participants: 32,
    maxParticipants: 80,
    organizer: 'Innovation Lab & Tech Club',
    location: 'HCMUT Innovation Hub, Building H6',
    prizes: [
      { place: '1st Place', prize: '10,000,000 VND + Mentorship Program' },
      { place: '2nd Place', prize: '7,000,000 VND + Tech Vouchers' },
      { place: '3rd Place', prize: '5,000,000 VND + Tech Vouchers' },
      { place: 'Best Innovation', prize: '3,000,000 VND' },
    ],
    rules: [
      'Teams of 3-5 members',
      'Any technology stack allowed',
      'Must present working prototype',
      'Open source projects encouraged',
      'Solutions must address real smart city challenges',
    ],
    timeline: [
      { date: 'Dec 15 - Jan 9', event: 'Team Registration' },
      { date: 'Jan 10, 8:00 AM', event: 'Opening Ceremony & Kickoff' },
      { date: 'Jan 12, 2:00 PM', event: 'Midpoint Check-in' },
      { date: 'Jan 15, 2:00 PM', event: 'Final Presentations' },
      { date: 'Jan 15, 6:00 PM', event: 'Award Ceremony' },
    ],
    requirements: [
      'HCMUT students (any major)',
      'Form a team or join as individual',
      'Bring your own laptop and charger',
      'Basic programming knowledge',
    ],
    contacts: [
      { name: 'Tran Ngoc Bao Duy', role: 'Event Director', email: 'duy.tranngocbao@hcmut.edu.vn' },
    ],
  },
  3: {
    id: 3,
    title: 'Data Science Competition',
    type: 'academic',
    description: 'Machine learning and data analysis challenge',
    fullDescription: 'Showcase your data science and machine learning skills in this comprehensive competition. Participants will work with real-world datasets to build predictive models and extract meaningful insights.',
    period: 'Nov 30 - Dec 25',
    startDate: 'November 30, 2025 - 10:00 AM',
    endDate: 'December 25, 2025 - 11:59 PM',
    status: 'open',
    participants: 67,
    maxParticipants: 100,
    organizer: 'AI & Data Science Lab',
    location: 'Online Platform',
    prizes: [
      { place: '1st Place', prize: '8,000,000 VND + AWS Credits' },
      { place: '2nd Place', prize: '5,000,000 VND + GPU Access' },
      { place: '3rd Place', prize: '3,000,000 VND' },
    ],
    rules: [
      'Individual or team (max 3 members)',
      'Use provided datasets only',
      'Document methodology and code',
      'Must submit Jupyter notebook',
      'Model performance evaluated on hidden test set',
    ],
    timeline: [
      { date: 'Nov 30 - Dec 14', event: 'Registration' },
      { date: 'Dec 15', event: 'Dataset Release' },
      { date: 'Dec 25', event: 'Submission Deadline' },
      { date: 'Dec 30', event: 'Winners Announcement' },
    ],
    requirements: [
      'HCMUT student or alumni',
      'Python programming skills',
      'Understanding of ML algorithms',
      'Jupyter Notebook environment',
    ],
    contacts: [
      { name: 'Dr. Le Thanh Sach', role: 'Competition Lead', email: 'sach.lethanh@hcmut.edu.vn' },
    ],
  },
};

export function ContestDetailScreen({ language, onBack, contestId, onStartContest }: ContestDetailScreenProps) {
  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    overview: language === 'en' ? 'Overview' : 'Tổng quan',
    rules: language === 'en' ? 'Rules' : 'Luật cuộc thi',
    prizes: language === 'en' ? 'Prizes' : 'Giải thưởng',
    register: language === 'en' ? 'Register Now' : 'Đăng ký ngay',
    registered: language === 'en' ? 'Registered' : 'Đã đăng ký',
    closed: language === 'en' ? 'Registration Closed' : 'Đã đóng đăng ký',
    participants: language === 'en' ? 'Participants' : 'Người tham gia',
    organizer: language === 'en' ? 'Organizer' : 'Đơn vị tổ chức',
    location: language === 'en' ? 'Location' : 'Địa điểm',
    timeline: language === 'en' ? 'Timeline' : 'Thời gian',
    requirements: language === 'en' ? 'Requirements' : 'Yêu cầu',
    contact: language === 'en' ? 'Contact' : 'Liên hệ',
    downloadBrochure: language === 'en' ? 'Download Brochure' : 'Tải tài liệu',
    open: language === 'en' ? 'Open' : 'Đang mở',
    description: language === 'en' ? 'Description' : 'Mô tả',
    startContest: language === 'en' ? 'Start Contest' : 'Bắt đầu làm bài',
  };

  const contest = mockContestDetails[contestId as keyof typeof mockContestDetails];

  if (!contest) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Contest not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.back}
      </Button>

      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${contest.type === 'academic' ? 'bg-purple-100' : 'bg-indigo-100'
                    }`}>
                    <Trophy className={`h-8 w-8 ${contest.type === 'academic' ? 'text-purple-600' : 'text-indigo-600'
                      }`} />
                  </div>
                  <div>
                    <h1 className="text-3xl mb-2">{contest.title}</h1>
                    <p className="text-gray-600">{contest.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={contest.status === 'open' ? 'default' : 'secondary'} className="bg-green-100 text-green-700">
                  {contest.status === 'open' ? t.open : t.closed}
                </Badge>
                <Badge variant="outline" className="border-purple-300 bg-purple-50 text-purple-700">
                  {contest.type === 'academic' ? 'Academic' : 'Non-academic'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{contest.period}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>{contest.participants}/{contest.maxParticipants} {t.participants}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={contest.status === 'closed'}
                onClick={onStartContest}
              >
                {contest.status === 'open' ? t.startContest : t.closed}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t.downloadBrochure}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="rules">{t.rules}</TabsTrigger>
          <TabsTrigger value="prizes">{t.prizes}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.description}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{contest.fullDescription}</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    {t.timeline}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contest.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                          {idx < contest.timeline.length - 1 && (
                            <div className="w-px h-full bg-purple-200 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    {t.requirements}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {contest.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-indigo-600 mt-1.5">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contest Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.organizer}</p>
                    <p className="font-medium">{contest.organizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.location}</p>
                    <p className="font-medium">{contest.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Start Date</p>
                    <p className="font-medium">{contest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">End Date</p>
                    <p className="font-medium">{contest.endDate}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.contact}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contest.contacts.map((contact, idx) => (
                    <div key={idx}>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      <p className="text-sm text-purple-600">{contact.email}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Contest Rules & Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {contest.rules.map((rule, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start gap-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-sm font-medium flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prizes Tab */}
        <TabsContent value="prizes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-600" />
                Prizes & Awards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contest.prizes.map((prize, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 text-amber-700 font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{prize.place}</p>
                      <p className="text-gray-600">{prize.prize}</p>
                    </div>
                    <Trophy className="h-6 w-6 text-amber-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
