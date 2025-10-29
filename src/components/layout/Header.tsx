import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="shadow-md p-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <a href="http://www.XonTel.com">
          <img
            src="/src/assets/xontel-logo.png"
            alt="Logo"
            className="w-24 mr-2"
          />
        </a>
      </div>
      <div className="text-center">
        <h1 className="text-zinc-800 text-2xl font-bold">
          HR Feedback Admin Panel
        </h1>
      </div>
      <div className="flex items-center">
        {user && (
          <>
            <span className="mr-4 font-semibold text-stone-700">
              {user.firstName} {user.lastName}
            </span>
            <img
              src={user.profilePictureUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 rounded-full"
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
