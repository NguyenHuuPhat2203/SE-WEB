import { useEffect, useState } from "react";
import { Filter, Mail, MailOpen, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { useLayoutContext } from "../../hooks/useLayoutContext";
import { api } from "../../utils/api";

interface Notification {
  _id: string; // MongoDB ObjectId
  title: string;
  senderBknetId?: string;
  time: string;
  unread: boolean;
  type: "course" | "consultation" | "contest" | "system";
  content: string;
}

interface StudentNotificationsProps {
  allowCompose?: boolean;
}

export function StudentNotifications({
  allowCompose,
}: StudentNotificationsProps) {
  const { language, user } = useLayoutContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [filter, setFilter] = useState("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");

  const t = {
    title: language === "en" ? "Notifications" : "Thông báo",
    compose: language === "en" ? "Compose" : "Soạn thông báo",
    to: language === "en" ? "To (BkNet ID)" : "Đến (BkNet ID)",
    subject: language === "en" ? "Subject" : "Tiêu đề",
    content: language === "en" ? "Content" : "Nội dung",
    send: language === "en" ? "Send" : "Gửi",
    cancel: language === "en" ? "Cancel" : "Hủy",
    filterType: language === "en" ? "Filter by type" : "Lọc theo loại",
  };

  useEffect(() => {
    // Fetch notifications with JWT token
    api
      .get<Notification[]>("/notifications")
      .then((data) => setNotifications(data))
      .catch((error) =>
        toast.error(error.message || "Failed to load notifications")
      );
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.unread) {
      try {
        await api.patch(`/notifications/${notification._id}/read`, {});
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, unread: false } : n
          )
        );
      } catch (error: any) {
        toast.error(error.message || "Failed to mark as read");
      }
    }
    setSelectedNotification(notification);
  };

  const handleSend = async () => {
    if (!composeTo.trim() || !composeSubject.trim()) {
      toast.error("Missing recipient or subject");
      return;
    }

    const payload = {
      receiverBknetId: composeTo.trim(),
      title: composeSubject.trim(),
      content: composeContent.trim(),
      type: "system",
    };

    try {
      await api.post("/addnotification", payload);
      toast.success("Notification sent!");
      setComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeContent("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notification");
    }
  };

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
        {allowCompose && (
          <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> {t.compose}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.compose}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t.to}</Label>
                  <Input
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.subject}</Label>
                  <Input
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.content}</Label>
                  <Textarea
                    rows={4}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setComposeOpen(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={handleSend}>{t.send}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t.filterType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="contest">Contest</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {filtered.map((n) => (
            <Card
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`cursor-pointer transition-colors ${
                selectedNotification?._id === n._id
                  ? "border-blue-600 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                {n.unread ? (
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                ) : (
                  <MailOpen className="h-5 w-5 text-gray-400 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{n.title}</h3>
                  <p className="text-xs text-gray-500">{n.senderBknetId}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedNotification ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">
                  {selectedNotification.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  From: {selectedNotification.senderBknetId} •{" "}
                  {selectedNotification.time}
                </p>
                <p className="text-gray-700">{selectedNotification.content}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-gray-500 text-sm">
                Select a notification to view
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
