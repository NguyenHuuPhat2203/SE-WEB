import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, GraduationCap } from "lucide-react";

type Language = "en" | "vi";

export function RegisterScreen() {
  const navigate = useNavigate();
  const [language] = useState<Language>("en");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bknetId, setBknetId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const t = {
    title: language === "en" ? "Sign Up" : "Đăng ký",
    subtitle:
      language === "en" ? "It's quick and easy." : "Nhanh chóng và dễ dàng.",
    firstName: language === "en" ? "First name" : "Tên",
    lastName: language === "en" ? "Last name" : "Họ",
    bknetId: "BKnetID",
    password: language === "en" ? "New password" : "Mật khẩu mới",
    confirmPassword:
      language === "en" ? "Confirm password" : "Xác nhận mật khẩu",
    signUp: language === "en" ? "Sign Up" : "Đăng ký",
    alreadyHaveAccount:
      language === "en" ? "Already have an account?" : "Đã có tài khoản?",
    passwordMismatch:
      language === "en" ? "Passwords do not match" : "Mật khẩu không khớp",
    required:
      language === "en"
        ? "Please fill in all fields"
        : "Vui lòng điền đầy đủ thông tin",
    success:
      language === "en"
        ? "Registration successful! Redirecting to login..."
        : "Đăng ký thành công! Đang chuyển đến đăng nhập...",
    terms:
      language === "en"
        ? "By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy."
        : "Bằng việc nhấn Đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.",
  };
  const handleRegister = async () => {
    setError("");

    // Validate FE trước
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !bknetId.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError(t.required);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          bknetId, // trùng với BE: bknetId
          password,
          role: "student", // nếu BE có default thì cũng được, gửi luôn cho rõ
        }),
      });

      const data = await res.json();

      // Trường hợp BE trả lỗi (thiếu field, trùng BKNetID, ...)
      if (!res.ok || !data.success) {
        // message là do BE trả về, ví dụ "BKNetID already exists"
        setError(
          data.message ||
            (language === "en" ? "Registration failed" : "Đăng ký thất bại")
        );
        return;
      }

      // Đăng ký OK - Tự động login bằng cách lưu token
      if (data.data && data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

      alert(t.success);
      navigate("/login");
    } catch (err) {
      setError(
        language === "en"
          ? "Cannot connect to server"
          : "Không thể kết nối server"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-purple-600">HCMUT</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl">{t.title}</h2>
              <p className="text-gray-600">{t.subtitle}</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstName}
                  className="h-12 px-4 bg-gray-50 border-gray-300"
                />
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.lastName}
                  className="h-12 px-4 bg-gray-50 border-gray-300"
                />
              </div>

              <Input
                id="bknetId"
                type="text"
                value={bknetId}
                onChange={(e) => setBknetId(e.target.value)}
                placeholder={t.bknetId}
                className="h-12 px-4 bg-gray-50 border-gray-300"
              />

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                className="h-12 px-4 bg-gray-50 border-gray-300"
              />

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                placeholder={t.confirmPassword}
                className="h-12 px-4 bg-gray-50 border-gray-300"
              />
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              {t.terms}
            </div>

            <Button
              onClick={handleRegister}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {t.signUp}
            </Button>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link to="/login" className="text-purple-600 hover:underline">
                {t.alreadyHaveAccount}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>© 2025 HCMUT - Ho Chi Minh University of Technology</p>
      </footer>
    </div>
  );
}
