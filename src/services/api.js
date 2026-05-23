import axios from "axios";

const API = axios.create({
  baseURL: "https://ecosense-backend.vercel.app/api", // أو الـ URL بتاعك
  timeout: 10000,
});

// إضافة التوكن لكل الطلبات
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("ecosense_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 هنا مربط الفرس والتعديل السحري لمعالجة الأخطاء
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. لو الإيرور جاي من صفحة اللوجين أو التسجيل، مرره فوراً للـ catch بدون أي ريفريش أو تدمير للـ state
    const isAuthRoute =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register") ||
      error.config?.url?.includes("/auth/verify");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // 2. هنا بقا الكود القديم بتاعك اللي كان بيعمل Refresh لو التوكن منتهي في باقي الصفحات
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirecting...");
      localStorage.removeItem("ecosense_token");
      localStorage.removeItem("ecosense_user");

      // تأكد إنه مش بيعمل window.location.reload() عمال على بطال هنا
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// تجميعة الـ API Requests بتاعتك
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  verifyOTP: (data) => API.post("/auth/verify", data),
  getMe: () => API.get("/auth/me"),
  logout: () => API.post("/auth/logout"),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  get: () => API.get("/main/dashboard"),
};

// ── Sectors ──────────────────────────────────────────────────────────────────
export const sectorsAPI = {
  getAll: () => API.get("/sectors"),
  create: (data) => API.post("/sectors", data),
  update: (id, data) => API.put(`/sectors/${id}`, data),
  delete: (id) => API.delete(`/sectors/${id}`),
};

// ── Devices ──────────────────────────────────────────────────────────────────
export const devicesAPI = {
  getAll: () => API.get("/devices"),
  create: (data) => API.post("/devices", data),
  delete: (id) => API.delete(`/devices/${id}`),
};

// ── Sensors ──────────────────────────────────────────────────────────────────
export const sensorsAPI = {
  getLatest: (sectorId) => API.get("/sensors/latest", { params: { sectorId } }),
  getHistory: (params) => API.get("/sensors/history", { params }),
  getAnalytics: (sectorId) =>
    API.get("/sensors/analytics", { params: { sectorId } }),
  analyze: (sectorId) => API.post(`/sensors/analyze/${sectorId}`),
};

// ── Images ───────────────────────────────────────────────────────────────────
export const imagesAPI = {
  upload: (formData) => {
    // 1. هنجيب التوكن بكل الأسامي المحتملة اللي مشروعك ممكن يكون مخزنها
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("ecosense_token") ||
      localStorage.getItem("user_token") ||
      localStorage.getItem("accessToken");

    console.log("🔑 Checking token right before ship:", token);

    // 2. هنحدد رابط الباكيند بتاعك (تأكد من البورت 6000 أو الرابط المرفوع)
    // لو شغالين لوكال اكتب: http://localhost:6000/api/images/upload
    // لو مرفوع اكتب رابط السيرفر المرفوع كالتالي:
    const baseURL = "https://ecosense-backend.vercel.app/api";

    // 3. نداء مباشر بـ axios الخام عشان نقطع الشك باليقين
    return axios.post(`${baseURL}/images/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // إرسال التوكن غصب عن أي إعدادات تانية
      },
    });
  },

  getHistory: (params) => API.get("/images/history", { params }),
  delete: (id) => API.delete(`/images/${id}`),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: () => API.get("/main/notifications"),
  markRead: (id) => API.patch(`/main/notifications/${id}`),
  delete: (id) => API.delete(`/main/notifications/${id}`),
};

// ── Users / Workers ───────────────────────────────────────────────────────────
export const usersAPI = {
  getWorkers: () => API.get("/users/workers"),
  addWorker: (data) => API.post("/users/add-worker", data),
  deleteWorker: (id) => API.delete(`/users/worker/${id}`),
};

// ── Reports ───────────────────────────────────────────────────────────────────
export const reportsAPI = {
  getStats: (sectorId, days) =>
    API.get("/reports/stats", { params: { sectorId, days } }),
  exportCSV: (sectorId) =>
    API.get("/reports/export", {
      params: { sectorId },
      responseType: "blob",
    }),
};

export default API;
