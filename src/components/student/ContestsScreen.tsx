import { useState } from 'react';
import { Trophy, Calendar, Users, Clock, Award, FileText, ChevronLeft, Download, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Language } from '../../App';

interface Contest {
  id: number;
  title: string;
  type: 'academic' | 'non-academic';
  description: string;
  period: string;
  status: 'open' | 'closed';
  participants: number;
}

interface ContestDetail extends Contest {
  fullDescription: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  organizer: string;
  location: string;
  prizes: { place: string; prize: string }[];
  rules: string[];
  timeline: { date: string; event: string }[];
  requirements: string[];
  contacts: { name: string; role: string; email: string }[];
}

const mockContests: Contest[] = [
  { id: 1, title: 'Algorithm Challenge 2025', type: 'academic', description: 'Competitive programming contest', period: 'Nov 25 - Dec 25', status: 'open', participants: 45 },
  { id: 2, title: 'Hackathon: Smart City Solutions', type: 'non-academic', description: 'Build innovative solutions for smart cities', period: 'Jan 10 - Jan 15', status: 'closed', participants: 32 },
  { id: 3, title: 'Data Science Competition', type: 'academic', description: 'Machine learning and data analysis', period: 'Nov 30 - Dec 25', status: 'open', participants: 67 }
];

const mockContestDetails: Record<number, ContestDetail> = {
  1: { id: 1, title: 'Algorithm Challenge 2025', type: 'academic', description: 'Competitive programming contest', fullDescription: 'Full details of Algorithm Challenge...', period: 'Nov 25 - Dec 25', startDate: 'Nov 25, 2025 - 9:00 AM', endDate: 'Dec 25, 2025 - 5:00 PM', status: 'open', participants: 45, maxParticipants: 100, organizer: 'Computer Science Dept.', location: 'Online', prizes: [{ place: '1st Place', prize: '5,000,000 VND + Certificate' }], rules: ['Individual participation only'], timeline: [{ date: 'Nov 25 - Nov 30', event: 'Registration' }], requirements: ['HCMUT student'], contacts: [{ name: 'Dr. Tran Tuan Anh', role: 'Coordinator', email: 'anh.trantuan@hcmut.edu.vn' }] },
  2: { id: 2, title: 'Hackathon: Smart City Solutions', type: 'non-academic', description: 'Build innovative solutions', fullDescription: 'Full details of Hackathon...', period: 'Jan 10 - Jan 15', startDate: 'Jan 10, 2025 - 8:00 AM', endDate: 'Jan 15, 2025 - 6:00 PM', status: 'closed', participants: 32, maxParticipants: 80, organizer: 'Innovation Lab', location: 'HCMUT Innovation Hub', prizes: [{ place: '1st Place', prize: '10,000,000 VND + Mentorship' }], rules: ['Teams of 3-5 members'], timeline: [{ date: 'Dec 15 - Jan 9', event: 'Team Registration' }], requirements: ['Form a team or individual'], contacts: [{ name: 'Tran Ngoc Bao Duy', role: 'Event Director', email: 'duy.tranngocbao@hcmut.edu.vn' }] },
  3: { id: 3, title: 'Data Science Competition', type: 'academic', description: 'ML and data analysis challenge', fullDescription: 'Full details of Data Science Competition...', period: 'Nov 30 - Dec 25', startDate: 'Nov 30, 2025 - 10:00 AM', endDate: 'Dec 25, 2025 - 11:59 PM', status: 'open', participants: 67, maxParticipants: 100, organizer: 'AI Lab', location: 'Online', prizes: [{ place: '1st Place', prize: '8,000,000 VND + AWS Credits' }], rules: ['Individual or team max 3 members'], timeline: [{ date: 'Nov 30 - Dec 14', event: 'Registration' }], requirements: ['Python skills'], contacts: [{ name: 'Dr. Le Thanh Sach', role: 'Competition Lead', email: 'sach.lethanh@hcmut.edu.vn' }] }
};

export function ContestsScreen({ language }: { language: Language }) {
  const t = {
    contests: language === 'en' ? 'Contests' : 'Cuộc thi',
    open: language === 'en' ? 'Open' : 'Đang mở',
    closed: language === 'en' ? 'Closed' : 'Đã đóng',
    register: language === 'en' ? 'Register' : 'Đăng ký',
    registered: language === 'en' ? 'Registered' : 'Đã đăng ký',
    participants: language === 'en' ? 'participants' : 'người tham gia',
    back: language === 'en' ? 'Back' : 'Quay lại',
    searchPlaceholder: language === 'en' ? 'Search contests...' : 'Tìm kiếm cuộc thi...',
    filterAll: language === 'en' ? 'All' : 'Tất cả',
    filterAcademic: language === 'en' ? 'Academic' : 'Học thuật',
    filterNonAcademic: language === 'en' ? 'Non-academic' : 'Phi học thuật'
  };

  const [registered, setRegistered] = useState<number[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState<'all' | 'academic' | 'non-academic'>('all');

  const toggleRegister = (id: number) => {
    setRegistered(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  if (selectedContestId !== null) {
    const contest = mockContestDetails[selectedContestId];
    if (!contest) return <p>Contest not found</p>;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedContestId(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> {t.back}
        </Button>

        <Card className="mb-6">
          <CardContent>
            <h1 className="text-3xl mb-2">{contest.title}</h1>
            <p className="text-gray-700">{contest.fullDescription}</p>
            <div className="flex gap-2 mt-4">
              <Button
                className={`flex-1 ${registered.includes(contest.id) ? 'bg-green-600 text-white' : ''}`}
                disabled={contest.status === 'closed' || registered.includes(contest.id)}
                onClick={() => toggleRegister(contest.id)}
              >
                {registered.includes(contest.id) ? t.registered : t.register}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="prizes">Prizes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Period</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{contest.period}</p>
                <p>{contest.participants}/{contest.maxParticipants} {t.participants}</p>
                <p>Organizer: {contest.organizer}</p>
                <p>Location: {contest.location}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-5 space-y-1">
                  {contest.rules.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes">
            <Card>
              <CardHeader>
                <CardTitle>Prizes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc ml-5 space-y-1">
                  {contest.prizes.map((p, idx) => <li key={idx}>{p.place}: {p.prize}</li>)}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Filter and search contests
  const filteredContests = mockContests.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filter === 'all' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-gray-900 mb-6">{t.contests}</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center border rounded-md p-2 flex-1">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 outline-none border-none"
          />
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as 'all' | 'academic' | 'non-academic')}
            className="appearance-none pl-8 pr-4 py-2 border rounded-md bg-white cursor-pointer"
          >
            <option value="all">{t.filterAll}</option>
            <option value="academic">{t.filterAcademic}</option>
            <option value="non-academic">{t.filterNonAcademic}</option>
          </select>
          <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContests.map(c => (
          <Card key={c.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedContestId(c.id)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Trophy className={`h-8 w-8 ${c.type === 'academic' ? 'text-purple-600' : 'text-indigo-600'}`} />
                <Badge variant={c.status === 'open' ? 'default' : 'secondary'}>
                  {c.status === 'open' ? t.open : t.closed}
                </Badge>
              </div>
              <CardTitle className="mt-2">{c.title}</CardTitle>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{c.period}</span>
                <span>{c.participants} {t.participants}</span>
              </div>
              <Button
                className={`mt-2 w-full ${registered.includes(c.id) ? 'bg-green-600 text-white' : ''}`}
                disabled={c.status === 'closed' || registered.includes(c.id)}
                onClick={e => { e.stopPropagation(); toggleRegister(c.id); }}
              >
                {registered.includes(c.id) ? t.registered : t.register}
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredContests.length === 0 && <p className="text-gray-500 col-span-full">No contests found.</p>}
      </div>
    </div>
  );
}

