import { useEffect, useState } from "react";
import { Trophy, Users, Download, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useLayoutContext } from "../../hooks/useLayoutContext";

interface Contest {
  id: number;
  title: string;
  type: "academic" | "non-academic";
  description: string;
  location: string;
  organizer: string;
  status: "open" | "closed";
  participants: number;
  startDate: string;
  endDate: string;
  rules?: string[];
}

export function TutorContestsScreen() {
  const { language } = useLayoutContext();
  const [open, setOpen] = useState(false);
  const [contests, setContests] = useState<Contest[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"academic" | "non-academic">("academic");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rulesText, setRulesText] = useState("");

  const t = {
    title: language === "en" ? "Manage Contests" : "Quản lý cuộc thi",
    create: language === "en" ? "Create contest" : "Tạo cuộc thi",
    name: language === "en" ? "Contest title" : "Tên cuộc thi",
    description: language === "en" ? "Description" : "Mô tả",
    type: language === "en" ? "Type" : "Loại cuộc thi",
    academic: language === "en" ? "Academic" : "Học thuật",
    nonAcademic: language === "en" ? "Non-academic" : "Phi học thuật",
    location: language === "en" ? "Location" : "Địa điểm",
    organizer: language === "en" ? "Organizer" : "Đơn vị tổ chức",
    start: language === "en" ? "Start date" : "Ngày bắt đầu",
    end: language === "en" ? "End date" : "Ngày kết thúc",
    rules:
      language === "en"
        ? "Rules (each line = one rule)"
        : "Quy định (mỗi dòng là 1 mục)",
    cancel: language === "en" ? "Cancel" : "Hủy",
    success:
      language === "en"
        ? "Contest created successfully!"
        : "Tạo cuộc thi thành công!",
    participants: language === "en" ? "participants" : "người tham gia",
    open: language === "en" ? "Open" : "Đang mở",
    closed: language === "en" ? "Closed" : "Đã đóng",
    exportResults: language === "en" ? "Export results" : "Xuất kết quả",
    downloaded: language === "en" ? "Downloaded" : "Đã tải xuống",
  };

  // ================= FETCH contests from backend =================
  useEffect(() => {
    fetch("http://localhost:3001/api/contests")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setContests(json.data);
        else toast.error("Failed to load contests");
      })
      .catch(() => toast.error("Cannot connect to backend"));
  }, []);

  // ================= CREATE new contest =================
  const handleCreate = async () => {
    if (!title || !startDate || !endDate) {
      toast.error(
        language === "en"
          ? "Please fill all required fields"
          : "Vui lòng điền đầy đủ thông tin"
      );
      return;
    }

    const newContest = {
      title,
      type,
      description,
      startDate,
      endDate,
      location,
      organizer,
      rules: rulesText.split("\n").filter((line) => line.trim() !== ""),
    };

    try {
      const res = await fetch("http://localhost:3001/api/addcontest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContest),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(t.success);
        setContests((prev) => [json.data, ...prev]);
        setOpen(false);
        // reset form
        setTitle("");
        setDescription("");
        setLocation("");
        setOrganizer("");
        setStartDate("");
        setEndDate("");
        setRulesText("");
        setType("academic");
      } else {
        toast.error(json.message || "Failed to create contest");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t.create}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t.create}</DialogTitle>
              <DialogDescription>
                Enter detailed contest information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Contest Type */}
              <div className="space-y-2">
                <Label>{t.type}</Label>
                <RadioGroup
                  value={type}
                  onValueChange={(v) =>
                    setType(v as "academic" | "non-academic")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="academic" id="academic" />
                    <Label htmlFor="academic" className="cursor-pointer">
                      {t.academic}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-academic" id="non-academic" />
                    <Label htmlFor="non-academic" className="cursor-pointer">
                      {t.nonAcademic}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Title + Description */}
              <div className="space-y-2">
                <Label htmlFor="title">{t.name} *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Location + Organizer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t.location}</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizer">{t.organizer}</Label>
                  <Input
                    id="organizer"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                  />
                </div>
              </div>

              {/* Start + End Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">{t.start}</Label>
                  <Input
                    id="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">{t.end}</Label>
                  <Input
                    id="end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Rules */}
              <div className="space-y-2">
                <Label htmlFor="rules">{t.rules}</Label>
                <Textarea
                  id="rules"
                  placeholder="Example:\n- Each participant must register individually.\n- Submit results before the deadline."
                  rows={3}
                  value={rulesText}
                  onChange={(e) => setRulesText(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleCreate}>{t.create}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contest List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contests.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <div>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>
                      {c.startDate} → {c.endDate}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={c.status === "open" ? "default" : "secondary"}>
                  {c.status === "open" ? t.open : t.closed}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {c.participants} {t.participants}
                  </span>
                </div>
                <Badge variant="outline">{c.type}</Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(t.downloaded)}
              >
                <Download className="h-4 w-4 mr-2" />
                {t.exportResults}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
