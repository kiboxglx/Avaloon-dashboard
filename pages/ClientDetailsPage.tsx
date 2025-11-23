import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { Client, IgDailyMetrics, Alert } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { generateMockDailyMetric } from '../lib/instagram';
import AlertBadge from '../components/clients/AlertBadge';
import { format } from 'date-fns';

interface ClientDetailsPageProps {
  clientId: string;
  navigate: (path: string) => void;
}

const ClientDetailsPage: React.FC<ClientDetailsPageProps> = ({ clientId, navigate }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [metrics, setMetrics] = useState<IgDailyMetrics[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reportSummary, setReportSummary] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      // 1. Client Info
      const clientDoc = await getDoc(doc(db, 'clients', clientId));
      if (clientDoc.exists()) {
        setClient({ id: clientDoc.id, ...clientDoc.data() } as Client);
      }

      // 2. Metrics (Last 14 days)
      const mQuery = query(
        collection(db, 'ig_metrics_daily'), 
        where('clientId', '==', clientId),
        orderBy('createdAt', 'asc')
      );
      const mSnapshot = await getDocs(mQuery);
      setMetrics(mSnapshot.docs.map(d => d.data() as IgDailyMetrics));

      // 3. Alerts
      const aQuery = query(collection(db, 'alerts'), where('clientId', '==', clientId), orderBy('detectedAt', 'desc'));
      const aSnapshot = await getDocs(aQuery);
      setAlerts(aSnapshot.docs.map(d => d.data() as Alert));
    };

    fetchData();
  }, [clientId]);

  const generateReport = () => {
    if (!client || metrics.length < 2) {
      setReportSummary("Dados insuficientes para gerar relatório.");
      return;
    }

    const latest = metrics[metrics.length - 1];
    const previous = metrics[metrics.length - 2];

    const growth = latest.followers - previous.followers;
    const reachChange = latest.reach - previous.reach;
    
    let summary = `Resumo para ${client.fantasyName || client.name}:\n\n`;
    summary += `1. Crescimento: ${growth > 0 ? '+' : ''}${growth} seguidores novos desde ontem.\n`;
    summary += `2. Alcance: ${reachChange > 0 ? 'Aumentou' : 'Caiu'} em ${Math.abs(reachChange)} contas.\n`;
    summary += `3. Engajamento Atual: ${latest.engagement} interações.\n\n`;
    
    if (latest.reach < 1000) summary += "RECOMENDAÇÃO: Aumentar frequência de Reels para recuperar alcance.\n";
    if (latest.engagement < 50) summary += "RECOMENDAÇÃO: Criar stories interativos (enquetes) hoje.\n";

    setReportSummary(summary);
  };

  const simulateData = async () => {
    if (!client) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const mock = generateMockDailyMetric(clientId, client.orgId, todayStr);
    await addDoc(collection(db, 'ig_metrics_daily'), mock);
    
    // Also create a mock alert if random
    if (Math.random() > 0.7) {
        await addDoc(collection(db, 'alerts'), {
            clientId,
            orgId: client.orgId,
            type: 'reach_drop',
            severity: 'high',
            reason: 'Queda brusca de alcance (-25%)',
            open: true,
            detectedAt: Date.now()
        });
    }

    alert('Dados simulados gerados! Recarregue a página.');
    window.location.reload();
  };

  if (!client) return <div className="p-8">Carregando...</div>;

  const chartData = metrics.map(m => ({
    date: m.date.substring(5), // MM-DD
    followers: m.followers,
    reach: m.reach,
    engagement: m.engagement
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-4 text-gray-500 hover:text-gray-900 flex items-center">
        &larr; Voltar ao Dashboard
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{client.fantasyName || client.name}</h1>
          <p className="text-gray-500">{client.segment}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={simulateData} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                Simular Dados (Demo)
            </button>
            <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-800`}>
                {client.status}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Charts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Alcance & Engajamento (14 Dias)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={2} name="Alcance" />
                  <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} name="Engajamento" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Crescimento de Seguidores</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="followers" stroke="#8B5CF6" strokeWidth={2} name="Seguidores" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Relatório Inteligente</h3>
            <p className="text-sm text-blue-700 mb-4">Gere um resumo automático baseado nos dados recentes.</p>
            <button 
                onClick={generateReport}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
                Gerar Resumo
            </button>
            {reportSummary && (
                <div className="mt-4 p-3 bg-white rounded border border-blue-100 text-sm whitespace-pre-line text-gray-700">
                    {reportSummary}
                </div>
            )}
          </div>

          {/* Alert History */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Histórico de Alertas</h3>
            <div className="space-y-3">
                {alerts.length === 0 && <p className="text-gray-400 text-sm">Nenhum alerta registrado.</p>}
                {alerts.map(alert => (
                    <div key={alert.id} className="flex flex-col border-l-2 border-red-200 pl-3 py-1">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{format(alert.detectedAt, 'dd/MM/yyyy')}</span>
                            <AlertBadge severity={alert.severity} />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mt-1">{alert.reason}</p>
                    </div>
                ))}
            </div>
          </div>

           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">Detalhes da Conta</h3>
            <div className="text-sm space-y-2 text-gray-600">
                <p><strong>Email:</strong> {client.email || '-'}</p>
                <p><strong>Telefone:</strong> {client.phone || '-'}</p>
                <p><strong>Instagram ID:</strong> {client.instagram?.igBusinessId || 'Não conectado'}</p>
                <p><strong>Responsável:</strong> {client.owner || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;