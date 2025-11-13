import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/admin/DashboardCard";

const Dashboard: React.FC = () => {
  const [stats] = useState([
    { title: "Total Products", value: 0 },
    { title: "Total Orders", value: 0 },
    { title: "Total Users", value: 0 },
    { title: "Revenue", value: "$0" },
  ]);

  // Optional: fetch real stats from backend if you have an admin/stats endpoint
  useEffect(() => {
    // Example: fetch("/admin/stats") ...
    // For now show placeholders or derive counts by fetching products/orders/users
    // fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <DashboardCard key={s.title} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Place for charts or recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Sales Chart</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            (chart will go here)
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium mb-2">Recent Orders</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">
            (recent orders table)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
