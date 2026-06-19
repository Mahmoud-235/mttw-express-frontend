import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: لطلب الإيميل, 2: لإدخال الكود والباسورد الجديد
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // البيانات المطلوبة للخطوتين
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); // لحفظ التوكن المنقذ اللي راجع من الباكيند

  const BACKEND_URL = "https://ecosense-backend.vercel.app"; // تأكد من مطابقة رابط الباكيند الفعلي

  // الخطوة الأولى: إرسال الإيميل للحصول على كود الـ OTP والـ Token
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      if (res.data.success) {
        toast.success("Verification code sent to your email! 📩");
        setResetToken(res.data.resetToken); // حفظ الـ Token عشان الخطوة الجاية
        setStep(2); // انقل المستخدم لخطوة تعيين الباسورد الجديد
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ⚠️");
    } finally {
      setLoading(false);
    }
  };

  // الخطوة الثانية: إرسال الكود والباسورد الجديد مع الـ Token لتغيير الباسورد
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        code: code.trim(),
        newPassword: newPassword,
        resetToken: resetToken, // ممررين التوكن هنا عشان الباكيند يفك تشفيره
      });

      if (res.data.success) {
        toast.success("Password updated successfully! 🎉");
        navigate("/login", { replace: true }); // رجعه لصفحة اللوجن يدخل بالجديد
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired code ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-96 h-96 bg-forest-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-forest-400/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative animate-slide-up">
        <div className="bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden">
          {/* الـ Header الثابت بنفس الهوية البصرية */}
          <div className="sidebar-bg px-8 pt-8 pb-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-forest opacity-30" />
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <Leaf size={22} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {step === 1 ? "Reset Password" : "Enter Verification Code"}
              </h1>
              <p className="text-forest-200 text-sm mt-1">
                {step === 1
                  ? "Enter your email to receive a verification OTP code"
                  : "Check your inbox and choose a strong new password"}
              </p>
            </div>
          </div>

          <div className="px-8 py-8 -mt-4 relative">
            {step === 1 ? (
              /* ================= الخطوة الأولى: نموذج الإيميل ================= */
              <form onSubmit={handleSendEmail} className="space-y-5">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      type="email"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="farm@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Verification Code <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* ================= الخطوة الثانية: نموذج الـ OTP والباسورد الجديد ================= */
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="label">Verification Code (OTP)</label>
                  <div className="relative">
                    <KeyRound
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      type="text"
                      maxLength="6"
                      value={code}
                      required
                      onChange={(e) => setCode(e.target.value)}
                      className="input pl-10 tracking-[0.25em] font-bold"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      required
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Reset Password <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            )}

            {/* العودة لصفحة اللوجن */}
            <p className="text-center text-sm text-sage-500 mt-6">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-forest-600 font-semibold hover:text-forest-800"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
