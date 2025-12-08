import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Users,
  ChevronLeft,
  Search,
  Filter,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useLayoutContext } from "../../hooks/useLayoutContext";
import { toast } from "sonner";

interface Contest {
  id: number;
  title: string;
  type: "academic" | "non-academic";
  description: string;
  status: "open" | "closed";
  participants: number;
  maxParticipants: number;
  location: string;
  organizer: string;
  startDate: string;
  endDate: string;
  rules?: string[];
}

export function ContestsScreen() {
  const { language } = useLayoutContext();
  const navigate = useNavigate();
  const t = {
    contests: language === "en" ? "Contests" : "Cuộc thi",
    open: language === "en" ? "Open" : "Đang mở",
    closed: language === "en" ? "Closed" : "Đã đóng",
    register: language === "en" ? "Register" : "Đăng ký",
    registered: language === "en" ? "Registered" : "Đã đăng ký",
    participants: language === "en" ? "participants" : "người tham gia",
    back: language === "en" ? "Back" : "Quay lại",
    searchPlaceholder:
      language === "en" ? "Search contests..." : "Tìm kiếm cuộc thi...",
    filterAll: language === "en" ? "All" : "Tất cả",
    filterAcademic: language === "en" ? "Academic" : "Học thuật",
    filterNonAcademic: language === "en" ? "Non-academic" : "Phi học thuật",
  };

  const [contests, setContests] = useState<Contest[]>([]);
  const [registered, setRegistered] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<"all" | "academic" | "non-academic">(
    "all"
  );

  // ========== FETCH list ==========
  useEffect(() => {
    fetch("http://localhost:3001/api/contests")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setContests(json.data);
        else toast.error("Failed to load contests");
      })
      .catch(() => toast.error("Cannot connect to backend"));
  }, []);

  const handleRegister = (id: number) => {
    fetch(`http://localhost:3001/api/contests/${id}/register`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          toast.success("Registered successfully!");
          setRegistered((prev) => [...prev, id]);
          setContests((prev) => prev.map((c) => (c.id === id ? json.data : c)));
        } else {
          toast.error(json.message || "Failed to register");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  const filteredContests = contests.filter((c) => {
    const matchesSearch = c.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter = filter === "all" || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  // ========== LIST VIEW ==========
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-gray-900 mb-6">{t.contests}</h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center border rounded-md p-2 flex-1">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 outline-none border-none"
          />
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "academic" | "non-academic")
            }
            className="appearance-none pl-8 pr-4 py-2 border rounded-md bg-white cursor-pointer"
          >
            <option value="all">{t.filterAll}</option>
            <option value="academic">{t.filterAcademic}</option>
            <option value="non-academic">{t.filterNonAcademic}</option>
          </select>
          <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContests.map((c) => (
          <Card
            key={c.id}
            className="cursor-pointer hover:shadow-md"
            onClick={() => navigate(`/student/contests/${c.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <Trophy
                  className={`h-8 w-8 ${
                    c.type === "academic"
                      ? "text-purple-600"
                      : "text-indigo-600"
                  }`}
                />
                <Badge variant={c.status === "open" ? "default" : "secondary"}>
                  {c.status === "open" ? t.open : t.closed}
                </Badge>
              </div>
              <CardTitle className="mt-2">{c.title}</CardTitle>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  <Calendar className="inline-block h-4 w-4 mr-1" />{" "}
                  {c.startDate}
                </span>
                <span>
                  {c.participants} {t.participants}
                </span>
              </div>
              <Button
                className={`mt-2 w-full ${
                  registered.includes(c.id) ? "bg-green-600 text-white" : ""
                }`}
                disabled={c.status === "closed" || registered.includes(c.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegister(c.id);
                }}
              >
                {registered.includes(c.id) ? t.registered : t.register}
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredContests.length === 0 && (
          <p className="text-gray-500 col-span-full">No contests found.</p>
        )}
      </div>
    </div>
  );
}
