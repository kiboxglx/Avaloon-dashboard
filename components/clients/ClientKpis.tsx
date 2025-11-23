import React from 'react';

interface ClientKpiProps {
  label: string;
  value: string | number;
  trend?: number; // percentage
  trendLabel?: string;
  color?: "blue" | "green" | "purple" | "gray";
}

const ClientKpi: React.FC<ClientKpiProps> = ({ label, value, trend, trendLabel, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    gray: "bg-gray-50 text-gray-700",
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col">
      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {trendLabel && <span className="text-xs text-gray-400 mt-1">{trendLabel}</span>}
    </div>
  );
};

export default ClientKpi;