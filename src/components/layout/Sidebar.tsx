import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`bg-charcoal text-soft-gray p-4 h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className="block py-2 px-4 rounded hover:bg-light-blue"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className="block py-2 px-4 rounded hover:bg-light-blue"
            >
              Chat
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
