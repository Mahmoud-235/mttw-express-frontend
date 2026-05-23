import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Bug,
  Info,
  MapPin,
  Wheat,
  Search,
  Filter,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { notificationsAPI } from "../services/api";
import { EmptyState } from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { timeAgo } from "../utils/helpers";
import toast from "react-hot-toast";

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
  --c-amber-b:    #f0c070;
  --c-red:        #8b1a1a;
  --c-red-l:      #fef0f0;
  --c-red-b:      #f0a0a0;
  --c-blue:       #1a4a7a;
  --c-blue-l:     #edf4ff;

  --r-sm:  8px;
  --r-md:  14px;
  --r-lg:  20px;
  --r-xl:  28px;

  --sh-sm: 0 1px 3px rgba(20,29,16,.06), 0 1px 2px rgba(20,29,16,.04);
  --sh-md: 0 4px 16px rgba(20,29,16,.08), 0 1px 4px rgba(20,29,16,.05);

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

/* Btn */
.ds-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:var(--r-sm); border:none; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all var(--dur) var(--ease); }
.ds-btn-primary { background:var(--c-primary); color:#fff; box-shadow:0 4px 14px rgba(45,106,42,.4); }
.ds-btn-primary:hover { background:var(--c-primary-d); transform:translateY(-1px); }
.ds-btn-secondary { background:rgba(255,255,255,.12); color:#fff; border:1px solid rgba(255,255,255,.2); backdrop-filter:blur(8px); }
.ds-btn-secondary:hover { background:rgba(255,255,255,.2); }

/* Filter bar */
.ds-filter-bar {
  background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg);
  padding:18px 20px; box-shadow:var(--sh-sm);
  display:flex; flex-direction:column; gap:14px;
}
.ds-filter-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.ds-search-wrap { position:relative; grid-column:span 2; }
.ds-search-wrap svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--c-ink-40); pointer-events:none; }
.ds-search-input {
  width:100%; padding:10px 14px 10px 38px;
  background:var(--c-surface2); border:1.5px solid var(--c-border); border-radius:var(--r-sm);
  font-family:inherit; font-size:13px; color:var(--c-ink); outline:none;
  transition:border-color var(--dur) var(--ease);
  box-sizing:border-box;
}
.ds-search-input:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(45,106,42,.12); }
.ds-search-input::placeholder { color:var(--c-ink-20); }

.ds-select-wrap { position:relative; display:inline-flex; align-items:center; width:100%; }
.ds-select-wrap svg { position:absolute; right:10px; pointer-events:none; color:var(--c-ink-40); }
.ds-select {
  appearance:none; width:100%; background:var(--c-surface2); border:1.5px solid var(--c-border);
  border-radius:var(--r-sm); padding:9px 30px 9px 36px; font-family:inherit; font-size:13px;
  color:var(--c-ink); cursor:pointer; outline:none; transition:border-color var(--dur) var(--ease);
}
.ds-select:focus { border-color:var(--c-primary); box-shadow:0 0 0 3px rgba(45,106,42,.12); }
.ds-select-icon { position:absolute; left:11px; pointer-events:none; }

.ds-date-row { display:flex; align-items:center; gap:10px; padding-top:10px; border-top:1px solid var(--c-border); flex-wrap:wrap; }
.ds-date-label { font-size:11.5px; font-weight:700; color:var(--c-ink-40); text-transform:uppercase; letter-spacing:.06em; display:flex; align-items:center; gap:6px; }
.ds-date-input {
  padding:7px 11px; font-size:12px; border-radius:var(--r-sm);
  border:1.5px solid var(--c-border); font-family:inherit; color:var(--c-ink);
  background:var(--c-surface2); outline:none; transition:border-color var(--dur) var(--ease);
}
.ds-date-input:focus { border-color:var(--c-primary); }
.ds-date-sep { font-size:12px; color:var(--c-ink-20); font-weight:500; }
.ds-clear-date { font-size:11.5px; font-weight:700; color:var(--c-red); cursor:pointer; background:none; border:none; font-family:inherit; margin-left:auto; transition:color var(--dur) var(--ease); }
.ds-clear-date:hover { color:#6b0000; }

/* Notification card */
.ds-notif-card {
  background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--r-lg);
  padding:16px 18px; display:flex; align-items:flex-start; gap:14px;
  box-shadow:var(--sh-sm); transition:all var(--dur) var(--ease);
}
.ds-notif-card:hover { box-shadow:var(--sh-md); transform:translateY(-1px); }
.ds-notif-card.disease { background:var(--c-red-l); border-color:var(--c-red-b); }
.ds-notif-card.warning { background:var(--c-amber-l); border-color:var(--c-amber-b); }
.ds-notif-card.info { background:var(--c-blue-l); border-color:#b0cce8; }
.ds-notif-card.read { background:var(--c-surface); border-color:var(--c-border); opacity:.85; }

.ds-notif-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid transparent; }

.ds-notif-title { font-size:13.5px; font-weight:800; color:var(--c-ink); margin-bottom:4px; }
.ds-notif-msg { font-size:12.5px; color:var(--c-ink-60); line-height:1.55; }

/* Chips */
.ds-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:700; border:1px solid transparent; }
.ds-chip-read { background:var(--c-primary); color:#fff; }

/* Unread dot */
.ds-unread-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; animation:notif-pulse 1.8s ease-in-out infinite; }
@keyframes notif-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }

/* Icon button */
.ds-icon-btn { width:34px; height:34px; border-radius:var(--r-sm); border:1.5px solid transparent; background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--dur) var(--ease); flex-shrink:0; }
.ds-icon-btn.mark { color:var(--c-ink-40); }
.ds-icon-btn.mark:hover { background:var(--c-primary-l); border-color:var(--c-border2); color:var(--c-primary); }
.ds-icon-btn.del { color:var(--c-ink-40); }
.ds-icon-btn.del:hover { background:var(--c-red-l); border-color:var(--c-red-b); color:var(--c-red); }
.ds-icon-btn:disabled { opacity:.4; cursor:not-allowed; }

/* Empty */
.ds-empty { text-align:center; padding:48px 24px; }

/* Pagination */
.ds-pagination { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:20px; }
.ds-page-btn {
  width:38px; height:38px; border-radius:var(--r-sm);
  border:1.5px solid var(--c-border); background:var(--c-surface);
  font-family:inherit; font-size:12.5px; font-weight:700; color:var(--c-ink-60);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all var(--dur) var(--ease);
}
.ds-page-btn:hover:not(:disabled):not(.active) { background:var(--c-primary-xl); border-color:var(--c-border2); color:var(--c-primary); }
.ds-page-btn.active { background:var(--c-primary); border-color:var(--c-primary); color:#fff; box-shadow:0 2px 8px rgba(45,106,42,.35); }
.ds-page-btn:disabled { opacity:.4; cursor:not-allowed; }
.ds-page-arrow { width:36px; height:36px; }

/* Section heading */
.ds-section-title { font-family:'Fraunces',serif; font-size:17px; font-weight:700; color:var(--c-ink); letter-spacing:-.2px; }

/* Fade */
.ds-fade { animation:ds-fadein .35s var(--ease) both; }
@keyframes ds-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

/* Spinner */
.ds-spin { width:12px; height:12px; border:2px solid rgba(45,106,42,.2); border-top-color:var(--c-primary); border-radius:50%; animation:spin .8s linear infinite; display:inline-block; }
@keyframes spin { to{transform:rotate(360deg)} }
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

/* ── Type configs ── */
const TYPE_CFG = {
  disease: {
    icon: Bug,
    bg: "var(--c-red-l)",
    border: "var(--c-red-b)",
    iconColor: "var(--c-red)",
    dot: "var(--c-red)",
    label: "Disease",
  },
  warning: {
    icon: AlertTriangle,
    bg: "var(--c-amber-l)",
    border: "var(--c-amber-b)",
    iconColor: "var(--c-amber)",
    dot: "var(--c-amber)",
    label: "Warning",
  },
  info: {
    icon: Info,
    bg: "var(--c-blue-l)",
    border: "#b0cce8",
    iconColor: "var(--c-blue)",
    dot: "var(--c-blue)",
    label: "Info",
  },
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

const ITEMS_PER_PAGE = 6;

export default function Notifications() {
  useDS();
  const { data, loading, refetch } = useFetch(notificationsAPI.getAll);
  const notifications = data?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [delId, setDelId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [marking, setMarking] = useState(null);

  const unread = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      n.title?.toLowerCase().includes(q) ||
      n.message?.toLowerCase().includes(q) ||
      n.sectorId?.name?.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || n.type === typeFilter;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !n.isRead) ||
      (statusFilter === "read" && n.isRead);
    const nd = n.createdAt ? new Date(n.createdAt).setHours(0, 0, 0, 0) : null;
    const matchFrom =
      !fromDate || !nd || nd >= new Date(fromDate).setHours(0, 0, 0, 0);
    const matchTo =
      !toDate || !nd || nd <= new Date(toDate).setHours(0, 0, 0, 0);
    return matchSearch && matchType && matchStatus && matchFrom && matchTo;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkRead = async (id) => {
    setMarking(id);
    try {
      await notificationsAPI.markRead(id);
      refetch();
    } catch {
      toast.error("Failed to update");
    } finally {
      setMarking(null);
    }
  };

  const handleMarkAllRead = async () => {
    const ids = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => notificationsAPI.markRead(id)));
      toast.success("All marked as read");
      refetch();
    } catch {
      toast.error("Failed");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await notificationsAPI.delete(delId);
      toast.success("Notification deleted");
      refetch();
      setDelId(null);
      if (currentItems.length === 1 && currentPage > 1)
        setCurrentPage((p) => p - 1);
    } catch {
      toast.error("Failed");
    } finally {
      setDeleting(false);
    }
  };

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
            <h2 className="ds-hero-title">Alerts & Notifications</h2>
            <p className="ds-hero-sub">
              {unread > 0 ? (
                <>
                  <span style={{ color: "#8fefaa", fontWeight: 700 }}>
                    {unread} unread
                  </span>{" "}
                  ·{" "}
                </>
              ) : (
                "All caught up · "
              )}
              {notifications.length} total
            </p>
          </div>
          {unread > 0 && (
            <button
              className="ds-btn ds-btn-secondary"
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="ds-filter-bar" style={{ marginBottom: 20 }}>
        <div className="ds-filter-grid">
          {/* Search */}
          <div className="ds-search-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search by title, description or sector name…"
              className="ds-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Type filter */}
          <div>
            <div className="ds-select-wrap">
              <Filter
                size={14}
                className="ds-select-icon"
                style={{ color: "var(--c-ink-40)" }}
              />
              <select
                className="ds-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Alert Types</option>
                <option value="disease">Diseases Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Info Bulletins</option>
              </select>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  position: "absolute",
                  right: 10,
                  pointerEvents: "none",
                  color: "var(--c-ink-40)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Status filter */}
          <div>
            <div className="ds-select-wrap">
              <Eye
                size={14}
                className="ds-select-icon"
                style={{ color: "var(--c-ink-40)" }}
              />
              <select
                className="ds-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  position: "absolute",
                  right: 10,
                  pointerEvents: "none",
                  color: "var(--c-ink-40)",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Date range */}
        <div className="ds-date-row">
          <span className="ds-date-label">
            <Calendar size={13} /> Filter by Date:
          </span>
          <input
            type="date"
            className="ds-date-input"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
          />
          <span className="ds-date-sep">to</span>
          <input
            type="date"
            className="ds-date-input"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
          />
          {(fromDate || toDate) && (
            <button
              className="ds-clear-date"
              onClick={() => {
                setFromDate("");
                setToDate("");
                setCurrentPage(1);
              }}
            >
              Clear dates
            </button>
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "var(--c-ink-40)",
              fontWeight: 600,
            }}
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            background: "var(--c-surface)",
            border: "1px solid var(--c-border)",
            borderRadius: "var(--r-lg)",
            padding: 24,
            boxShadow: "var(--sh-sm)",
          }}
        >
          <TableSkeleton rows={6} />
        </div>
      ) : currentItems.length === 0 ? (
        <div
          style={{
            background: "var(--c-surface)",
            border: "1px solid var(--c-border)",
            borderRadius: "var(--r-lg)",
            boxShadow: "var(--sh-sm)",
          }}
        >
          <div className="ds-empty">
            <Bell
              size={32}
              style={{ color: "var(--c-ink-20)", margin: "0 auto 12px" }}
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
              {notifications.length > 0
                ? "No results found"
                : "No notifications"}
            </p>
            <p style={{ fontSize: 13, color: "var(--c-ink-40)" }}>
              Try adjusting your search terms, date ranges, or filters.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentItems.map((n) => {
            const cfg = TYPE_CFG[n.type] || TYPE_CFG.info;
            const Icon = cfg.icon;
            const sector = n.sectorId;
            const crop = sector?.cropType;
            const cc = CROP_COLORS[crop] || CROP_COLORS.Other;
            const isRead = n.isRead;

            return (
              <div
                key={n._id}
                className={`ds-notif-card${isRead ? " read" : ""}`}
                style={
                  !isRead ? { background: cfg.bg, borderColor: cfg.border } : {}
                }
              >
                {/* Type icon */}
                <div
                  className="ds-notif-icon"
                  style={{
                    background: isRead
                      ? "var(--c-surface2)"
                      : "rgba(255,255,255,.7)",
                    borderColor: isRead ? "var(--c-border)" : cfg.border,
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: isRead ? "var(--c-ink-40)" : cfg.iconColor,
                    }}
                  />
                </div>

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="ds-notif-title"
                        style={{
                          color: isRead ? "var(--c-ink-60)" : "var(--c-ink)",
                        }}
                      >
                        {n.title}
                      </p>
                      <p className="ds-notif-msg">{n.message}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--c-ink-40)",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.createdAt ? timeAgo(n.createdAt) : ""}
                      </span>
                      {!isRead && (
                        <div
                          className="ds-unread-dot"
                          style={{ background: cfg.dot }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 10,
                      alignItems: "center",
                    }}
                  >
                    {sector?.name && (
                      <span
                        className="ds-chip"
                        style={{
                          background: "rgba(255,255,255,.7)",
                          borderColor: "var(--c-border)",
                          color: "var(--c-ink-60)",
                        }}
                      >
                        📍 {sector.name}
                      </span>
                    )}
                    {sector?.location && (
                      <span
                        className="ds-chip"
                        style={{
                          background: "rgba(255,255,255,.5)",
                          borderColor: "var(--c-border)",
                          color: "var(--c-ink-40)",
                        }}
                      >
                        <MapPin size={10} /> {sector.location}
                      </span>
                    )}
                    {crop && (
                      <span
                        className="ds-chip"
                        style={{
                          background: cc.bg,
                          color: cc.color,
                          borderColor: cc.border,
                        }}
                      >
                        <Wheat size={10} /> {crop}
                      </span>
                    )}
                    <span
                      className="ds-chip"
                      style={{
                        background: isRead ? "var(--c-surface2)" : cfg.bg,
                        color: isRead ? "var(--c-ink-40)" : cfg.iconColor,
                        borderColor: isRead ? "var(--c-border)" : cfg.border,
                      }}
                    >
                      {cfg.label}
                    </span>
                    {isRead && (
                      <span
                        className="ds-chip"
                        style={{
                          background: "var(--c-primary-l)",
                          color: "var(--c-primary)",
                          borderColor: "var(--c-border2)",
                          fontSize: 10,
                        }}
                      >
                        ✓ Read
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {!isRead && (
                    <button
                      className="ds-icon-btn mark"
                      onClick={() => handleMarkRead(n._id)}
                      disabled={marking === n._id}
                      title="Mark as read"
                    >
                      {marking === n._id ? (
                        <span className="ds-spin" />
                      ) : (
                        <CheckCheck size={15} />
                      )}
                    </button>
                  )}
                  <button
                    className="ds-icon-btn del"
                    onClick={() => setDelId(n._id)}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ds-pagination">
          <button
            className="ds-page-btn ds-page-arrow"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                className={`ds-page-btn${currentPage === p ? " active" : ""}`}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </button>
            );
          })}
          <button
            className="ds-page-btn ds-page-arrow"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Notification"
        message="This notification will be permanently removed from your history."
      />
    </div>
  );
}
