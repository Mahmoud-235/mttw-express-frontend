import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecosense_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. التقاط التوكن من الرابط لو المستخدم راجع من صفحة جوجل
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("ecosense_token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. التحقق من التوكن وجلب بيانات المستخدم
    const token = localStorage.getItem("ecosense_token");
    if (token) {
      authAPI
        .getMe()
        .then((r) => {
          localStorage.setItem("ecosense_user", JSON.stringify(r.data.user));
          setUser(r.data.user);
        })
        .catch((err) => {
          console.log("Session token expired or invalid:", err);
          localStorage.removeItem("ecosense_token");
          localStorage.removeItem("ecosense_user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // دالة تسجيل الدخول مع تمرير الإيرور بأمان للـ Component بدون ضرب الـ State
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });

      if (data?.token && data?.user) {
        localStorage.setItem("ecosense_token", data.token);
        localStorage.setItem("ecosense_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      // بنعمل throw للخطأ عشان يروح للـ catch اللي جوه الـ Login.jsx وتظهر في التوست
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    window.location.href =
      "https://ecosense-backend.vercel.app/api/auth/google";
  }, []);

  const logout = useCallback(async (navigate) => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.log("Logout API error safely ignored", err);
    }

    // 1. تنظيف الـ Storage تماماً
    localStorage.removeItem("ecosense_token");
    localStorage.removeItem("ecosense_user");
    setUser(null);

    // 2. التوجيه لصفحة الـ login أو الـ Landing مع مسح الـ History stack
    if (navigate) {
      navigate("/login", { replace: true });
    }
  }, []);
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("ecosense_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, loginWithGoogle, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
