import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBox,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

interface Props {
  isOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ isOpen }) => {
  const location = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { to: "/admin/products", label: "Products", icon: <FaBox /> },
    { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
    { to: "/admin/orders", label: "Orders", icon: <FaShoppingCart /> },
    { to: "/admin/users", label: "Users", icon: <FaUsers /> },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white transition-all duration-200`}
    >
      <div className="h-16 flex items-center justify-center ">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>
          {isOpen && <span className="text-lg font-semibold">Admin</span>}
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        {links.map((l) => {
          const active = location.pathname.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-3 p-2 rounded-md text-sm ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{l.icon}</span>
              <span className={`${!isOpen ? "hidden" : ""}`}>{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
