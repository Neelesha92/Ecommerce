import React from "react";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

interface Props {
  toggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white  px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FaBars />
        </button>

        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-72 text-sm focus:outline-none focus:ring-1"
            placeholder="Search products, orders, users..."
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <FaBell className="text-gray-600 cursor-pointer" />
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-600" />
          <div className="hidden sm:block">
            <div className="text-sm font-medium">Admin</div>
            <div className="text-xs text-gray-500">admin@megamart.com</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
