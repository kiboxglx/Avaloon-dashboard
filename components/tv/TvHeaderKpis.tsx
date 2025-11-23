import React from 'react';
import { Client } from '../../types';

interface TvHeaderKpisProps {
  clients: Client[];
}

const TvHeaderKpis: React.FC<TvHeaderKpisProps> = ({ clients }) => {
  const total = clients.length;
  const active = clients.filter(c => c.status === 'active').length;
  const risk = clients.filter(c => c.status === 'risk').length;
  
  return (
    <div className="flex justify-between items-center bg-gray-900 p-6 border-b border-gray-800">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">AVALOON <span className="text-blue-500">FINANCEIRO</span></h1>
        <span className="ml-4 px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded uppercase tracking-widest">Modo TV</span>
      </div>
      
      <div className="flex space-x-8">
        <div className="text-center">
          <p className="text-gray-400 text-xs uppercase">Total Clientes</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="text-center">
          <p className="text-green-500 text-xs uppercase">Ativos</p>
          <p className="text-3xl font-bold text-green-400">{active}</p>
        </div>
        <div className="text-center">
          <p className="text-red-500 text-xs uppercase">Em Risco</p>
          <p className="text-3xl font-bold text-red-500">{risk}</p>
        </div>
      </div>
    </div>
  );
};

export default TvHeaderKpis;