import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Video } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
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
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useLayoutContext } from "../../hooks/useLayoutContext";

interface Session {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "offline" | "online";
  location: string;
  students: Array<{
    id: number;
    name: string;
    status: "registered" | "attended" | "absent";
    avatar?: string;
  }>;
  description?: string;
  objectives?: string[];
  materials?: string[];
}

export function ConsultationScreen() {
  const { language } = useLayoutContext();
  const navigate = useNavigate();
  const t = {
    title: language === "en" ? "Consultation Sessions" : "Buổi tư vấn",
    create:
      language === "en" ? "Create consultation session" : "Tạo buổi tư vấn",
    date: language === "en" ? "Date" : "Ngày",
    time: language === "en" ? "Time" : "Thời gian",
    type: language === "en" ? "Type" : "Loại",
    inPerson: language === "en" ? "In-person" : "Trực tiếp",
    online: language === "en" ? "Online" : "Trực tuyến",
    location: language === "en" ? "Location" : "Địa điểm",
    meetingLink: language === "en" ? "Meeting link" : "Liên kết cuộc họp",
    description:
      language === "en" ? "Description and objectives" : "Mô tả và mục tiêu",
    cancel: language === "en" ? "Cancel" : "Hủy",
    students: language === "en" ? "students" : "sinh viên",
    success:
      language === "en"
        ? "Session created successfully!"
        : "Đã tạo buổi tư vấn!",
    back: language === "en" ? "Back" : "Quay lại",
    registered: language === "en" ? "Registered" : "Đã đăng ký",
    attended: language === "en" ? "Attended" : "Đã tham gia",
    absent: language === "en" ? "Absent" : "Vắng mặt",
    objectives: language === "en" ? "Objectives" : "Mục tiêu",
    materials: language === "en" ? "Materials" : "Tài liệu",
    joinMeeting: language === "en" ? "Join Meeting" : "Tham gia cuộc họp",
  };

  // ======== State ========
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Form state (chỉ dùng cho chức năng tạo buổi tư vấn)
  const [sessionType, setSessionType] = useState<"in-person" | "online">(
    "in-person"
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  // ======== Fetch sessions từ backend ========
  useEffect(() => {
    fetch("http://localhost:3001/api/sessions")
      .then((res) => res.json())
      .then((json) => {
        console.log("💾 sessions response:", json);
        if (json.success && Array.isArray(json.data)) {
          setSessions(json.data);
        } else {
          toast.error("Failed to load sessions");
        }
      })
      .catch((err) => {
        console.error("🚨 Fetch error:", err);
        toast.error("Cannot connect to backend");
      });
  }, []);

  // ======== Create session (demo local) ========
  // const handleCreate = () => {
  //   if (!title || !date || !time || !location) return toast.error('Please fill all required fields');
  //   const newSession: Session = {
  //     id: sessions.length + 1,
  //     title,
  //     date,
  //     time,
  //     type: sessionType === 'in-person' ? 'offline' : 'online',
  //     location,
  //     students: [],
  //     description,
  //     objectives: [],
  //     materials: [],
  //   };
  //   setSessions([newSession, ...sessions]);
  //   toast.success(t.success);
  //   setOpenDialog(false);
  //   // reset form
  //   setTitle('');
  //   setDate('');
  //   setTime('');
  //   setLocation('');
  //   setDescription('');
  //   setSessionType('in-person');
  // };
  const handleCreate = async () => {
    if (!title || !date || !time || !location) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      title,
      date,
      time,
      type: sessionType === "in-person" ? "offline" : "online",
      location,
      description,
    };

    try {
      const res = await fetch("http://localhost:3001/api/addsession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSessions((prev) => [json.data, ...prev]);
        toast.success("Session created successfully!");
        setOpenDialog(false);
        setTitle("");
        setDate("");
        setTime("");
        setLocation("");
        setDescription("");
        setSessionType("in-person");
      } else {
        toast.error(json.message || "Failed to create session");
      }
    } catch (err) {
      console.error("Create session error:", err);
      toast.error("Cannot connect to backend");
    }
  };

  // ======== Render ========
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        {/* Form tạo consultation session */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                Schedule a new consultation session
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t.date}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t.time}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.type}</Label>
                <RadioGroup
                  value={sessionType}
                  onValueChange={(v: string) =>
                    setSessionType(v as "in-person" | "online")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person">{t.inPerson}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">{t.online}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  {sessionType === "in-person" ? t.location : t.meetingLink}
                </Label>
                <Input
                  id="location"
                  placeholder={
                    sessionType === "in-person"
                      ? "Room name or number"
                      : "https://teams.microsoft.com/..."
                  }
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                {t.cancel}
              </Button>
              <Button onClick={handleCreate}>{t.create}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách session */}
      <div className="space-y-4">
        {sessions.length === 0 && (
          <p className="text-gray-500 italic">No sessions found.</p>
        )}
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="cursor-pointer"
            onClick={() => navigate(`/tutor/consultation/${session.id}`)}
          >
            <CardContent className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{session.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>
                    {session.date} • {session.time}
                  </span>
                  <Badge
                    variant={
                      session.type === "online" ? "default" : "secondary"
                    }
                  >
                    {session.type === "offline" ? (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        {t.inPerson}
                      </>
                    ) : (
                      <>
                        <Video className="h-3 w-3 mr-1" />
                        {t.online}
                      </>
                    )}
                  </Badge>
                  <span>
                    {session.students.length} {t.students}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{session.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
