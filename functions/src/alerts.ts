import { IgDailyMetrics, Alert } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export const computeAlerts = (clientId: string, last7: IgDailyMetrics[], latest: IgDailyMetrics): Alert[] => {
  const alerts: Alert[] = [];
  const now = Date.now();
  const orgId = latest.orgId;

  // 1. Reach Drop (vs yesterday or average)
  // Using deltaReachPct calculated in index.ts
  if (latest.deltaReachPct !== undefined && latest.deltaReachPct <= -20) {
    alerts.push({
      id: uuidv4(),
      orgId,
      clientId,
      type: 'reach_drop',
      severity: latest.deltaReachPct <= -30 ? 'high' : 'medium',
      reason: `Queda de alcance de ${latest.deltaReachPct.toFixed(1)}% comparado a ontem.`,
      open: true,
      detectedAt: now
    });
  }

  // 2. Engagement Drop
  if (latest.deltaEngagementPct !== undefined && latest.deltaEngagementPct <= -20) {
    alerts.push({
      id: uuidv4(),
      orgId,
      clientId,
      type: 'engagement_drop',
      severity: latest.deltaEngagementPct <= -30 ? 'high' : 'medium',
      reason: `Queda de engajamento de ${latest.deltaEngagementPct.toFixed(1)}% comparado a ontem.`,
      open: true,
      detectedAt: now
    });
  }

  // 3. Low Frequency (Last 7 days)
  if (last7.length > 0) {
    const totalPosts = last7.reduce((sum, m) => sum + m.postsCount + m.reelsCount, 0);
    // Add today's
    const grandTotal = totalPosts + latest.postsCount + latest.reelsCount;
    
    if (grandTotal < 3) {
      alerts.push({
        id: uuidv4(),
        orgId,
        clientId,
        type: 'low_frequency',
        severity: 'medium',
        reason: `Baixa frequência: Apenas ${grandTotal} posts nos últimos 7 dias.`,
        open: true,
        detectedAt: now
      });
    }
  }

  // 4. Stagnant Followers (Last 7 days growth <= 0)
  if (last7.length >= 6) {
    const weekAgo = last7[0]; // Assuming sorted ascending in index.ts before passing here
    const growth = latest.followers - weekAgo.followers;
    
    if (growth <= 0) {
       alerts.push({
        id: uuidv4(),
        orgId,
        clientId,
        type: 'stagnant_followers',
        severity: 'low',
        reason: `Sem crescimento de seguidores na última semana.`,
        open: true,
        detectedAt: now
      });
    }
  }

  return alerts;
};