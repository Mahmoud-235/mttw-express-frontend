import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/sectors": "Farm Sectors",
  "/devices": "IoT Devices",
  "/sensors": "Sensor Readings",
  "/images": "Plant Scan & Diagnosis",
  "/reports": "Analytics & Reports",
  "/notifications": "Alerts & Notifications",
  "/workers": "Workers Management",
};

export function AppLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "EcoSense";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-forest-50 flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar
          title={title}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-6 animate-fade-in overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
