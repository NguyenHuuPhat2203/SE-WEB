import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

type Language = "en" | "vi";

export function PasswordRecoveryScreen() {
  const navigate = useNavigate();
  const [language] = useState<Language>("en");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const t = {
    title: language === "en" ? "Find Your Account" : "Tìm tài khoản của bạn",
    subtitle:
      language === "en"
        ? "Please enter your BKnetID to search for your account."
        : "Vui lòng nhập BKnetID của bạn để tìm kiếm tài khoản.",
    verifyTitle: language === "en" ? "Reset Your Password" : "Đặt lại mật khẩu",
    verifySubtitle:
      language === "en"
        ? "A CAPTCHA code has been sent to your HCMUT email"
        : "Mã CAPTCHA đã được gửi đến email HCMUT của bạn",
    bknetId: "BKnetID",
    captcha: language === "en" ? "CAPTCHA code" : "Mã CAPTCHA",
    newPassword: language === "en" ? "New Password" : "Mật khẩu mới",
    search: language === "en" ? "Search" : "Tìm kiếm",
    resetPassword: language === "en" ? "Reset Password" : "Đặt lại mật khẩu",
    cancel: language === "en" ? "Cancel" : "Hủy",
    backToLogin: language === "en" ? "Back to Login" : "Quay lại đăng nhập",
    required:
      language === "en" ? "This field is required" : "Trường này là bắt buộc",
    invalidCaptcha:
      language === "en" ? "Invalid CAPTCHA code" : "Mã CAPTCHA không hợp lệ",
    successMsg:
      language === "en"
        ? "Password reset successfully!"
        : "Đặt lại mật khẩu thành công!",
    emailNotFound:
      language === "en" ? "Account not found" : "Không tìm thấy tài khoản",
  };
  const handleSearch = async () => {
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError(t.required);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/password/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // email ở đây chính là BKnetID
        body: JSON.stringify({ bknetId: email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || t.emailNotFound);
        return;
      }

      // Tìm thấy account → sang bước verify
      setStep("verify");
    } catch (err) {
      setError(
        language === "en"
          ? "Cannot connect to server"
          : "Không thể kết nối server"
      );
    }
  };

  const handleReset = async () => {
    setError("");
    setSuccess(false);

    if (!captcha.trim() || !newPassword.trim()) {
      setError(t.required);
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bknetId: email, // dùng lại BKnetID đã nhập ở bước 1
          captcha,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || t.invalidCaptcha);
        return;
      }

      // Thành công
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
            {step === "email" ? (
              <>
                <div className="space-y-2">
                  <h2 className="text-xl">{t.title}</h2>
                  <p className="text-gray-600">{t.subtitle}</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.bknetId}
                    className="h-12 px-4 bg-gray-50 border-gray-300"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full h-12">
                      {t.cancel}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSearch}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {t.search}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <button
                    onClick={() => setStep("email")}
                    className="flex items-center gap-2 text-purple-600 hover:underline mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {language === "en" ? "Back" : "Quay lại"}
                  </button>
                  <h2 className="text-xl">{t.verifyTitle}</h2>
                  <p className="text-gray-600">{t.verifySubtitle}</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{t.successMsg}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="captcha">{t.captcha}</Label>
                    <Input
                      id="captcha"
                      type="text"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="Enter CAPTCHA (demo: 123456)"
                      className="h-12 px-4 bg-gray-50 border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t.newPassword}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReset()}
                      className="h-12 px-4 bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleReset}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={success}
                >
                  {t.resetPassword}
                </Button>
              </>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="text-purple-600 hover:underline">
              {t.backToLogin}
            </Link>
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
