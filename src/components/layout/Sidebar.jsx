import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Cpu,
  Activity,
  ImageIcon,
  FileBarChart,
  Bell,
  Users,
  LogOut,
  Leaf,
  Wifi,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import toast from "react-hot-toast";

const ownerLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sectors", icon: Layers, label: "Sectors" },
  { to: "/devices", icon: Cpu, label: "Devices" },
  { to: "/sensors", icon: Activity, label: "Sensors" },
  { to: "/images", icon: ImageIcon, label: "Plant Scan" },
  { to: "/reports", icon: FileBarChart, label: "Reports" },
  { to: "/notifications", icon: Bell, label: "Alerts" },
  { to: "/workers", icon: Users, label: "Workers" },
];
const workerLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/sensors", icon: Activity, label: "Sensors" },
  { to: "/images", icon: ImageIcon, label: "Plant Scan" },
  { to: "/notifications", icon: Bell, label: "Alerts" },
];

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const links = user?.role === "owner" ? ownerLinks : workerLinks;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link-active"
      : "nav-link text-forest-200 hover:text-white hover:bg-white/10";

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-forest-400 rounded-xl flex items-center justify-center shadow-forest-sm flex-shrink-0">
            <Leaf size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-white font-bold text-lg tracking-tight block truncate">
              EcoSense
            </span>
            <p className="text-forest-300 text-xs font-medium truncate">
              Smart Farm Monitor
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={navLinkClass}
            onClick={onClose}
          >
            <Icon size={17} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {/* Socket status */}
        <div className="flex items-center gap-2 px-3 py-2 text-xs">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? "bg-forest-400 animate-pulse-slow" : "bg-sage-500"}`}
          />
          <span className="text-forest-300 truncate">
            {connected ? "Live connected" : "Offline"}
          </span>
          <Wifi
            size={12}
            className={
              connected ? "text-forest-400 ml-auto flex-shrink-0" : "text-sage-500 ml-auto flex-shrink-0"
            }
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 min-w-0">
          <div className="w-8 h-8 bg-forest-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-forest-300 text-xs capitalize truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                     text-forest-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span className="truncate">Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-bg w-64 min-h-screen flex flex-col fixed left-0 top-0 z-30 md:relative md:z-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-6 p-1 rounded-lg hover:bg-white/10 md:hidden z-40"
          aria-label="Close sidebar"
        >
          <X size={20} className="text-white" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
