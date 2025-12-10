import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  bknetId: string;
  firstName: string;
  lastName: string;
  role: "student" | "tutor" | "cod" | "ctsv";
  faculty?: string;
  department?: string;
  name?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loginWithSSO: (token: string, user: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Call /api/me to get current user info
      const res = await fetch("http://localhost:3001/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          const userData = result.data;
          setUser({
            id: userData._id || userData.id,
            bknetId: userData.bknetId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            faculty: userData.faculty,
            department: userData.department,
            name: `${userData.firstName} ${userData.lastName}`,
            permissions: userData.permissions || [],
          });
        } else {
          localStorage.removeItem("token");
        }
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSSO = async (token: string, userData: any) => {
    try {
      setUser({
        id: userData._id || userData.id,
        bknetId: userData.bknetId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        faculty: userData.faculty,
        department: userData.department,
        name: `${userData.firstName} ${userData.lastName}`,
        permissions: userData.permissions || [],
      });
    } catch (err) {
      console.error("SSO login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    // Try to logout from SSO
    if (token) {
      try {
        await fetch("http://localhost:3001/api/auth/sso/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("SSO logout failed:", err);
      }
    }

    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, loginWithSSO, logout, isLoading, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
