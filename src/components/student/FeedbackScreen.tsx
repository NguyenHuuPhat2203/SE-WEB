import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useLayoutContext } from "../../hooks/useLayoutContext";

interface FeedbackScreenProps {}

export function FeedbackScreen({}: FeedbackScreenProps) {
  const { language } = useLayoutContext();
  const [evaluationType, setEvaluationType] = useState("tutor");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 👇 state thông tin cá nhân
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentClass, setStudentClass] = useState("");

  // 👇 state cho selection cụ thể
  const [selectedEntityId, setSelectedEntityId] = useState("");

  const t = {
    title: language === "en" ? "Evaluation" : "Đánh giá",

    // Thêm bước 0 – thông tin cá nhân
    step0:
      language === "en"
        ? "Step 0: Your personal information"
        : "Bước 0: Thông tin cá nhân",
    fullName: language === "en" ? "Full name" : "Họ và tên",
    studentIdLabel: "Student ID",
    classLabel: language === "en" ? "Class / Cohort" : "Lớp / Khóa",
    missingInfo:
      language === "en"
        ? "Please fill in your name and Student ID before submitting."
        : "Vui lòng nhập Họ tên và MSSV (7 số) trước khi gửi.",
    invalidStudentId:
      language === "en"
        ? "Student ID must be 7 digits."
        : "MSSV phải bao gồm 7 chữ số.",

    step1:
      language === "en"
        ? "Step 1: Choose what to evaluate"
        : "Bước 1: Chọn đối tượng đánh giá",
    tutor: language === "en" ? "Tutor" : "Cố vấn",
    session: language === "en" ? "Consultation session" : "Buổi tư vấn",
    course: language === "en" ? "Course/Class" : "Môn học/Lớp học",
    step2:
      language === "en"
        ? "Step 2: Your evaluation"
        : "Bước 2: Đánh giá của bạn",
    rating: language === "en" ? "Rating" : "Xếp hạng",
    comments:
      language === "en" ? "Comments / Suggestions" : "Nhận xét / Đề xuất",
    tags: language === "en" ? "Tags (optional)" : "Thẻ (tùy chọn)",
    submit: language === "en" ? "Submit" : "Gửi",
    cancel: language === "en" ? "Cancel" : "Hủy",
    success:
      language === "en"
        ? "Thank you for your feedback!"
        : "Cảm ơn phản hồi của bạn!",
    selectSpecific: language === "en" ? "Select specific" : "Chọn cụ thể",
  };

  const tags = [
    {
      id: "quality",
      label: language === "en" ? "Content quality" : "Chất lượng nội dung",
    },
    {
      id: "teaching",
      label: language === "en" ? "Teaching style" : "Phong cách giảng dạy",
    },
    {
      id: "support",
      label: language === "en" ? "Support level" : "Mức độ hỗ trợ",
    },
    {
      id: "timing",
      label: language === "en" ? "Time management" : "Quản lý thời gian",
    },
  ];

  // Mock data for dynamic selection
  const mockMyTutors = [
    { id: "1", name: "Dr. Nguyen Van A" },
    { id: "2", name: "Ms. Le Thi B" },
  ];
  
  const mockMySessions = [
    { id: "101", title: "Data Structures - Week 5" },
    { id: "102", title: "Algorithm Analysis - Final Review" },
  ];

  const mockMyCourses = [
    { id: "CO3001", name: "Software Engineering" },
    { id: "CO3005", name: "Principles of Programming Languages" },
  ];

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    // ⚠️ kiểm tra thông tin cá nhân trước
    if (!fullName.trim() || !studentId.trim()) {
      toast.error(t.missingInfo);
      return;
    }
    if (!/^\d{7}$/.test(studentId)) {
        toast.error(t.invalidStudentId);
        return;
    }
    if (!selectedEntityId) {
        toast.error(language === "en" ? "Please select a specific item to evaluate." : "Vui lòng chọn đối tượng cụ thể để đánh giá.");
        return;
    }

    toast.success(t.success);

    // reset phần đánh giá (giữ lại info cá nhân cho lần sau)
    setRating(0);
    setComments("");
    setSelectedTags([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">{t.title}</h1>
      </div>

      <div className="space-y-6">
        {/* 🆕 Card thông tin cá nhân */}
        <Card>
          <CardHeader>
            <CardTitle>{t.step0}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.fullName} *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your full name"
                      : "Nhập họ và tên"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">{t.studentIdLabel} *</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => {
                      // Only allow digits and max 7 chars
                      const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                      setStudentId(val);
                  }}
                  placeholder="xxxxxxx (7 digits)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentClass">{t.classLabel}</Label>
              <Input
                id="studentClass"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder={
                  language === "en" ? "e.g., CNPM L04" : "VD: CNPM L04"
                }
              />
            </div>
            <p className="text-xs text-gray-400">
              * {language === "en" ? "Required fields" : "Trường bắt buộc"}
            </p>
          </CardContent>
        </Card>

        {/* Step 1: chọn đối tượng đánh giá */}
        <Card>
          <CardHeader>
            <CardTitle>{t.step1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={evaluationType}
              onValueChange={(val) => {
                  setEvaluationType(val);
                  setSelectedEntityId(""); // Reset specific selection on type change
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`cursor-pointer ${
                    evaluationType === "tutor"
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tutor" id="tutor" />
                      <Label htmlFor="tutor" className="cursor-pointer">
                        {t.tutor}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer ${
                    evaluationType === "session"
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="session" id="session" />
                      <Label htmlFor="session" className="cursor-pointer">
                        {t.session}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer ${
                    evaluationType === "course"
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="course" id="course" />
                      <Label htmlFor="course" className="cursor-pointer">
                        {t.course}
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
            
            {/* Dynamic Selection Dropdown */}
            <div className="pt-4 border-t">
                <Label className="mb-2 block">{t.selectSpecific} {
                    evaluationType === "tutor" ? t.tutor :
                    evaluationType === "session" ? t.session : t.course
                }</Label>
                
                {/* Manual Select Implementation using standard HTML select for simplicity or Shadcn Select */}
                 {/* Reusing Shadcn Select imports if available at top, else standard select */}
                 <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                 >
                     <option value="" disabled>-- Select --</option>
                     {evaluationType === "tutor" && mockMyTutors.map(t => (
                         <option key={t.id} value={t.id}>{t.name}</option>
                     ))}
                     {evaluationType === "session" && mockMySessions.map(s => (
                         <option key={s.id} value={s.id}>{s.title}</option>
                     ))}
                     {evaluationType === "course" && mockMyCourses.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                 </select>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: đánh giá chi tiết */}
        <Card>
          <CardHeader>
            <CardTitle>{t.step2}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t.rating}</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-gray-600">{rating}/5</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">{t.comments}</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
                placeholder={
                  language === "en"
                    ? "Share your experience..."
                    : "Chia sẻ trải nghiệm của bạn..."
                }
              />
            </div>

            <div className="space-y-2">
              <Label>{t.tags}</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={
                      selectedTags.includes(tag.id) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} disabled={rating === 0}>
                {t.submit}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRating(0);
                  setComments("");
                  setSelectedTags([]);
                }}
              >
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
