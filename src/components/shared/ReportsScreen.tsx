import { useState, useEffect } from "react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useLayoutContext } from "../../hooks/useLayoutContext";
import { toast } from "sonner";

export function ReportsScreen() {
  const { language } = useLayoutContext();
  const [dataSource, setDataSource] = useState("consultations");
  const [timeRange, setTimeRange] = useState("semester");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportOpen, setExportOpen] = useState(false);
  const [downloadPopup, setDownloadPopup] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    overview: {
      totalSessions: 0,
      completedSessions: 0,
      completionRate: 0,
      avgRating: 0,
      openContests: 0,
    },
    charts: {
      sessionsByStatus: [],
    },
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/reports/stats", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .catch(() => toast.error("Failed to load report data"));
  }, []);

  const t = {
    title: language === "en" ? "Reports" : "Báo cáo",
    filters: language === "en" ? "Filters" : "Bộ lọc",
    dataSource: language === "en" ? "Data source" : "Nguồn dữ liệu",
    // ... (rest of translations can stay or be simplified)
    timeRange: language === "en" ? "Time range" : "Khoảng thời gian",
    avgRating:
      language === "en" ? "Average rating" : "Đánh giá trung bình",
    totalSessions:
      language === "en" ? "Total Sessions" : "Tổng số buổi",
    completionRate:
      language === "en" ? "Completion Rate" : "Tỷ lệ hoàn thành",
    exportReport: language === "en" ? "Export report" : "Xuất báo cáo",
    generate: language === "en" ? "Generate file" : "Tạo tệp",
    cancel: language === "en" ? "Cancel" : "Hủy",
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900 font-bold text-2xl">{t.title}</h1>
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
              <Label>Format</Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={setExportFormat}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel">Excel</Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportOpen(false)}>
                {t.cancel}
              </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t.avgRating}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.avgRating} / 5</div>
            <p className="text-xs text-gray-500 mt-1">Based on student feedbacks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t.totalSessions}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalSessions}</div>
            <p className="text-xs text-gray-500 mt-1">Total sessions created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t.completionRate}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.completionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">{stats.overview.completedSessions} completed sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sessions by Status</CardTitle>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.charts.sessionsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                >
                  {stats.charts.sessionsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
