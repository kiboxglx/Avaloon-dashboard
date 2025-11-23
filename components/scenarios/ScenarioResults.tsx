import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Scenario } from '../../types';

interface ScenarioResultsProps {
  results: Scenario['results'];
}

const ScenarioResults: React.FC<ScenarioResultsProps> = ({ results }) => {
  const data = results.months.map((m, i) => ({
      month: m,
      MRR: results.projectedMrr[i],
      Lucro: results.projectedProfit[i],
      Clientes: results.projectedClients[i]
  }));

  const breakEvenIndex = results.projectedProfit.findIndex(p => p > 0);
  const breakEvenMonth = breakEvenIndex >= 0 ? results.months[breakEvenIndex] : 'Não atingido';

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-lg font-bold text-gray-800">Resultados da Simulação</h3>
         <span className={`px-3 py-1 rounded-full text-xs font-bold ${breakEvenIndex >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
             Break-even: {breakEvenMonth}
         </span>
      </div>
      
      <div className="h-64 mb-8">
         <p className="text-sm text-gray-500 mb-2">Projeção Financeira</p>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="MRR" stroke="#3B82F6" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="Lucro" stroke="#10B981" strokeWidth={2} />
            </LineChart>
         </ResponsiveContainer>
      </div>

      <div className="h-48">
         <p className="text-sm text-gray-500 mb-2">Crescimento de Clientes</p>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="step" dataKey="Clientes" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScenarioResults;
