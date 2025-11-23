import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { OrgFinancialSnapshot, ClientFinancialSnapshot, Client } from '../types';
import RevenueKpis from '../components/revenue/RevenueKpis';
import CashflowChart from '../components/revenue/CashflowChart';
import ProfitabilityTable from '../components/revenue/ProfitabilityTable';
import { useCurrentOrg } from '../lib/tenancy';

const RevenueAnalyticsPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [orgSnapshot, setOrgSnapshot] = useState<OrgFinancialSnapshot | undefined>();
  const [history, setHistory] = useState<OrgFinancialSnapshot[]>([]);
  const [clientSnapshots, setClientSnapshots] = useState<ClientFinancialSnapshot[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        // 1. Org Financials (Latest)
        const orgQ = query(collection(db, 'org_financial_monthly'), where('orgId', '==', orgId), orderBy('month', 'desc'), limit(12));
        const orgSnap = await getDocs(orgQ);
        const orgData = orgSnap.docs.map(d => d.data() as OrgFinancialSnapshot);
        if (orgData.length > 0) setOrgSnapshot(orgData[0]);
        setHistory(orgData);

        // 2. Client Snapshots (Latest Month)
        if (orgData.length > 0) {
            const lastMonth = orgData[0].month;
            const clientQ = query(collection(db, 'client_financial_monthly'), where('orgId', '==', orgId), where('month', '==', lastMonth));
            const cSnap = await getDocs(clientQ);
            setClientSnapshots(cSnap.docs.map(d => d.data() as ClientFinancialSnapshot));
        }

        // 3. Client details for names
        const clientsQ = query(collection(db, 'clients'), where('orgId', '==', orgId));
        const clSnap = await getDocs(clientsQ);
        setClients(clSnap.docs.map(d => ({id: d.id, ...d.data()} as Client)));
    };
    fetchData();
  }, [orgId]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Análises de Receita & Lucratividade</h1>
      
      {orgSnapshot ? (
        <>
            <RevenueKpis snapshot={orgSnapshot} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CashflowChart data={history} />
                {/* Placeholder for Expenses Breakdown Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center justify-center text-gray-400">
                    Gráfico de Despesas (Em Breve)
                </div>
            </div>
            <ProfitabilityTable snapshots={clientSnapshots} clients={clients} />
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Nenhum dado financeiro fechado ainda.</p>
        </div>
      )}
    </div>
  );
};

export default RevenueAnalyticsPage;
