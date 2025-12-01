import { ArrowLeft, BookOpen, Users, GraduationCap, Clock, Calendar, Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import type { Language } from '../../App';

interface CourseDetailScreenProps {
  language: Language;
  courseId: number;
  onBack: () => void;
}

export function CourseDetailScreen({ language, courseId, onBack }: CourseDetailScreenProps) {
  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    overview: language === 'en' ? 'Overview' : 'Tổng quan',
    syllabus: language === 'en' ? 'Syllabus' : 'Đề cương',
    tutors: language === 'en' ? 'Tutors' : 'Cố vấn',
    request: language === 'en' ? 'Request course' : 'Yêu cầu môn học',
    requested: language === 'en' ? 'Requested' : 'Đã yêu cầu',
    credits: language === 'en' ? 'Credits' : 'Tín chỉ',
    duration: language === 'en' ? 'Duration' : 'Thời lượng',
    weeks: language === 'en' ? 'weeks' : 'tuần',
    difficulty: language === 'en' ? 'Difficulty' : 'Độ khó',
    students: language === 'en' ? 'students interested' : 'sinh viên quan tâm',
    prerequisites: language === 'en' ? 'Prerequisites' : 'Yêu cầu trước',
    learningOutcomes: language === 'en' ? 'Learning outcomes' : 'Kết quả học tập',
    courseDescription: language === 'en' ? 'Course description' : 'Mô tả môn học',
    week: language === 'en' ? 'Week' : 'Tuần',
    topic: language === 'en' ? 'Topic' : 'Chủ đề',
    activities: language === 'en' ? 'Activities' : 'Hoạt động',
    tutor: language === 'en' ? 'Tutor' : 'Cố vấn',
    experience: language === 'en' ? 'years experience' : 'năm kinh nghiệm',
    rating: language === 'en' ? 'Rating' : 'Đánh giá',
    sessions: language === 'en' ? 'sessions' : 'buổi học',
  };

  // Mock course data based on courseId
  const course = {
    id: courseId,
    code: 'CS301',
    name: language === 'en' ? 'Machine Learning' : 'Học máy',
    department: language === 'en' ? 'Computer Science' : 'Khoa học máy tính',
    description: language === 'en'
      ? 'This course provides a comprehensive introduction to machine learning, covering supervised and unsupervised learning, neural networks, and deep learning. Students will gain hands-on experience with popular ML frameworks and work on real-world projects.'
      : 'Môn học này cung cấp giới thiệu toàn diện về học máy, bao gồm học có giám sát và không giám sát, mạng nơ-ron và học sâu. Sinh viên sẽ có kinh nghiệm thực hành với các framework ML phổ biến và làm việc trên các dự án thực tế.',
    credits: 4,
    duration: 15,
    difficulty: 'Advanced',
    interested: 45,
    requested: false,
    prerequisites: [
      language === 'en' ? 'Linear Algebra' : 'Đại số tuyến tính',
      language === 'en' ? 'Probability and Statistics' : 'Xác suất và Thống kê',
      language === 'en' ? 'Python Programming' : 'Lập trình Python',
    ],
    outcomes: [
      language === 'en' ? 'Understand core machine learning concepts and algorithms' : 'Hiểu các khái niệm và thuật toán học máy cốt lõi',
      language === 'en' ? 'Implement ML models using popular frameworks' : 'Triển khai mô hình ML sử dụng các framework phổ biến',
      language === 'en' ? 'Evaluate and optimize model performance' : 'Đánh giá và tối ưu hóa hiệu suất mô hình',
      language === 'en' ? 'Apply ML techniques to real-world problems' : 'Áp dụng kỹ thuật ML vào các vấn đề thực tế',
    ],
  };

  const syllabus = [
    {
      week: 1,
      topic: language === 'en' ? 'Introduction to Machine Learning' : 'Giới thiệu về Học máy',
      activities: language === 'en' ? 'Lectures, Reading assignments' : 'Bài giảng, Bài tập đọc',
    },
    {
      week: 2,
      topic: language === 'en' ? 'Linear Regression' : 'Hồi quy tuyến tính',
      activities: language === 'en' ? 'Lab session, Problem set 1' : 'Thực hành, Bài tập 1',
    },
    {
      week: 3,
      topic: language === 'en' ? 'Logistic Regression & Classification' : 'Hồi quy Logistic & Phân loại',
      activities: language === 'en' ? 'Lab session, Quiz 1' : 'Thực hành, Kiểm tra 1',
    },
    {
      week: 4,
      topic: language === 'en' ? 'Decision Trees and Random Forests' : 'Cây quyết định và Rừng ngẫu nhiên',
      activities: language === 'en' ? 'Lab session, Problem set 2' : 'Thực hành, Bài tập 2',
    },
    {
      week: 5,
      topic: language === 'en' ? 'Support Vector Machines' : 'Máy vector hỗ trợ',
      activities: language === 'en' ? 'Lab session, Project proposal due' : 'Thực hành, Nộp đề xuất dự án',
    },
    {
      week: 6,
      topic: language === 'en' ? 'Neural Networks Basics' : 'Cơ bản về Mạng nơ-ron',
      activities: language === 'en' ? 'Lab session, Quiz 2' : 'Thực hành, Kiểm tra 2',
    },
    {
      week: 7,
      topic: language === 'en' ? 'Deep Learning Fundamentals' : 'Cơ sở Học sâu',
      activities: language === 'en' ? 'Lab session, Problem set 3' : 'Thực hành, Bài tập 3',
    },
    {
      week: 8,
      topic: language === 'en' ? 'Midterm Exam' : 'Kiểm tra giữa kỳ',
      activities: language === 'en' ? 'Exam' : 'Thi',
    },
  ];

  const tutorsList = [
    {
      id: 1,
      name: 'Dr. Le Thanh Sach',
      avatar: '',
      rating: 4.9,
      experience: 8,
      sessions: 156,
      specialization: language === 'en' ? 'Deep Learning' : 'Học sâu',
    },
    {
      id: 2,
      name: 'Dr. Nguyen Duc Dung',
      avatar: '',
      rating: 4.8,
      experience: 12,
      sessions: 203,
      specialization: language === 'en' ? 'Neural Networks' : 'Mạng nơ-ron',
    },
    {
      id: 3,
      name: 'Dr. Le Thanh Sach',
      avatar: '',
      rating: 4.7,
      experience: 6,
      sessions: 98,
      specialization: language === 'en' ? 'Computer Vision' : 'Thị giác máy tính',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="h-24 w-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="h-12 w-12" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {course.code}
                  </Badge>
                  <Badge variant="outline" className={`${getDifficultyColor(course.difficulty)} border-0`}>
                    {course.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl mb-2">{course.name}</h1>
                <p className="text-purple-100">{course.department}</p>
              </div>
            </div>
            <Button
              size="lg"
              className={`${course.requested
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              disabled={course.requested}
            >
              {course.requested ? t.requested : t.request}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-100 mb-1">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm">{t.credits}</span>
              </div>
              <p className="text-2xl">{course.credits}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-100 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{t.duration}</span>
              </div>
              <p className="text-2xl">{course.duration} {t.weeks}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-100 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">{t.difficulty}</span>
              </div>
              <p className="text-2xl">{course.difficulty}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-100 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Interest</span>
              </div>
              <p className="text-2xl">{course.interested}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              {t.overview}
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              {t.syllabus}
            </TabsTrigger>
            <TabsTrigger value="tutors" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              {t.tutors}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.courseDescription}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.prerequisites}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      <span>{prereq}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.learningOutcomes}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-purple-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{outcome}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syllabus Tab */}
          <TabsContent value="syllabus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Schedule</CardTitle>
                <CardDescription>
                  {course.duration} week curriculum with lectures, labs, and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syllabus.map((item) => (
                    <div
                      key={item.week}
                      className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                          <span>{item.week}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{item.topic}</h4>
                        <p className="text-sm text-gray-600">{item.activities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutors Tab */}
          <TabsContent value="tutors" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {tutorsList.map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-xl">
                            {tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg mb-1">{tutor.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tutor.specialization}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {tutor.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {tutor.experience} {t.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {tutor.sessions} {t.sessions}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
