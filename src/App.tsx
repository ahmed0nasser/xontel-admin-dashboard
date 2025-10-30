import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import { HiMenu } from "react-icons/hi";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

function App() {
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/") {
      navigate("/dashboard");
    }
  }, [pathname, navigate]);

  // Automatically adjust sidebar based on screen size and close on navigation on mobile
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isDesktop, pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDesktop={isDesktop}
        />

        {/* Overlay for mobile */}
        {!isDesktop && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {!isDesktop && (
          <button
            onClick={toggleSidebar}
            className="text-2xl fixed top-20 right-4 z-20 bg-gray-300/60 text-brand-blue p-2 rounded-full shadow-lg transition-colors"
          >
            <HiMenu />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
