import { useState } from "react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, GraduationCap } from "lucide-react";

type Language = "en" | "vi";

export function LoginScreen() {
  const [language] = useState<Language>("en");
  const [error, setError] = useState("");

  const t = {
    title: "HCMUT",
    subtitle:
      language === "en" ? "Tutor Support System" : "Hệ thống Cố vấn học tập",
    tagline:
      language === "en"
        ? "Connect with tutors and achieve your academic goals"
        : "Kết nối với cố vấn và đạt được mục tiêu học tập",
    ssoButton:
      language === "en" ? "Login with HCMUT SSO" : "Đăng nhập qua HCMUT SSO",
    ssoInfo:
      language === "en"
        ? "Use your HCMUT BKnet ID to access the system"
        : "Sử dụng BKnet ID của HCMUT để truy cập hệ thống",
  };

  const handleSSOLogin = async () => {
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/sso/login?redirect_uri=http://localhost/auth/callback"
      );
      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.authUrl;
      } else {
        setError(data.message || "Failed to initiate SSO login");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
      console.error("SSO login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-purple-600">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
              </div>
            </div>
            <p className="text-2xl text-gray-700 max-w-md mx-auto md:mx-0">
              {t.tagline}
            </p>
          </div>

          {/* Right side - SSO Login */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? "Welcome" : "Chào mừng"}
                </h2>
                <p className="text-gray-600 text-sm">{t.ssoInfo}</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSSOLogin}
                className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg font-semibold shadow-lg"
              >
                🎓 {t.ssoButton}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-2">
                  {language === "en" ? "Demo Credentials:" : "Tài khoản demo:"}
                </p>
                <ul className="space-y-1 text-xs">
                  <li>
                    <strong>Student:</strong> student / password
                  </li>
                  <li>
                    <strong>Tutor:</strong> tutor / password
                  </li>
                  <li>
                    <strong>CoD:</strong> cod / password
                  </li>
                  <li>
                    <strong>CTSV:</strong> ctsv / password
                  </li>
                </ul>
              </div>
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
