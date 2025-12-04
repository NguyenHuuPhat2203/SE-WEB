import { useState, useEffect } from 'react';
import { ChevronLeft, Trophy, Play, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Language } from '../../App';
import { contestsAPI, authAPI } from '../../services/api';

interface ContestStartScreenProps {
  language: Language;
  onBack: () => void;
  onStartContest: () => void;
  contestId: string;
}

export function ContestStartScreen({ language, onBack, onStartContest, contestId }: ContestStartScreenProps) {
  const [contest, setContest] = useState<any>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  useEffect(() => {
    loadContestInfo();
  }, [contestId]);

  const loadContestInfo = async () => {
    const user = authAPI.getCurrentUser();
    if (!user) {
      onBack();
      return;
    }

    try {
      setLoading(true);
      const response = await contestsAPI.getById(contestId);
      if (response.success && response.data) {
        setContest(response.data);
        const points = response.data.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0;
        setTotalPoints(points);

        // Load best score
        const resultResponse = await contestsAPI.getUserResult(contestId, user.id);
        if (resultResponse.success && resultResponse.data) {
          setBestScore(resultResponse.data.score);
          setAttemptCount(1); // Could track this from backend if needed
        }
      }
    } catch (error) {
      console.error('Error loading contest info:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = {
    back: language === 'en' ? 'Back' : 'Quay lại',
    startContest: language === 'en' ? 'Start Contest' : 'Bắt đầu làm bài',
    retryContest: language === 'en' ? 'Try Again' : 'Làm lại',
    yourBestScore: language === 'en' ? 'Your Best Score' : 'Điểm cao nhất của bạn',
    totalPoints: language === 'en' ? 'Total Points' : 'Tổng điểm',
    noAttemptYet: language === 'en' ? 'You haven\'t taken this contest yet' : 'Bạn chưa làm bài thi này',
    contestInfo: language === 'en' ? 'Contest Information' : 'Thông tin cuộc thi',
    numberOfQuestions: language === 'en' ? 'Number of Questions' : 'Số câu hỏi',
    timeLimit: language === 'en' ? 'Time Limit' : 'Thời gian',
    minutes: language === 'en' ? 'minutes' : 'phút',
    ready: language === 'en' ? 'Ready to start?' : 'Sẵn sàng bắt đầu?',
    instructions: language === 'en' ? 'Instructions' : 'Hướng dẫn',
    instruction1: language === 'en' ? 'Read each question carefully' : 'Đọc kỹ từng câu hỏi',
    instruction2: language === 'en' ? 'Select one answer for each question' : 'Chọn một đáp án cho mỗi câu',
    instruction3: language === 'en' ? 'You can retake the contest multiple times' : 'Bạn có thể làm lại nhiều lần',
    instruction4: language === 'en' ? 'Only your best score will be saved' : 'Chỉ điểm cao nhất được lưu',
    loading: language === 'en' ? 'Loading...' : 'Đang tải...'
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <p>Contest not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.back}
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{contest.title}</CardTitle>
          <p className="text-gray-600">{contest.description}</p>
        </CardHeader>
      </Card>

      {/* Best Score Display */}
      {bestScore !== null ? (
        <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-12 w-12 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-700 font-medium">{t.yourBestScore}</p>
                  <p className="text-4xl font-bold text-purple-600">{bestScore}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t.totalPoints}</p>
                <p className="text-2xl font-semibold text-gray-700">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 text-blue-600" />
            <p className="text-blue-700 font-medium">{t.noAttemptYet}</p>
            <p className="text-sm text-blue-600 mt-1">{t.totalPoints}: {totalPoints}</p>
          </CardContent>
        </Card>
      )}

      {/* Contest Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.contestInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">{t.numberOfQuestions}</p>
              <p className="text-xl font-semibold">{contest.questions?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.timeLimit}</p>
              <p className="text-xl font-semibold">60 {t.minutes}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold mb-2">{t.instructions}:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                {t.instruction1}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                {t.instruction2}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                {t.instruction3}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                {t.instruction4}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-lg font-semibold mb-4">{t.ready}</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8"
            onClick={onStartContest}
          >
            <Play className="h-5 w-5 mr-2" />
            {bestScore !== null ? t.retryContest : t.startContest}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
