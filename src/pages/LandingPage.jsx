import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaLeaf,
  FaRobot,
  FaChartLine,
  FaCloudSun,
  FaMicrochip,
  FaBell,
  FaArrowRight,
  FaGlobe,
  FaChevronDown,
  FaTemperatureHigh,
  FaTint,
  FaSun,
  FaHeadset,
  FaCheckCircle,
  FaPlay,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import {
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
} from "react-icons/hi";

// ─── Language Context ──────────────────────────────────────────────────────
const LanguageContext = createContext();

const translations = {
  en: {
    heroTitle: "Grow Smarter,",
    heroTitle2: "Not Harder.",
    heroDesc:
      "EcoSense unifies IoT sensor networks and AI-powered plant disease detection into one intelligent farming platform — monitor, analyse, and act in real time.",
    start: "Start Free Trial",
    learn: "See How It Works",
    login: "Log In",
    getStarted: "Get Started Free",
    overview: "Overview",
    features: "Features",
    architecture: "Architecture",
    dashboard: "Dashboard",
    pricing: "Pricing",
    contact: "Contact",
    badge: "AI + IoT Powered Smart Farming",
    statsLabel1: "Active Farms",
    statsLabel2: "AI Accuracy",
    statsLabel3: "Yield Increase",
    statsLabel4: "Support",
  },
  ar: {
    heroTitle: "ازرع بذكاء،",
    heroTitle2: "وليس بجهد.",
    heroDesc:
      "إيكو سينس تجمع شبكات حساسات إنترنت الأشياء وتشخيص أمراض النباتات بالذكاء الاصطناعي في منصة زراعية ذكية — راقب وحلّل وتصرّف لحظيًا.",
    start: "ابدأ مجانًا",
    learn: "اعرف المزيد",
    login: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    overview: "نظرة عامة",
    features: "المميزات",
    architecture: "البنية",
    dashboard: "لوحة التحكم",
    pricing: "الأسعار",
    contact: "تواصل",
    badge: "زراعة ذكية بالذكاء الاصطناعي وإنترنت الأشياء",
    statsLabel1: "مزرعة نشطة",
    statsLabel2: "دقة الكشف",
    statsLabel3: "زيادة الإنتاج",
    statsLabel4: "دعم فني",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en",
  );
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);
  const toggleLanguage = () => setLanguage((p) => (p === "en" ? "ar" : "en"));
  const t = (key) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => useContext(LanguageContext);

// ─── Animated Counter ──────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setCount(target);
        clearInterval(t);
      } else setCount(Math.floor(cur));
    }, 20);
    return () => clearInterval(t);
  }, [started, target]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Floating Particle ──────────────────────────────────────────────────────
function Particle({ style }) {
  return (
    <motion.div
      style={{ position: "absolute", borderRadius: "50%", ...style }}
      animate={{ y: [-20, 20, -20], opacity: [0.3, 0.7, 0.3] }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Sensor Card ────────────────────────────────────────────────────────────
function SensorCard({ icon, value, label, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 20,
        padding: "22px 20px",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 0% 0%, ${color}18, transparent 60%)`,
        }}
      />
      <div style={{ color, fontSize: 20, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: -1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <motion.div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenu(false);
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isRTL = language === "ar";
  const NAV_ITEMS = [
    { label: "Home", id: "home" },
    { label: t("overview"), id: "overview" },
    { label: t("features"), id: "features" },
    { label: t("architecture"), id: "architecture" },
    { label: t("pricing"), id: "pricing" },
    { label: t("contact"), id: "footer" },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "#050e09",
        color: "#fff",
        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          padding: "0 16px",
          height: 60,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(5,14,9,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(82,212,74,0.1)" : "none",
          transition: "all 0.4s ease",
          boxSizing: "border-box",
          "@media (min-width: 768px)": {
            padding: "0 60px",
            height: 70,
          }
        }}
      >
        {/* Logo */}
        <div
          onClick={() => scrollToSection("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg,#52d44a,#22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              boxShadow: "0 0 20px rgba(82,212,74,0.4)",
            }}
          >
            <FaLeaf color="#fff" />
          </div>
          <span style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800, letterSpacing: -0.5 }}>
            EcoSense
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "none", gap: 6, alignItems: "center", "@media (min-width: 768px)": { display: "flex" } }}>
          {NAV_ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.id)}
              style={{
                background:
                  activeNav === item.id
                    ? "rgba(82,212,74,0.12)"
                    : "transparent",
                border:
                  activeNav === item.id
                    ? "1px solid rgba(82,212,74,0.25)"
                    : "1px solid transparent",
                color:
                  activeNav === item.id ? "#52d44a" : "rgba(255,255,255,0.7)",
                fontSize: 14,
                fontWeight: 500,
                padding: "7px 16px",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={toggleLanguage}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <FaGlobe size={12} />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {t("login")}
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              background: "linear-gradient(135deg,#52d44a,#22c55e)",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(82,212,74,0.3)",
              transition: "all 0.2s",
            }}
          >
            {t("getStarted")}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{
            display: "flex",
            "@media (min-width: 768px)": { display: "none" },
            alignItems: "center",
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            cursor: "pointer",
            borderRadius: 8,
            fontSize: 20,
          }}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            background: "rgba(5,14,9,0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(82,212,74,0.1)",
            zIndex: 999,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
                setMobileMenu(false);
              }}
              style={{
                padding: "12px 16px",
                background: "rgba(82,212,74,0.08)",
                border: "1px solid rgba(82,212,74,0.2)",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* ── HERO ── */}
      <section
        id="home"
        ref={heroRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* BG */}
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(rgba(0,0,0,0.65),rgba(5,14,9,0.9)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974") center/cover`,
            }}
          />
        </motion.div>

        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <Particle
            key={i}
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              background: `rgba(82,212,74,${0.2 + Math.random() * 0.4})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Glows */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(82,212,74,0.12), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <motion.div
          style={{
            opacity: heroOpacity,
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1300,
            margin: "0 auto",
            padding: "60px 20px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "center",
            "@media (min-width: 768px)": {
              padding: "120px 60px 60px",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
            }
          }}
        >
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(82,212,74,0.1)",
                border: "1px solid rgba(82,212,74,0.3)",
                color: "#52d44a",
                padding: "8px 18px",
                borderRadius: 40,
                marginBottom: 28,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦
              </motion.span>
              {t("badge")}
            </motion.div>

            <h1
              style={{
                fontSize: "clamp(52px,6vw,82px)",
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: 24,
                letterSpacing: -2,
              }}
            >
              {t("heroTitle")}
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg,#52d44a,#86efac)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("heroTitle2")}
              </span>
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 40,
                maxWidth: 520,
              }}
            >
              {t("heroDesc")}
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 40px rgba(82,212,74,0.5)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                style={{
                  padding: "15px 32px",
                  borderRadius: 14,
                  background: "linear-gradient(135deg,#52d44a,#22c55e)",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 0 30px rgba(82,212,74,0.35)",
                }}
              >
                {t("start")} <FaArrowRight />
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.03,
                  background: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection("overview")}
                style={{
                  padding: "15px 32px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  backdropFilter: "blur(10px)",
                }}
              >
                <FaPlay size={12} /> {t("learn")}
              </motion.button>
            </div>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 40,
                flexWrap: "wrap",
              }}
            >
              {[
                "No credit card required",
                "Free tier available",
                "Setup in 5 min",
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 13,
                  }}
                >
                  <FaCheckCircle color="#52d44a" size={12} />
                  {b}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            style={{ perspective: 1200 }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "rgba(5,20,15,0.9)",
                borderRadius: 28,
                border: "1px solid rgba(82,212,74,0.15)",
                padding: 28,
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(82,212,74,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Top bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#52d44a,#22c55e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaLeaf color="#fff" size={13} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>
                    EcoSense Dashboard
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#52d44a",
                    }}
                  />
                  <span
                    style={{ color: "#52d44a", fontSize: 12, fontWeight: 600 }}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Sensor cards grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <SensorCard
                  icon={<FaTemperatureHigh />}
                  value="32.4°"
                  label="Temperature"
                  color="#ef4444"
                  delay={0.5}
                />
                <SensorCard
                  icon={<FaTint />}
                  value="68%"
                  label="Air Humidity"
                  color="#3b82f6"
                  delay={0.6}
                />
                <SensorCard
                  icon={<FaCloudSun />}
                  value="41%"
                  label="Soil Moisture"
                  color="#52d44a"
                  delay={0.7}
                />
                <SensorCard
                  icon={<FaSun />}
                  value="High"
                  label="Light Level"
                  color="#f59e0b"
                  delay={0.8}
                />
              </div>

              {/* Mini chart */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 18,
                  padding: "18px 20px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    Sensor Trend — Last 24h
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#52d44a",
                      background: "rgba(82,212,74,0.1)",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    Safe
                  </span>
                </div>
                <svg
                  width="100%"
                  height="80"
                  viewBox="0 0 400 80"
                  style={{ overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52d44a" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#52d44a" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 55 C40 30,80 65,120 45 S200 60,240 40 S320 25,400 35 L400 80 L0 80Z"
                    fill="url(#g1)"
                  />
                  <path
                    d="M0 55 C40 30,80 65,120 45 S200 60,240 40 S320 25,400 35"
                    stroke="#52d44a"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M0 65 C50 45,100 70,160 55 S260 40,320 60 S370 50,400 45 L400 80 L0 80Z"
                    fill="url(#g2)"
                  />
                  <path
                    d="M0 65 C50 45,100 70,160 55 S260 40,320 60 S370 50,400 45"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,3"
                  />
                </svg>
              </div>

              {/* Alert */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 12,
                  padding: "10px 16px",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaBell color="#ef4444" size={13} />
                </motion.div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                  AI detected{" "}
                  <strong style={{ color: "#ef4444" }}>Early Blight</strong> in
                  Sector B · 2m ago
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            zIndex: 10,
          }}
          onClick={() => scrollToSection("overview")}
        >
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 24,
              height: 40,
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              display: "flex",
              justifyContent: "center",
              paddingTop: 6,
            }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 4,
                height: 8,
                borderRadius: 2,
                background: "#52d44a",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          padding: "40px 20px 60px",
          marginTop: -50,
          position: "relative",
          zIndex: 20,
          "@media (min-width: 768px)": {
            padding: "0 60px 100px",
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: "rgba(10,25,18,0.95)",
            borderRadius: 28,
            border: "1px solid rgba(82,212,74,0.12)",
            padding: "40px 50px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 40,
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          }}
        >
          {[
            {
              icon: <FaLeaf />,
              val: 500,
              suf: "+",
              label: t("statsLabel1"),
              color: "#52d44a",
            },
            {
              icon: <FaRobot />,
              val: 98,
              suf: "%",
              label: t("statsLabel2"),
              color: "#3b82f6",
            },
            {
              icon: <FaChartLine />,
              val: 30,
              suf: "%",
              label: t("statsLabel3"),
              color: "#f59e0b",
            },
            {
              icon: <FaHeadset />,
              val: 24,
              suf: "/7",
              label: t("statsLabel4"),
              color: "#a855f7",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                    letterSpacing: -1,
                    color: "#fff",
                  }}
                >
                  <Counter target={s.val} suffix={s.suf} />
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── OVERVIEW ── */}
      <section
        id="overview"
        style={{
          padding: "60px 20px",
          "@media (min-width: 768px)": {
            padding: "100px 60px",
          },
          background: "linear-gradient(180deg,#f0fdf4 0%,#fff 100%)",
          color: "#111",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(82,212,74,0.12)",
                color: "#16a34a",
                padding: "8px 18px",
                borderRadius: 40,
                marginBottom: 24,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <FaLeaf /> {t("overview")}
            </div>
            <h2
              style={{
                fontSize: "clamp(36px,4vw,52px)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: -1,
              }}
            >
              A Comprehensive Smart Farming Platform
            </h2>
            <p
              style={{
                color: "#4b5563",
                lineHeight: 1.9,
                fontSize: 17,
                marginBottom: 32,
              }}
            >
              EcoSense is a production-grade platform that combines real-time
              IoT sensor monitoring with AI-powered plant disease detection.
              Built for farm owners and field workers who need actionable
              insights — not just raw data.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {[
                "Multi-sector management",
                "Role-based access control",
                "AI disease detection",
                "Real-time WebSocket alerts",
                "CSV data export",
                "ESP32 IoT integration",
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <FaCheckCircle color="#22c55e" size={14} />
                  {f}
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              style={{
                marginTop: 36,
                padding: "14px 30px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 10px 30px rgba(34,197,94,0.3)",
              }}
            >
              {t("getStarted")} <FaArrowRight size={13} />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: "relative" }}
          >
            <div
              style={{
                position: "absolute",
                inset: -20,
                background:
                  "linear-gradient(135deg,rgba(82,212,74,0.15),rgba(34,197,94,0.05))",
                borderRadius: 40,
                filter: "blur(30px)",
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1200&auto=format&fit=crop"
              alt="smart farming"
              style={{
                width: "100%",
                borderRadius: 28,
                position: "relative",
                boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
                border: "1px solid rgba(82,212,74,0.2)",
              }}
            />
            {/* floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: -18,
                left: 20,
                background: "#fff",
                borderRadius: 16,
                padding: "14px 20px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "1px solid rgba(82,212,74,0.2)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#52d44a,#22c55e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaRobot color="#fff" size={16} />
              </div>
              <div>
                <div
                  style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}
                >
                  AI Analysis
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                  Disease Detected · 94% conf.
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        style={{
          padding: "60px 20px",
          "@media (min-width: 768px)": {
            padding: "100px 60px",
          }
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 70 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(82,212,74,0.1)",
                color: "#16a34a",
                padding: "8px 18px",
                borderRadius: 40,
                marginBottom: 20,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <HiOutlineSparkles size={14} /> Why EcoSense?
            </div>
            <h2
              style={{
                fontSize: "clamp(36px,4vw,54px)",
                fontWeight: 900,
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Everything your farm needs
            </h2>
            <p
              style={{
                color: "#6b7280",
                fontSize: 18,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              From IoT hardware ingestion to AI diagnostics — one platform, zero
              compromise.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: <FaMicrochip />,
                title: "IoT Sensor Networks",
                desc: "Real-time monitoring of temperature, humidity, soil moisture and light across all farm sectors via ESP32 nodes.",
                color: "#52d44a",
              },
              {
                icon: <FaRobot />,
                title: "AI Disease Detection",
                desc: "Upload plant photos — our AI model identifies diseases with confidence scores and actionable treatment recommendations.",
                color: "#3b82f6",
              },
              {
                icon: <FaBell />,
                title: "Instant Smart Alerts",
                desc: "Socket.io WebSocket events + Firebase push notifications delivered the moment a critical condition is detected.",
                color: "#ef4444",
              },
              {
                icon: <FaChartLine />,
                title: "Analytics & Reports",
                desc: "Daily trend charts, aggregated stats, and one-click CSV export for every sector. Data-driven decisions made easy.",
                color: "#f59e0b",
              },
              {
                icon: <HiOutlineShieldCheck size={20} />,
                title: "Role-Based Access",
                desc: "Owners get the full picture. Workers see only their sector. Scoped, secure access at every API endpoint.",
                color: "#a855f7",
              },
              {
                icon: <HiOutlineLightningBolt size={20} />,
                title: "Sub-200ms Ingestion",
                desc: "IoT devices get instant acknowledgement. AI analysis runs asynchronously — never blocking your hardware.",
                color: "#06b6d4",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px ${f.color}25`,
                }}
                style={{
                  padding: "36px 32px",
                  borderRadius: 24,
                  background: "#fff",
                  border: "1px solid #f0f0f0",
                  cursor: "default",
                  transition: "box-shadow 0.2s",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${f.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: f.color,
                    fontSize: 22,
                    marginBottom: 22,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#111",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: 15 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section
        id="architecture"
        style={{ padding: "60px 20px", "@media (min-width: 768px)": { padding: "100px 60px" }, background: "#050e09", color: "#fff" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 70 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(82,212,74,0.1)",
                color: "#52d44a",
                padding: "8px 18px",
                borderRadius: 40,
                marginBottom: 20,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <FaMicrochip size={12} /> {t("architecture")}
            </div>
            <h2
              style={{
                fontSize: "clamp(36px,4vw,52px)",
                fontWeight: 900,
                letterSpacing: -1,
              }}
            >
              Built on battle-tested tech
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 16,
            }}
          >
            {[
              { label: "Node.js", sub: "Backend", color: "#52d44a" },
              { label: "MongoDB", sub: "Database", color: "#22c55e" },
              { label: "React + Vite", sub: "Frontend", color: "#3b82f6" },
              { label: "Socket.io", sub: "Real-time", color: "#a855f7" },
              { label: "Firebase FCM", sub: "Push Alerts", color: "#f59e0b" },
              { label: "Cloudinary", sub: "Image CDN", color: "#06b6d4" },
              { label: "Python AI", sub: "ML Inference", color: "#ef4444" },
              { label: "ESP32", sub: "IoT Hardware", color: "#52d44a" },
            ].map((t2, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04, borderColor: t2.color }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 18,
                  padding: "22px 18px",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.07)",
                  cursor: "default",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: `${t2.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  <FaLeaf color={t2.color} size={16} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  {t2.label}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {t2.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{ padding: "60px 20px", "@media (min-width: 768px)": { padding: "100px 60px" }, background: "#f0fdf4", color: "#111" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 70 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(82,212,74,0.15)",
                color: "#16a34a",
                padding: "8px 18px",
                borderRadius: 40,
                marginBottom: 20,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {t("pricing")}
            </div>
            <h2
              style={{
                fontSize: "clamp(36px,4vw,52px)",
                fontWeight: 900,
                letterSpacing: -1,
                marginBottom: 16,
              }}
            >
              Simple, transparent pricing
            </h2>
            <p style={{ color: "#6b7280", fontSize: 17 }}>
              Start free. Scale as your farm grows. No hidden fees.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            {[
              {
                name: "Starter",
                price: "Free",
                period: "",
                highlight: false,
                features: [
                  "1 farm owner",
                  "Up to 3 sectors",
                  "2 IoT devices",
                  "Basic sensor data",
                  "Email alerts",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                period: "/mo",
                highlight: true,
                features: [
                  "Unlimited sectors",
                  "Up to 20 IoT devices",
                  "AI disease detection",
                  "Push notifications",
                  "CSV reports",
                  "5 workers",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                highlight: false,
                features: [
                  "Unlimited everything",
                  "Dedicated AI server",
                  "Custom integrations",
                  "SLA guarantee",
                  "Priority support",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(145deg,#15803d,#166534)"
                    : "#fff",
                  borderRadius: 28,
                  padding: "36px 32px",
                  border: plan.highlight ? "none" : "1px solid #e5e7eb",
                  boxShadow: plan.highlight
                    ? "0 30px 70px rgba(21,128,61,0.35)"
                    : "0 4px 20px rgba(0,0,0,0.05)",
                  transform: plan.highlight ? "scale(1.04)" : "scale(1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      background: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: plan.highlight ? "#fff" : "#111",
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      color: plan.highlight ? "#fff" : "#111",
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      style={{
                        color: plan.highlight
                          ? "rgba(255,255,255,0.6)"
                          : "#9ca3af",
                        fontSize: 15,
                      }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 32,
                  }}
                >
                  {plan.features.map((f, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: plan.highlight
                          ? "rgba(255,255,255,0.9)"
                          : "#374151",
                        fontSize: 14,
                      }}
                    >
                      <FaCheckCircle
                        color={plan.highlight ? "#86efac" : "#22c55e"}
                        size={13}
                      />
                      {f}
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/register")}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 14,
                    background: plan.highlight
                      ? "rgba(255,255,255,0.2)"
                      : "linear-gradient(135deg,#22c55e,#16a34a)",
                    border: plan.highlight
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "none",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "60px 20px",
          "@media (min-width: 768px)": {
            padding: "100px 60px",
          },
          background: "linear-gradient(135deg,#052e16,#14532d,#052e16)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle,rgba(82,212,74,0.15),transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 10,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <FaLeaf color="#52d44a" size={26} />
          </div>
          <h2
            style={{
              fontSize: "clamp(36px,4vw,56px)",
              fontWeight: 900,
              letterSpacing: -1,
              marginBottom: 20,
            }}
          >
            Ready to grow smarter?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Join farms already using EcoSense to monitor crops, detect diseases
            early, and maximise yields with AI-driven insights.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 50px rgba(82,212,74,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              style={{
                padding: "16px 36px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#52d44a,#22c55e)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 0 30px rgba(82,212,74,0.35)",
              }}
            >
              {t("getStarted")} <FaArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 36px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t("login")}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        id="footer"
        style={{
          background: "#020b08",
          color: "#fff",
          borderTop: "1px solid rgba(82,212,74,0.1)",
          padding: "40px 20px 20px",
          "@media (min-width: 768px)": {
            padding: "60px 60px 30px",
          }
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 50,
              marginBottom: 50,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#52d44a,#22c55e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaLeaf color="#fff" size={14} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800 }}>EcoSense</span>
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 14,
                  lineHeight: 1.8,
                  maxWidth: 280,
                }}
              >
                Smart agricultural monitoring powered by IoT and AI. One
                platform, unlimited farm intelligence.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  "Dashboard",
                  "Sectors",
                  "Devices",
                  "Sensors",
                  "Reports",
                ],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Contact"],
              },
              {
                title: "Support",
                links: ["Documentation", "API Docs", "Status", "Community"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 18,
                  }}
                >
                  {col.title}
                </h4>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {col.links.map((l, j) => (
                    <button
                      key={j}
                      onClick={() => scrollToSection("home")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 14,
                        cursor: "pointer",
                        textAlign: isRTL ? "right" : "left",
                        padding: 0,
                        transition: "color 0.2s",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
              © {new Date().getFullYear()} EcoSense Inc. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                (l, i) => (
                  <button
                    key={i}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.35)",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {l}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
