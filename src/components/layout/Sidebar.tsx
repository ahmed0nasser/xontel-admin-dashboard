import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GrPieChart } from "react-icons/gr";
import { BiChat } from "react-icons/bi";
import { subscribeToTotalUnreadCount } from "../../services/firebase";
import UnreadBadge from "../ui/UnreadBadge";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDesktop: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isDesktop }) => {
  const { pathname } = useLocation();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    const unsubPromise = subscribeToTotalUnreadCount((count) => {
      setTotalUnreadCount(count);
    });

    let unsubscribe: () => void;
    unsubPromise.then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const dashboardColor = pathname === "/dashboard" && "text-brand-blue";
  const chatColor = pathname === "/chat" && "text-brand-blue";

  const mobileClasses = `pt-40 fixed top-0 left-0 bg-white z-40 shadow-xl bg-white/90 ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  }`;

  return (
    <aside
      className={`${
        !isDesktop && mobileClasses
      } h-full ease-in-out duration-300 text-base font-bold lg:p-2`}
    >
      <nav>
        <ul className="uppercase text-gray-600/70 mt-10 space-y-16 lg:space-y-12">
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
              <div className="relative ml-5 text-5xl">
                <BiChat />
                {totalUnreadCount > 0 && (
                  <div className="absolute top-0 right-0">
                    <UnreadBadge count={totalUnreadCount} />
                  </div>
                )}
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
