import React from 'react';

interface CohortHeatmapProps {
  data: any[]; // { cohort: string, size: number, retention: number[] }
}

const CohortHeatmap: React.FC<CohortHeatmapProps> = ({ data }) => {
  const getColor = (pct: number) => {
      if (pct >= 90) return 'bg-green-600 text-white';
      if (pct >= 75) return 'bg-green-400 text-gray-900';
      if (pct >= 50) return 'bg-yellow-300 text-gray-900';
      if (pct >= 25) return 'bg-orange-300 text-gray-900';
      return 'bg-red-300 text-gray-900';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coorte</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clientes</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 0</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 1</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 2</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 3</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 4</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mês 5</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.cohort}>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-700">{row.cohort}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{row.size}</td>
              {row.retention.map((pct: number, i: number) => (
                <td key={i} className={`px-4 py-2 whitespace-nowrap text-center text-sm font-medium ${getColor(pct)}`}>
                    {pct.toFixed(0)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CohortHeatmap;
