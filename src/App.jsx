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
import ForgotPassword from "./pages/ForgotPassword";
import { LanguageProvider } from "./pages/LandingPage";

// 🛡️ حماية المسارات الأساسية للـ Dashboard
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
}

// 👑 حماية مسارات صاحب المزرعة (Owner) فقط
function OwnerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user?.role === "owner" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // شاشة تحميل رئيسية ريثما يتحقق الـ Context من التوكن
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin" />
          <span className="text-sage-600 font-medium text-sm">
            Loading EcoSense...
          </span>
        </div>
      </div>
    );

  return (
    <Routes>
      {/* 🌍 المسارات العامة */}
      <Route path="/" element={<LandingPage />} />

      {/* 🔐 مسارات الـ Auth (توجيه تلقائي لو مسجل دخول) */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/forgot-password"
        element={
          user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
        }
      />

      {/* 🌲 مسارات الـ Dashboard المحمية والـ Real-time Sockets */}
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

      {/* 🔄 Handling Not Found Routes */}
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
