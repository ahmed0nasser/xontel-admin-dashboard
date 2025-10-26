import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GrPieChart } from "react-icons/gr";
import { BiChat } from "react-icons/bi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { pathname } = useLocation();
  const dashboardColor = pathname === "/dashboard" && "text-brand-blue";
  const chatColor = pathname === "/chat" && "text-brand-blue";

  return (
    <aside
      className={`text-md font-bold p-2 h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-auto" : "w-0 overflow-hidden"
      }`}
    >
      <nav>
        <ul className="uppercase text-gray-600/70 mt-10 space-y-12">
          <li>
            <NavLink
              to="/dashboard"
              className={`block py-2 px-4 rounded duration-300 hover:text-brand-blue ${dashboardColor}`}
            >
              <div className="ml-5 text-5xl">
                <GrPieChart />
              </div>
              <div className="mt-4 text-xs tracking-widest flex justify-center">
                Dashboard
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={`block py-2 px-4 rounded duration-300 hover:text-brand-blue ${chatColor}`}
            >
              <div className="ml-5 text-5xl">
                <BiChat />
              </div>
              <div className="mt-2 text-xs tracking-widest flex justify-center">
                Chat
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
