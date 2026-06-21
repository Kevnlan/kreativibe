export interface RawPortfolioItem {
  id: string;
  title: string;
  brand: string;
  platform: string;
  type?: string;
  mediaUrl?: string;
  completedAt: string;
  reach?: number | null;
  engagement?: number | null;
  earnings?: string | number | null;
  rating?: number | null;
  tags: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  brand: string;
  platform: string;
  type?: string;
  mediaUrl?: string;
  completedAt: string;
  reach?: number;
  engagement?: number;
  earnings?: number;
  rating?: number;
  tags: string[];
}

export interface PortfolioListResponse {
  items: PortfolioItem[];
}

export interface AddPortfolioItemData {
  title: string;
  brand: string;
  platform: string;
  mediaUrl: string;
  completedAt: string;
  tags?: string[];
}
