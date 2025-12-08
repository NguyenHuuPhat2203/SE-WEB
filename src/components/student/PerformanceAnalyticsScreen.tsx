import { TrendingUp, Target, Award, Calendar, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLayoutContext } from "../../hooks/useLayoutContext";

interface PerformanceAnalyticsScreenProps {}

export function PerformanceAnalyticsScreen({}: PerformanceAnalyticsScreenProps) {
  const { language } = useLayoutContext();
  const t = {
    title: language === "en" ? "Performance Analytics" : "Phân tích hiệu suất",
    description:
      language === "en"
        ? "Track your academic progress and improvement"
        : "Theo dõi tiến độ học tập và cải thiện",
    overview: language === "en" ? "Overview" : "Tổng quan",
    subjects: language === "en" ? "Subjects" : "Môn học",
    goals: language === "en" ? "Goals" : "Mục tiêu",
    currentGPA: language === "en" ? "Current GPA" : "GPA hiện tại",
    targetGPA: language === "en" ? "Target GPA" : "GPA mục tiêu",
    improvement: language === "en" ? "Improvement" : "Cải thiện",
    sessionsCompleted:
      language === "en" ? "Sessions completed" : "Buổi học hoàn thành",
    thisMonth: language === "en" ? "This month" : "Tháng này",
    exportReport: language === "en" ? "Export report" : "Xuất báo cáo",
    gradeProgress: language === "en" ? "Grade progress" : "Tiến độ điểm số",
    subjectPerformance:
      language === "en" ? "Subject performance" : "Hiệu suất theo môn",
    studyTime: language === "en" ? "Study time (hours)" : "Thời gian học (giờ)",
    skillRadar: language === "en" ? "Skill assessment" : "Đánh giá kỹ năng",
    onTrack: language === "en" ? "On track" : "Đúng tiến độ",
    needsAttention: language === "en" ? "Needs attention" : "Cần chú ý",
  };

  const gradeProgressData = [
    { month: "Sep", gpa: 3.2, target: 3.5 },
    { month: "Oct", gpa: 3.3, target: 3.5 },
    { month: "Nov", gpa: 3.4, target: 3.5 },
    { month: "Dec", gpa: 3.5, target: 3.5 },
    { month: "Jan", gpa: 3.6, target: 3.5 },
    { month: "Feb", gpa: 3.7, target: 3.5 },
  ];

  const subjectData = [
    { subject: "Data Structures", score: 85, hours: 24 },
    { subject: "Algorithms", score: 92, hours: 28 },
    { subject: "Databases", score: 78, hours: 18 },
    { subject: "Networks", score: 88, hours: 22 },
    { subject: "Web Dev", score: 95, hours: 30 },
  ];

  const skillData = [
    { skill: "Problem Solving", score: 85 },
    { skill: "Coding", score: 90 },
    { skill: "Theory", score: 75 },
    { skill: "Communication", score: 80 },
    { skill: "Teamwork", score: 88 },
  ];

  const goals = [
    {
      id: 1,
      title: "Achieve 3.7 GPA this semester",
      progress: 85,
      status: "on-track",
    },
    {
      id: 2,
      title: "Complete 20 consultation sessions",
      progress: 60,
      status: "on-track",
    },
    {
      id: 3,
      title: "Master Data Structures",
      progress: 45,
      status: "needs-attention",
    },
    {
      id: 4,
      title: "Improve Algorithm skills to 90%",
      progress: 75,
      status: "on-track",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.description}</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t.exportReport}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-100">
              {t.currentGPA}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-1">3.7</div>
            <div className="flex items-center gap-1 text-sm text-purple-100">
              <TrendingUp className="h-4 w-4" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-pink-100">
              {t.targetGPA}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-1">3.5</div>
            <div className="flex items-center gap-1 text-sm text-pink-100">
              <Target className="h-4 w-4" />
              Goal achieved!
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-indigo-100">
              {t.sessionsCompleted}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-1">12</div>
            <div className="flex items-center gap-1 text-sm text-indigo-100">
              <Calendar className="h-4 w-4" />
              {t.thisMonth}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-amber-100">
              {t.improvement}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl mb-1">+15%</div>
            <div className="flex items-center gap-1 text-sm text-amber-100">
              <Award className="h-4 w-4" />
              Compared to last semester
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="subjects">{t.subjects}</TabsTrigger>
          <TabsTrigger value="goals">{t.goals}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t.gradeProgress}</CardTitle>
                <CardDescription>
                  Your GPA trend over the semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gradeProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      name="Your GPA"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ec4899"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skill Radar */}
            <Card>
              <CardHeader>
                <CardTitle>{t.skillRadar}</CardTitle>
                <CardDescription>
                  Your strengths and areas for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#7c3aed"
                      fill="#7c3aed"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.subjectPerformance}</CardTitle>
              <CardDescription>
                Your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="score"
                    fill="#7c3aed"
                    name="Score (%)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="hours"
                    fill="#ec4899"
                    name="Study Hours"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectData.map((subject) => (
              <Card
                key={subject.subject}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{subject.subject}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Score</span>
                      <span className="text-2xl text-purple-600">
                        {subject.score}%
                      </span>
                    </div>
                    <Progress value={subject.score} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{t.studyTime}</span>
                    <span>{subject.hours}h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-2">{goal.title}</h3>
                    <Badge
                      variant={
                        goal.status === "on-track" ? "default" : "secondary"
                      }
                      className={
                        goal.status === "on-track"
                          ? "bg-green-100 text-green-700 border-0"
                          : "bg-amber-100 text-amber-700 border-0"
                      }
                    >
                      {goal.status === "on-track"
                        ? t.onTrack
                        : t.needsAttention}
                    </Badge>
                  </div>
                  <div className="text-2xl text-purple-600">
                    {goal.progress}%
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
