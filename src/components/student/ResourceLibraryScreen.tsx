import React, { useState } from 'react';
import {
  FileText, Video, Download, Eye, Search, Filter, BookOpen, Upload, Star, Clock, ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';

interface ResourceScreenProps {
  language: Language;
}

export function ResourceLibraryScreen({ language }: ResourceScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [screen, setScreen] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const t = {
    title: language === 'en' ? 'Resource Library' : 'Thư viện tài liệu',
    description: language === 'en' ? 'Access lecture notes, videos, and study materials' : 'Truy cập ghi chú bài giảng, video và tài liệu học tập',
    search: language === 'en' ? 'Search resources...' : 'Tìm kiếm tài liệu...',
    allResources: language === 'en' ? 'All resources' : 'Tất cả tài liệu',
    documents: language === 'en' ? 'Documents' : 'Tài liệu',
    videos: language === 'en' ? 'Videos' : 'Video',
    myUploads: language === 'en' ? 'My uploads' : 'Tải lên của tôi',
    upload: language === 'en' ? 'Upload' : 'Tải lên',
    filterBy: language === 'en' ? 'Filter by' : 'Lọc theo',
    download: language === 'en' ? 'Download' : 'Tải xuống',
    downloaded: language === 'en' ? 'Downloaded' : 'Đã tải xuống',
    view: language === 'en' ? 'View' : 'Xem',
    uploadedBy: language === 'en' ? 'Uploaded by' : 'Tải lên bởi',
    downloads: language === 'en' ? 'downloads' : 'lượt tải',
    views: language === 'en' ? 'views' : 'lượt xem',
    back: language === 'en' ? 'Back' : 'Quay lại',
    descriptionLabel: language === 'en' ? 'Description' : 'Mô tả',
    size: language === 'en' ? 'Size' : 'Kích thước',
    duration: language === 'en' ? 'Duration' : 'Thời lượng',
    tags: language === 'en' ? 'Tags' : 'Thẻ',
    document: language === 'en' ? 'Document' : 'Tài liệu',
    video: language === 'en' ? 'Video' : 'Video',
  };

  // -------------------------
  // MOCK DATA
  // -------------------------
  const resources = [
    { id: 1, title: 'Data Structures - Lecture Notes (Week 1-5)', type: 'document', subject: 'Computer Science', uploadedBy: 'Tran Ngoc Bao Duy', uploadDate: '2 days ago', downloads: 234, views: 567, rating: 4.8, size: '2.4 MB', description: 'Comprehensive lecture notes covering fundamental data structures including arrays, linked lists, stacks, queues, and trees. Includes examples and practice problems.', content: 'This document contains detailed notes from weeks 1-5...', tags: ['Data Structures', 'Algorithms', 'Lecture Notes'] },
    { id: 2, title: 'Introduction to Algorithms - Video Lecture', type: 'video', subject: 'Computer Science', uploadedBy: 'Tran Ngoc Bao Duy', uploadDate: '1 week ago', downloads: 0, views: 892, rating: 4.9, duration: '45:30', description: 'A comprehensive video lecture introducing fundamental algorithm concepts, complexity analysis, and common algorithmic patterns.', tags: ['Algorithms', 'Video', 'Lecture'] },
    { id: 3, title: 'Linear Algebra Problem Set Solutions', type: 'document', subject: 'Mathematics', uploadedBy: 'Dang Van Vinh', uploadDate: '3 days ago', downloads: 456, views: 789, rating: 4.7, size: '1.8 MB', description: 'Complete solutions to problem sets covering linear transformations, eigenvalues, and matrix operations.', tags: ['Mathematics', 'Linear Algebra', 'Solutions'] },
    { id: 4, title: 'Database Design Tutorial Series', type: 'video', subject: 'Computer Science', uploadedBy: 'Mai Duc Trung', uploadDate: '5 days ago', downloads: 0, views: 1234, rating: 4.9, duration: '1:20:15', description: 'A comprehensive tutorial series on database design principles, normalization, and best practices.', tags: ['Database', 'Tutorial', 'Video'] },
    { id: 5, title: 'Physics Lab Manual - Mechanics', type: 'document', subject: 'Physics', uploadedBy: 'Nguyen Minh Chau', uploadDate: '1 day ago', downloads: 123, views: 345, rating: 4.6, size: '5.2 MB', description: 'Complete lab manual for mechanics experiments including procedures, data collection methods, and analysis techniques.', tags: ['Physics', 'Lab Manual', 'Mechanics'] },
    { id: 6, title: 'Calculus Practice Problems', type: 'document', subject: 'Mathematics', uploadedBy: 'Nguyen Thi Xuan Anh', uploadDate: '4 days ago', downloads: 678, views: 1023, rating: 4.8, size: '3.1 MB', description: 'Extensive collection of calculus practice problems covering limits, derivatives, and integrals with detailed solutions.', tags: ['Mathematics', 'Calculus', 'Practice Problems'] },
  ];

  const subjects = ['All Subjects', 'Computer Science', 'Mathematics', 'Physics', 'English'];

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleDownload = (resourceId: number) => {
    toast.success(t.downloaded);
  };

  const handleView = (resourceId: number) => {
    setSelectedId(resourceId);
    setScreen('detail');
  };

  // -------------------------
  // RENDER CARD
  // -------------------------
  const renderResourceCard = (resource: typeof resources[0]) => {
    const isVideo = resource.type === 'video';
    const Icon = isVideo ? Video : FileText;

    return (
      <Card key={resource.id} className="hover:shadow-lg transition-all hover:border-purple-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-5 w-5 ${isVideo ? 'text-pink-600' : 'text-purple-600'}`} />
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  {resource.subject}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {resource.rating}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>{t.uploadedBy}: {resource.uploadedBy}</p>
            <p>{resource.uploadDate}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleView(resource.id)}>
                <Eye className="h-4 w-4 mr-2" />
                {t.view}
              </Button>
              {!isVideo && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="sm"
                  onClick={() => handleDownload(resource.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.download}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // -------------------------
  // DETAIL SCREEN
  // -------------------------
  if (screen === 'detail' && selectedId !== null) {
    const resource = resources.find(r => r.id === selectedId);
    if (!resource) return <p>Resource not found</p>;
    const isVideo = resource.type === 'video';
    const Icon = isVideo ? Video : FileText;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => setScreen('list')} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 flex gap-3">
                <Icon className={`h-8 w-8 ${isVideo ? 'text-pink-600' : 'text-purple-600'}`} />
                <div>
                  <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="border-purple-200 text-purple-700">{resource.subject}</Badge>
                    <Badge variant="secondary">{isVideo ? t.video : t.document}</Badge>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </span>
                  </div>
                </div>
              </div>
              {!isVideo && (
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => handleDownload(resource.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.download}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-1">{t.descriptionLabel}</p>
            <p className="text-gray-700 whitespace-pre-line">{resource.description}</p>

            {resource.tags && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">{t.tags}</p>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, idx) => <Badge key={idx} variant="outline">{tag}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {resource.content && (
          <Card>
            <CardHeader><CardTitle>{t.view}</CardTitle></CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{resource.content}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isVideo && (
          <Card>
            <CardHeader><CardTitle>{t.video}</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-16 w-16 text-white opacity-50" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // -------------------------
  // LIST SCREEN
  // -------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <Upload className="mr-2 h-4 w-4" /> {t.upload}
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject.toLowerCase().replace(/\s+/g, '-')}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="all"><BookOpen className="h-4 w-4 mr-2" />{t.allResources}</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="h-4 w-4 mr-2" />{t.documents}</TabsTrigger>
          <TabsTrigger value="videos"><Video className="h-4 w-4 mr-2" />{t.videos}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(renderResourceCard)}
          </div>
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.filter(r => r.type === 'document').map(renderResourceCard)}
          </div>
        </TabsContent>
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.filter(r => r.type === 'video').map(renderResourceCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
