import Navbar from "./Navbar";
import Logo from "./Logo";
import { UserRoundCog, BellPlus, SunMoon } from "lucide-react";

export default function Header({ user }) {
  // Get user's name - combine firstName and lastName
  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Guest";

  return (
    <>
      <div className="max-w-7xl p-4 mx-auto flex justify-between items-center border border-[#2EB0BC]-200">
        {/* <Logo /> */}
        {/* <Navbar /> */}
        <h1 className="text-2xl font-semibold">Header</h1>
        <div className="flex gap-8">
          <div className="flex rounded-md items-center gap-2">
           <SunMoon />
          </div>
          <div className="flex rounded-md items-center gap-2">
            <BellPlus />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-gray-200 p-2">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserRoundCog className="w-8 h-8 text-gray-600" />
            )}
            <h3 className="text-sm font-medium">{userName}</h3>
          </div>
        </div>
      </div>
    </>
  );
}
