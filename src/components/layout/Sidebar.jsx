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

export function Sidebar() {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const links = user?.role === "owner" ? ownerLinks : workerLinks;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar-bg w-64 min-h-screen flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-forest-400 rounded-xl flex items-center justify-center shadow-forest-sm">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">
              EcoSense
            </span>
            <p className="text-forest-300 text-xs font-medium">
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
            className={({ isActive }) =>
              isActive
                ? "nav-link-active"
                : "nav-link text-forest-200 hover:text-white hover:bg-white/10"
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {/* Socket status */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-forest-400 animate-pulse-slow" : "bg-sage-500"}`}
          />
          <span className="text-xs text-forest-300">
            {connected ? "Live connected" : "Offline"}
          </span>
          <Wifi
            size={12}
            className={
              connected ? "text-forest-400 ml-auto" : "text-sage-500 ml-auto"
            }
          />
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
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
            <p className="text-forest-300 text-xs capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                     text-forest-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
