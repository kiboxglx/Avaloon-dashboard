import React, { useState } from 'react';
import { Scenario } from '../../types';

interface ScenarioFormProps {
  onSimulate: (assumptions: Scenario['assumptions']) => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSimulate }) => {
  const [assumptions, setAssumptions] = useState<Scenario['assumptions']>({
    newClientsPerMonth: 2,
    churnPct: 5,
    avgMrrPerClient: 2000,
    adsSpendPerMonth: 5000,
    payrollPerMonth: 15000,
    toolsPerMonth: 1000
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssumptions(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Premissas do Cenário</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-gray-700">Novos Clientes/Mês</label>
           <input type="number" name="newClientsPerMonth" value={assumptions.newClientsPerMonth} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Churn Mensal (%)</label>
           <input type="number" name="churnPct" value={assumptions.churnPct} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Ticket Médio (MRR)</label>
           <input type="number" name="avgMrrPerClient" value={assumptions.avgMrrPerClient} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Gasto Ads/Mês (Org)</label>
           <input type="number" name="adsSpendPerMonth" value={assumptions.adsSpendPerMonth} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Folha de Pagamento</label>
           <input type="number" name="payrollPerMonth" value={assumptions.payrollPerMonth} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Ferramentas</label>
           <input type="number" name="toolsPerMonth" value={assumptions.toolsPerMonth} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
      </div>
      <button 
        onClick={() => onSimulate(assumptions)}
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-bold"
      >
        Simular Projeção (6 Meses)
      </button>
    </div>
  );
};

export default ScenarioForm;
