import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

export function ProfileSetupScreen({ user, onComplete, language }) {
  const [form, setForm] = useState({
    faculty: user.faculty || "",
    stuId: user.stuId || "",
    department: user.department || "",
    tutorId: user.tutorId || "",
    education: (user.education || []).join(", "),
    awards: (user.awards || []).join(", "),
    listCourseCanTeach: (user.listCourseCanTeach || []).join(", "),
  });

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.bknetId}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(language === "en" ? "Profile updated!" : "Đã cập nhật thông tin!");
        onComplete(json.data);
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">
        {language === "en" ? "Complete your profile" : "Hoàn thiện thông tin cá nhân"}
      </h1>

      {user.role === "student" && (
        <>
          <div>
            <Label>Department</Label>
            <Input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>
          <div>
            <Label>Student ID</Label>
            <Input
              value={form.stuId}
              onChange={(e) => setForm({ ...form, stuId: e.target.value })}
            />
          </div>
        </>
      )}

      {user.role === "tutor" && (
        <>
          <div>
            <Label>Faculty</Label>
            <Input
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            />
          </div>
          <div>
            <Label>Tutor ID</Label>
            <Input
              value={form.tutorId}
              onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
            />
          </div>
          <div>
            <Label>Courses can teach</Label>
            <Input
              placeholder="CS101, CS102..."
              value={form.listCourseCanTeach}
              onChange={(e) => setForm({ ...form, listCourseCanTeach: e.target.value })}
            />
          </div>
          <div>
            <Label>Education</Label>
            <Input
              placeholder="BSc, MSc, PhD..."
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
            />
          </div>
          <div>
            <Label>Awards</Label>
            <Input
              placeholder="Teaching Excellence Award..."
              value={form.awards}
              onChange={(e) => setForm({ ...form, awards: e.target.value })}
            />
          </div>
        </>
      )}

      <Button onClick={handleSave}>
        {language === "en" ? "Save and continue" : "Lưu và tiếp tục"}
      </Button>
    </div>
  );
}
