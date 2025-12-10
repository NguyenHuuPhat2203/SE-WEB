import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { GraduationCap, Loader2, CheckCircle2, XCircle } from "lucide-react";

export function SSOCallbackScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithSSO } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [message, setMessage] = useState("Processing SSO authentication...");

  useEffect(() => {
    let isHandled = false; // Prevent double execution

    const handleCallback = async () => {
      if (isHandled) return;
      isHandled = true;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      console.log("[SSO Callback] Starting authentication flow");
      console.log("[SSO Callback] Code:", code ? "present" : "missing");

      // Handle error from SSO
      if (error) {
        console.error("[SSO Callback] Error from SSO:", error);
        setStatus("error");
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      // Validate code
      if (!code) {
        console.error("[SSO Callback] No authorization code provided");
        setStatus("error");
        setMessage("Invalid authorization code");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        console.log("[SSO Callback] Exchanging code for token...");

        // Step 3: Exchange code for token
        const response = await fetch(
          "http://localhost:3001/api/auth/sso/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              redirectUri: "http://localhost/auth/callback",
            }),
          }
        );

        const data = await response.json();
        console.log(
          "[SSO Callback] Token exchange response:",
          data.success ? "success" : "failed"
        );

        if (data.success) {
          console.log("[SSO Callback] Storing token and user data");

          // Store token and user data
          localStorage.setItem("token", data.data.accessToken);

          if (loginWithSSO) {
            await loginWithSSO(data.data.accessToken, data.data.user);
          }

          setStatus("success");
          setMessage("Login successful! Redirecting...");

          const role = data.data.user.role;
          console.log("[SSO Callback] Redirecting to:", role);

          // Redirect based on role immediately
          setTimeout(() => {
            switch (role) {
              case "student":
                navigate("/student", { replace: true });
                break;
              case "tutor":
                navigate("/tutor", { replace: true });
                break;
              case "cod":
                navigate("/cod", { replace: true });
                break;
              case "ctsv":
                navigate("/ctsv", { replace: true });
                break;
              default:
                navigate("/", { replace: true });
            }
          }, 500); // Reduced delay for faster redirect
        } else {
          console.error("[SSO Callback] Authentication failed:", data.message);
          setStatus("error");
          setMessage(data.message || "Failed to authenticate");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error: any) {
        console.error("[SSO Callback] Exception:", error);
        setStatus("error");
        setMessage("Network error. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, []); // Remove dependencies to prevent re-execution

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HCMUT SSO</h1>
          <p className="text-gray-600">Ho Chi Minh University of Technology</p>
        </div>

        <div className="py-8">
          {status === "processing" && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 text-red-600 mx-auto" />
              <p className="text-gray-700 font-medium">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          © 2025 HCMUT. Secure SSO Authentication.
        </div>
      </div>
    </div>
  );
}
