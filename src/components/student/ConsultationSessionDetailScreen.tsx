import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Video,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import { useLayoutContext } from "../../hooks/useLayoutContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

interface SessionDetail {
  id: string; // MongoDB _id
  title: string;
  date: string;
  time: string;
  duration: string;
  type: "offline" | "online";
  location: string;
  description: string;
  tutorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export function ConsultationSessionDetailScreen() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { language } = useLayoutContext();
  const { user } = useAuth();

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState([5]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Demo data fetch
    fetch(`http://localhost:3001/api/sessions/${sessionId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSession(json.data);
        else toast.error("Failed into load session");
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSubmitFeedback = async () => {
    if (!session) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sessionId: session.id,
          tutorId: session.tutorId._id,
          rating: rating[0],
          comment,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Feedback submitted successfully!");
        setIsFeedbackOpen(false);
      } else {
        toast.error(json.message || "Failed to submit feedback");
      }
    } catch (e) {
      toast.error("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!session) return <div className="p-6">Session not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        ← Back
      </Button>

      <div className="grid gap-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{session.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge
                    variant={session.type === "online" ? "default" : "secondary"}
                  >
                    {session.type === "online" ? "Online" : "Offline"}
                  </Badge>
                  <Badge variant="outline" className="uppercase">
                    {session.status}
                  </Badge>
                </div>
              </div>
              {session.status === "completed" && (
                <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="w-4 h-4 mr-2" />
                      Rate Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rate this Session</DialogTitle>
                      <DialogDescription>
                        How was your experience with {session.tutorId.firstName}{" "}
                        {session.tutorId.lastName}?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Rating: {rating[0]} / 5
                        </label>
                        <Slider
                          value={rating}
                          onValueChange={setRating}
                          max={5}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Comment</label>
                        <Textarea
                          placeholder="Write your feedback here..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setIsFeedbackOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-gray-500" />
                <span>
                  {session.time} ({session.duration})
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span>{session.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span>
                  Tutor: {session.tutorId.firstName} {session.tutorId.lastName}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{session.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
