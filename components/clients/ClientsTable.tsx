import React from 'react';
import { Client, IgDailyMetrics, Alert } from '../../types';
import AlertBadge from './AlertBadge';

interface ClientsTableProps {
  clients: Client[];
  metricsMap: Record<string, IgDailyMetrics>;
  alertsMap: Record<string, Alert[]>;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clients, metricsMap, alertsMap, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métricas (Ontem)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alertas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => {
            const m = metricsMap[client.id];
            const clientAlerts = alertsMap[client.id] || [];
            
            return (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => onView(client.id)}>
                        {client.fantasyName || client.name}
                      </div>
                      <div className="text-xs text-gray-500">{client.segment}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${client.status === 'active' ? 'bg-green-100 text-green-800' : 
                      client.status === 'risk' ? 'bg-red-100 text-red-800' : 
                      client.status === 'lead' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {client.status.toUpperCase()}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">Pri: {client.priority}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {m ? (
                    <div className="text-sm text-gray-600">
                      <div><span className="font-bold">{m.followers.toLocaleString()}</span> seg.</div>
                      <div><span className="font-bold">{m.reach.toLocaleString()}</span> alc.</div>
                      <div><span className="font-bold">{m.engagement.toLocaleString()}</span> eng.</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Sem dados</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {clientAlerts.length > 0 ? (
                    <div className="flex flex-col space-y-1">
                      {clientAlerts.map(a => (
                        <AlertBadge key={a.id} severity={a.severity} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-green-500 text-xs">✔ Tudo ok</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onView(client.id)} className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                  <button onClick={() => onEdit(client)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                  <button onClick={() => onDelete(client.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;