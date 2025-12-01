import React, { useState } from 'react';
import { Sparkles, BookOpen, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import type { Language } from '../../App';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { PerformanceAnalyticsScreen } from './PerformanceAnalyticsScreen';

export function PersonalizationScreen({ language, isTutor }: { language: Language; isTutor?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const t = {
    title: language === 'en' ? 'Personalized plan' : 'Kế hoạch cá nhân hóa',
    info: language === 'en'
      ? 'AI analyzes your courses, grades, and schedule to provide personalized recommendations'
      : 'AI phân tích môn học, điểm số và lịch trình để đưa ra gợi ý cá nhân hóa',
    analyze: language === 'en' ? 'Analyze my data' : 'Phân tích dữ liệu của tôi',
    tasks: language === 'en' ? 'Recommended tasks' : 'Nhiệm vụ được gợi ý',
    materials: language === 'en' ? 'Recommended materials' : 'Tài liệu gợi ý',
    deadlines: language === 'en' ? 'Upcoming important deadlines' : 'Thời hạn quan trọng sắp tới',
    openLibrary: language === 'en' ? 'Open in library' : 'Mở trong thư viện',
    high: language === 'en' ? 'High' : 'Cao',
    medium: language === 'en' ? 'Medium' : 'Trung bình'
  };

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2000);
  };

  const mockTasks = [
    { id: 1, task: 'Review Algorithm Analysis chapter 3', priority: 'high', due: '2 days' },
    { id: 2, task: 'Complete Data Structures assignment', priority: 'high', due: '3 days' },
    { id: 3, task: 'Prepare for Database midterm', priority: 'medium', due: '1 week' }
  ];

  const mockMaterials = [
    { id: 1, title: 'Introduction to Algorithms (CLRS)', type: 'Book', description: 'Comprehensive algorithms textbook' },
    { id: 2, title: 'Database System Concepts', type: 'Book', description: 'Complete guide to database systems' },
    { id: 3, title: 'Machine Learning Basics', type: 'Article', description: 'Introduction to ML concepts' }
  ];

  const mockDeadlines = [
    { id: 1, title: 'Algorithm Contest Registration', date: 'Tomorrow' },
    { id: 2, title: 'Data Structures Project Submission', date: 'Dec 25, 2025' },
    { id: 3, title: 'Database Exam', date: 'Jan 5, 2026' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">{t.title}</h1>
      </div>
      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plan">{language === 'en' ? 'Personalized Plan' : 'Kế hoạch cá nhân hóa'}</TabsTrigger>
          <TabsTrigger value="analytics">{language === 'en' ? 'Analytics' : 'Phân tích'}</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          <Alert className="mb-6">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>{t.info}</AlertDescription>
          </Alert>
          {!analyzed && (
            <div className="flex justify-center py-12">
              <Button size="lg" onClick={handleAnalyze} disabled={loading}>
                <Sparkles className="h-4 w-4 mr-2" />
                {t.analyze}
              </Button>
            </div>
          )}
          {loading && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          )}
          {analyzed && !loading && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.tasks}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-gray-900">{task.task}</p>
                        <p className="text-sm text-gray-500">Due in {task.due}</p>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task.priority === 'high' ? t.high : t.medium}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t.materials}</CardTitle>
                  <CardDescription>From HCMUT Library</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockMaterials.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                              <h3 className="text-gray-900">{material.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                            <Badge variant="outline">{material.type}</Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            {t.openLibrary}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t.deadlines}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-900">{deadline.title}</p>
                      </div>
                      <span className="text-sm text-gray-600">{deadline.date}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        <TabsContent value="analytics">
          <PerformanceAnalyticsScreen language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
