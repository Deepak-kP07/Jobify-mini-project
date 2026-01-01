import Logo from "./Logo";
import Navbar from "./Navbar";
import { PanelRightOpen, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  // Get user's name - combine firstName and lastName
  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Guest";

  const userEmail = user?.email || "No email";

  const logoutUser = async () => {
    try {
      await customFetch.post("/auth/logout");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <aside className="flex flex-col h-screen w-80">
        <div className="flex p-4 justify-between items-center vertical-center">
          {/* here logo and icons for closing opening sidebat */}
          <div className="w-35 h-auto">
            <Logo />
          </div>
          <button className="text-2xl">
            <PanelRightOpen />
          </button>
        </div>
        <div className="flex-1 h-full shadow-md">
          {/* here links for sidebar */}
          <Navbar user={user} />
        </div>
        <div className=" flex bottom-2 items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md">
          {/* here profile and logout button
          <div>
              <img src={user.avatar} alt='avatar' className='img' />
          </div> */}
          <LogOut className="w-6 h-6" onClick={logoutUser} />
          <div className=" flex flex-col justify-center items-start">
            <h3 className="text-lg font-medium">{userName}</h3>
            <h4 className="text-sm text-gray-500">{userEmail}</h4>
          </div>
        </div>
      </aside>
    </>
  );
}
