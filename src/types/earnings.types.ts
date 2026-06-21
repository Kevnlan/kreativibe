export interface EarningsBreakdownItem {
  amount: number;
  percent: number;
}

export interface TopPerformingContentItem {
  contentId: string;
  title: string;
  salesCount: number;
  revenue: number;
}

export interface EarningsSummary {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  totalSales: number;
  averagePerSale: number;
  currency: string;
  breakdown: {
    contentSales: EarningsBreakdownItem;
    customRequests: EarningsBreakdownItem;
    bonuses: EarningsBreakdownItem;
  };
  topPerformingContent: TopPerformingContentItem[];
}

export interface DashboardStats {
  totalViews: number;
  totalLikes: number;
  walletBalance: number;
  pendingApplications: number;
}

export interface DashboardActivityItem {
  type: string;
  message: string;
  createdAt: string;
}

export interface DashboardSummary {
  verificationStatus: string;
  stats: DashboardStats;
  recentActivity: DashboardActivityItem[];
}
