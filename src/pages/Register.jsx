import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const STEPS = ["Account Info", "Verify Email"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [regToken, setRegToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // 1. دالة إنشاء الحساب وإرسال الـ OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // تأمين الـ Event من التسريب

    if (loading) return;
    setLoading(true);

    try {
      const cleanEmail = form.email.trim().toLowerCase();
      const res = await authAPI.register({ ...form, email: cleanEmail });

      if (res.data?.registrationToken) {
        setRegToken(res.data.registrationToken);
      }

      toast.success("Verification code sent to your email! 📩");
      setStep(1);
    } catch (err) {
      console.log("Captured Register Error Safely:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "فشل إنشاء الحساب، تأكد من صحة البيانات المدخلة أو استخدام إيميل آخر 📝";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة التحقق من كود الـ OTP وتفعيل الحساب
  // 2. دالة التحقق من كود الـ OTP وتفعيل الحساب والدخول فوراً
  const handleVerify = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await authAPI.verifyOTP({
        code: otp,
        registrationToken: regToken,
      });

      // ⚠️ تأكد إن الباكيند بيرجع الاسماء دي بالظبط (token و user)
      const authToken = res.data?.token;
      const userData = res.data?.user;

      if (authToken) {
        // 1. حفظ البيانات في الـ Local Storage
        localStorage.setItem("ecosense_token", authToken);
        localStorage.setItem("ecosense_user", JSON.stringify(userData));

        toast.success("Account verified! Welcome to EcoSense 🌿");

        // 2. التوجيه المباشر والسرى للـ Dashboard
        navigate("/dashboard", { replace: true });

        // 3. تحديث الصفحة تحديث كامل (جبري) عشان الـ AuthContext يقرا التوكن الجديد ويدخله علطول
        window.location.reload();
      } else {
        // لو الباكيند مش بيبعت توكن، كدا كدا لازم يروح للوجين
        toast.success("Account verified successfully! 🎉");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.log("Captured Verification Error Safely:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "الكود المدخل غير صحيح أو منتهي الصلاحية ❌";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="fixed top-0 right-0 w-80 h-80 bg-forest-300/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="w-full max-w-lg relative animate-slide-up">
        <div className="bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden">
          <div className="sidebar-bg px-8 pt-8 pb-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-forest opacity-30" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <Leaf size={22} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Create account
                </h1>
                <p className="text-forest-200 text-sm mt-1">
                  Join EcoSense as a farm owner
                </p>
              </div>
              <div className="flex gap-2 mt-1">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${i === step ? "bg-white text-forest-700" : i < step ? "bg-forest-500 text-white" : "bg-white/20 text-forest-200"}`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-current/20">
                      {i + 1}
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {step === 0 ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                      />
                      <input
                        className="input pl-9"
                        placeholder="John"
                        required
                        value={form.firstName}
                        onChange={set("firstName")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                      />
                      <input
                        className="input pl-9"
                        placeholder="Farmer"
                        required
                        value={form.lastName}
                        onChange={set("lastName")}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      type="email"
                      className="input pl-9"
                      placeholder="you@farm.com"
                      required
                      value={form.email}
                      onChange={set("email")}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      type="password"
                      className="input pl-9"
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={set("password")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone</label>
                    <div className="relative">
                      <Phone
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                      />
                      <input
                        className="input pl-9"
                        placeholder="+20..."
                        required
                        value={form.phoneNumber}
                        onChange={set("phoneNumber")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <div className="relative">
                      <MapPin
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                      />
                      <input
                        className="input pl-9"
                        placeholder="City, Country"
                        required
                        value={form.address}
                        onChange={set("address")}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 mt-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="bg-forest-50 border border-forest-200 rounded-2xl p-4 text-sm text-forest-700">
                  We sent a 6-digit code to <strong>{form.email}</strong>. Enter
                  it below to activate your account.
                </div>
                <div>
                  <label className="label">Verification Code</label>
                  <div className="relative">
                    <KeyRound
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      className="input pl-10 text-center text-xl font-mono tracking-[0.5em]"
                      placeholder="000000"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full justify-center py-3"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Verify & Activate"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="btn-secondary w-full justify-center"
                >
                  ← Back
                </button>
              </form>
            )}

            <p className="text-center text-sm text-sage-500 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-forest-600 font-semibold hover:text-forest-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
