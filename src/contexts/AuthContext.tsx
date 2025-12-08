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
}

interface AuthContextType {
  user: User | null;
  login: (bknetId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
      const res = await fetch("http://localhost:3001/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          const userData = result.data[0];
          setUser({
            id: userData.id,
            bknetId: userData.bknetId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            name: `${userData.firstName} ${userData.lastName}`,
          });
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

  const login = async (bknetId: string, password: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bknetId, password }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.data.token);

      const userData = result.data.user;
      setUser({
        id: userData.id,
        bknetId: userData.bknetId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        name: `${userData.firstName} ${userData.lastName}`,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
