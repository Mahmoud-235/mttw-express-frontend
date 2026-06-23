import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

export function Topbar({ title, sidebarOpen, onToggleSidebar }) {
  const { liveAlerts, clearAlert } = useSocket();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showAlerts, setShowAlerts] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);
  const unread = liveAlerts.length;
  const userAvatar = user?.avatarUrl || user?.avatar || null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    setShowUserMenu(false);
    if (logout) {
      await logout();
    }
    navigate("/login");
  };

  return (
    <header
      className="h-16 bg-white/80 backdrop-blur-sm border-b border-forest-100
                        flex items-center justify-between px-4 md:px-6 sticky top-0 z-20"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl hover:bg-forest-50 text-sage-500
                     hover:text-forest-700 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-sage-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Bell Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAlerts(!showAlerts);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-xl hover:bg-forest-50 text-sage-500
                       hover:text-forest-700 transition-colors"
          >
            <Bell size={18} className={unread > 0 ? "bell-ring" : ""} />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full
                               flex items-center justify-center text-white text-[10px] font-bold"
              >
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {showAlerts && (
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl
                            shadow-card-hover border border-forest-100 overflow-hidden z-50 animate-slide-up max-w-[calc(100vw-1rem)]"
            >
              <div className="px-4 py-3 border-b border-forest-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-sage-800">
                  Live Alerts
                </span>
                <button
                  className="text-xs text-forest-600 hover:text-forest-800 font-medium"
                  onClick={() => {
                    setShowAlerts(false);
                    navigate("/notifications");
                  }}
                >
                  View all
                </button>
              </div>
              {liveAlerts.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-sage-400">
                  No new alerts
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-forest-50">
                  {liveAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="px-4 py-3 hover:bg-forest-50 transition-colors flex gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-ping-slow" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-sage-800">
                          {a.title}
                        </p>
                        <p className="text-xs text-sage-500 truncate">
                          {a.message}
                        </p>
                      </div>
                      <button
                        onClick={() => clearAlert(a.id)}
                        className="text-sage-300 hover:text-sage-600 text-xs flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <div
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowAlerts(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all border
              ${
                showUserMenu
                  ? "bg-forest-50 border-forest-200 shadow-xs"
                  : "hover:bg-forest-50 border-transparent hover:border-forest-200"
              }`}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden bg-forest-600 shadow-xs flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-bold uppercase tabular-nums">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              )}
            </div>

            <span className="text-sm font-semibold text-sage-700 hidden sm:block select-none truncate">
              {user?.firstName || "Mahmoud"}
            </span>

            <ChevronDown
              size={13}
              className={`text-sage-400 transition-transform duration-200 flex-shrink-0 ${showUserMenu ? "rotate-180 text-forest-600" : ""}`}
            />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-forest-100 overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-3 bg-gradient-to-br from-forest-50/40 to-transparent border-b border-forest-50">
                <p className="text-xs text-sage-400 font-medium">
                  Logged in as
                </p>
                <p className="text-sm font-bold text-sage-800 truncate">
                  {user?.firstName} {user?.lastName || "Mansour"}
                </p>
                {user?.role && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-forest-100/70 text-forest-700 font-bold px-1.5 py-0.5 rounded-md mt-1">
                    <Shield size={10} /> {user.role}
                  </span>
                )}
              </div>

              <div className="p-1.5">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left font-semibold"
                >
                  <LogOut size={15} className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
