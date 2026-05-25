import { useState, useRef } from "react";
import {
  Upload,
  ImageIcon,
  Trash2,
  ChevronDown,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  Calendar,
  Activity,
  User,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Leaf,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
// 🔥 أضفنا devicesAPI هنا عشان ننده على جلب الأجهزة
import { imagesAPI, sectorsAPI, devicesAPI } from "../services/api";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { timeAgo } from "../utils/helpers";
import toast from "react-hot-toast";

/* ─── Design System CSS ─────────────────────────────────────────────────── */
const DS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
:root {
  --c-bg:#f2f5f0; --c-surface:#fff; --c-surface2:#f8faf6;
  --c-border:#dde5d8; --c-border2:#c9d8c1;
  --c-ink:#141d10; --c-ink-60:#4a5e42; --c-ink-40:#7a9170; --c-ink-20:#b8cdb0;
  --c-primary:#2d6a2a; --c-primary-d:#1e4a1c; --c-primary-l:#eaf3e7; --c-primary-xl:#f4faf2;
  --c-amber:#92500a; --c-amber-l:#fff4e0;
  --c-red:#8b1a1a; --c-red-l:#fef0f0; --c-red-b:#f0a0a0;
  --c-blue:#1a4a7a; --c-blue-l:#edf4ff;
  --c-warn:#b45309; --c-warn-l:#fffbeb; --c-warn-b:#fcd34d;
  --r-sm:8px; --r-md:14px; --r-lg:20px; --r-xl:28px;
  --sh-sm:0 1px 3px rgba(20,29,16,.06),0 1px 2px rgba(20,29,16,.04);
  --sh-md:0 4px 16px rgba(20,29,16,.09),0 1px 4px rgba(20,29,16,.05);
  --sh-lg:0 12px 40px rgba(20,29,16,.12),0 2px 8px rgba(20,29,16,.06);
  --sh-xl:0 24px 64px rgba(20,29,16,.18),0 4px 16px rgba(20,29,16,.08);
  --ease:cubic-bezier(.4,0,.2,1); --dur:220ms;
}
.ds-page{font-family:'Plus Jakarta Sans',sans-serif;background:var(--c-bg);min-height:100vh;color:var(--c-ink);}
.ds-hero{background:linear-gradient(140deg,#1a3d17 0%,#2d5e28 45%,#1e4a2a 100%);border-radius:var(--r-xl);padding:26px 28px;position:relative;overflow:hidden;margin-bottom:22px;}
.ds-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 90% at 100% 50%,rgba(90,200,80,.18) 0%,transparent 70%),radial-gradient(ellipse 30% 60% at 5% 100%,rgba(255,200,60,.12) 0%,transparent 70%);}
.ds-hero>*{position:relative;z-index:1;}
.ds-hero-title{font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:-.4px;line-height:1.2;}
.ds-hero-sub{font-size:13px;color:rgba(255,255,255,.65);margin-top:5px;}
.ds-stat{background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-lg);padding:18px 20px;box-shadow:var(--sh-sm);display:flex;align-items:center;gap:14px;transition:all var(--dur) var(--ease);}
.ds-stat:hover{box-shadow:var(--sh-md);transform:translateY(-1px);}
.ds-stat-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ds-stat-val{font-family:'Fraunces',serif;font-size:30px;font-weight:700;color:var(--c-ink);line-height:1;letter-spacing:-.5px;}
.ds-stat-label{font-size:11.5px;font-weight:700;color:var(--c-ink-40);text-transform:uppercase;letter-spacing:.06em;margin-top:3px;}
/* Upload zone */
.ds-upload{background:var(--c-surface);border:2px dashed var(--c-border2);border-radius:var(--r-xl);padding:36px 24px;display:flex;flex-direction:column;align-items:center;gap:16px;cursor:pointer;transition:all var(--dur) var(--ease);box-shadow:var(--sh-sm);}
.ds-upload:hover,.ds-upload.drag{border-color:var(--c-primary);background:var(--c-primary-xl);}
.ds-upload.blocked{cursor:not-allowed;opacity:.75;border-color:var(--c-warn-b);background:var(--c-warn-l);}
.ds-upload-icon{width:60px;height:60px;border-radius:18px;background:var(--c-primary-l);border:1.5px solid var(--c-border2);display:flex;align-items:center;justify-content:center;transition:all var(--dur) var(--ease);}
.ds-upload:not(.blocked):hover .ds-upload-icon,.ds-upload.drag .ds-upload-icon{background:var(--c-primary);border-color:var(--c-primary);}
.ds-upload:not(.blocked):hover .ds-upload-icon svg,.ds-upload.drag .ds-upload-icon svg{color:#fff !important;}
/* Sector selector box */
.ds-sector-required{background:var(--c-warn-l);border:2px solid var(--c-warn-b);border-radius:var(--r-lg);padding:18px 22px;display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;}
/* Card */
.ds-card-img{background:var(--c-surface);border:1px solid var(--c-border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--sh-sm);cursor:zoom-in;transition:all var(--dur) var(--ease);position:relative;}
.ds-card-img:hover{box-shadow:var(--sh-md);transform:translateY(-2px);}
.ds-card-img::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-lg) var(--r-lg) 0 0;z-index:2;opacity:0;transition:opacity var(--dur) var(--ease);}
.ds-card-img:hover::before{opacity:1;}
.ds-card-img.infected::before{background:linear-gradient(90deg,var(--c-red),#e05555);}
.ds-card-img.healthy::before{background:linear-gradient(90deg,var(--c-primary),#5ecc55);}
.ds-card-img-thumb{height:168px;overflow:hidden;position:relative;background:#0d1a0b;}
.ds-card-img-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease);}
.ds-card-img:hover .ds-card-img-thumb img{transform:scale(1.07);}
.ds-card-img-body{padding:14px;}
.ds-status{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;border:1px solid transparent;}
.ds-status.infected{background:var(--c-red-l);color:var(--c-red);border-color:var(--c-red-b);}
.ds-status.healthy{background:var(--c-primary-l);color:var(--c-primary);border-color:var(--c-border2);}
.ds-status.unknown{background:var(--c-amber-l);color:var(--c-amber);border-color:#f0d080;}
.ds-del-btn{position:absolute;top:10px;right:10px;z-index:10;width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,.9);border:1px solid rgba(255,255,255,.6);display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:all var(--dur) var(--ease);color:var(--c-ink-40);box-shadow:var(--sh-sm);}
.ds-del-btn:hover{background:var(--c-red-l);color:var(--c-red);border-color:var(--c-red-b);}
.ds-card-img:hover .ds-del-btn{opacity:1;}
.ds-conf-bar{height:3px;border-radius:99px;background:var(--c-border);margin-top:8px;overflow:hidden;}
.ds-color-fill{height:100%;border-radius:99px;transition:width .8s var(--ease);}
.ds-select-wrap{position:relative;display:inline-flex;align-items:center;}
.ds-select-wrap svg{position:absolute;right:10px;pointer-events:none;}
.ds-select{appearance:none;background:var(--c-surface);border:1.5px solid var(--c-border);border-radius:var(--r-sm);padding:9px 32px 9px 13px;font-size:13px;font-family:inherit;color:var(--c-ink);cursor:pointer;outline:none;transition:border-color var(--dur) var(--ease);min-width:175px;}
.ds-select:focus{border-color:var(--c-primary);box-shadow:0 0 0 3px rgba(45,106,42,.12);}
.ds-select-dark{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff;}
.ds-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:var(--r-sm);border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all var(--dur) var(--ease);}
.ds-btn-primary{background:var(--c-primary);color:#fff;box-shadow:0 4px 14px rgba(45,106,42,.4);}
.ds-btn-primary:hover:not(:disabled){background:var(--c-primary-d);transform:translateY(-1px);box-shadow:0 6px 20px rgba(45,106,42,.5);}
.ds-btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.ds-btn-ghost{background:transparent;border:1.5px solid var(--c-border);color:var(--c-ink-60);}
.ds-btn-ghost:hover:not(:disabled){background:var(--c-primary-xl);border-color:var(--c-border2);color:var(--c-primary);}
.ds-btn-warn{background:var(--c-warn-l);border:1.5px solid var(--c-warn-b);color:var(--c-warn);font-family:inherit;font-size:13px;font-weight:700;padding:9px 20px;border-radius:var(--r-sm);cursor:not-allowed;display:inline-flex;align-items:center;gap:7px;}
/* Overlay & Modal */
.ds-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,20,8,.65);backdrop-filter:blur(6px);animation:ds-fadein .2s var(--ease) both;}
.ds-modal{background:var(--c-surface);border-radius:var(--r-xl);max-width:780px;width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:var(--sh-xl);border:1px solid var(--c-border);animation:ds-scalein .25s var(--ease) both;}
@media(min-width:640px){.ds-modal{flex-direction:row;}}
.ds-modal-img-side{background:#0d1a0b;display:flex;align-items:center;justify-content:center;min-height:240px;position:relative;flex-shrink:0;}
@media(min-width:640px){.ds-modal-img-side{width:45%;min-height:0;}}
.ds-modal-img-side img{width:100%;height:100%;object-fit:contain;max-height:45vh;}
@media(min-width:640px){.ds-modal-img-side img{max-height:100%;}}
.ds-modal-body{padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:18px;flex:1;}
.ds-color-bar{height:6px;border-radius:99px;overflow:hidden;background:var(--c-border);margin-top:5px;}
.ds-label{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--c-ink-40);}
.ds-shimmer{background:linear-gradient(90deg,#f0f4ee 25%,#e8ede6 50%,#f0f4ee 75%);background-size:200% 100%;animation:ds-shim 1.4s infinite;border-radius:var(--r-md);}
@keyframes ds-shim{0%{background-position:200%}100%{background-position:-200%}}
.ds-empty{text-align:center;padding:56px 24px;border:1.5px dashed var(--c-border2);border-radius:var(--r-xl);background:var(--c-primary-xl);}
.ds-fade{animation:ds-fadein .35s var(--ease) both;}
@keyframes ds-fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes ds-scalein{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
@keyframes spin{to{transform:rotate(360deg)}}
.ds-pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:24px;}
.ds-page-btn{min-width:38px;height:38px;padding:0 10px;border-radius:var(--r-sm);border:1.5px solid var(--c-border);background:var(--c-surface);font-family:inherit;font-size:12.5px;font-weight:700;color:var(--c-ink-60);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px;transition:all var(--dur) var(--ease);white-space:nowrap;}
.ds-page-btn:hover:not(:disabled):not(.active){background:var(--c-primary-xl);border-color:var(--c-border2);color:var(--c-primary);}
.ds-page-btn.active{background:var(--c-primary);border-color:var(--c-primary);color:#fff;box-shadow:0 2px 8px rgba(45,106,42,.35);}
.ds-page-btn:disabled{opacity:.38;cursor:not-allowed;}
/* Sector selector large */
.ds-sector-select-lg{width:100%;padding:12px 40px 12px 16px;border-radius:var(--r-md);border:2px solid var(--c-border2);background:var(--c-surface);font-family:inherit;font-size:14px;font-weight:600;color:var(--c-ink);appearance:none;outline:none;cursor:pointer;transition:all var(--dur) var(--ease);}
.ds-sector-select-lg:focus{border-color:var(--c-primary);box-shadow:0 0 0 3px rgba(45,106,42,.12);}
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

const ITEMS_PER_PAGE = 12;

function getStatusClass(status) {
  if (status === "Infected" || status === "Unhealthy") return "infected";
  if (status === "Healthy") return "healthy";
  return "unknown";
}

/* ─── Image Detail Modal ─────────────────────────────────────────────────── */
function ImageDetailModal({ log, onClose }) {
  if (!log) return null;
  const status = log.analysisResult?.status;
  const sk = getStatusClass(status);
  const recText = log.analysisResult?.recommendation || "";

  const greenRatio = parseFloat(recText.match(/أخضر\s*([\d.]+)/)?.[1] ?? 0);
  const yellowRatio = parseFloat(recText.match(/أصفر\s*([\d.]+)/)?.[1] ?? 0);
  const brownRatio = parseFloat(recText.match(/بني\s*([\d.]+)/)?.[1] ?? 0);
  const hasColorData = greenRatio > 0 || yellowRatio > 0 || brownRatio > 0;
  const cleanRec = recText.split("[تحليل الألوان")[0].trim();
  const conf = log.analysisResult?.confidence
    ? Math.round(log.analysisResult.confidence)
    : 0;

  const statusColor =
    sk === "healthy"
      ? "var(--c-primary)"
      : sk === "infected"
        ? "var(--c-red)"
        : "var(--c-amber)";
  const statusBg =
    sk === "healthy"
      ? "var(--c-primary-l)"
      : sk === "infected"
        ? "var(--c-red-l)"
        : "var(--c-amber-l)";
  const statusBorder =
    sk === "healthy"
      ? "var(--c-border2)"
      : sk === "infected"
        ? "var(--c-red-b)"
        : "#f0d080";
  const StatusIcon =
    sk === "healthy" ? CheckCircle : sk === "infected" ? AlertCircle : Cpu;

  return (
    <div
      className="ds-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ds-modal">
        <div className="ds-modal-img-side">
          <img src={log.imageUrl} alt="Leaf Diagnostic Scan" />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "none",
              background: "rgba(0,0,0,.5)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="ds-modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}>
                <span
                  className={`ds-status ${sk}`}
                  style={{
                    background: statusBg,
                    color: statusColor,
                    borderColor: statusBorder,
                  }}
                >
                  <StatusIcon size={12} /> {status || "Unknown"}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--c-ink)",
                  marginBottom: 4,
                  letterSpacing: "-.2px",
                }}
              >
                {log.analysisResult?.diseaseName || "Healthy Leaf"}
              </h3>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--c-ink-40)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Calendar size={10} /> Captured{" "}
                {log.createdAt ? timeAgo(log.createdAt) : "Just now"}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "1.5px solid var(--c-border)",
                background: "var(--c-surface2)",
                color: "var(--c-ink-40)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </div>

          {conf > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span className="ds-label">Model Confidence</span>
                <span
                  style={{ fontSize: 12, fontWeight: 800, color: statusColor }}
                >
                  {conf}%
                </span>
              </div>
              <div className="ds-color-bar">
                <div
                  className="ds-color-fill"
                  style={{ width: `${conf}%`, background: statusColor }}
                />
              </div>
            </div>
          )}

          {cleanRec && (
            <div
              style={{
                background: "var(--c-surface2)",
                border: "1px solid var(--c-border)",
                borderRadius: "var(--r-md)",
                padding: "14px 16px",
                borderLeft: `3px solid ${statusColor}`,
              }}
            >
              <p
                className="ds-label"
                style={{
                  marginBottom: 7,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Activity size={11} /> AI Recommendation
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "var(--c-ink-60)",
                  lineHeight: 1.65,
                }}
              >
                {cleanRec}
              </p>
            </div>
          )}

          {hasColorData && (
            <div>
              <p
                className="ds-label"
                style={{
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <BarChart2 size={11} /> Color Metrics Telemetry
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "Green Ratio (Chlorophyll)",
                    value: greenRatio,
                    color: "#2d9e2a",
                  },
                  {
                    label: "Yellow Ratio (Chlorosis)",
                    value: yellowRatio,
                    color: "#c07a10",
                  },
                  {
                    label: "Brown Ratio (Necrosis)",
                    value: brownRatio,
                    color: "#7a4010",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        fontSize: 11.5,
                        color: "var(--c-ink-60)",
                        fontWeight: 600,
                      }}
                    >
                      <span>{label}</span>
                      <span style={{ color, fontWeight: 800 }}>
                        {value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="ds-color-bar">
                      <div
                        className="ds-color-fill"
                        style={{ width: `${value}%`, background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              paddingTop: 14,
              borderTop: "1px solid var(--c-border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              {
                label: "Sector",
                value: `📍 ${log.sectorId?.name || "Unknown"}`,
              },
              {
                label: "Scan Mode",
                value:
                  log.captureReason === "Automatic Camera"
                    ? "📷 Automated IoT"
                    : "📱 Manual App",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="ds-label" style={{ marginBottom: 3 }}>
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--c-ink-60)",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
            {log.capturedBy && (
              <div
                style={{
                  gridColumn: "span 2",
                  paddingTop: 10,
                  borderTop: "1px dashed var(--c-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11.5,
                  color: "var(--c-ink-40)",
                }}
              >
                <User size={11} /> Operator:{" "}
                <strong style={{ color: "var(--c-ink-60)" }}>
                  {log.capturedBy.firstName} {log.capturedBy.lastName}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Diagnosis Card ─────────────────────────────────────────────────────── */
function DiagnosisCard({ log, onDelete, onOpenDetail }) {
  const sk = getStatusClass(log.analysisResult?.status);
  const conf = log.analysisResult?.confidence
    ? Math.round(log.analysisResult.confidence)
    : 0;
  const confColor =
    conf >= 80
      ? "var(--c-primary)"
      : conf >= 60
        ? "var(--c-amber)"
        : "var(--c-red)";

  return (
    <div className={`ds-card-img ${sk}`} onClick={() => onOpenDetail(log)}>
      <div className="ds-card-img-thumb">
        <img src={log.imageUrl} alt="plant scan" />
        <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
          <span className={`ds-status ${sk}`}>
            {sk === "healthy" ? (
              <CheckCircle size={10} />
            ) : sk === "infected" ? (
              <AlertCircle size={10} />
            ) : (
              <Cpu size={10} />
            )}
            {log.analysisResult?.status || "Unknown"}
          </span>
        </div>
        <button
          className="ds-del-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(log._id);
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="ds-card-img-body">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 800,
              color:
                sk === "infected"
                  ? "var(--c-red)"
                  : sk === "healthy"
                    ? "var(--c-primary)"
                    : "var(--c-amber)",
              flex: 1,
            }}
          >
            {log.analysisResult?.diseaseName || "Healthy"}
          </p>
          {conf > 0 && (
            <span
              style={{
                fontSize: 10.5,
                color: confColor,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {conf}%
            </span>
          )}
        </div>
        {log.analysisResult?.recommendation && (
          <p
            style={{
              fontSize: 11.5,
              color: "var(--c-ink-40)",
              lineHeight: 1.55,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              marginBottom: 10,
            }}
          >
            {log.analysisResult.recommendation.slice(0, 100)}…
          </p>
        )}
        {conf > 0 && (
          <div className="ds-conf-bar">
            <div
              className="ds-color-fill"
              style={{ width: `${conf}%`, background: confColor }}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--c-border)",
          }}
        >
          <span
            style={{ fontSize: 11, color: "var(--c-ink-40)", fontWeight: 500 }}
          >
            {log.captureReason === "Automatic Camera" ? "📷 Auto" : "📱 Manual"}
          </span>
          <span style={{ fontSize: 11, color: "var(--c-ink-40)" }}>
            {log.createdAt ? timeAgo(log.createdAt) : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function Images() {
  useDS();

  const { data: sData } = useFetch(sectorsAPI.getAll);
  const sectors = sData?.data || [];
  const { data: dData } = useFetch(devicesAPI.getAll);
  const devices = dData?.data || [];
  const [sectorId, setSectorId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [delId, setDelId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeLog, setActiveLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileRef = useRef();

  const { data, loading, refetch } = useFetch(
    () => imagesAPI.getHistory({ sectorId: sectorId || undefined, limit: 200 }),
    [sectorId],
  );
  const allImages = data?.data || [];
  const totalPages = Math.ceil(allImages.length / ITEMS_PER_PAGE);
  const pageImages = allImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const infected = allImages.filter(
    (i) =>
      i.analysisResult?.status === "Infected" ||
      i.analysisResult?.status === "Unhealthy",
  ).length;
  const healthy = allImages.filter(
    (i) => i.analysisResult?.status === "Healthy",
  ).length;

  /* ── Upload ── */
  const handleUpload = async (file) => {
    if (!file) return;

    // 1️⃣ لازم يختار قطاع الأول
    if (!sectorId) {
      toast.error("الرجاء اختيار القطاع أولاً قبل رفع الصورة.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);

      // 2️⃣ تأمين البحث عن الجهاز المرتبط بالقطاع
      // البحث يدعم لو dev.sectorId عبارة عن Object (بسبب الـ populate) أو مجرد String ID
      const matchedDevice =
        devices && devices.length > 0
          ? devices.find((dev) => {
              const devSectorId = dev.sectorId?._id || dev.sectorId;
              return devSectorId?.toString() === sectorId.toString();
            })
          : null;

      // 3️⃣ تحديد السيريال (يفضل تنبيه المالك/العامل لو القطاع ملوش جهاز فعلي)
      if (!matchedDevice) {
        console.warn(
          `⚠️ No device registered for Sector: [${sectorId}]. Using fallback serial.`,
        );
        // لو عايز تمنع الرفع تماماً لو مفيش جهاز، فك الكومنت عن السطرين اللي تحت:
        // toast.error("هذا القطاع لا يحتوي على أجهزة مسجلة، لا يمكن رفع الصورة.");
        // setUploading(false); return;
      }

      const currentSerial = matchedDevice?.deviceSerial || "ESP32-GENERIC-UNIT";

      fd.append("deviceSerial", currentSerial);
      fd.append("sectorId", sectorId);

      console.log(
        `🚀 Sending dynamically -> Serial: [${currentSerial}] for Sector: [${sectorId}]`,
      );

      // 4️⃣ إرسال البيانات للباك إند
      const response = await imagesAPI.upload(fd);

      // دعم الطريقتين للتأكد من النجاح حسب شكل الـ Axios response عندك
      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast.success("تم رفع الصورة وتحليلها بنجاح! 🎉");

        if (refetch) await refetch(); // تحديث قائمة الصور فوراً
        if (setCurrentPage) setCurrentPage(1); // العودة للصفحة الأولى في الـ Pagination
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "فشلت عملية الرفع، يرجى المحاولة مرة أخرى.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleUpload(file);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await imagesAPI.delete(delId);
      toast.success("Image deleted");
      refetch();
      setDelId(null);
      if (pageImages.length === 1 && currentPage > 1)
        setCurrentPage((p) => p - 1);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    } finally {
      setDeleting(false);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, "…", totalPages);
    else if (currentPage >= totalPages - 3)
      pages.push(
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    else
      pages.push(
        1,
        "…",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "…",
        totalPages,
      );
    return pages;
  };

  // Selected sector object
  const selectedSector = sectors.find((s) => s._id === sectorId);

  return (
    <div className="ds-page ds-fade" style={{ padding: "24px 20px 60px" }}>
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
            <h2 className="ds-hero-title">Plant Scan & Diagnosis</h2>
            <p className="ds-hero-sub">
              AI-powered disease detection from plant images
            </p>
          </div>
          {/* Sector selector in hero */}
          <div className="ds-select-wrap">
            <select
              className="ds-select ds-select-dark"
              value={sectorId}
              onChange={(e) => {
                setSectorId(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="" style={{ color: "#000" }}>
                — Select sector —
              </option>
              {sectors.map((s) => (
                <option key={s._id} value={s._id} style={{ color: "#000" }}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} style={{ color: "rgba(255,255,255,.75)" }} />
          </div>
        </div>

        {/* Selected sector info strip */}
        {selectedSector && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,.12)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf size={13} color="#fff" />
            </div>
            <div>
              <p
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {selectedSector.name}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,.55)",
                  fontSize: 11,
                  margin: 0,
                }}
              >
                {selectedSector.cropType}
                {selectedSector.location
                  ? ` · 📍 ${selectedSector.location}`
                  : ""}
                {selectedSector.assignedWorker
                  ? ` · 👤 ${selectedSector.assignedWorker.firstName} ${selectedSector.assignedWorker.lastName}`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {allImages.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div className="ds-stat">
            <div
              className="ds-stat-icon"
              style={{ background: "var(--c-primary-l)" }}
            >
              <Leaf size={18} style={{ color: "var(--c-primary)" }} />
            </div>
            <div>
              <p className="ds-stat-val">{allImages.length}</p>
              <p className="ds-stat-label">Total Scans</p>
            </div>
          </div>
          <div className="ds-stat">
            <div
              className="ds-stat-icon"
              style={{ background: "var(--c-red-l)" }}
            >
              <AlertCircle size={18} style={{ color: "var(--c-red)" }} />
            </div>
            <div>
              <p
                className="ds-stat-val"
                style={{
                  color: infected > 0 ? "var(--c-red)" : "var(--c-ink)",
                }}
              >
                {infected}
              </p>
              <p className="ds-stat-label">Infected</p>
            </div>
          </div>
          <div className="ds-stat">
            <div
              className="ds-stat-icon"
              style={{ background: "var(--c-primary-l)" }}
            >
              <CheckCircle size={18} style={{ color: "var(--c-primary)" }} />
            </div>
            <div>
              <p className="ds-stat-val" style={{ color: "var(--c-primary)" }}>
                {healthy}
              </p>
              <p className="ds-stat-label">Healthy</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sector required warning ── */}
      {!sectorId && (
        <div className="ds-sector-required" style={{ marginBottom: 16 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "rgba(180,83,9,.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={17} style={{ color: "var(--c-warn)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "var(--c-warn)",
                margin: "0 0 4px",
              }}
            >
              Select a sector to upload
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#92400e",
                margin: "0 0 12px",
                lineHeight: 1.5,
              }}
            >
              You must select a sector before uploading a plant image. The image
              will be linked to this sector for AI diagnosis.
            </p>
            {/* Large sector selector in warning */}
            <div style={{ position: "relative" }}>
              <select
                className="ds-sector-select-lg"
                value={sectorId}
                onChange={(e) => {
                  setSectorId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">— Choose a sector —</option>
                {sectors.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.cropType}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "var(--c-warn)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Zone ── */}
      <div
        className={`ds-upload${dragOver ? " drag" : ""}${!sectorId ? " blocked" : ""}`}
        style={{ marginBottom: 24 }}
        onClick={() => {
          if (!sectorId) {
            toast.error("Please select a sector first.");
            return;
          }
          if (!uploading) fileRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (sectorId) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onClick={(e) => {
            e.target.value = null;
          }}
          onChange={(e) => {
            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
          }}
        />

        {uploading ? (
          <>
            <div
              className="ds-upload-icon"
              style={{
                background: "var(--c-primary)",
                borderColor: "var(--c-primary)",
              }}
            >
              <Loader
                size={22}
                style={{ color: "#fff", animation: "spin .8s linear infinite" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--c-primary)",
                  marginBottom: 4,
                }}
              >
                Uploading & analyzing with AI…
              </p>
              <p style={{ fontSize: 12, color: "var(--c-ink-40)" }}>
                This may take a few seconds
              </p>
            </div>
          </>
        ) : !sectorId ? (
          <>
            <div
              className="ds-upload-icon"
              style={{
                background: "var(--c-warn-l)",
                borderColor: "var(--c-warn-b)",
              }}
            >
              <AlertTriangle size={24} style={{ color: "var(--c-warn)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--c-warn)",
                  marginBottom: 5,
                }}
              >
                Select a sector first
              </p>
              <p style={{ fontSize: 12, color: "#92400e" }}>
                Choose a sector from above to enable image upload
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="ds-upload-icon">
              <Camera size={24} style={{ color: "var(--c-primary)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--c-ink)",
                  marginBottom: 5,
                }}
              >
                Drop image here or click to upload
              </p>
              <p style={{ fontSize: 12, color: "var(--c-ink-40)" }}>
                PNG, JPG, WEBP — plant photos for disease detection
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--c-primary)",
                  fontWeight: 700,
                  marginTop: 5,
                }}
              >
                📍 Will be linked to: <strong>{selectedSector?.name}</strong>
              </p>
            </div>
            <button
              className="ds-btn ds-btn-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload size={14} /> Choose Image
            </button>
          </>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 14,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} className="ds-shimmer" style={{ height: 260 }} />
          ))}
        </div>
      ) : allImages.length === 0 ? (
        <div className="ds-empty">
          <ImageIcon
            size={36}
            style={{ color: "var(--c-ink-20)", margin: "0 auto 14px" }}
          />
          <p
            style={{
              fontFamily: "'Fraunces',serif",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--c-ink)",
              marginBottom: 6,
            }}
          >
            No scans yet
          </p>
          <p style={{ fontSize: 13, color: "var(--c-ink-40)" }}>
            {sectorId
              ? "Upload your first plant image to get an AI disease diagnosis."
              : "Select a sector then upload a plant image."}
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--c-ink)",
                letterSpacing: "-.2px",
              }}
            >
              Recent Scans
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--c-ink-40)",
                fontWeight: 600,
              }}
            >
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, allImages.length)} of{" "}
              {allImages.length}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 14,
            }}
          >
            {pageImages.map((img) => (
              <DiagnosisCard
                key={img._id}
                log={img}
                onDelete={setDelId}
                onOpenDetail={setActiveLog}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="ds-pagination">
              <button
                className="ds-page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={15} />
              </button>
              {getPageNumbers().map((p, i) =>
                p === "…" ? (
                  <span
                    key={`e-${i}`}
                    style={{
                      padding: "0 4px",
                      color: "var(--c-ink-40)",
                      fontSize: 13,
                    }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`ds-page-btn${currentPage === p ? " active" : ""}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                className="ds-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}

      {activeLog && (
        <ImageDetailModal log={activeLog} onClose={() => setActiveLog(null)} />
      )}
      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Image"
        message="This will remove the image from storage and delete the diagnosis record permanently."
      />
    </div>
  );
}
