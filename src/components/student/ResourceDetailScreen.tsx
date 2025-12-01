import React from 'react';
import { ChevronLeft, FileText, Video, Download, Eye, Star, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from 'sonner';
import type { Language } from '../../App';

interface ResourceDetailScreenProps {
  language: Language;
  resourceId: number;
  onBack: () => void;
}

const mockResourceDetails: Record<number, {
  id: number;
  title: string;
  type: 'document' | 'video';
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  views: number;
  rating: number;
  size?: string;
  duration?: string;
  description: string;
  content?: string;
  tags: string[];
}> = {
  1: {
    id: 1,
    title: 'Data Structures - Lecture Notes (Week 1-5)',
    type: 'document',
    subject: 'Computer Science',
    uploadedBy: 'Tran Ngoc Bao Duy',
    uploadDate: '2 days ago',
    downloads: 234,
    views: 567,
    rating: 4.8,
    size: '2.4 MB',
    description: 'Comprehensive lecture notes covering fundamental data structures including arrays, linked lists, stacks, queues, and trees. Includes examples and practice problems.',
    content: 'This document contains detailed notes from weeks 1-5 of the Data Structures course...',
    tags: ['Data Structures', 'Algorithms', 'Lecture Notes']
  },
  2: {
    id: 2,
    title: 'Introduction to Algorithms - Video Lecture',
    type: 'video',
    subject: 'Computer Science',
    uploadedBy: 'Tran Ngoc Bao Duy',
    uploadDate: '1 week ago',
    downloads: 0,
    views: 892,
    rating: 4.9,
    duration: '45:30',
    description: 'A comprehensive video lecture introducing fundamental algorithm concepts, complexity analysis, and common algorithmic patterns.',
    tags: ['Algorithms', 'Video', 'Lecture']
  },
  3: {
    id: 3,
    title: 'Linear Algebra Problem Set Solutions',
    type: 'document',
    subject: 'Mathematics',
    uploadedBy: 'Dang Van Vinh',
    uploadDate: '3 days ago',
    downloads: 456,
    views: 789,
    rating: 4.7,
    size: '1.8 MB',
    description: 'Complete solutions to problem sets covering linear transformations, eigenvalues, and matrix operations.',
    tags: ['Mathematics', 'Linear Algebra', 'Solutions']
  },
  4: {
    id: 4,
    title: 'Database Design Tutorial Series',
    type: 'video',
    subject: 'Computer Science',
    uploadedBy: 'Mai Duc Trung',
    uploadDate: '5 days ago',
    downloads: 0,
    views: 1234,
    rating: 4.9,
    duration: '1:20:15',
    description: 'A comprehensive tutorial series on database design principles, normalization, and best practices.',
    tags: ['Database', 'Tutorial', 'Video']
  },
  5: {
    id: 5,
    title: 'Physics Lab Manual - Mechanics',
    type: 'document',
    subject: 'Physics',
    uploadedBy: 'Nguyen Minh Chau',
    uploadDate: '1 day ago',
    downloads: 123,
    views: 345,
    rating: 4.6,
    size: '5.2 MB',
    description: 'Complete lab manual for mechanics experiments including procedures, data collection methods, and analysis techniques.',
    tags: ['Physics', 'Lab Manual', 'Mechanics']
  },
  6: {
    id: 6,
    title: 'Calculus Practice Problems',
    type: 'document',
    subject: 'Mathematics',
    uploadedBy: 'Nguyen Thi Xuan Anh',
    uploadDate: '4 days ago',
    downloads: 678,
    views: 1023,
    rating: 4.8,
    size: '3.1 MB',
    description: 'Extensive collection of calculus practice problems covering limits, derivatives, and integrals with detailed solutions.',
    tags: ['Mathematics', 'Calculus', 'Practice Problems']
  }
};

export function ResourceDetailScreen({ language, resourceId, onBack }: ResourceDetailScreenProps) {
  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    download: language === 'en' ? 'Download' : 'Tải xuống',
    downloaded: language === 'en' ? 'Downloaded' : 'Đã tải xuống',
    view: language === 'en' ? 'View' : 'Xem',
    description: language === 'en' ? 'Description' : 'Mô tả',
    uploadedBy: language === 'en' ? 'Uploaded by' : 'Tải lên bởi',
    downloads: language === 'en' ? 'downloads' : 'lượt tải',
    views: language === 'en' ? 'views' : 'lượt xem',
    rating: language === 'en' ? 'Rating' : 'Đánh giá',
    size: language === 'en' ? 'Size' : 'Kích thước',
    duration: language === 'en' ? 'Duration' : 'Thời lượng',
    tags: language === 'en' ? 'Tags' : 'Thẻ',
    document: language === 'en' ? 'Document' : 'Tài liệu',
    video: language === 'en' ? 'Video' : 'Video',
  };

  const resource = mockResourceDetails[resourceId as keyof typeof mockResourceDetails];

  if (!resource) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Resource not found</p>
      </div>
    );
  }

  const handleDownload = () => {
    toast.success(t.downloaded);
  };

  const isVideo = resource.type === 'video';
  const Icon = isVideo ? Video : FileText;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.back}
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`h-8 w-8 ${isVideo ? 'text-pink-600' : 'text-purple-600'}`} />
                <div>
                  <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="border-purple-200 text-purple-700">
                      {resource.subject}
                    </Badge>
                    <Badge variant="secondary">
                      {isVideo ? t.video : t.document}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {resource.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {!isVideo && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                {t.download}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t.description}</p>
            <p className="text-gray-700">{resource.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t.uploadedBy}</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                    {resource.uploadedBy.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm">{resource.uploadedBy}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t.views}</p>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{resource.views}</p>
              </div>
            </div>
            {!isVideo && (
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.downloads}</p>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{resource.downloads}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">{isVideo ? t.duration : t.size}</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="font-medium">{isVideo ? resource.duration : resource.size}</p>
              </div>
            </div>
          </div>

          {resource.tags && resource.tags.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">{t.tags}</p>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Preview */}
      {resource.content && (
        <Card>
          <CardHeader>
            <CardTitle>{t.view}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{resource.content}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isVideo && (
        <Card>
          <CardHeader>
            <CardTitle>{t.video}</CardTitle>
          </CardHeader>
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

