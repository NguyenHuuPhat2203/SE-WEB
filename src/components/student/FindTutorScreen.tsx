import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Clock, Sparkles, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useLayoutContext } from "../../hooks/useLayoutContext";

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
  recentReviews?: {
    student: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const mockTutors: Tutor[] = [
  {
    id: 1,
    name: "Demo Tutor 01",
    department: "Computer Science",
    specialization: ["Data Structures", "Algorithms", "Programming"],
    rating: 4.8,
    reviews: 24,
    avatar: "",
    nextAvailable: "Tomorrow, 2:00 PM",
    matchScore: 95,
    email: "demotutor01@hcmut.edu.vn",
    bio: "Experienced professor in Data Structures and Algorithms.",
    education: ["Ph.D. in CS - Stanford", "M.Sc. in CS - MIT"],
    courses: ["Data Structures", "Algorithms", "Programming Fundamentals"],
    awards: ["Best Teacher 2023"],
    availability: [
      { day: "Monday", times: ["10:00 AM - 12:00 PM"] },
      { day: "Wednesday", times: ["2:00 PM - 4:00 PM"] },
    ],
    recentReviews: [
      {
        student: "Demo Student 01",
        rating: 10,
        comment: "Excellent teaching!",
        date: "2 days ago",
      },
      {
        student: "Demo Student 02",
        rating: 9,
        comment: "Very engaging and clear.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: 2,
    name: "Demo Tutor 02",
    department: "Electrical Engineering",
    specialization: ["Circuit Design", "Embedded Systems"],
    rating: 4.6,
    reviews: 18,
    avatar: "",
    nextAvailable: "Friday, 9:00 AM",
    matchScore: 89,
    email: "demotutor02@hcmut.edu.vn",
    bio: "Passionate lecturer in digital and analog circuits, with 8 years of teaching experience.",
    education: [
      "Ph.D. in Electrical Engineering - Tokyo Institute of Technology",
    ],
    courses: ["Circuit Theory", "Embedded Systems", "Digital Logic"],
    awards: ["Women in Engineering Award 2021"],
    availability: [
      { day: "Tuesday", times: ["8:00 AM - 10:00 AM"] },
      { day: "Thursday", times: ["1:00 PM - 3:00 PM"] },
    ],
    recentReviews: [
      {
        student: "Demo Student 03",
        rating: 9,
        comment: "Good teaching, clear explanations.",
        date: "3 days ago",
      },
      {
        student: "Demo Student 04",
        rating: 8,
        comment: "Helpful but a bit fast-paced.",
        date: "5 days ago",
      },
    ],
  },
  {
    id: 3,
    name: "Demo Tutor 03",
    department: "Information Systems",
    specialization: ["Database Systems", "SQL", "Data Analytics"],
    rating: 4.9,
    reviews: 30,
    avatar: "",
    nextAvailable: "Today, 4:00 PM",
    matchScore: 97,
    email: "demotutor03@hcmut.edu.vn",
    bio: "Loves mentoring students in database management and data analytics using real-world projects.",
    education: [
      "M.Sc. in Information Systems - National University of Singapore",
    ],
    courses: ["Database Systems", "Business Intelligence"],
    awards: ["Best Database Instructor 2024"],
    availability: [
      { day: "Monday", times: ["3:00 PM - 5:00 PM"] },
      { day: "Friday", times: ["9:00 AM - 11:00 AM"] },
    ],
    recentReviews: [
      {
        student: "Demo Student 05",
        rating: 10,
        comment: "Awesome sessions, learned a lot!",
        date: "2 days ago",
      },
      {
        student: "Demo Student 06",
        rating: 10,
        comment: "Very supportive mentor.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: 4,
    name: "Demo Tutor 04",
    department: "Mechanical Engineering",
    specialization: ["Thermodynamics", "Machine Design"],
    rating: 4.4,
    reviews: 16,
    avatar: "",
    nextAvailable: "Monday, 10:00 AM",
    matchScore: 85,
    email: "demotutor04@hcmut.edu.vn",
    bio: "Helps students understand core mechanical concepts through hands-on examples.",
    education: ["M.Eng. in Mechanical Engineering - HCMUT"],
    courses: ["Thermodynamics", "Machine Design"],
    awards: ["Faculty Innovation Award 2022"],
    availability: [
      { day: "Wednesday", times: ["3:00 PM - 5:00 PM"] },
      { day: "Friday", times: ["1:00 PM - 3:00 PM"] },
    ],
    recentReviews: [
      {
        student: "Demo Student 07",
        rating: 9,
        comment: "Great guidance for my project.",
        date: "4 days ago",
      },
    ],
  },
  {
    id: 5,
    name: "Demo Tutor 05",
    department: "Civil Engineering",
    specialization: ["Structural Analysis", "Concrete Design"],
    rating: 4.5,
    reviews: 12,
    avatar: "",
    nextAvailable: "Thursday, 10:00 AM",
    matchScore: 83,
    email: "demotutor05@hcmut.edu.vn",
    bio: "Civil engineer with extensive experience in structural and materials design.",
    education: ["Ph.D. in Structural Engineering - HCMUT"],
    courses: ["Structural Analysis", "Concrete Design"],
    awards: ["Top 10 Civil Lecturers 2022"],
    availability: [
      { day: "Tuesday", times: ["2:00 PM - 4:00 PM"] },
      { day: "Thursday", times: ["10:00 AM - 12:00 PM"] },
    ],
    recentReviews: [
      {
        student: "Demo Student 08",
        rating: 8,
        comment: "Informative and detailed.",
        date: "6 days ago",
      },
    ],
  },
];

export function FindTutorScreen() {
  const navigate = useNavigate();
  const { language } = useLayoutContext();
  const [bknetId, setBknetId] = useState("");
  const [course, setCourse] = useState("");
  const [results, setResults] = useState(mockTutors);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);

  const t = {
    title: language === "en" ? "Find Tutor" : "Tìm cố vấn",
    manualSearch: language === "en" ? "Manual search" : "Tìm kiếm thủ công",
    autoSuggestion:
      language === "en" ? "Automatic suggestion (AI)" : "Gợi ý tự động (AI)",
    bknetId: "BKnetID",
    optional: language === "en" ? "Optional" : "Tùy chọn",
    course: language === "en" ? "Course / Subject" : "Môn học",
    selectCourse: language === "en" ? "Select a course" : "Chọn môn học",
    search: language === "en" ? "Search" : "Tìm kiếm",
    searchPlaceholder:
      language === "en"
        ? "Search by name, department, or specialization..."
        : "Tìm kiếm theo tên, khoa hoặc chuyên môn...",
    results: language === "en" ? "Search results" : "Kết quả tìm kiếm",
    viewDetails: language === "en" ? "View details" : "Xem chi tiết",
    aiInfo:
      language === "en"
        ? "AI suggests tutors based on your courses, grades and schedule"
        : "AI gợi ý cố vấn dựa trên môn học, điểm số và lịch trình của bạn",
    getSuggestions: language === "en" ? "Get AI suggestions" : "Nhận gợi ý AI",
    matchScore: language === "en" ? "Match score" : "Điểm phù hợp",
    reviews: language === "en" ? "reviews" : "đánh giá",
    nextAvailable:
      language === "en" ? "Next available" : "Thời gian rảnh tiếp theo",
    department: language === "en" ? "Department" : "Khoa",
    specialization: language === "en" ? "Specialization" : "Chuyên môn",
  };

  const departments = useMemo(
    () => Array.from(new Set(mockTutors.map((t) => t.department))),
    []
  );
  const specializations = useMemo(
    () => Array.from(new Set(mockTutors.flatMap((t) => t.specialization))),
    []
  );

  const filteredTutors = useMemo(() => {
    let filtered = [...mockTutors];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(query) ||
          tutor.department.toLowerCase().includes(query) ||
          tutor.specialization.some((spec) =>
            spec.toLowerCase().includes(query)
          )
      );
    }
    if (selectedDepartments.length > 0)
      filtered = filtered.filter((t) =>
        selectedDepartments.includes(t.department)
      );
    if (minRating > 0) filtered = filtered.filter((t) => t.rating >= minRating);
    if (selectedSpecializations.length > 0)
      filtered = filtered.filter((t) =>
        t.specialization.some((spec) => selectedSpecializations.includes(spec))
      );
    if (bknetId.trim())
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(bknetId.toLowerCase())
      );
    if (course)
      filtered = filtered.filter((t) =>
        t.specialization.some((spec) =>
          spec.toLowerCase().includes(course.toLowerCase())
        )
      );
    return filtered;
  }, [
    searchQuery,
    selectedDepartments,
    minRating,
    selectedSpecializations,
    bknetId,
    course,
  ]);

  const handleSearch = () => setResults(filteredTutors);
  const handleAISuggestion = () => {
    setShowAISuggestions(true);
    setResults(
      [...mockTutors].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    );
  };
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartments([]);
    setMinRating(0);
    setSelectedSpecializations([]);
    setBknetId("");
    setCourse("");
    setResults(mockTutors);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-gray-900 mb-4">{t.title}</h1>

      {/* Search Tabs */}
      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="manual"
            onClick={() => setShowAISuggestions(false)}
          >
            <Search className="h-4 w-4 mr-2" /> {t.manualSearch}
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="h-4 w-4 mr-2" /> {t.autoSuggestion}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.manualSearch}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bknetId">
                    {t.bknetId}{" "}
                    <span className="text-gray-400">({t.optional})</span>
                  </Label>
                  <Input
                    id="bknetId"
                    value={bknetId}
                    onChange={(e) => setBknetId(e.target.value)}
                    placeholder="tutor.hcmut"
                  />
                </div>
                <div>
                  <Label htmlFor="course">{t.course}</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder={t.selectCourse} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data-structures">
                        Data Structures
                      </SelectItem>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="database">Database Systems</SelectItem>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                {t.search}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Button onClick={handleAISuggestion}>
            <Sparkles className="h-4 w-4 mr-2" />
            {t.getSuggestions}
          </Button>
        </TabsContent>
      </Tabs>

      {/* Results */}
      <div className="mt-6">
        <h2 className="text-gray-900 mb-4">
          {t.results} ({filteredTutors.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedTutor(tutor)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 truncate">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.department}</p>
                  </div>
                  {showAISuggestions && (
                    <Badge variant="secondary">{tutor.matchScore}%</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{" "}
                  {tutor.rating}{" "}
                  <span className="text-sm text-gray-500">
                    ({tutor.reviews} {t.reviews})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {tutor.specialization.slice(0, 2).map((spec, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {tutor.specialization.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutor.specialization.length - 2}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  {tutor.nextAvailable}
                </div>
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
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedTutor.avatar}
                      alt={selectedTutor.name}
                    />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
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
                  <ul>
                    {selectedTutor.education?.map((edu, idx) => (
                      <li key={idx}>{edu}</li>
                    ))}
                  </ul>
                  <Label>Courses</Label>
                  <ul>
                    {selectedTutor.courses?.map((course, idx) => (
                      <li key={idx}>{course}</li>
                    ))}
                  </ul>
                  <Label>Awards</Label>
                  <ul>
                    {selectedTutor.awards?.map((award, idx) => (
                      <li key={idx}>{award}</li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {selectedTutor.recentReviews?.map((rev, idx) => (
                    <Card key={idx}>
                      <CardContent>
                        {rev.student}: {rev.comment} ({rev.rating}⭐)
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  {selectedTutor.availability?.map((slot, idx) => (
                    <div key={idx}>
                      <p className="font-medium">{slot.day}</p>
                      <ul>
                        {slot.times.map((time, tIdx) => (
                          <li key={tIdx}>{time}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate(`/student/tutor/${selectedTutor.id}`);
                    setSelectedTutor(null);
                  }}
                >
                  {language === "en" ? "View Full Profile" : "Xem hồ sơ đầy đủ"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
