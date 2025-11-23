import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { Scenario } from '../types';

export const runSimulation = async (
  orgId: string,
  baseMonth: string,
  assumptions: Scenario['assumptions']
): Promise<Scenario['results']> => {
  // In a real app this calls the backend. 
  // For MVP/Frontend preview, we can simulate locally or call the callable.
  
  try {
    const createScenarioFn = httpsCallable(functions, 'createScenarioCallable');
    // Note: If calling just for preview, backend needs a distinct 'simulate' endpoint 
    // or we implement simple logic here.
    
    // Simple frontend simulation for immediate feedback
    const months = [];
    const projectedMrr = [];
    const projectedProfit = [];
    const projectedClients = [];
    
    // Start with dummy baseline if snapshot missing
    let currentClients = 20; 
    
    for (let i = 1; i <= 6; i++) {
        const date = new Date(baseMonth);
        date.setMonth(date.getMonth() + i);
        months.push(date.toISOString().slice(0, 7)); // YYYY-MM
        
        // Churn & Growth
        const churned = currentClients * (assumptions.churnPct / 100);
        currentClients = currentClients - churned + assumptions.newClientsPerMonth;
        
        const mrr = currentClients * assumptions.avgMrrPerClient;
        const expenses = assumptions.adsSpendPerMonth + assumptions.payrollPerMonth + assumptions.toolsPerMonth;
        const profit = mrr - expenses;
        
        projectedClients.push(Math.round(currentClients));
        projectedMrr.push(mrr);
        projectedProfit.push(profit);
    }
    
    return { months, projectedMrr, projectedProfit, projectedClients };
  } catch (e) {
    console.error(e);
    throw e;
  }
};
