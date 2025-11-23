import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const buildRetentionCohorts = async (orgId: string) => {
    // 1. Fetch all clients
    const clientsSnap = await db.collection('clients').where('orgId', '==', orgId).get();
    const clients = clientsSnap.docs.map(d => d.data());

    // 2. Group by createdAt Month
    const cohorts: Record<string, any[]> = {};
    clients.forEach(client => {
        const date = new Date(client.createdAt);
        const month = date.toISOString().slice(0, 7); // YYYY-MM
        if (!cohorts[month]) cohorts[month] = [];
        cohorts[month].push(client);
    });

    // 3. Calculate retention
    // Simple logic: If status != 'churn', they are retained.
    // In real world, check transaction history per month.
    
    const matrix: any[] = [];
    
    Object.keys(cohorts).sort().forEach(month => {
        const cohortClients = cohorts[month];
        const size = cohortClients.length;
        
        // For M1..M6, check if they are still active relative to now
        // This is a simplified "snapshot" view. A real view needs historical status logs.
        const retainedCount = cohortClients.filter(c => c.status !== 'churn').length;
        const pct = size > 0 ? (retainedCount / size) * 100 : 0;
        
        matrix.push({
            cohort: month,
            size,
            retention: [100, pct, pct, pct, pct, pct] // Simplified for MVP (M0 is always 100%)
        });
    });

    // Store in reports collection
    await db.collection('reports').add({
        orgId,
        type: 'retention_cohorts',
        summaryText: 'Análise de Coortes',
        snapshotJson: JSON.stringify(matrix),
        createdAt: Date.now()
    });
};
