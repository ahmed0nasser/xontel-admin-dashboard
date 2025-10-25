import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-charcoal text-soft-gray p-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <img
          src="/src/assets/xontel-logo.png"
          alt="Logo"
          className="h-8 w-8 mr-2"
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold">HR Feedback Admin Panel</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-4">Ahmed</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="h-8 w-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
