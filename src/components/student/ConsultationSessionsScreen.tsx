import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Video } from "lucide-react";
import { useLayoutContext } from "../../hooks/useLayoutContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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

export function ConsultationSessionsScreen() {
  const navigate = useNavigate();
  const { language, user } = useLayoutContext();
  const t = {
    title: language === "en" ? "Consultation Sessions" : "Các buổi tư vấn",
    students: language === "en" ? "students" : "sinh viên",
    inPerson: language === "en" ? "In-person" : "Trực tiếp",
    online: language === "en" ? "Online" : "Trực tuyến",
  };

  const [sessions, setSessions] = useState<Session[]>([]);

  // Load session list from backend
  useEffect(() => {
    fetch("http://localhost:3001/api/sessions")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSessions(json.data);
      });
  }, []);

  // =================== RENDER ===================

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-gray-900">{t.title}</h1>
      </div>

      {/* SESSION LIST */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="cursor-pointer"
            onClick={() =>
              navigate(`/student/consultation-sessions/${session.id}`)
            }
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
