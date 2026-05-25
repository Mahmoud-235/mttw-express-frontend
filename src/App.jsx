import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { AppLayout } from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sectors from "./pages/Sectors";
import Devices from "./pages/Devices";
import Sensors from "./pages/Sensors";
import Images from "./pages/Images";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Workers from "./pages/Workers";
import { LanguageProvider } from "./pages/LandingPage";

// 🛡️ حماية المسارات الأساسية
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// 👑 حماية مسارات المالك
function OwnerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === "owner" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

// 🚪 حماية صفحات الـ auth — لو مسجل دخول يروح للـ Landing Page الخارجية
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    window.location.replace("https://ecosensedabab.netlify.app/");
    return null;
  }
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <SocketProvider>
              <AppLayout />
            </SocketProvider>
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/sectors"
          element={
            <OwnerRoute>
              <Sectors />
            </OwnerRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <OwnerRoute>
              <Devices />
            </OwnerRoute>
          }
        />
        <Route path="/sensors" element={<Sensors />} />
        <Route path="/images" element={<Images />} />
        <Route
          path="/reports"
          element={
            <OwnerRoute>
              <Reports />
            </OwnerRoute>
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/workers"
          element={
            <OwnerRoute>
              <Workers />
            </OwnerRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LanguageProvider>
  );
}
