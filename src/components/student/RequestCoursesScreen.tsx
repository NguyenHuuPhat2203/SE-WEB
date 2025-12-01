import React, { useState } from 'react';
import {
  Search, BookOpen, Users, GraduationCap, Check,
  ChevronLeft, Star, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';

interface RequestCoursesScreenProps {
  language: Language;
}

export function RequestCoursesScreen({ language }: RequestCoursesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [requestedCourses, setRequestedCourses] = useState<number[]>([3]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const t = {
    title: language === 'en' ? 'Request Courses' : 'Yêu cầu môn học',
    description: language === 'en' ? 'Browse and request courses for the upcoming semester' : 'Duyệt và yêu cầu các môn học cho học kỳ tới',
    search: language === 'en' ? 'Search courses...' : 'Tìm kiếm môn học...',
    request: language === 'en' ? 'Request' : 'Yêu cầu',
    requested: language === 'en' ? 'Requested' : 'Đã yêu cầu',
    tutors: language === 'en' ? 'tutors' : 'cố vấn',
    students: language === 'en' ? 'students interested' : 'sinh viên quan tâm',
    credits: language === 'en' ? 'credits' : 'tín chỉ',
    back: language === 'en' ? 'Back' : 'Quay lại',
    details: language === 'en' ? 'Course Details' : 'Chi tiết môn học',
  };

  const courses = [
    {
      id: 1,
      code: 'CS301',
      name: language === 'en' ? 'Machine Learning' : 'Học máy',
      department: 'Computer Science',
      description: 'ML basics, algorithms & applications',
      credits: 4,
      tutors: 1,
      interested: 45,
      difficulty: 'Advanced',
      color: 'purple',
      instructor: 'Dr. Le Thanh Sach',
      rating: 4.8,
      duration: '14 weeks'
    },
    {
      id: 2,
      code: 'CS201',
      name: language === 'en' ? 'Advanced Database Systems' : 'Hệ quản trị CSDL nâng cao',
      department: 'Computer Science',
      description: 'Database design, optimization & NoSQL',
      credits: 3,
      tutors: 1,
      interested: 32,
      difficulty: 'Intermediate',
      color: 'blue',
      instructor: 'Mai Duc Trung',
      rating: 4.7,
      duration: '12 weeks'
    },
    {
      id: 3,
      code: 'CS302',
      name: language === 'en' ? 'Computer Vision' : 'Thị giác máy tính',
      department: 'Computer Science',
      description: 'Image processing & CV techniques',
      credits: 4,
      tutors: 1,
      interested: 28,
      difficulty: 'Advanced',
      color: 'green',
      instructor: 'Huynh Van Thong',
      rating: 4.9,
      duration: '14 weeks'
    },
    {
      id: 4,
      code: 'CS202',
      name: language === 'en' ? 'Distributed Systems' : 'Hệ thống phân tán',
      department: 'Computer Science',
      description: 'Distributed design & implementation',
      credits: 3,
      tutors: 1,
      interested: 38,
      difficulty: 'Advanced',
      color: 'indigo',
      instructor: 'Tran Ngoc Bao Duy',
      rating: 4.8,
      duration: '13 weeks'
    }
  ];

  const filteredCourses = courses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestCourse = (courseId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (requestedCourses.includes(courseId)) {
      setSelectedCourseId(courseId);
    } else {
      setRequestedCourses([...requestedCourses, courseId]);
      toast.success(language === 'en' ? 'Course requested successfully' : 'Đã yêu cầu môn học thành công');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // -------------------------
  // COURSE DETAIL SCREEN
  // -------------------------
  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  if (selectedCourseId && selectedCourse) {
    return (
      <div className="p-6 max-w-5xl mx-auto">

        <Button variant="ghost" onClick={() => setSelectedCourseId(null)} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">{selectedCourse.name}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{selectedCourse.code}</Badge>
              <Badge variant="outline" className={getDifficultyColor(selectedCourse.difficulty)}>
                {selectedCourse.difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-700">{selectedCourse.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{selectedCourse.instructor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium">{selectedCourse.instructor}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <p className="font-medium">{selectedCourse.rating}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t.credits}</p>
                <p className="font-medium">{selectedCourse.credits}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{selectedCourse.duration}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------------------------
  // MAIN COURSE LIST SCREEN
  // -------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.description}</p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isRequested = requestedCourses.includes(course.id);
          return (
            <Card
              key={course.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${isRequested ? 'ring-2 ring-purple-200' : ''}`}
              onClick={() => setSelectedCourseId(course.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br from-${course.color}-400 to-${course.color}-500`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline">{course.code}</Badge>
                  </div>

                  <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>

                <CardTitle className="text-lg">{course.name}</CardTitle>
                <p className="line-clamp-2 text-gray-600">{course.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {course.credits} {t.credits}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.tutors} {t.tutors}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {course.interested} {t.students}
                  </p>

                  <Button
                    className={`w-full ${isRequested
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      }`}
                    onClick={(e) => handleRequestCourse(course.id, e)}
                  >
                    {isRequested ? <><Check className="h-4 w-4 mr-2" />{t.requested}</> : t.request}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
