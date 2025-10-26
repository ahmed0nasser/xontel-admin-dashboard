import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/") {
      navigate("/dashboard");
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-soft-gray h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-4 overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <Outlet />
        </main>
        {/* <button
          onClick={toggleSidebar}
          className={`absolute top-4 bg-brand-blue text-white p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? "left-64 -translate-x-1/2"
              : "left-0 translate-x-1/2"
          }`}
        >
          {isSidebarOpen ? "<" : ">"}
        </button> */}
      </div>
    </div>
  );
}

export default App;
