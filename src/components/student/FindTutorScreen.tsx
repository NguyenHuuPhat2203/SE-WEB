import { useState, useMemo, useEffect } from 'react';
import { Search, Star, Clock, Sparkles, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { toast } from 'sonner';
import type { Language } from '../../App';
import { tutorsAPI } from '../../services/api';
import { formatTutor } from '../../services/dataFormatters';

interface Tutor {
  id: number;
  name: string;
  department: string;
  specialization: string[];
  rating: number;
  reviews: number;
  avatar: string;
  nextAvailable: string;
  matchScore?: number;
  email?: string;
  bio?: string;
  education?: string[];
  courses?: string[];
  awards?: string[];
  availability?: { day: string; times: string[] }[];
  recentReviews?: { student: string; rating: number; comment: string; date: string }[];
}

interface FindTutorScreenProps {
  language: Language;
  onNavigate?: (screen: string, tutorId?: number) => void;
}

const mockTutors: Tutor[] = [
  {
    id: 1,
    name: 'Dr. Le Thanh Sach',
    department: 'Computer Science',
    specialization: ['Data Structures', 'Algorithms', 'Programming'],
    rating: 4.8,
    reviews: 24,
    avatar: '',
    nextAvailable: 'Tomorrow, 2:00 PM',
    matchScore: 95,
    email: 'sach@hcmut.edu.vn',
    bio: 'Experienced professor in Data Structures and Algorithms.',
    education: ['Ph.D. in CS - Stanford', 'M.Sc. in CS - MIT'],
    courses: ['Data Structures', 'Algorithms', 'Programming Fundamentals'],
    awards: ['Best Teacher 2023'],
    availability: [
      { day: 'Monday', times: ['10:00 AM - 12:00 PM'] },
      { day: 'Wednesday', times: ['2:00 PM - 4:00 PM'] },
    ],
    recentReviews: [
      { student: 'Nguyen Huu Phat', rating: 10, comment: 'Excellent teaching!', date: '2 days ago' },
    ],
  },
  // Add other tutors...
];

export function FindTutorScreen({ language, onNavigate }: FindTutorScreenProps) {
  const [bknetId, setBknetId] = useState('');
  const [course, setCourse] = useState('');
  const [results, setResults] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      setLoading(true);
      const response = await tutorsAPI.getAll();
      if (response.success && response.data) {
        const formattedTutors = response.data.map(formatTutor);
        setResults(formattedTutors);
      }
    } catch (error) {
      console.error('Error loading tutors:', error);
      toast.error(language === 'en' ? 'Failed to load tutors' : 'Không thể tải danh sách cố vấn');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    title: language === 'en' ? 'Find Tutor' : 'Tìm cố vấn',
    manualSearch: language === 'en' ? 'Manual search' : 'Tìm kiếm thủ công',
    autoSuggestion: language === 'en' ? 'Automatic suggestion (AI)' : 'Gợi ý tự động (AI)',
    bknetId: 'BKnetID',
    optional: language === 'en' ? 'Optional' : 'Tùy chọn',
    course: language === 'en' ? 'Course / Subject' : 'Môn học',
    selectCourse: language === 'en' ? 'Select a course' : 'Chọn môn học',
    search: language === 'en' ? 'Search' : 'Tìm kiếm',
    searchPlaceholder: language === 'en' ? 'Search by name, department, or specialization...' : 'Tìm kiếm theo tên, khoa hoặc chuyên môn...',
    results: language === 'en' ? 'Search results' : 'Kết quả tìm kiếm',
    viewDetails: language === 'en' ? 'View details' : 'Xem chi tiết',
    aiInfo: language === 'en' ? 'AI suggests tutors based on your courses, grades and schedule' : 'AI gợi ý cố vấn dựa trên môn học, điểm số và lịch trình của bạn',
    getSuggestions: language === 'en' ? 'Get AI suggestions' : 'Nhận gợi ý AI',
    matchScore: language === 'en' ? 'Match score' : 'Điểm phù hợp',
    reviews: language === 'en' ? 'reviews' : 'đánh giá',
    nextAvailable: language === 'en' ? 'Next available' : 'Thời gian rảnh tiếp theo',
    department: language === 'en' ? 'Department' : 'Khoa',
    specialization: language === 'en' ? 'Specialization' : 'Chuyên môn',
  };

  const departments = useMemo(() => Array.from(new Set(mockTutors.map(t => t.department))), []);
  const specializations = useMemo(() => Array.from(new Set(mockTutors.flatMap(t => t.specialization))), []);

  const filteredTutors = useMemo(() => {
    let filtered = [...mockTutors];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tutor =>
        tutor.name.toLowerCase().includes(query) ||
        tutor.department.toLowerCase().includes(query) ||
        tutor.specialization.some(spec => spec.toLowerCase().includes(query))
      );
    }
    if (selectedDepartments.length > 0) filtered = filtered.filter(t => selectedDepartments.includes(t.department));
    if (minRating > 0) filtered = filtered.filter(t => t.rating >= minRating);
    if (selectedSpecializations.length > 0) filtered = filtered.filter(t =>
      t.specialization.some(spec => selectedSpecializations.includes(spec))
    );
    if (bknetId.trim()) filtered = filtered.filter(t => t.name.toLowerCase().includes(bknetId.toLowerCase()));
    if (course) filtered = filtered.filter(t => t.specialization.some(spec => spec.toLowerCase().includes(course.toLowerCase())));
    return filtered;
  }, [searchQuery, selectedDepartments, minRating, selectedSpecializations, bknetId, course]);

  const handleSearch = () => setResults(filteredTutors);
  const handleAISuggestion = () => {
    setShowAISuggestions(true);
    setResults([...mockTutors].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)));
  };
  const resetFilters = () => {
    setSearchQuery(''); setSelectedDepartments([]); setMinRating(0);
    setSelectedSpecializations([]); setBknetId(''); setCourse('');
    loadTutors();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-500">Loading tutors...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-gray-900 mb-4">{t.title}</h1>

      {/* Search Tabs */}
      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manual" onClick={() => setShowAISuggestions(false)}>
            <Search className="h-4 w-4 mr-2" /> {t.manualSearch}
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" /> {t.autoSuggestion}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>{t.manualSearch}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bknetId">{t.bknetId} <span className="text-gray-400">({t.optional})</span></Label>
                  <Input id="bknetId" value={bknetId} onChange={e => setBknetId(e.target.value)} placeholder="tutor.hcmut" />
                </div>
                <div>
                  <Label htmlFor="course">{t.course}</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course"><SelectValue placeholder={t.selectCourse} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-structures">Data Structures</SelectItem>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="database">Database Systems</SelectItem>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSearch}><Search className="h-4 w-4 mr-2" />{t.search}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Button onClick={handleAISuggestion}><Sparkles className="h-4 w-4 mr-2" />{t.getSuggestions}</Button>
        </TabsContent>
      </Tabs>

      {/* Results */}
      <div className="mt-6">
        <h2 className="text-gray-900 mb-4">{t.results} ({filteredTutors.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutors.map(tutor => (
            <Card key={tutor.id} className="cursor-pointer hover:shadow-lg" onClick={() => setSelectedTutor(tutor)}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar><AvatarImage src={tutor.avatar} alt={tutor.name} /><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 truncate">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.department}</p>
                  </div>
                  {showAISuggestions && <Badge variant="secondary">{tutor.matchScore}%</Badge>}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {tutor.rating} <span className="text-sm text-gray-500">({tutor.reviews} {t.reviews})</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {tutor.specialization.slice(0, 2).map((spec, idx) => <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>)}
                  {tutor.specialization.length > 2 && <Badge variant="outline" className="text-xs">+{tutor.specialization.length - 2}</Badge>}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3"><Clock className="h-4 w-4 mr-1" />{tutor.nextAvailable}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tutor Details Sheet */}
      <Sheet open={!!selectedTutor} onOpenChange={() => setSelectedTutor(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedTutor && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-16 w-16"><AvatarImage src={selectedTutor.avatar} alt={selectedTutor.name} /><AvatarFallback><User className="h-8 w-8" /></AvatarFallback></Avatar>
                  <div>
                    <SheetTitle>{selectedTutor.name}</SheetTitle>
                    <p className="text-gray-600">{selectedTutor.department}</p>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <p>{selectedTutor.bio}</p>
                  <Label>Education</Label>
                  <ul>{selectedTutor.education?.map((edu, idx) => <li key={idx}>{edu}</li>)}</ul>
                  <Label>Courses</Label>
                  <ul>{selectedTutor.courses?.map((course, idx) => <li key={idx}>{course}</li>)}</ul>
                  <Label>Awards</Label>
                  <ul>{selectedTutor.awards?.map((award, idx) => <li key={idx}>{award}</li>)}</ul>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {selectedTutor.recentReviews?.map((rev, idx) => (
                    <Card key={idx}><CardContent>{rev.student}: {rev.comment} ({rev.rating}⭐)</CardContent></Card>
                  ))}
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  {selectedTutor.availability?.map((slot, idx) => (
                    <div key={idx}>
                      <p className="font-medium">{slot.day}</p>
                      <ul>{slot.times.map((time, tIdx) => <li key={tIdx}>{time}</li>)}</ul>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
