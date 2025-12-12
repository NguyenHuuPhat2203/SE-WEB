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
  const { language } = useLayoutContext();
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

      {/* Layout - Fixed height container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* List - Scrollable */}
        <div className="lg:col-span-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar border-r border-gray-100">
          {filtered.length === 0 ? (
             <div className="text-center text-gray-400 py-8">No notifications</div>
          ) : (
             filtered.map((n) => (
            <Card
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`cursor-pointer transition-all duration-200 border shadow-sm ${
                selectedNotification?._id === n._id
                  ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-200"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                {n.unread ? (
                  <Mail className="h-5 w-5 text-blue-600 mt-1 shrink-0" />
                ) : (
                  <MailOpen className="h-5 w-5 text-gray-400 mt-1 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate ${n.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                    {n.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 truncate max-w-[120px]">{n.senderBknetId}</p>
                    <p className="text-xs text-gray-400 shrink-0">{new Date(n.time).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )))}
        </div>

        {/* Detail - Fixed and Scrollable content */}
        <div className="lg:col-span-2 h-full">
          {selectedNotification ? (
            <Card className="h-full flex flex-col shadow-md border-gray-200">
              <CardContent className="p-8 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {selectedNotification.title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{selectedNotification.senderBknetId}</span>
                            <span>•</span>
                            <span>{new Date(selectedNotification.time).toLocaleString()}</span>
                            <span>•</span>
                            <Badge variant="outline" className="capitalize">{selectedNotification.type}</Badge>
                        </div>
                    </div>
                </div>
                <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedNotification.content}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center bg-gray-50/50 border-dashed">
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Select a notification</h3>
                <p className="text-gray-500 text-sm mt-1">Choose a message from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
