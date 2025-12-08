import { useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLayoutContext } from "../../hooks/useLayoutContext";

const mockData = [
  { month: "Sep", consultations: 45, contests: 12, avgRating: 4.5 },
  { month: "Oct", consultations: 52, contests: 15, avgRating: 4.6 },
  { month: "Nov", consultations: 48, contests: 18, avgRating: 4.7 },
  { month: "Dec", consultations: 62, contests: 20, avgRating: 4.8 },
];

export function ReportsScreen() {
  const { language, user } = useLayoutContext();
  const [dataSource, setDataSource] = useState("consultations");
  const [timeRange, setTimeRange] = useState("semester");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportOpen, setExportOpen] = useState(false);

  // ADD: popup when downloaded
  const [downloadPopup, setDownloadPopup] = useState(false);

  const t = {
    title: language === "en" ? "Reports" : "Báo cáo",
    filters: language === "en" ? "Filters" : "Bộ lọc",
    dataSource: language === "en" ? "Data source" : "Nguồn dữ liệu",
    timeRange: language === "en" ? "Time range" : "Khoảng thời gian",
    semester: language === "en" ? "This semester" : "Học kỳ này",
    year: language === "en" ? "This year" : "Năm nay",
    consultations: language === "en" ? "Consultations" : "Buổi tư vấn",
    contests: language === "en" ? "Contests" : "Cuộc thi",
    feedback: language === "en" ? "Feedback" : "Phản hồi",
    kpis:
      language === "en"
        ? "Key Performance Indicators"
        : "Chỉ số hiệu suất chính",
    avgRating:
      language === "en" ? "Average rating per tutor" : "Đánh giá TB mỗi cố vấn",
    totalConsultations:
      language === "en" ? "Total consultations" : "Tổng buổi tư vấn",
    contestParticipation:
      language === "en" ? "Contest participation" : "Tham gia cuộc thi",
    exportReport: language === "en" ? "Export report" : "Xuất báo cáo",
    format: language === "en" ? "Format" : "Định dạng",
    generate: language === "en" ? "Generate file" : "Tạo tệp",
    cancel: language === "en" ? "Cancel" : "Hủy",
    trends: language === "en" ? "Trends over time" : "xu hướng theo thời gian",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogTrigger asChild>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              {t.exportReport}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.exportReport}</DialogTitle>
              <DialogDescription>
                Choose the format for your report
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>{t.format}</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={setExportFormat}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="cursor-pointer">
                    PDF
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="cursor-pointer">
                    Excel
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportOpen(false)}>
                {t.cancel}
              </Button>

              {/* MODIFY: show popup when clicked */}
              <Button
                onClick={() => {
                  setExportOpen(false);
                  setDownloadPopup(true);
                }}
              >
                {t.generate}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* DOWNLOAD SUCCESS POPUP */}
      <Dialog open={downloadPopup} onOpenChange={setDownloadPopup}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-green-600">Downloaded</DialogTitle>
            <DialogDescription>
              The report was generated successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={() => setDownloadPopup(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.filters}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>{t.dataSource}</Label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultations">
                    {t.consultations}
                  </SelectItem>
                  <SelectItem value="contests">{t.contests}</SelectItem>
                  <SelectItem value="feedback">{t.feedback}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.timeRange}</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">{t.semester}</SelectItem>
                  <SelectItem value="year">{t.year}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">
              {t.avgRating}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">4.7</div>
            <p className="text-xs text-gray-500 mt-1">+0.2 from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">
              {t.totalConsultations}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">207</div>
            <p className="text-xs text-gray-500 mt-1">+15% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">
              {t.contestParticipation}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">65</div>
            <p className="text-xs text-gray-500 mt-1">+8% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.trends}</CardTitle>
          <CardDescription>
            Activity metrics over the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="consultations"
                fill="#3b82f6"
                name={t.consultations}
              />
              <Bar dataKey="contests" fill="#8b5cf6" name={t.contests} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
