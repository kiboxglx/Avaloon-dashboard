import React from 'react';
import { Client, IgDailyMetrics, Alert } from '../../types';

interface TvClientSlideProps {
  client: Client;
  metrics?: IgDailyMetrics;
  alerts: Alert[];
}

const TvClientSlide: React.FC<TvClientSlideProps> = ({ client, metrics, alerts }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-12 bg-gray-950 h-full">
      <div className="w-full max-w-5xl">
        {/* Header of the Card */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-6xl font-extrabold text-white mb-4">{client.fantasyName || client.name}</h2>
            <p className="text-2xl text-gray-400">{client.segment}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
             <span className={`px-6 py-2 rounded-lg text-2xl font-bold uppercase tracking-wide
              ${client.status === 'risk' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}
             `}>
               {client.status}
             </span>
             <span className="text-gray-500 text-lg uppercase tracking-wider">Prioridade: {client.priority}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col items-center">
            <span className="text-gray-400 text-xl uppercase mb-2">Seguidores</span>
            <span className="text-5xl font-bold text-white">{metrics?.followers.toLocaleString() || '-'}</span>
            {metrics?.deltaFollowersPct !== undefined && (
              <span className={`mt-2 text-lg ${metrics.deltaFollowersPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                 {metrics.deltaFollowersPct > 0 ? '+' : ''}{metrics.deltaFollowersPct.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col items-center">
            <span className="text-gray-400 text-xl uppercase mb-2">Alcance (Dia)</span>
            <span className="text-5xl font-bold text-white">{metrics?.reach.toLocaleString() || '-'}</span>
            {metrics?.deltaReachPct !== undefined && (
              <span className={`mt-2 text-lg ${metrics.deltaReachPct >= -10 ? 'text-gray-400' : 'text-red-500'}`}>
                 {metrics.deltaReachPct.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 flex flex-col items-center">
             <span className="text-gray-400 text-xl uppercase mb-2">Engajamento</span>
            <span className="text-5xl font-bold text-white">{metrics?.engagement.toLocaleString() || '-'}</span>
             {metrics?.deltaEngagementPct !== undefined && (
              <span className={`mt-2 text-lg ${metrics.deltaEngagementPct >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                 {metrics.deltaEngagementPct.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-8">
            <h3 className="text-red-500 text-2xl font-bold mb-6 flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              ATENÇÃO REQUERIDA
            </h3>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-red-950/50 p-4 rounded-lg border border-red-900/30 flex items-center justify-between">
                  <span className="text-white text-xl">{alert.reason}</span>
                  <span className="text-red-300 text-sm uppercase font-bold">{alert.type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TvClientSlide;