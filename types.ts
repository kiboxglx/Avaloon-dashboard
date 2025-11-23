export type ClientStatus = "lead" | "active" | "risk" | "churn";
export type ClientPriority = "high" | "medium" | "low";
export type ChannelType = "instagram" | "facebook" | "tiktok";

export interface ClientChannelAccount {
  channel: ChannelType;
  accountId: string;
  accessTokenEncrypted: string;
  connected: boolean;
  label?: string;
}

export interface Client {
  id: string;
  orgId: string;
  name: string;
  fantasyName?: string;
  email?: string;
  phone?: string;
  city?: string;
  segment?: string;
  status: ClientStatus;
  priority: ClientPriority;
  owner?: string;
  notes?: string;
  channelAccounts?: ClientChannelAccount[];
  createdAt: number;
  updatedAt: number;
  instagram?: {
    igBusinessId?: string;
    accessTokenEncrypted?: string;
    tokenExpiresAt?: number;
    connected: boolean;
  };
}

export interface IgDailyMetrics {
  id: string;
  orgId: string;
  clientId: string;
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  postsCount: number;
  reelsCount: number;
  deltaFollowersPct?: number;
  deltaReachPct?: number;
  deltaEngagementPct?: number;
  createdAt: number;
}

export interface Alert {
  id: string;
  orgId: string;
  clientId: string;
  type: string;
  severity: "low" | "medium" | "high";
  reason: string;
  open: boolean;
  detectedAt: number;
}

// ... Existing Revenue types ...
export interface Transaction {
  id: string;
  orgId: string;
  clientId?: string;
  type: "income" | "expense";
  category: "mrr" | "one_time" | "ads" | "payroll" | "tools" | "other";
  amount: number;
  date: string;
  notes?: string;
  createdByUid: string;
  createdAt: number;
  updatedAt: number;
}

export interface ClientFinancialSnapshot {
  id: string;
  orgId: string;
  clientId: string;
  month: string;
  mrr: number;
  arr: number;
  grossMarginPct: number;
  adsSpend: number;
  payrollAllocated: number;
  toolsAllocated: number;
  netRevenue: number;
  churnRiskPct?: number;
  createdAt: number;
}

export interface OrgFinancialSnapshot {
  id: string;
  orgId: string;
  month: string;
  totalMrr: number;
  totalArr: number;
  totalInflow: number;
  totalOutflow: number;
  grossMarginPct: number;
  netProfit: number;
  clientsActive: number;
  createdAt: number;
}

export interface Scenario {
  id: string;
  orgId: string;
  name: string;
  baseMonth: string;
  assumptions: {
    newClientsPerMonth: number;
    churnPct: number;
    avgMrrPerClient: number;
    adsSpendPerMonth: number;
    payrollPerMonth: number;
    toolsPerMonth: number;
  };
  results: {
    months: string[];
    projectedMrr: number[];
    projectedProfit: number[];
    projectedClients: number[];
  };
  createdByUid: string;
  createdAt: number;
  updatedAt: number;
}

// PROMPT 15 NEW TYPES

export type AutomationEvent =
  | "alert_opened"
  | "alert_closed"
  | "task_created"
  | "task_overdue"
  | "report_weekly_ready"
  | "report_monthly_ready"
  | "health_score_risk"
  | "content_scheduled_today"
  | "content_rejected";

export type AutomationAction =
  | "create_task"
  | "notify_team"
  | "notify_client"
  | "add_comment"
  | "queue_delivery_job"
  | "open_alert";

export interface AutomationRule {
  id: string;
  orgId: string;
  name: string;
  enabled: boolean;
  event: AutomationEvent;
  conditions?: {
    severity?: ("high" | "medium" | "low")[];
    clientStatus?: ClientStatus[];
    clientPriority?: ClientPriority[];
    channel?: ChannelType[];
    minHealthScore?: number;
    maxHealthScore?: number;
  };
  actions: {
    type: AutomationAction;
    params: Record<string, any>;
  }[];
  createdByUid: string;
  createdAt: number;
  updatedAt: number;
  lastRunAt?: number;
  runsCount?: number;
}

export type ContentType = "post" | "reel" | "story" | "ad";
export type ContentStatus = "draft" | "scheduled" | "in_review" | "approved" | "rejected" | "published";

export interface ContentItem {
  id: string;
  orgId: string;
  clientId: string;
  title: string;
  type: ContentType;
  channel: ChannelType | "all";
  status: ContentStatus;
  scheduledDate: string; // YYYY-MM-DD
  caption?: string;
  creativeAssetId?: string;
  notes?: string;
  createdByUid: string;
  createdAt: number;
  updatedAt: number;
}

export interface Approval {
  id: string;
  orgId: string;
  clientId: string;
  contentItemId: string;
  submittedByUid: string;
  status: "pending" | "approved" | "rejected";
  clientUid?: string;
  clientComment?: string;
  decidedAt?: number;
  createdAt: number;
}
