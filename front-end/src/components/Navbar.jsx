import { Link, NavLink } from "react-router-dom";
import {
  UserRoundPlus,
  ChartColumn,
  HandPlatter,
  UserPen,
  UserStar,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function Navbar({ user }) {
  return (
    <>
      <nav>
        <ul className="flex flex-col p-2 font-medium text-lg gap-4">
          <li>
            <SidebarItem
              path="/dashboard"
              text="Add Job"
              icon={<UserRoundPlus className="w-6 h-6" />}
            />
          </li>
          <li>
            <SidebarItem
              path="/dashboard/all-jobs"
              text="All Jobs"
              icon={<HandPlatter className="w-6 h-6" />}
            />
          </li>
          <li>
            <SidebarItem
              path="/dashboard/edit-job/:id"
              text="Edit Job"
              icon={<UserPen className="w-6 h-6" />}
            />
          </li>
          <li>
            <SidebarItem
              path="/dashboard/stats"
              text="Stats"
              icon={<ChartColumn className="w-6 h-6" />}
            />
          </li>
          <li>
            <SidebarItem
              path="/dashboard/profile"
              text="Profile"
              icon={<UserPen className="w-6 h-6" />}
            />
          </li>
          {/* Only show Admin menu for admin users */}
          {user?.role === "admin" && (
            <li>
              <SidebarItem
                path="/dashboard/admin"
                text="Admin"
                icon={<UserStar className="w-6 h-6" />}
              />
            </li>
          )}

          {/* <li className=" bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
               
                    <NavLink to='/dashboard' end className={ ({ isActive }) =>
                        `flex items-center gap-2 vertical-center font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                        }`
                    }> <UserRoundPlus className="w-6 h-6" /> Add Job </NavLink>
                </li>
                <li className="flex items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
                <ChartColumn className="w-6 h-6" />
                    <NavLink to='/dashboard/stats' end className={({ isActive }) =>
                        `font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                        }`
                    }> Stats </NavLink>
                </li>
                <li className="flex items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
                <HandPlatter className="w-6 h-6" />
                    <NavLink to='/dashboard/all-jobs' end className={({ isActive }) =>
                        `font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                        }`
                    }> All Job </NavLink>
                </li >
                <li className="flex items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
                <UserPen className="w-6 h-6" />
                    <NavLink to='/dashboard/profile' end className={({ isActive }) =>
                        `font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                        }`
                    }> Profile </NavLink>
                </li>
                <li className="flex items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
                <UserStar  className="w-6 h-6" />
                    <NavLink to='/dashboard/admin' end className={({ isActive }) =>
                        `font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                        }`
                    }> Admin </NavLink>
                </li> */}
        </ul>
      </nav>
    </>
  );
}
