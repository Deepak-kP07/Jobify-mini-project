import { NavLink } from "react-router-dom";
export default function SidebarItem({ path, text, icon }) {
    return <>
        <div className="flex items-center gap-2 vertical-center bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors hover:text-[#2EB0BC]">
           
            <NavLink to={path} end className={({ isActive }) =>
                `flex items-center gap-2 vertical-center font-medium transition-colors ${isActive ? "text-[#2EB0BC]" : "hover:text-[#2EB0BC]"
                }`
            }>  {icon} {text} </NavLink>
        </div>
    </>
}