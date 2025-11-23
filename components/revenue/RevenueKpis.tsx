import React from 'react';
import { OrgFinancialSnapshot } from '../../types';

interface RevenueKpisProps {
  snapshot?: OrgFinancialSnapshot;
}

const RevenueKpis: React.FC<RevenueKpisProps> = ({ snapshot }) => {
  if (!snapshot) return <div className="p-4">Carregando dados financeiros...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-gray-500 text-xs uppercase">MRR Total</p>
        <p className="text-2xl font-bold text-gray-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snapshot.totalMrr)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-gray-500 text-xs uppercase">ARR Projetado</p>
        <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snapshot.totalArr)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-gray-500 text-xs uppercase">Lucro Líquido (Mês)</p>
        <p className={`text-2xl font-bold ${snapshot.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(snapshot.netProfit)}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
        <p className="text-gray-500 text-xs uppercase">Margem Bruta</p>
        <p className={`text-2xl font-bold ${snapshot.grossMarginPct >= 50 ? 'text-green-500' : 'text-orange-500'}`}>
            {snapshot.grossMarginPct.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};

export default RevenueKpis;
