import { Outlet, useLocation } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-forest-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
