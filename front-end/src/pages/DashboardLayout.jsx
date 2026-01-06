import { Outlet, useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

export default function DashboardLayout() {
  const data = useLoaderData();
  const user = data?.user || null;

  // Debug: Log after successful login
  useEffect(() => {
    console.log("✅ Dashboard Loaded - User Logged In");
    console.log("👤 User Data:", user);
    console.log("📍 Current URL:", window.location.href);
    console.log("🌐 Hostname:", window.location.hostname);
  }, [user]);

  return (
    <>
      <div className="flex">
        <Sidebar user={user} />
        <div className="flex-1 flex-col h-screen p-4 overflow-y-auto">
          <Header user={user} />
          <Outlet context={{ user }} />
        </div>
      </div>
    </>
  );
}
