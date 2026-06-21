export type ReputationLevel = 'RISING_STAR' | 'CONTENT_PRO' | 'TOP_CREATOR' | 'ELITE_CREATOR';

export interface ReputationSummary {
  totalPoints: number;
  currentLevel: ReputationLevel;
  progressToNext: number;
}

export type PointsHistoryType = 'EARNED' | 'BONUS' | 'MILESTONE';

export interface PointsHistoryItem {
  id: string;
  activity: string;
  points: number;
  type: PointsHistoryType;
  date: string;
}

export interface PointsHistoryResponse {
  items: PointsHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earnedAt?: string | null;
  progress: number;
  target: number;
}
