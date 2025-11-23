import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, where, addDoc } from 'firebase/firestore';
import { Client, IgDailyMetrics, Alert } from '../types';
import ClientKpi from '../components/clients/ClientKpis';
import ClientsTable from '../components/clients/ClientsTable';
import ClientForm from '../components/clients/ClientForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientsDashboardPageProps {
  navigate: (path: string) => void;
}

const ClientsDashboardPage: React.FC<ClientsDashboardPageProps> = ({ navigate }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [metricsMap, setMetricsMap] = useState<Record<string, IgDailyMetrics>>({});
  const [alertsMap, setAlertsMap] = useState<Record<string, Alert[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // 1. Fetch Clients
  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientsData);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Latest Metrics (Simplified: fetching all daily metrics for today/yesterday is heavy in prod, 
  // but for MVP we fetch recent ones or just listen to a 'latest_metrics' collection if we had one.
  // Here we listen to ig_metrics_daily limited)
  useEffect(() => {
    // Optimization: In real app, store "latestMetrics" directly on Client document to avoid this query.
    // For MVP, we'll just fetch the last 100 metrics.
    const q = query(collection(db, 'ig_metrics_daily'), orderBy('createdAt', 'desc'), where('createdAt', '>', Date.now() - 86400000 * 2)); // Last 2 days
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map: Record<string, IgDailyMetrics> = {};
      snapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() } as IgDailyMetrics;
        // Only keep the most recent per client
        if (!map[data.clientId]) {
          map[data.clientId] = data;
        }
      });
      setMetricsMap(map);
    });
    return () => unsubscribe();
  }, []);

  // 3. Fetch Alerts
  useEffect(() => {
    const q = query(collection(db, 'alerts'), where('open', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map: Record<string, Alert[]> = {};
      snapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() } as Alert;
        if (!map[data.clientId]) map[data.clientId] = [];
        map[data.clientId].push(data);
      });
      setAlertsMap(map);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Tem certeza? Isso não pode ser desfeito.')) {
      // Implement delete doc
      alert('Delete implementado no backend.'); 
    }
  };

  const filteredClients = clients.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                        (c.fantasyName && c.fantasyName.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Calculate Global KPIs
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const riskClients = clients.filter(c => c.status === 'risk').length;
  const churnClients = clients.filter(c => c.status === 'churn').length;
  const totalAlerts = Object.values(alertsMap).flat().length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Clientes</h1>
        <div className="flex space-x-4">
            <button 
                onClick={() => navigate('#/tv')}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Modo TV
            </button>
            <button 
                onClick={() => { setEditingClient(undefined); setShowForm(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium shadow-sm"
            >
                + Novo Cliente
            </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <ClientKpi label="Total Clientes" value={totalClients} color="gray" />
        <ClientKpi label="Ativos" value={activeClients} color="green" />
        <ClientKpi label="Em Risco" value={riskClients} color="purple" />
        <ClientKpi label="Churn" value={churnClients} color="gray" />
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col justify-center items-center">
            <span className="text-red-800 font-bold text-3xl">{totalAlerts}</span>
            <span className="text-red-600 text-xs uppercase font-medium">Alertas Abertos</span>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 gap-4">
        <div className="w-full md:w-1/3 relative">
            <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
            {['all', 'lead', 'active', 'risk', 'churn'].map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap ${filterStatus === status ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {status === 'all' ? 'Todos' : status}
                </button>
            ))}
        </div>
      </div>

      <ClientsTable 
        clients={filteredClients} 
        metricsMap={metricsMap}
        alertsMap={alertsMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(id) => navigate(`#/client/${id}`)}
      />

      {showForm && (
        <ClientForm 
            existingClient={editingClient} 
            onClose={() => setShowForm(false)} 
            onSuccess={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default ClientsDashboardPage;