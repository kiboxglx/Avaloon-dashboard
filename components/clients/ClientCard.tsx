import React from 'react';
import { Client, IgDailyMetrics } from '../../types';
import AlertBadge from './AlertBadge';

interface ClientCardProps {
  client: Client;
  metrics?: IgDailyMetrics;
  alertCount: number;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, metrics, alertCount, onClick }) => {
  const statusColors = {
    lead: "bg-gray-100 text-gray-600",
    active: "bg-green-100 text-green-700",
    risk: "bg-red-100 text-red-700",
    churn: "bg-black text-white",
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{client.fantasyName || client.name}</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[client.status]}`}>
            {client.status}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          {client.segment || 'Sem segmento'}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <span className="block text-xs text-gray-400">Seguidores</span>
            <span className="block font-semibold text-gray-800">{metrics?.followers.toLocaleString() || '-'}</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-gray-400">Alcance</span>
            <span className="block font-semibold text-gray-800">{metrics?.reach.toLocaleString() || '-'}</span>
          </div>
          <div className="text-center">
            <span className="block text-xs text-gray-400">Engaj.</span>
            <span className="block font-semibold text-gray-800">{metrics?.engagement.toLocaleString() || '-'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <div>
          {alertCount > 0 ? (
            <AlertBadge severity="high" count={alertCount} />
          ) : (
             <span className="text-xs text-green-600 flex items-center">
               <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
               Regular
             </span>
          )}
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline">Ver detalhes</button>
      </div>
    </div>
  );
};

export default ClientCard;