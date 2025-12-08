import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../Sidebar";
import { TopAppBar } from "../TopAppBar";
import { useAuth } from "../../contexts/AuthContext";

export type Language = "vi" | "en";

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const [unreadNotifications] = useState(5);

  if (!user) return null;

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"));
  };

  const handleNavigateProfile = () => {
    navigate(`/${user.role}/profile`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role={user.role} language={language} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopAppBar
          user={user}
          unreadNotifications={unreadNotifications}
          language={language}
          onToggleLanguage={toggleLanguage}
          onLogout={logout}
          onNavigateProfile={handleNavigateProfile}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ language, user }} />
        </main>
      </div>
    </div>
  );
}
