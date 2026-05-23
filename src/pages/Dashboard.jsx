import { Link } from "react-router-dom";
import {
  Layers,
  Cpu,
  Users,
  AlertTriangle,
  TrendingUp,
  Wifi,
  Leaf,
  Activity,
  ImageIcon,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Wheat,
  Clock,
  Shield,
  Sprout,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { CardSkeleton } from "../components/ui/Skeleton";
import { timeAgo } from "../utils/helpers";

/* ─────────────────────────── Design System ──────────────────────────── */
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
  --c-purple:     #5a2d82;
  --c-purple-l:   #f4eeff;

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

/* ── Fonts ── */
.ds-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--c-bg);
  min-height: 100vh;
  color: var(--c-ink);
}

/* ── Page header ── */
.ds-hero {
  background: linear-gradient(140deg, #1a3d17 0%, #2d5e28 45%, #1e4a2a 100%);
  border-radius: var(--r-xl);
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
  margin-bottom: 6px;
}
.ds-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 90% at 100% 50%, rgba(90,200,80,.18) 0%, transparent 70%),
    radial-gradient(ellipse 30% 60% at 5% 100%, rgba(255,200,60,.12) 0%, transparent 70%);
}
.ds-hero::after {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(80,200,70,.12) 0%, transparent 70%);
}
.ds-hero > * { position: relative; z-index: 1; }

.ds-greeting {
  font-family: 'Fraunces', serif;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -.5px;
}
.ds-greeting-sub {
  font-size: 13.5px;
  color: rgba(255,255,255,.65);
  margin-top: 6px;
  font-weight: 400;
}

/* ── Pill badges ── */
.ds-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .01em;
  border: 1px solid transparent;
  transition: all var(--dur) var(--ease);
}
.ds-pill-glass {
  background: rgba(255,255,255,.12);
  border-color: rgba(255,255,255,.2);
  color: rgba(255,255,255,.9);
  backdrop-filter: blur(8px);
}
.ds-pill-live {
  background: rgba(60,220,100,.15);
  border-color: rgba(80,220,100,.35);
  color: #6ddb7a;
}
.ds-pill-live .dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #6ddb7a;
  animation: ds-pulse 1.5s ease-in-out infinite;
}
@keyframes ds-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }

.ds-pill-offline {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.15);
  color: rgba(255,255,255,.5);
}

/* ── Stat cards ── */
.ds-stat {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: var(--sh-sm);
  transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.ds-stat:hover {
  box-shadow: var(--sh-md);
  transform: translateY(-1px);
}
.ds-stat-icon {
  width: 42px; height: 42px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ds-stat-val {
  font-family: 'Fraunces', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--c-ink);
  line-height: 1;
  letter-spacing: -.5px;
}
.ds-stat-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--c-ink-40);
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-top: 4px;
}
.ds-stat-sub {
  font-size: 11.5px;
  color: var(--c-ink-40);
  margin-top: 2px;
  font-weight: 400;
}

/* ── Progress bar in device health ── */
.ds-health-bar {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 18px 20px;
  box-shadow: var(--sh-sm);
}
.ds-track {
  height: 6px;
  background: var(--c-border);
  border-radius: 99px;
  overflow: hidden;
  margin-top: 10px;
}
.ds-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .9s cubic-bezier(.4,0,.2,1);
}

/* ── Card ── */
.ds-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
  transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.ds-card:hover { box-shadow: var(--sh-md); }

/* ── Sector cards ── */
.ds-sector-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 18px;
  box-shadow: var(--sh-sm);
  transition: all var(--dur) var(--ease);
  position: relative;
  overflow: hidden;
}
.ds-sector-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--c-primary), #6bd45e);
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
}
.ds-sector-card:hover {
  border-color: var(--c-border2);
  box-shadow: var(--sh-md);
  transform: translateY(-2px);
}
.ds-sector-card:hover::before { opacity: 1; }

/* ── Crop chip ── */
.ds-crop {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}

/* ── Notification items ── */
.ds-notif {
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid var(--c-border);
  transition: background var(--dur) var(--ease);
}
.ds-notif:last-child { border-bottom: none; }
.ds-notif:hover { background: var(--c-primary-xl); }

/* ── Quick action ── */
.ds-action {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--sh-sm);
  transition: all var(--dur) var(--ease);
  text-decoration: none;
  color: inherit;
}
.ds-action:hover {
  border-color: var(--c-primary);
  box-shadow: var(--sh-md);
  transform: translateY(-1px);
  background: var(--c-primary-xl);
}
.ds-action-icon {
  width: 38px; height: 38px;
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Section heading ── */
.ds-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.ds-section-title {
  font-family: 'Fraunces', serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--c-ink);
  letter-spacing: -.2px;
}
.ds-section-link {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--c-primary);
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  transition: color var(--dur) var(--ease);
}
.ds-section-link:hover { color: var(--c-primary-d); }

/* ── Empty state ── */
.ds-empty {
  text-align: center;
  padding: 40px 24px;
  border: 1.5px dashed var(--c-border2);
  border-radius: var(--r-lg);
  background: var(--c-primary-xl);
}

/* ── Btn primary ── */
.ds-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: var(--r-sm);
  border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}
.ds-btn-primary {
  background: var(--c-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(45,106,42,.35);
}
.ds-btn-primary:hover {
  background: var(--c-primary-d);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(45,106,42,.45);
}

/* ── Sector worker dashboard banner ── */
.ds-sector-banner {
  border-radius: var(--r-lg);
  padding: 22px 24px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  box-shadow: var(--sh-sm);
  border-left: 4px solid var(--c-primary);
}
.ds-sector-banner.critical { border-left-color: var(--c-red); background: var(--c-red-l); }

/* ── Scan card ── */
.ds-scan-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all var(--dur) var(--ease);
}
.ds-scan-card:hover {
  border-color: var(--c-border2);
  background: var(--c-primary-xl);
}

/* ── Fade in ── */
.ds-fade { animation: ds-fadein .35s var(--ease) both; }
@keyframes ds-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
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

/* ── Helpers ── */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const COLOR_PALETTES = {
  green: { icon: "var(--c-primary)", bg: "var(--c-primary-l)" },
  amber: { icon: "var(--c-amber)", bg: "var(--c-amber-l)" },
  red: { icon: "var(--c-red)", bg: "var(--c-red-l)" },
  blue: { icon: "var(--c-blue)", bg: "var(--c-blue-l)" },
  purple: { icon: "var(--c-purple)", bg: "var(--c-purple-l)" },
};

const CROP_COLORS = {
  Corn: { bg: "#fff8e0", color: "#7a5200", border: "#ffe8a0" },
  Tomato: { bg: "#fff0ee", color: "#7a1f1f", border: "#ffd0cc" },
  Pepper: { bg: "#fff4ec", color: "#7a3a00", border: "#ffddbb" },
  Mint: {
    bg: "var(--c-primary-l)",
    color: "var(--c-primary)",
    border: "var(--c-border2)",
  },
  Other: { bg: "#f0f4ef", color: "#4a5e42", border: "#c9d8c1" },
};

/* ── StatCard ── */
function StatCard({ icon: Icon, label, value, sub, color = "green" }) {
  const p = COLOR_PALETTES[color] || COLOR_PALETTES.green;
  return (
    <div className="ds-stat">
      <div>
        <div className="ds-stat-icon" style={{ background: p.bg }}>
          <Icon size={18} style={{ color: p.icon }} />
        </div>
      </div>
      <div>
        <p className="ds-stat-val">{value ?? "—"}</p>
        <p className="ds-stat-label">{label}</p>
        {sub && <p className="ds-stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

/* ── SectorCard ── */
function SectorCard({ sector }) {
  const crop = sector?.cropType || "Other";
  const cc = CROP_COLORS[crop] || CROP_COLORS.Other;
  return (
    <div className="ds-sector-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div
          className="ds-stat-icon"
          style={{
            background: "var(--c-primary-l)",
            width: 36,
            height: 36,
            borderRadius: 10,
          }}
        >
          <Layers size={15} style={{ color: "var(--c-primary)" }} />
        </div>
        <span
          className="ds-crop"
          style={{
            background: cc.bg,
            color: cc.color,
            border: `1px solid ${cc.border}`,
          }}
        >
          <Wheat size={10} /> {crop}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "var(--c-ink)",
          marginBottom: 10,
        }}
      >
        {sector?.name}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {sector?.location && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--c-ink-40)",
            }}
          >
            <MapPin size={10} /> {sector.location}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
          }}
        >
          <Users size={10} style={{ color: "var(--c-ink-40)" }} />
          {sector?.assignedWorker ? (
            <span style={{ color: "var(--c-primary)", fontWeight: 600 }}>
              {sector.assignedWorker.firstName} {sector.assignedWorker.lastName}
            </span>
          ) : (
            <span style={{ color: "var(--c-ink-20)" }}>Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── NotificationItem ── */
function NotificationItem({ n }) {
  const isDis = n?.type === "disease";
  return (
    <div className="ds-notif">
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          marginTop: 6,
          flexShrink: 0,
          background: isDis ? "var(--c-red)" : "var(--c-amber)",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "var(--c-ink)",
            marginBottom: 2,
          }}
        >
          {n?.title}
        </p>
        <p
          style={{
            fontSize: 11.5,
            color: "var(--c-ink-40)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {n?.message}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 5,
          }}
        >
          {n?.sectorId?.name && (
            <span style={{ fontSize: 10.5, color: "var(--c-ink-40)" }}>
              📍 {n.sectorId.name}
            </span>
          )}
          {n?.createdAt && (
            <span
              style={{
                fontSize: 10.5,
                color: "var(--c-ink-20)",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Clock size={9} /> {timeAgo(n.createdAt)}
            </span>
          )}
        </div>
      </div>
      {!n?.isRead && (
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            flexShrink: 0,
            marginTop: 6,
            background: isDis ? "var(--c-red)" : "var(--c-amber)",
          }}
        />
      )}
    </div>
  );
}

/* ── DiagnosticCard ── */
function DiagnosticCard({ img }) {
  const isInfected = img?.analysisResult?.status === "Infected";
  return (
    <div className="ds-scan-card">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid var(--c-border)",
          background: "var(--c-bg)",
        }}
      >
        <img
          src={img?.imageUrl || "https://placehold.co/150?text=—"}
          alt="scan"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: isInfected ? "var(--c-red)" : "var(--c-primary)",
            marginBottom: 2,
          }}
        >
          {img?.analysisResult?.diseaseName ||
            (isInfected ? "Infected" : "Healthy")}
        </p>
        {img?.analysisResult?.confidence > 0 && (
          <p style={{ fontSize: 10.5, color: "var(--c-ink-40)" }}>
            {Math.round(img.analysisResult.confidence)}% confidence
          </p>
        )}
        {img?.createdAt && (
          <p style={{ fontSize: 10.5, color: "var(--c-ink-20)", marginTop: 2 }}>
            {timeAgo(img.createdAt)}
          </p>
        )}
      </div>
      <span
        style={{
          padding: "3px 10px",
          borderRadius: 99,
          fontSize: 10.5,
          fontWeight: 700,
          flexShrink: 0,
          background: isInfected ? "var(--c-red-l)" : "var(--c-primary-l)",
          color: isInfected ? "var(--c-red)" : "var(--c-primary)",
        }}
      >
        {img?.analysisResult?.status || "—"}
      </span>
    </div>
  );
}

/* ── OwnerDashboard ── */
function OwnerDashboard({ d }) {
  const { summary = {}, sectors = [], notifications = [] } = d;
  const devPct = summary.totalDevices
    ? Math.round(((summary.onlineDevices ?? 0) / summary.totalDevices) * 100)
    : 0;
  const barColor =
    devPct === 100
      ? "var(--c-primary)"
      : devPct > 0
        ? "var(--c-amber)"
        : "var(--c-red)";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 28 }}
      className="ds-fade"
    >
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14,
        }}
      >
        <StatCard
          icon={Layers}
          label="Total Sectors"
          value={summary?.totalSectors}
          color="green"
        />
        <StatCard
          icon={Users}
          label="Workers"
          value={summary?.totalWorkers}
          color="blue"
        />
        <StatCard
          icon={Cpu}
          label="Devices"
          value={summary?.totalDevices}
          sub={`${summary?.onlineDevices ?? 0} online`}
          color={
            summary?.onlineDevices < summary?.totalDevices ? "amber" : "green"
          }
        />
        <StatCard
          icon={AlertTriangle}
          label="Disease Alerts"
          value={summary?.infectedPlantsAlerts}
          color={summary?.infectedPlantsAlerts > 0 ? "red" : "green"}
          sub={
            summary?.infectedPlantsAlerts > 0 ? "Needs attention" : "All clear"
          }
        />
      </div>

      {/* Device health */}
      {summary?.totalDevices > 0 && (
        <div className="ds-health-bar">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Cpu size={14} style={{ color: "var(--c-ink-40)" }} />
              <span
                style={{ fontSize: 13, fontWeight: 700, color: "var(--c-ink)" }}
              >
                Device Health
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                color: "var(--c-ink-40)",
                fontWeight: 600,
              }}
            >
              {devPct}% online
            </span>
          </div>
          <div className="ds-track">
            <div
              className="ds-fill"
              style={{ width: `${devPct}%`, background: barColor }}
            />
          </div>
        </div>
      )}

      {/* Sectors + Notifications */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div>
          <div className="ds-section-head">
            <span className="ds-section-title">Farm Sectors</span>
            <Link to="/sectors" className="ds-section-link">
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          {sectors.length === 0 ? (
            <div className="ds-empty">
              <Sprout
                size={28}
                style={{ color: "var(--c-primary)", margin: "0 auto 10px" }}
              />
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--c-ink-60)",
                  marginBottom: 12,
                }}
              >
                No sectors yet.
              </p>
              <Link to="/sectors">
                <button className="ds-btn ds-btn-primary">
                  <Layers size={13} /> Create first sector
                </button>
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
            >
              {sectors.slice(0, 6).map((s) => (
                <SectorCard key={s._id} sector={s} />
              ))}
              {sectors.length > 6 && (
                <Link
                  to="/sectors"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--c-primary)",
                    border: "1.5px dashed var(--c-border2)",
                    borderRadius: "var(--r-lg)",
                    minHeight: 110,
                    textDecoration: "none",
                    background: "var(--c-primary-xl)",
                    transition: "all var(--dur) var(--ease)",
                  }}
                >
                  +{sectors.length - 6} more <ArrowRight size={13} />
                </Link>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="ds-section-head">
            <span className="ds-section-title">Recent Alerts</span>
            <Link to="/notifications" className="ds-section-link">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="ds-card" style={{ overflow: "hidden" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <CheckCircle2
                  size={24}
                  style={{ color: "var(--c-primary)", margin: "0 auto 8px" }}
                />
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--c-ink-60)",
                  }}
                >
                  All clear!
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--c-ink-40)",
                    marginTop: 4,
                  }}
                >
                  No recent alerts
                </p>
              </div>
            ) : (
              notifications.map((n) => <NotificationItem key={n._id} n={n} />)
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="ds-section-head">
          <span className="ds-section-title">Quick Actions</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {[
            {
              to: "/sectors",
              icon: Layers,
              label: "Add Sector",
              color: "var(--c-primary)",
              bg: "var(--c-primary-l)",
            },
            {
              to: "/devices",
              icon: Cpu,
              label: "Add Device",
              color: "var(--c-blue)",
              bg: "var(--c-blue-l)",
            },
            {
              to: "/workers",
              icon: Users,
              label: "Add Worker",
              color: "var(--c-purple)",
              bg: "var(--c-purple-l)",
            },
            {
              to: "/reports",
              icon: TrendingUp,
              label: "View Reports",
              color: "var(--c-amber)",
              bg: "var(--c-amber-l)",
            },
          ].map(({ to, icon: Icon, label, color, bg }) => (
            <Link key={to} to={to} className="ds-action">
              <div className="ds-action-icon" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--c-ink)",
                  flex: 1,
                }}
              >
                {label}
              </span>
              <ArrowRight
                size={13}
                style={{ color: "var(--c-ink-20)", flexShrink: 0 }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── WorkerDashboard ── */
function WorkerDashboard({ d }) {
  const {
    sectorInfo,
    sensorInsights,
    recentDiagnostics = [],
    healthStatus,
    notifications = [],
  } = d;
  const noReadings =
    !sensorInsights ||
    sensorInsights === "لا توجد قراءات" ||
    (!sensorInsights.air && !sensorInsights.soil);
  const isCritical = healthStatus?.isSystemCritical;
  const lastDiag = healthStatus?.lastDiagnostic;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
      className="ds-fade"
    >
      {/* Sector banner */}
      <div className={`ds-sector-banner${isCritical ? " critical" : ""}`}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              flexShrink: 0,
              background: isCritical ? "var(--c-red-l)" : "var(--c-primary-l)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield
              size={17}
              style={{
                color: isCritical ? "var(--c-red)" : "var(--c-primary)",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                color: "var(--c-ink-40)",
                marginBottom: 4,
              }}
            >
              Your Assigned Sector
            </p>
            <h3
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--c-ink)",
                letterSpacing: "-.3px",
                marginBottom: 8,
              }}
            >
              {sectorInfo?.name || "Unassigned Sector"}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 700,
                  background: isCritical
                    ? "var(--c-red-l)"
                    : "var(--c-primary-l)",
                  color: isCritical ? "var(--c-red)" : "var(--c-primary)",
                  border: `1px solid ${isCritical ? "#ffd0cc" : "var(--c-border2)"}`,
                }}
              >
                {isCritical ? "⚠ Critical" : "✓ Normal"}
              </span>
              {sectorInfo?.cropType && (
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#f0f4ef",
                    color: "var(--c-ink-60)",
                    border: "1px solid var(--c-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Wheat size={9} /> {sectorInfo.cropType}
                </span>
              )}
              {sectorInfo?.location && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--c-ink-40)",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <MapPin size={10} /> {sectorInfo.location}
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p
              style={{
                fontSize: 10.5,
                color: "var(--c-ink-40)",
                marginBottom: 4,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Last Diagnosis
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Fraunces', serif",
                color:
                  lastDiag === "Infected"
                    ? "var(--c-red)"
                    : lastDiag === "Healthy"
                      ? "var(--c-primary)"
                      : "var(--c-ink-40)",
              }}
            >
              {lastDiag || "No Data"}
            </p>
          </div>
        </div>
      </div>

      {/* Sensor stats */}
      {!noReadings && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <StatCard
            icon={TrendingUp}
            label="Temperature"
            value={
              sensorInsights?.air?.temperature != null
                ? `${sensorInsights.air.temperature}°C`
                : "—"
            }
            color={
              sensorInsights?.air?.temperature > 40
                ? "red"
                : sensorInsights?.air?.temperature > 35
                  ? "amber"
                  : "green"
            }
            sub={
              sensorInsights?.air?.temperature > 40
                ? "⚠ Above safe limit"
                : "Normal range"
            }
          />
          <StatCard
            icon={Wifi}
            label="Air Humidity"
            value={
              sensorInsights?.air?.humidity != null
                ? `${sensorInsights.air.humidity}%`
                : "—"
            }
            color={sensorInsights?.air?.humidity < 30 ? "amber" : "blue"}
            sub={`Light: ${sensorInsights?.light || "—"}`}
          />
          <StatCard
            icon={Layers}
            label="Soil Moisture"
            value={
              sensorInsights?.soil?.moisture != null
                ? `${sensorInsights.soil.moisture}%`
                : "—"
            }
            color={
              sensorInsights?.soil?.moisture < 10
                ? "red"
                : sensorInsights?.soil?.moisture < 20
                  ? "amber"
                  : "green"
            }
            sub={
              sensorInsights?.soil?.moisture < 20
                ? "⚠ Low — check irrigation"
                : "Adequate"
            }
          />
          <StatCard
            icon={Activity}
            label="Status"
            value={isCritical ? "Critical" : "Stable"}
            color={isCritical ? "red" : "green"}
          />
        </div>
      )}

      {noReadings && (
        <div className="ds-empty">
          <Activity
            size={28}
            style={{ color: "var(--c-ink-40)", margin: "0 auto 10px" }}
          />
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--c-ink-60)",
              marginBottom: 4,
            }}
          >
            No sensor readings yet
          </p>
          <p
            style={{ fontSize: 12, color: "var(--c-ink-40)", marginBottom: 14 }}
          >
            Waiting for IoT device data from your sector
          </p>
          <Link to="/sensors">
            <button className="ds-btn ds-btn-primary">
              <Activity size={13} /> Go to Sensors
            </button>
          </Link>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        {/* Recent Scans */}
        <div>
          <div className="ds-section-head">
            <span className="ds-section-title">Recent Plant Scans</span>
            <Link to="/images" className="ds-section-link">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentDiagnostics.length === 0 ? (
              <div className="ds-empty">
                <ImageIcon
                  size={24}
                  style={{ color: "var(--c-ink-40)", margin: "0 auto 10px" }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--c-ink-60)",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  No scans yet
                </p>
                <Link to="/images">
                  <button className="ds-btn ds-btn-primary">
                    <ImageIcon size={12} /> Upload Plant Photo
                  </button>
                </Link>
              </div>
            ) : (
              recentDiagnostics.map((img) => (
                <DiagnosticCard key={img._id} img={img} />
              ))
            )}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div className="ds-section-head">
            <span className="ds-section-title">My Alerts</span>
            <Link to="/notifications" className="ds-section-link">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="ds-card" style={{ overflow: "hidden" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <CheckCircle2
                  size={22}
                  style={{ color: "var(--c-primary)", margin: "0 auto 8px" }}
                />
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--c-ink-60)",
                  }}
                >
                  All clear!
                </p>
              </div>
            ) : (
              notifications.map((n) => <NotificationItem key={n._id} n={n} />)
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="ds-section-head">
          <span className="ds-section-title">Quick Actions</span>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[
            {
              to: "/sensors",
              icon: Activity,
              label: "Check Sensors",
              color: "var(--c-primary)",
              bg: "var(--c-primary-l)",
            },
            {
              to: "/images",
              icon: ImageIcon,
              label: "Scan a Plant",
              color: "var(--c-blue)",
              bg: "var(--c-blue-l)",
            },
          ].map(({ to, icon: Icon, label, color, bg }) => (
            <Link key={to} to={to} className="ds-action">
              <div className="ds-action-icon" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--c-ink)",
                  flex: 1,
                }}
              >
                {label}
              </span>
              <ArrowRight size={13} style={{ color: "var(--c-ink-20)" }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function Dashboard() {
  useDS();
  const { user } = useAuth();
  const { connected } = useSocket();
  const { data, loading } = useFetch(dashboardAPI.get);
  const d = data?.data;

  if (loading)
    return (
      <div className="ds-page" style={{ padding: "28px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );

  const isOwner = user?.role === "owner";

  if (!isOwner && !d?.sectorInfo)
    return (
      <div
        className="ds-page"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            background: "var(--c-amber-l)",
            border: "1px solid #ffd08a",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "ds-fadein .4s ease",
          }}
        >
          <AlertTriangle size={26} style={{ color: "var(--c-amber)" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--c-ink)",
              marginBottom: 8,
            }}
          >
            No sector assigned
          </h3>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--c-ink-40)",
              maxWidth: 320,
              lineHeight: 1.6,
            }}
          >
            Your farm owner hasn't assigned you to a sector yet. Please contact
            them to update your setup.
          </p>
        </div>
      </div>
    );

  return (
    <div className="ds-page" style={{ padding: "24px 20px 60px" }}>
      {/* Hero Header */}
      <div className="ds-hero" style={{ marginBottom: 24 }}>
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
            <h2 className="ds-greeting">
              {greeting()}, {user?.firstName || "User"} 👋
            </h2>
            <p className="ds-greeting-sub">
              {isOwner
                ? "Here's a complete overview of your farm."
                : `Monitoring sector: ${d?.sectorInfo?.name || "—"}`}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span className="ds-pill ds-pill-glass">
              <Leaf size={12} /> {user?.role}
            </span>
            <span
              className={`ds-pill ${connected ? "ds-pill-live" : "ds-pill-offline"}`}
            >
              {connected ? (
                <>
                  <span className="dot" /> Live
                </>
              ) : (
                "Offline"
              )}
            </span>
          </div>
        </div>
      </div>

      {isOwner && d ? (
        <OwnerDashboard d={d} />
      ) : !isOwner && d ? (
        <WorkerDashboard d={d} />
      ) : null}
    </div>
  );
}
