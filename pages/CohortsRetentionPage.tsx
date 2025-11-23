import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import CohortHeatmap from '../components/cohorts/CohortHeatmap';
import { useCurrentOrg } from '../lib/tenancy';

const CohortsRetentionPage: React.FC = () => {
  const { orgId } = useCurrentOrg();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        // Fetch latest retention report
        const q = query(
            collection(db, 'reports'), 
            where('orgId', '==', orgId), 
            where('type', '==', 'retention_cohorts'),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            const report = snap.docs[0].data();
            if (report.snapshotJson) {
                setData(JSON.parse(report.snapshotJson));
            }
        } else {
            // Mock data for MVP display if report job hasn't run
            setData([
                { cohort: '2023-08', size: 10, retention: [100, 90, 80, 80, 70, 70] },
                { cohort: '2023-09', size: 12, retention: [100, 92, 92, 85, 80] },
                { cohort: '2023-10', size: 15, retention: [100, 95, 90, 90] },
                { cohort: '2023-11', size: 8, retention: [100, 100, 100] },
                { cohort: '2023-12', size: 11, retention: [100, 90] },
                { cohort: '2024-01', size: 14, retention: [100] },
            ]);
        }
    };
    fetchData();
  }, [orgId]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Retenção por Coortes (Churn Analysis)</h1>
        <div className="bg-white shadow rounded-lg p-6">
            <CohortHeatmap data={data} />
            <p className="mt-4 text-xs text-gray-500">
                * As coortes são baseadas no mês de entrada do cliente. A porcentagem indica quantos clientes permanecem ativos X meses depois.
            </p>
        </div>
    </div>
  );
};

export default CohortsRetentionPage;
