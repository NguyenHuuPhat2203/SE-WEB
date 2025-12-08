import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/index";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="min-h-screen">
          <AppRoutes />
          <Toaster />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
