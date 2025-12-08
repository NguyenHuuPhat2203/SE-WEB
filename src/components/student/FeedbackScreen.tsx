import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { toast } from "sonner@2.0.3";
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
  const [bknetId, setBknetId] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const t = {
    title: language === "en" ? "Evaluation" : "Đánh giá",

    // Thêm bước 0 – thông tin cá nhân
    step0:
      language === "en"
        ? "Step 0: Your personal information"
        : "Bước 0: Thông tin cá nhân",
    fullName: language === "en" ? "Full name" : "Họ và tên",
    bknetIdLabel: "BKnetID",
    classLabel: language === "en" ? "Class / Cohort" : "Lớp / Khóa",
    missingInfo:
      language === "en"
        ? "Please fill in your name and BKnetID before submitting."
        : "Vui lòng nhập Họ tên và BKnetID trước khi gửi.",

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

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    // ⚠️ kiểm tra thông tin cá nhân trước
    if (!fullName.trim() || !bknetId.trim()) {
      toast.error(t.missingInfo);
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
                <Label htmlFor="bknetId">{t.bknetIdLabel} *</Label>
                <Input
                  id="bknetId"
                  value={bknetId}
                  onChange={(e) => setBknetId(e.target.value)}
                  placeholder="2312xxxx / your BKnetID"
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
          <CardContent>
            <RadioGroup
              value={evaluationType}
              onValueChange={setEvaluationType}
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
