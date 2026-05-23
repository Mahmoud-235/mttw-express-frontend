import { useState, useEffect, useCallback, useRef } from "react";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  ChevronDown,
  Activity,
  History,
  BarChart2,
  Clock,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { sensorsAPI, sectorsAPI } from "../services/api";
import { CardSkeleton } from "../components/ui/Skeleton";
import { timeAgo, formatDateTime } from "../utils/helpers";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

/* ─────────────────── Design System (shared tokens) ─────────────────── */
const DS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

:root {
  --c-bg:         #f2f5f0;
  --c-surface:    #ffffff;
  --c-surface2:   #f8faf6;
  --c-border:     #dde5d8;
  --c-border2:    #c9d8c1;

  --c-ink:        #141d10;
  --c-ink-60:     #4a5e42;
  --c-ink-40:     #7a9170;
  --c-ink-20:     #b8cdb0;

  --c-primary:    #2d6a2a;
  --c-primary-d:  #1e4a1c;
  --c-primary-l:  #eaf3e7;
  --c-primary-xl: #f4faf2;

  --c-amber:      #92500a;
  --c-amber-l:    #fff4e0;
  --c-red:        #8b1a1a;
  --c-red-l:      #fef0f0;
  --c-blue:       #1a4a7a;
  --c-blue-l:     #edf4ff;

  --r-sm:  8px;
  --r-md:  14px;
  --r-lg:  20px;
  --r-xl:  28px;

  --sh-sm: 0 1px 3px rgba(20,29,16,.06), 0 1px 2px rgba(20,29,16,.04);
  --sh-md: 0 4px 16px rgba(20,29,16,.08), 0 1px 4px rgba(20,29,16,.05);
  --sh-lg: 0 12px 40px rgba(20,29,16,.10), 0 2px 8px rgba(20,29,16,.06);

  --ease: cubic-bezier(.4,0,.2,1);
  --dur:  220ms;
}

.ds-page { font-family:'Plus Jakarta Sans',sans-serif; background:var(--c-bg); min-height:100vh; color:var(--c-ink); }

/* Hero */
.ds-hero {
  background: linear-gradient(140deg, #1a3d17 0%, #2d5e28 45%, #1e4a2a 100%);
  border-radius: var(--r-xl);
  padding: 26px 28px;
  position: relative; overflow: hidden;
  margin-bottom: 22px;
}
.ds-hero::before {
  content:''; position:absolute; inset:0;
  background:
    radial-gradient(ellipse 55% 90% at 100% 50%, rgba(90,200,80,.18) 0%, transparent 70%),
    radial-gradient(ellipse 30% 60% at 5% 100%, rgba(255,200,60,.12) 0%, transparent 70%);
}
.ds-hero > * { position:relative; z-index:1; }
.ds-hero-title { font-family:'Fraunces',serif; font-size:24px; font-weight:700; color:#fff; letter-spacing:-.4px; line-height:1.2; }
.ds-hero-sub { font-size:13px; color:rgba(255,255,255,.65); margin-top:5px; }

/* Pills */
.ds-pill { display:inline-flex; align-items:center; gap:6px; padding:5px 13px; border-radius:99px; font-size:12px; font-weight:600; border:1px solid transparent; }
.ds-pill-glass { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.2); color:rgba(255,255,255,.9); }
.ds-pill-live { background:rgba(60,220,100,.15); border-color:rgba(80,220,100,.35); color:#6ddb7a; }
.ds-pill-live .dot { width:6px; height:6px; border-radius:50%; background:#6ddb7a; animation:ds-pulse 1.5s ease-in-out infinite; }
@keyframes ds-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }

/* Tabs */
.ds-tabs { display:flex; gap:3px; background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-sm); padding:4px; width:fit-content; box-shadow:var(--sh-sm); margin-bottom:20px; }
.ds-tab { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; border-radius:6px; font-size:13px; font-weight:600; border:none; background:transparent; color:var(--c-ink-40); cursor:pointer; transition:all var(--dur) var(--ease); font-family:inherit; white-space:nowrap; }
.ds-tab.active { background:var(--c-primary); color:#fff; box-shadow:0 2px 8px rgba(45,106,42,.35); }
.ds-tab:not(.active):hover { background:var(--c-primary-xl); color:var(--c-ink-60); }

/* Cards */
.ds-card { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg); box-shadow:var(--sh-sm); transition:box-shadow var(--dur) var(--ease); }

/* Gauge */
.ds-gauge {
  background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg);
  padding:20px; position:relative; overflow:hidden;
  transition:all var(--dur) var(--ease); box-shadow:var(--sh-sm);
}
.ds-gauge:hover { box-shadow:var(--sh-md); transform:translateY(-2px); }
.ds-gauge.alert { border-color:rgba(139,26,26,.35); box-shadow:0 0 0 3px rgba(139,26,26,.12); }
.ds-gauge-accent { position:absolute; bottom:0; left:0; right:0; height:3px; border-radius:0 0 var(--r-lg) var(--r-lg); }
.ds-gauge-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
.ds-gauge-val { font-family:'Fraunces',serif; font-size:30px; font-weight:700; line-height:1; }
.ds-gauge-unit { font-size:13px; color:var(--c-ink-40); font-weight:600; margin-left:2px; }
.ds-gauge-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--c-ink-40); margin-top:5px; margin-bottom:10px; }
.ds-bar-track { height:5px; border-radius:99px; }
.ds-bar-fill { height:100%; border-radius:99px; transition:width .8s cubic-bezier(.4,0,.2,1); }

/* Select */
.ds-select-wrap { position:relative; display:inline-flex; align-items:center; }
.ds-select-wrap svg { position:absolute; right:10px; pointer-events:none; color:var(--c-ink-40); }
.ds-select {
  appearance:none; background:var(--c-surface); border:1.5px solid var(--c-border);
  border-radius:var(--r-sm); padding:9px 32px 9px 13px; font-size:13px;
  font-family:inherit; color:var(--c-ink); cursor:pointer; outline:none;
  transition:border-color var(--dur) var(--ease); min-width:180px;
}
.ds-select:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(45,106,42,.15); }
.ds-select-dark { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); color:#fff; }

/* Inputs */
.ds-input {
  background:var(--c-surface); border:1.5px solid var(--c-border); border-radius:var(--r-sm);
  padding:9px 13px; font-size:13px; font-family:inherit; color:var(--c-ink); outline:none;
  transition:border-color var(--dur) var(--ease);
}
.ds-input:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(45,106,42,.12); }
.ds-label { font-size:11px; font-weight:700; color:var(--c-ink-40); text-transform:uppercase; letter-spacing:.06em; margin-bottom:5px; display:block; }

/* Buttons */
.ds-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:var(--r-sm); border:none; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all var(--dur) var(--ease); }
.ds-btn-primary { background:var(--c-primary); color:#fff; box-shadow:0 4px 14px rgba(45,106,42,.4); }
.ds-btn-primary:hover:not(:disabled) { background:var(--c-primary-d); transform:translateY(-1px); box-shadow:0 6px 20px rgba(45,106,42,.5); }
.ds-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.ds-btn-ghost { background:transparent; border:1.5px solid var(--c-border); color:var(--c-ink-60); }
.ds-btn-ghost:hover:not(:disabled) { background:var(--c-primary-xl); border-color:var(--c-border2); }
.ds-btn-ghost:disabled { opacity:.4; cursor:not-allowed; }

/* Analysis banner */
.ds-analysis { border-radius:var(--r-lg); padding:20px 22px; border:1px solid var(--c-border); background:var(--c-surface); position:relative; overflow:hidden; transition:all .3s ease; }
.ds-analysis::before { content:''; position:absolute; top:0; left:0; bottom:0; width:4px; border-radius:99px 0 0 99px; }
.ds-analysis.Safe::before,.ds-analysis.Healthy::before { background:var(--c-primary); }
.ds-analysis.Warning::before { background:var(--c-amber); }
.ds-analysis.Danger::before,.ds-analysis.Critical::before { background:var(--c-red); }
.ds-analysis.Unknown::before { background:var(--c-border2); }

/* Status badge */
.ds-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; }
.ds-badge .bdot { width:6px; height:6px; border-radius:50%; }
.ds-badge.Safe,.ds-badge.Healthy { background:var(--c-primary-l); color:var(--c-primary); }
.ds-badge.Safe .bdot,.ds-badge.Healthy .bdot { background:var(--c-primary); }
.ds-badge.Warning { background:var(--c-amber-l); color:var(--c-amber); }
.ds-badge.Warning .bdot { background:var(--c-amber); }
.ds-badge.Danger,.ds-badge.Critical { background:var(--c-red-l); color:var(--c-red); }
.ds-badge.Danger .bdot,.ds-badge.Critical .bdot { background:var(--c-red); }
.ds-badge.Unknown { background:var(--c-surface2); color:var(--c-ink-40); }

/* Table */
.ds-table-wrap { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
.ds-table { width:100%; border-collapse:collapse; }
.ds-table thead tr { background:var(--c-primary-xl); border-bottom:1px solid var(--c-border); }
.ds-table th { padding:12px 16px; text-align:left; font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:var(--c-ink-60); white-space:nowrap; }
.ds-table td { padding:13px 16px; font-size:13px; border-bottom:1px solid #f0f5ee; }
.ds-table tbody tr:last-child td { border-bottom:none; }
.ds-table tbody tr:hover td { background:var(--c-primary-xl); }

/* Shimmer */
.ds-shimmer { background:linear-gradient(90deg,#f0f4ee 25%,#e8ede6 50%,#f0f4ee 75%); background-size:200% 100%; animation:ds-shim 1.4s infinite; border-radius:10px; }
@keyframes ds-shim { 0%{background-position:200%} 100%{background-position:-200%} }

/* Pagination */
.ds-paginate { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-top:1px solid var(--c-border); }
.ds-paginate-info { font-size:12px; color:var(--c-ink-40); font-weight:500; }

/* Auto badge */
.ds-auto-badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:4px 10px; border-radius:99px; background:var(--c-primary-l); color:var(--c-primary); }
.ds-spin { width:10px; height:10px; border:2px solid rgba(45,106,42,.25); border-top-color:var(--c-primary); border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to{transform:rotate(360deg)} }

/* Chart card */
.ds-chart-card { background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg); padding:22px; box-shadow:var(--sh-sm); }
.ds-chart-title { font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--c-ink); letter-spacing:-.2px; }

/* Fade */
.ds-fade { animation:ds-fadein .35s var(--ease) both; }
@keyframes ds-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
`;

let _injected = false;
function useDS() {
  if (!_injected && typeof document !== "undefined") {
    const el = document.createElement("style");
    el.textContent = DS;
    document.head.appendChild(el);
    _injected = true;
  }
}

/* ── Gauge themes ── */
const GT = {
  green: {
    bg: "var(--c-primary-l)",
    icon: "var(--c-primary)",
    bar: "var(--c-primary)",
    text: "var(--c-primary)",
    track: "rgba(45,106,42,.15)",
  },
  blue: {
    bg: "var(--c-blue-l)",
    icon: "var(--c-blue)",
    bar: "#2563eb",
    text: "var(--c-blue)",
    track: "rgba(37,99,235,.15)",
  },
  amber: {
    bg: "var(--c-amber-l)",
    icon: "var(--c-amber)",
    bar: "var(--c-amber)",
    text: "var(--c-amber)",
    track: "rgba(146,80,10,.15)",
  },
  rose: {
    bg: "var(--c-red-l)",
    icon: "var(--c-red)",
    bar: "var(--c-red)",
    text: "var(--c-red)",
    track: "rgba(139,26,26,.12)",
  },
};

/* ── Status map ── */
const STATUS_MAP = {
  Safe: "Safe",
  Healthy: "Safe",
  Warning: "Warning",
  "High Stress": "Warning",
  Danger: "Danger",
  Critical: "Danger",
};
const statusKey = (s) => STATUS_MAP[s] || "Unknown";

/* ── Gauge ── */
function SensorGauge({
  icon: Icon,
  label,
  value,
  unit,
  color = "green",
  max = 100,
  threshold,
}) {
  const num = parseFloat(value);
  const pct = isNaN(num) ? 0 : Math.min(100, Math.max(0, (num / max) * 100));
  const isAlert = threshold && !isNaN(num) && num > threshold;
  const t = isAlert ? GT.rose : GT[color] || GT.green;

  return (
    <div className={`ds-gauge${isAlert ? " alert" : ""}`}>
      <div className="ds-gauge-icon" style={{ background: t.bg }}>
        <Icon size={17} style={{ color: t.icon }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        <span className="ds-gauge-val" style={{ color: t.text }}>
          {value ?? "—"}
        </span>
        <span className="ds-gauge-unit">{unit}</span>
      </div>
      <div className="ds-gauge-label">{label}</div>
      <div className="ds-bar-track" style={{ background: t.track }}>
        <div
          className="ds-bar-fill"
          style={{ width: `${pct}%`, background: t.bar }}
        />
      </div>
      {isAlert && (
        <p
          style={{
            fontSize: 10,
            color: "var(--c-red)",
            marginTop: 7,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <AlertTriangle size={10} /> Above safe threshold ({threshold}
          {unit})
        </p>
      )}
      <div
        className="ds-gauge-accent"
        style={{
          background: `linear-gradient(90deg, ${t.bar}50, transparent)`,
        }}
      />
    </div>
  );
}

/* ── Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--c-border)",
        borderRadius: 12,
        boxShadow: "var(--sh-md)",
        padding: "10px 14px",
        fontSize: 12,
        minWidth: 140,
      }}
    >
      <p
        style={{
          fontWeight: 800,
          color: "var(--c-ink)",
          marginBottom: 8,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              color: p.color,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: p.color,
                display: "inline-block",
              }}
            />
            {p.name}
          </span>
          <strong style={{ color: "var(--c-ink)", fontFamily: "monospace" }}>
            {p.value ?? "—"}
          </strong>
        </div>
      ))}
    </div>
  );
};

/* ── Analysis Banner ── */
function AnalysisBanner({ latest, analyzing }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(null);

  useEffect(() => {
    if (
      latest?.analysis?.status &&
      latest.analysis.status !== prevRef.current
    ) {
      prevRef.current = latest.analysis.status;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 2500);
      return () => clearTimeout(t);
    }
  }, [latest?.analysis?.status]);

  if (!latest) return null;
  const sk = statusKey(latest.analysis?.status);
  const StatusIcon = sk === "Safe" ? CheckCircle2 : AlertTriangle;
  const iconColor =
    sk === "Safe"
      ? "var(--c-primary)"
      : sk === "Warning"
        ? "var(--c-amber)"
        : "var(--c-red)";
  const iconBg =
    sk === "Safe"
      ? "var(--c-primary-l)"
      : sk === "Warning"
        ? "var(--c-amber-l)"
        : "var(--c-red-l)";
  const textColor =
    sk === "Safe"
      ? "var(--c-primary-d)"
      : sk === "Warning"
        ? "#5a3800"
        : "#6b0000";

  return (
    <div className={`ds-analysis ${sk}`}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: iconBg,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatusIcon size={16} style={{ color: iconColor }} />
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  color: "var(--c-ink-40)",
                }}
              >
                AI Health Assessment
              </p>
              <span className={`ds-badge ${sk}`}>
                <span className="bdot" />
                {latest.analysis?.status || "Unknown"}
              </span>
              {analyzing && (
                <span className="ds-auto-badge">
                  <span className="ds-spin" /> Analyzing…
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 13.5,
                lineHeight: 1.65,
                color: textColor,
                fontWeight: 500,
              }}
            >
              {latest.analysis?.recommendation || "Awaiting analysis…"}
            </p>
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "var(--c-ink-40)",
              marginBottom: 4,
              justifyContent: "flex-end",
            }}
          >
            <Clock size={10} />{" "}
            {latest.createdAt ? timeAgo(latest.createdAt) : "—"}
          </div>
          {latest.deviceId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--c-ink-40)",
                justifyContent: "flex-end",
              }}
            >
              <Cpu size={10} />
              <code
                style={{
                  background: "var(--c-surface2)",
                  padding: "2px 7px",
                  borderRadius: 5,
                  fontSize: 10,
                  border: "1px solid var(--c-border)",
                }}
              >
                {latest.deviceId.deviceSerial}
              </code>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    latest.deviceId.status === "online"
                      ? "var(--c-primary)"
                      : "var(--c-ink-20)",
                  animation:
                    latest.deviceId.status === "online"
                      ? "ds-pulse 1.5s ease-in-out infinite"
                      : "none",
                }}
              />
            </div>
          )}
          {latest.sectorId && (
            <div
              style={{ fontSize: 11, color: "var(--c-ink-40)", marginTop: 3 }}
            >
              📍 {latest.sectorId.name} · {latest.sectorId.cropType}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── History Row ── */
function HistoryRow({ row }) {
  const sk = statusKey(row.analysis?.status);
  return (
    <tr>
      <td>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            color: "var(--c-ink-40)",
          }}
        >
          <Clock size={10} />{" "}
          {row.createdAt ? formatDateTime(row.createdAt) : "—"}
        </span>
      </td>
      <td>
        <span
          style={{
            fontWeight: 700,
            color: "var(--c-red)",
            fontFamily: "monospace",
          }}
        >
          {row.air?.temperature ?? "—"}°C
        </span>
      </td>
      <td>
        <span
          style={{
            fontWeight: 700,
            color: "var(--c-blue)",
            fontFamily: "monospace",
          }}
        >
          {row.air?.humidity ?? "—"}%
        </span>
      </td>
      <td>
        <span
          style={{
            fontWeight: 700,
            color: "var(--c-primary)",
            fontFamily: "monospace",
          }}
        >
          {row.soil?.moisture ?? "—"}%
        </span>
      </td>
      <td>
        <span style={{ fontSize: 12, color: "var(--c-ink-40)" }}>
          {row.light || "—"}
        </span>
      </td>
      <td>
        <span className={`ds-badge ${sk}`}>
          <span className="bdot" />
          {row.analysis?.status || "Unknown"}
        </span>
      </td>
      <td style={{ maxWidth: 200 }}>
        <p
          style={{
            fontSize: 12,
            color: "var(--c-ink-40)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.analysis?.recommendation || "—"}
        </p>
      </td>
      <td>
        {row.deviceId?.deviceSerial ? (
          <code
            style={{
              background: "var(--c-surface2)",
              padding: "3px 8px",
              borderRadius: 5,
              fontSize: 10.5,
              border: "1px solid var(--c-border)",
            }}
          >
            {row.deviceId.deviceSerial}
          </code>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}

/* ── Live Panel ── */
function LivePanel({ sectorId, onRegisterRefresh, onLatestChange }) {
  const [analyzing, setAnalyzing] = useState(false);
  const analyzeRef = useRef(null);
  const lastIdRef = useRef(null);

  const { data, loading, refetch } = useFetch(
    () => sensorsAPI.getLatest(sectorId || undefined),
    [sectorId],
  );
  const { data: histData, refetch: refetchHistory } = useFetch(
    () => sensorsAPI.getHistory({ sectorId: sectorId || undefined, limit: 20 }),
    [sectorId],
  );

  const latest = data?.data;
  const history = (histData?.data || []).reverse();
  const resolvedSectorId =
    latest?.sectorId?._id || latest?.sectorId || sectorId || null;

  const runAnalysis = useCallback(
    async (sid) => {
      if (!sid || analyzing) return;
      setAnalyzing(true);
      try {
        await sensorsAPI.analyze(sid);
        refetch();
        refetchHistory();
      } catch {
        /* silent */
      } finally {
        setAnalyzing(false);
      }
    },
    [analyzing, refetch, refetchHistory],
  );

  useEffect(() => {
    if (!latest) return;
    const rid = latest._id;
    if (rid && rid !== lastIdRef.current) {
      lastIdRef.current = rid;
      clearTimeout(analyzeRef.current);
      analyzeRef.current = setTimeout(() => {
        if (resolvedSectorId) runAnalysis(resolvedSectorId);
      }, 800);
    }
    return () => clearTimeout(analyzeRef.current);
  }, [latest?._id, resolvedSectorId]);

  useEffect(() => {
    if (onRegisterRefresh)
      onRegisterRefresh(() => {
        refetch();
        refetchHistory();
      });
  }, [refetch, refetchHistory, onRegisterRefresh]);
  useEffect(() => {
    if (latest && onLatestChange) onLatestChange(latest);
  }, [latest, onLatestChange]);

  const chartData = history.map((h) => ({
    time: new Date(h.createdAt).toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    Temp: h.air?.temperature,
    Humidity: h.air?.humidity,
    Soil: h.soil?.moisture,
  }));

  if (loading)
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 14,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="ds-shimmer" style={{ height: 140 }} />
        ))}
      </div>
    );

  if (!latest)
    return (
      <div
        className="ds-card"
        style={{ padding: "48px 24px", textAlign: "center" }}
      >
        <Activity
          size={32}
          style={{ color: "var(--c-ink-40)", margin: "0 auto 12px" }}
        />
        <p style={{ fontWeight: 700, color: "var(--c-ink)", marginBottom: 6 }}>
          No sensor data yet
        </p>
        <p style={{ fontSize: 13, color: "var(--c-ink-40)" }}>
          Connect an IoT device to start collecting readings.
        </p>
      </div>
    );

  const airTemp = latest.air?.temperature;
  const tempColor = airTemp > 40 ? "rose" : airTemp > 35 ? "amber" : "green";

  return (
    <div
      className="ds-fade"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <AnalysisBanner latest={latest} analyzing={analyzing} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 14,
        }}
      >
        <SensorGauge
          icon={Thermometer}
          label="Temperature"
          value={airTemp}
          unit="°C"
          color={tempColor}
          max={60}
          threshold={40}
        />
        <SensorGauge
          icon={Droplets}
          label="Air Humidity"
          value={latest.air?.humidity}
          unit="%"
          color="blue"
          max={100}
        />
        <SensorGauge
          icon={Sprout}
          label="Soil Moisture"
          value={latest.soil?.moisture}
          unit="%"
          color={latest.soil?.moisture < 20 ? "amber" : "green"}
          max={100}
        />
        <SensorGauge
          icon={Sun}
          label="Light Level"
          value={latest.light || "—"}
          unit=""
          color="amber"
          max={100}
        />
      </div>

      {chartData.length > 1 && (
        <div className="ds-chart-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h3 className="ds-chart-title">
              Live Trend — Last {chartData.length} readings
            </h3>
            <span className="ds-auto-badge">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--c-primary)",
                  animation: "ds-pulse 1.5s ease-in-out infinite",
                }}
              />{" "}
              Auto-updating
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 8, left: -12, bottom: 5 }}
            >
              <defs>
                {[
                  ["lgT", "#8b1a1a"],
                  ["lgH", "#1a4a7a"],
                  ["lgS", "#2d6a2a"],
                ].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e8ede6"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--c-ink-40)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--c-ink-40)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <ReferenceLine
                y={40}
                stroke="var(--c-amber)"
                strokeDasharray="4 2"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="Temp"
                stroke="var(--c-red)"
                strokeWidth={2.5}
                fill="url(#lgT)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Humidity"
                stroke="var(--c-blue)"
                strokeWidth={2.5}
                fill="url(#lgH)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Soil"
                stroke="var(--c-primary)"
                strokeWidth={2.5}
                fill="url(#lgS)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ── History Panel ── */
function HistoryPanel({ sectorId }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const LIMIT = 10;

  const { data, loading } = useFetch(
    () =>
      sensorsAPI.getHistory({
        sectorId: sectorId || undefined,
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit: LIMIT,
      }),
    [sectorId, status, startDate, endDate, page],
  );
  const rows = data?.data || [];
  const total = data?.totalRecords || 0;
  const pages = Math.ceil(total / LIMIT);
  const chartData = [...rows]
    .reverse()
    .map((h) => ({
      time: new Date(h.createdAt).toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Temp: h.air?.temperature,
      Humidity: h.air?.humidity,
      Soil: h.soil?.moisture,
    }));

  return (
    <div
      className="ds-fade"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div className="ds-card" style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          {[
            {
              label: "AI Status",
              content: (
                <div className="ds-select-wrap">
                  <select
                    className="ds-select"
                    style={{ minWidth: 155 }}
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All statuses</option>
                    {[
                      "Safe",
                      "Warning",
                      "High Stress",
                      "Danger",
                      "Critical",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} />
                </div>
              ),
            },
            {
              label: "From",
              content: (
                <input
                  type="date"
                  className="ds-input"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              ),
            },
            {
              label: "To",
              content: (
                <input
                  type="date"
                  className="ds-input"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              ),
            },
          ].map(({ label, content }) => (
            <div key={label}>
              <label className="ds-label">{label}</label>
              {content}
            </div>
          ))}
          {(status || startDate || endDate) && (
            <button
              className="ds-btn ds-btn-ghost"
              style={{ padding: "9px 14px", alignSelf: "flex-end" }}
              onClick={() => {
                setStatus("");
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
          <div
            style={{
              marginLeft: "auto",
              alignSelf: "flex-end",
              fontSize: 12,
              color: "var(--c-ink-40)",
              fontWeight: 600,
            }}
          >
            {total} records
          </div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="ds-chart-card">
          <h3 className="ds-chart-title" style={{ marginBottom: 16 }}>
            Trend — Page {page}
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 8, left: -12, bottom: 5 }}
            >
              <defs>
                {[
                  ["hT", "#8b1a1a"],
                  ["hH", "#1a4a7a"],
                  ["hS", "#2d6a2a"],
                ].map(([id, c]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.14} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e8ede6"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--c-ink-40)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--c-ink-40)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine
                y={40}
                stroke="var(--c-amber)"
                strokeDasharray="4 2"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="Temp"
                stroke="var(--c-red)"
                strokeWidth={2.5}
                fill="url(#hT)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Humidity"
                stroke="var(--c-blue)"
                strokeWidth={2.5}
                fill="url(#hH)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="Soil"
                stroke="var(--c-primary)"
                strokeWidth={2.5}
                fill="url(#hS)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="ds-table-wrap">
        {loading ? (
          <div
            style={{
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="ds-shimmer" style={{ height: 18 }} />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <History
              size={28}
              style={{ color: "var(--c-ink-40)", margin: "0 auto 10px" }}
            />
            <p
              style={{
                fontWeight: 700,
                color: "var(--c-ink)",
                marginBottom: 4,
              }}
            >
              No records found
            </p>
            <p style={{ fontSize: 12, color: "var(--c-ink-40)" }}>
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="ds-table">
              <thead>
                <tr>
                  {[
                    "Timestamp",
                    "Temp",
                    "Humidity",
                    "Soil",
                    "Light",
                    "Status",
                    "Recommendation",
                    "Device",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <HistoryRow key={row._id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="ds-paginate">
            <span className="ds-paginate-info">
              Page {page} of {pages} · {total} records
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="ds-btn ds-btn-ghost"
                style={{ padding: "7px 14px", fontSize: 12 }}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <button
                className="ds-btn ds-btn-ghost"
                style={{ padding: "7px 14px", fontSize: 12 }}
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Analytics Panel ── */
function AnalyticsPanel({ sectorId }) {
  const { data, loading } = useFetch(
    () =>
      sectorId
        ? sensorsAPI.getAnalytics(sectorId)
        : Promise.resolve({ data: null }),
    [sectorId],
  );
  const stats = data?.data;

  if (!sectorId)
    return (
      <div
        className="ds-card"
        style={{ padding: "48px 24px", textAlign: "center" }}
      >
        <BarChart2
          size={32}
          style={{ color: "var(--c-ink-40)", margin: "0 auto 12px" }}
        />
        <p style={{ fontWeight: 700, color: "var(--c-ink)", marginBottom: 6 }}>
          Select a sector
        </p>
        <p style={{ fontSize: 13, color: "var(--c-ink-40)" }}>
          Choose a sector to view today's analytics.
        </p>
      </div>
    );

  if (loading)
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="ds-shimmer" style={{ height: 100 }} />
        ))}
      </div>
    );

  if (!stats || stats.message)
    return (
      <div
        className="ds-card"
        style={{ padding: "48px 24px", textAlign: "center" }}
      >
        <BarChart2
          size={32}
          style={{ color: "var(--c-ink-40)", margin: "0 auto 12px" }}
        />
        <p style={{ fontWeight: 700, color: "var(--c-ink)" }}>No data today</p>
      </div>
    );

  const items = [
    {
      label: "Avg Temperature",
      value: `${stats.avgAirTemp?.toFixed(1) ?? "—"}°C`,
      icon: Thermometer,
      color: "var(--c-red)",
      bg: "var(--c-red-l)",
    },
    {
      label: "Avg Soil Moisture",
      value: `${stats.avgSoilMoist?.toFixed(1) ?? "—"}%`,
      icon: Sprout,
      color: "var(--c-primary)",
      bg: "var(--c-primary-l)",
    },
    {
      label: "Readings Today",
      value: stats.readingsCount ?? "—",
      icon: Activity,
      color: "var(--c-blue)",
      bg: "var(--c-blue-l)",
    },
  ];

  const tip =
    stats.avgAirTemp > 38
      ? "⚠️ Temperature is above recommended range — consider irrigation or shading."
      : stats.avgSoilMoist < 25
        ? "⚠️ Soil moisture is low — consider scheduling irrigation."
        : "✅ All conditions within normal range today.";

  return (
    <div
      className="ds-fade"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
          gap: 14,
        }}
      >
        {items.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="ds-card"
            style={{
              padding: 20,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--c-ink)",
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--c-ink-40)",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="ds-card"
        style={{
          padding: 22,
          borderLeft: "4px solid var(--c-primary)",
          background: "var(--c-primary-xl)",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "var(--c-primary)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={16} style={{ color: "#fff" }} />
          </div>
          <div>
            <p
              style={{
                fontWeight: 800,
                fontSize: 14,
                color: "var(--c-ink)",
                marginBottom: 5,
              }}
            >
              Today's Summary
            </p>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--c-ink-60)",
              }}
            >
              {stats.readingsCount} readings collected today. Average
              temperature <strong>{stats.avgAirTemp?.toFixed(1)}°C</strong> and
              average soil moisture{" "}
              <strong>{stats.avgSoilMoist?.toFixed(1)}%</strong>. {tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const TABS = [
  { id: "live", label: "Live Reading", icon: Activity },
  { id: "history", label: "History", icon: History },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

export default function Sensors() {
  useDS();
  const [tab, setTab] = useState("live");
  const [sectorId, setSectorId] = useState("");
  const [manualAnalyzing, setManualAnalyzing] = useState(false);
  const [refreshLive, setRefreshLive] = useState(null);
  const [liveLatest, setLiveLatest] = useState(null);

  const { connected } = useSocket();
  const { data: sectorsData } = useFetch(() => sectorsAPI.getAll(), []);
  const sectors = sectorsData?.data || [];
  const resolvedForManual =
    liveLatest?.sectorId?._id || liveLatest?.sectorId || sectorId || null;

  const handleManualAnalyze = useCallback(async () => {
    if (!resolvedForManual)
      return toast.error("No sector detected yet — waiting for a reading");
    setManualAnalyzing(true);
    try {
      await sensorsAPI.analyze(resolvedForManual);
      toast.success("AI Analysis complete!");
      refreshLive?.();
    } catch (e) {
      toast.error(e.response?.data?.message || "Analysis failed");
    } finally {
      setManualAnalyzing(false);
    }
  }, [resolvedForManual, refreshLive]);

  return (
    <div className="ds-page" style={{ padding: "24px 20px 60px" }}>
      {/* Hero */}
      <div className="ds-hero">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h2 className="ds-hero-title">Sensor Readings</h2>
            <p className="ds-hero-sub">
              Real-time monitoring · AI analysis runs automatically on every new
              reading
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {connected ? (
                <span className="ds-pill ds-pill-live">
                  <span className="dot" /> Live monitoring active
                </span>
              ) : (
                <span className="ds-pill ds-pill-glass">
                  <WifiOff size={11} /> Offline mode
                </span>
              )}
              {liveLatest?.sectorId && (
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,.7)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,.3)" }}>·</span>
                  📍 {liveLatest.sectorId.name ?? "—"}
                  {liveLatest.sectorId.cropType && (
                    <span
                      style={{
                        background: "rgba(45,106,42,.3)",
                        color: "#8fefaa",
                        padding: "2px 9px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {liveLatest.sectorId.cropType}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            {tab !== "live" && (
              <div className="ds-select-wrap">
                <select
                  className="ds-select ds-select-dark"
                  value={sectorId}
                  onChange={(e) => setSectorId(e.target.value)}
                >
                  <option value="" style={{ color: "#000" }}>
                    All sectors
                  </option>
                  {sectors.map((s) => (
                    <option key={s._id} value={s._id} style={{ color: "#000" }}>
                      {s.name} — {s.cropType}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  style={{ color: "rgba(255,255,255,.75)" }}
                />
              </div>
            )}
            <button
              className="ds-btn ds-btn-primary"
              onClick={handleManualAnalyze}
              disabled={manualAnalyzing || !resolvedForManual}
            >
              {manualAnalyzing ? (
                <span className="ds-spin" />
              ) : (
                <>
                  <Zap size={14} /> Re-analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ds-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`ds-tab${tab === id ? " active" : ""}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div key={tab}>
        {tab === "live" && (
          <LivePanel
            sectorId={sectorId}
            onRegisterRefresh={setRefreshLive}
            onLatestChange={setLiveLatest}
          />
        )}
        {tab === "history" && <HistoryPanel sectorId={sectorId} />}
        {tab === "analytics" && <AnalyticsPanel sectorId={sectorId} />}
      </div>
    </div>
  );
}
