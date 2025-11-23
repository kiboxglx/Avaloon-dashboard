import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Scenario } from '../../types';

const db = admin.firestore();

export const createScenarioCallable = functions.https.onCall(async (data, context) => {
    // const uid = context.auth?.uid; // In prod enable
    const uid = "admin_uid";
    const { orgId, name, baseMonth, assumptions } = data;

    if (!orgId) throw new functions.https.HttpsError('invalid-argument', 'orgId required');

    // Logic similar to frontend lib but server-side reliable
    const months = [];
    const projectedMrr = [];
    const projectedProfit = [];
    const projectedClients = [];
    
    let currentClients = 20; // Fetch from org_financial_monthly ideal
    
    for (let i = 1; i <= 6; i++) {
        const date = new Date(baseMonth);
        date.setMonth(date.getMonth() + i);
        months.push(date.toISOString().slice(0, 7));
        
        const churned = currentClients * (assumptions.churnPct / 100);
        currentClients = currentClients - churned + assumptions.newClientsPerMonth;
        
        const mrr = currentClients * assumptions.avgMrrPerClient;
        const expenses = assumptions.adsSpendPerMonth + assumptions.payrollPerMonth + assumptions.toolsPerMonth;
        const profit = mrr - expenses;
        
        projectedClients.push(Math.round(currentClients));
        projectedMrr.push(mrr);
        projectedProfit.push(profit);
    }

    const results = { months, projectedMrr, projectedProfit, projectedClients };

    const scenario: Scenario = {
        id: '', // set after add
        orgId,
        name,
        baseMonth,
        assumptions,
        results,
        createdByUid: uid,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    const ref = await db.collection('scenarios').add(scenario);
    return { id: ref.id, ...scenario };
});
