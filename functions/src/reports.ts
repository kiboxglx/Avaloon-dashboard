import { IgDailyMetrics } from '../../types';

export const generateReportSummary = (
    clientId: string, 
    clientName: string, 
    period: "weekly" | "monthly", 
    metrics: IgDailyMetrics[]
): string => {
    if (metrics.length < 2) {
        return `Dados insuficientes para gerar relatório ${period === 'weekly' ? 'semanal' : 'mensal'}.`;
    }

    // Sort just in case
    const sorted = [...metrics].sort((a, b) => a.createdAt - b.createdAt);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const followersGained = last.followers - first.followers;
    const totalReach = sorted.reduce((sum, m) => sum + m.reach, 0);
    const totalEngagement = sorted.reduce((sum, m) => sum + m.engagement, 0);
    const totalPosts = sorted.reduce((sum, m) => sum + m.postsCount + m.reelsCount, 0);

    const avgReach = Math.floor(totalReach / sorted.length);

    let summary = `Resumo ${period === 'weekly' ? 'Semanal' : 'Mensal'} - ${clientName}\n\n`;
    
    summary += `📊 VISÃO GERAL:\n`;
    summary += `- Novos Seguidores: ${followersGained > 0 ? '+' : ''}${followersGained}\n`;
    summary += `- Alcance Total Acumulado: ${totalReach.toLocaleString()}\n`;
    summary += `- Engajamento Total: ${totalEngagement.toLocaleString()}\n`;
    summary += `- Publicações no período: ${totalPosts}\n\n`;

    summary += `✅ DESTAQUES:\n`;
    if (followersGained > 0) summary += `- A base de seguidores cresceu!\n`;
    if (totalPosts >= (period === 'weekly' ? 3 : 12)) summary += `- Frequência de postagem consistente.\n`;
    else summary += `- Frequência de postagem abaixo do ideal.\n`;

    summary += `\n⚠️ PONTOS DE ATENÇÃO & RECOMENDAÇÕES:\n`;
    if (avgReach < 500) { // arbitrary threshold for MVP
        summary += `- Alcance médio baixo (${avgReach}). Recomendamos focar em Reels e Hashtags locais.\n`;
    }
    if (totalEngagement / totalReach < 0.02) { // < 2% engagement rate
        summary += `- Taxa de engajamento baixa. Tente call-to-actions mais diretos (ex: "Comente EU QUERO").\n`;
    }

    return summary;
};
