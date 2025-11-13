import React, { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "../../components/admin/sidebar";
import Header from "../../components/admin/Header";

interface Props {
  children: ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
