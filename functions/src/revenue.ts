import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ClientFinancialSnapshot, OrgFinancialSnapshot, Transaction } from '../../types';

const db = admin.firestore();

export const computeClientFinancialSnapshot = async (orgId: string, clientId: string, month: string) => {
  // 1. Get Transactions for this client in this month
  const start = `${month}-01`;
  const end = `${month}-31`; // Rough end
  
  const txSnapshot = await db.collection('transactions')
    .where('orgId', '==', orgId)
    .where('clientId', '==', clientId)
    .where('date', '>=', start)
    .where('date', '<=', end)
    .get();

  const txs = txSnapshot.docs.map(d => d.data() as Transaction);

  const mrr = txs.filter(t => t.type === 'income' && t.category === 'mrr')
                 .reduce((sum, t) => sum + t.amount, 0);
  
  const oneTime = txs.filter(t => t.type === 'income' && t.category === 'one_time')
                     .reduce((sum, t) => sum + t.amount, 0);

  const adsSpend = txs.filter(t => t.type === 'expense' && t.category === 'ads')
                      .reduce((sum, t) => sum + t.amount, 0);

  // Allocations (simplified: fetch global org expenses and divide by client count or weight by MRR)
  // For MVP, we assume 0 or pre-calculated fields
  const payrollAllocated = 0; 
  const toolsAllocated = 0;

  const netRevenue = (mrr + oneTime) - (adsSpend + payrollAllocated + toolsAllocated);
  const grossMarginPct = (mrr + oneTime) > 0 ? (netRevenue / (mrr + oneTime)) * 100 : 0;

  const snapshot: ClientFinancialSnapshot = {
    id: `${orgId}_${clientId}_${month}`,
    orgId,
    clientId,
    month,
    mrr,
    arr: mrr * 12,
    grossMarginPct,
    adsSpend,
    payrollAllocated,
    toolsAllocated,
    netRevenue,
    churnRiskPct: grossMarginPct < 20 ? 80 : 10, // Simple heuristic
    createdAt: Date.now()
  };

  await db.collection('client_financial_monthly').doc(snapshot.id).set(snapshot);
  return snapshot;
};

export const computeOrgFinancialSnapshot = async (orgId: string, month: string) => {
    // Aggregate all client snapshots + org level transactions
    const start = `${month}-01`;
    const end = `${month}-31`;

    const txSnapshot = await db.collection('transactions')
        .where('orgId', '==', orgId)
        .where('date', '>=', start)
        .where('date', '<=', end)
        .get();
    
    const txs = txSnapshot.docs.map(d => d.data() as Transaction);
    
    const totalInflow = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalOutflow = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalMrr = txs.filter(t => t.type === 'income' && t.category === 'mrr').reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalInflow - totalOutflow;
    const grossMarginPct = totalInflow > 0 ? (netProfit / totalInflow) * 100 : 0;

    // Count active clients
    const clientsSnap = await db.collection('clients')
        .where('orgId', '==', orgId)
        .where('status', '==', 'active')
        .count()
        .get();

    const snapshot: OrgFinancialSnapshot = {
        id: `${orgId}_${month}`,
        orgId,
        month,
        totalMrr,
        totalArr: totalMrr * 12,
        totalInflow,
        totalOutflow,
        grossMarginPct,
        netProfit,
        clientsActive: clientsSnap.data().count,
        createdAt: Date.now()
    };

    await db.collection('org_financial_monthly').doc(snapshot.id).set(snapshot);
};
