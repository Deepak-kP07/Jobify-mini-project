import { Outlet, useLoaderData } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const data = useLoaderData();
  const user = data?.user || null;

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
