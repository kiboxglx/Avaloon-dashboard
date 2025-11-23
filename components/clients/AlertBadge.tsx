import React from 'react';

interface AlertBadgeProps {
  severity: "low" | "medium" | "high";
  count?: number;
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ severity, count }) => {
  const colors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200",
    low: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const label = count !== undefined ? `${count} Alerta${count > 1 ? 's' : ''}` : 'Alerta';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[severity]}`}>
      {label}
    </span>
  );
};

export default AlertBadge;