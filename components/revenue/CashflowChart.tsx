import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { OrgFinancialSnapshot } from '../../types';

interface CashflowChartProps {
  data: OrgFinancialSnapshot[];
}

const CashflowChart: React.FC<CashflowChartProps> = ({ data }) => {
  // Sort by date
  const chartData = [...data]
    .sort((a,b) => a.month.localeCompare(b.month))
    .map(d => ({
        month: d.month,
        Entradas: d.totalInflow,
        Saidas: d.totalOutflow,
        Lucro: d.netProfit
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 h-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Fluxo de Caixa (Últimos 12 Meses)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))} />
          <Legend />
          <Bar dataKey="Entradas" fill="#10B981" />
          <Bar dataKey="Saidas" fill="#EF4444" />
          <Bar dataKey="Lucro" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashflowChart;
