import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { IgDailyMetrics } from '../types';

// This file now acts as a bridge to the Backend Cloud Functions.
// No direct Instagram API calls are made from the browser.

interface ConnectInstagramParams {
  clientId: string;
  igBusinessId: string;
  accessToken: string;
}

interface ConnectInstagramResult {
  success: boolean;
  message: string;
}

export const connectInstagram = async (params: ConnectInstagramParams): Promise<ConnectInstagramResult> => {
  try {
    const connectFn = httpsCallable<ConnectInstagramParams, ConnectInstagramResult>(functions, 'connectInstagram');
    const result = await connectFn(params);
    return result.data;
  } catch (error) {
    console.error("Error connecting Instagram:", error);
    throw new Error("Falha ao conectar com o backend.");
  }
};

export const triggerManualSync = async (clientId: string): Promise<void> => {
  try {
    const syncFn = httpsCallable<{ clientId: string }, void>(functions, 'manualSyncInstagram');
    await syncFn({ clientId });
  } catch (error) {
    console.error("Error triggering sync:", error);
    throw error;
  }
};

export const generateMockDailyMetric = (clientId: string, orgId: string, dateStr: string): IgDailyMetrics => {
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  
  return {
    id: `${clientId}_${dateStr}_mock`,
    orgId,
    clientId,
    date: dateStr,
    followers: randomInt(1000, 50000),
    reach: randomInt(500, 10000),
    impressions: randomInt(1000, 15000),
    engagement: randomInt(50, 2000),
    postsCount: randomInt(0, 2),
    reelsCount: randomInt(0, 1),
    deltaFollowersPct: Number((Math.random() * 10 - 2).toFixed(2)), // -2 to +8%
    deltaReachPct: Number((Math.random() * 40 - 20).toFixed(2)), // -20 to +20%
    deltaEngagementPct: Number((Math.random() * 40 - 20).toFixed(2)),
    createdAt: Date.now()
  };
};