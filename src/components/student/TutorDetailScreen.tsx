import { useState } from 'react';
import { Star, Calendar, Mail, Phone, MapPin, Clock, Award, BookOpen, ChevronLeft, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { Language } from '../../App';

interface TutorDetailScreenProps {
  language: Language;
  onBack: () => void;
  tutorId: number;
}

const mockTutorDetails = {
  1: {
    id: 1,
    name: 'Dr. Tran Thi B',
    department: 'Computer Science',
    specialization: ['Data Structures', 'Algorithms', 'Programming'],
    rating: 4.8,
    reviews: 24,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    email: 'tran.thi.b@hcmut.edu.vn',
    phone: '+84 123 456 789',
    office: 'Room 305, Building A4',
    bio: 'Experienced professor with 10+ years in teaching data structures and algorithms. Passionate about helping students understand complex concepts through practical examples.',
    education: [
      'Ph.D. in Computer Science - Stanford University (2012)',
      'M.Sc. in Computer Science - MIT (2008)',
      'B.Sc. in Computer Science - HCMUT (2006)',
    ],
    courses: ['Data Structures', 'Advanced Algorithms', 'Programming Fundamentals', 'Discrete Mathematics'],
    awards: ['Best Teacher Award 2023', 'Outstanding Research Award 2022', 'Excellence in Teaching 2021'],
    availability: [
      { day: 'Monday', times: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'] },
      { day: 'Wednesday', times: ['10:00 AM - 12:00 PM', '3:00 PM - 5:00 PM'] },
      { day: 'Friday', times: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'] },
    ],
    recentReviews: [
      { student: 'Nguyen Van A', rating: 5, comment: 'Excellent teaching style, very patient and helpful!', date: '2 days ago' },
      { student: 'Tran Thi C', rating: 4, comment: 'Great tutor, explains concepts clearly.', date: '1 week ago' },
      { student: 'Le Van D', rating: 5, comment: 'Highly recommended! Helped me ace my algorithms exam.', date: '2 weeks ago' },
    ],
  },
  2: {
    id: 2,
    name: 'Dr. Nguyen Van C',
    department: 'Computer Science',
    specialization: ['Database', 'Web Development', 'Software Engineering'],
    rating: 4.6,
    reviews: 18,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    email: 'nguyen.van.c@hcmut.edu.vn',
    phone: '+84 123 456 790',
    office: 'Room 208, Building A4',
    bio: 'Specializing in database systems and web development. Industry experience from working at major tech companies.',
    education: [
      'Ph.D. in Computer Science - UC Berkeley (2015)',
      'M.Sc. in Software Engineering - Carnegie Mellon (2011)',
      'B.Sc. in Computer Science - HCMUT (2009)',
    ],
    courses: ['Database Systems', 'Web Development', 'Software Engineering', 'Cloud Computing'],
    awards: ['Innovation in Teaching 2023', 'Research Excellence Award 2021'],
    availability: [
      { day: 'Tuesday', times: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'] },
      { day: 'Thursday', times: ['10:00 AM - 12:00 PM', '3:00 PM - 5:00 PM'] },
    ],
    recentReviews: [
      { student: 'Pham Van E', rating: 5, comment: 'Very knowledgeable in database systems!', date: '3 days ago' },
      { student: 'Hoang Thi F', rating: 4, comment: 'Good explanations, very practical examples.', date: '1 week ago' },
    ],
  },
  3: {
    id: 3,
    name: 'Dr. Le Thi D',
    department: 'Computer Science',
    specialization: ['Machine Learning', 'AI', 'Data Science'],
    rating: 4.9,
    reviews: 32,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    email: 'le.thi.d@hcmut.edu.vn',
    phone: '+84 123 456 791',
    office: 'Room 402, Building A5',
    bio: 'Leading researcher in machine learning and AI. Published numerous papers in top-tier conferences.',
    education: [
      'Ph.D. in Artificial Intelligence - Oxford University (2014)',
      'M.Sc. in Machine Learning - ETH Zurich (2010)',
      'B.Sc. in Computer Science - HCMUT (2008)',
    ],
    courses: ['Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Data Science'],
    awards: ['Best Researcher Award 2023', 'Excellence in Teaching 2022', 'Outstanding Paper Award 2021'],
    availability: [
      { day: 'Monday', times: ['1:00 PM - 3:00 PM', '4:00 PM - 6:00 PM'] },
      { day: 'Wednesday', times: ['1:00 PM - 3:00 PM'] },
      { day: 'Friday', times: ['2:00 PM - 4:00 PM'] },
    ],
    recentReviews: [
      { student: 'Dao Van G', rating: 5, comment: 'Amazing! Best ML teacher ever!', date: '1 day ago' },
      { student: 'Bui Thi H', rating: 5, comment: 'Explains complex concepts so well.', date: '4 days ago' },
      { student: 'Vo Van I', rating: 5, comment: 'Highly recommended for ML students!', date: '1 week ago' },
    ],
  },
};

export function TutorDetailScreen({ language, onBack, tutorId }: TutorDetailScreenProps) {
  const [consultationMessage, setConsultationMessage] = useState('');

  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    overview: language === 'en' ? 'Overview' : 'Tổng quan',
    reviews: language === 'en' ? 'Reviews' : 'Đánh giá',
    schedule: language === 'en' ? 'Schedule' : 'Lịch trình',
    contact: language === 'en' ? 'Contact Information' : 'Thông tin liên hệ',
    education: language === 'en' ? 'Education' : 'Học vấn',
    courses: language === 'en' ? 'Courses Teaching' : 'Môn học giảng dạy',
    awards: language === 'en' ? 'Awards & Recognition' : 'Giải thưởng & Vinh danh',
    availability: language === 'en' ? 'Availability' : 'Lịch rảnh',
    requestConsultation: language === 'en' ? 'Request Consultation' : 'Yêu cầu tư vấn',
    sendRequest: language === 'en' ? 'Send Request' : 'Gửi yêu cầu',
    message: language === 'en' ? 'Message' : 'Tin nhắn',
    messagePlaceholder: language === 'en' ? 'Describe what you need help with...' : 'Mô tả nội dung bạn cần tư vấn...',
    rating: language === 'en' ? 'rating' : 'đánh giá',
    reviewsCount: language === 'en' ? 'reviews' : 'đánh giá',
  };

  const tutor = mockTutorDetails[tutorId as keyof typeof mockTutorDetails];

  if (!tutor) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Tutor not found</p>
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
            <Avatar className="h-32 w-32">
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white text-4xl">
                {tutor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl mb-2">{tutor.name}</h1>
              <p className="text-gray-600 mb-3">{tutor.department}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl">{tutor.rating}</span>
                  <span className="text-gray-500">({tutor.reviews} {t.reviewsCount})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tutor.specialization.map((spec, idx) => (
                  <Badge key={idx} variant="outline" className="border-purple-300 bg-purple-50 text-purple-700">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Calendar className="h-4 w-4 mr-2" />
                {t.requestConsultation}
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="reviews">{t.reviews}</TabsTrigger>
          <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{tutor.bio}</p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    {t.education}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutor.education.map((edu, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-purple-600 mt-1.5">•</span>
                        {edu}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    {t.courses}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tutor.courses.map((course, idx) => (
                      <Badge key={idx} variant="outline" className="border-indigo-300 bg-indigo-50 text-indigo-700">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.contact}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm">{tutor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-sm">{tutor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Office</p>
                      <p className="text-sm">{tutor.office}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Awards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    {t.awards}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutor.awards.map((award, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        {award}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {tutor.recentReviews.map((review, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {review.student.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.student}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                {t.availability}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutor.availability.map((slot, idx) => (
                  <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                    <p className="font-medium mb-2">{slot.day}</p>
                    <div className="space-y-1">
                      {slot.times.map((time, timeIdx) => (
                        <div key={timeIdx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Request Consultation Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t.requestConsultation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">{t.message}</Label>
                <Textarea
                  id="message"
                  placeholder={t.messagePlaceholder}
                  value={consultationMessage}
                  onChange={(e) => setConsultationMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Calendar className="h-4 w-4 mr-2" />
                {t.sendRequest}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
