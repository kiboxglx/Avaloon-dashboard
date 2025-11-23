import React from 'react';
import { ClientFinancialSnapshot, Client } from '../../types';

interface ProfitabilityTableProps {
  snapshots: ClientFinancialSnapshot[];
  clients: Client[];
}

const ProfitabilityTable: React.FC<ProfitabilityTableProps> = ({ snapshots, clients }) => {
  const getClientName = (id: string) => {
      const c = clients.find(cl => cl.id === id);
      return c ? (c.fantasyName || c.name) : id;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Rentabilidade por Cliente</h3>
      </div>
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gasto Ads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro Líq.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margem</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {snapshots.map(snap => (
                <tr key={snap.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getClientName(snap.clientId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snap.mrr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snap.adsSpend)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${snap.netRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snap.netRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${snap.grossMarginPct > 40 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {snap.grossMarginPct.toFixed(0)}%
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default ProfitabilityTable;
