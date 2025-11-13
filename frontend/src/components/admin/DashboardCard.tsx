import React from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}

const DashboardCard: React.FC<Props> = ({ title, value, subtitle }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
};

export default DashboardCard;
