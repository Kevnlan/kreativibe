import type { CampaignBrief } from '../components/campaign/BriefGenerator';
import type { PackageOption } from '../components/campaign/PackageRecommender';

export type { CampaignBrief, PackageOption };

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

// Raw shape returned by the backend (Prisma decimals serialize as strings,
// nullable columns come back as null rather than undefined).
export interface RawCampaign {
  id: string;
  brandProfileId: string;
  title: string;
  objective: string;
  description?: string | null;
  audience?: string | null;
  platforms: string[];
  contentTypes: string[];
  categories: string[];
  deliverables: string[];
  milestones: string[];
  messaging?: string | null;
  tone?: string | null;
  budgetMin: string | number;
  budgetMax: string | number;
  currency: string;
  startDate?: string | null;
  endDate?: string | null;
  status: CampaignStatus;
  source: 'MANUAL' | 'AI';
  brief?: CampaignBrief | null;
  createdAt: string;
  updatedAt: string;
  _count?: { applications: number };
  brandProfile?: { companyName: string; logo?: string | null; isVerified: boolean };
}

export interface RawCampaignListResponse {
  items: RawCampaign[];
  total: number;
  page: number;
  limit: number;
}

export interface Campaign {
  id: string;
  brandProfileId: string;
  title: string;
  objective: string;
  description?: string;
  audience?: string;
  platforms: string[];
  contentTypes: string[];
  categories: string[];
  deliverables: string[];
  milestones: string[];
  messaging?: string;
  tone?: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  status: CampaignStatus;
  source: 'MANUAL' | 'AI';
  brief?: CampaignBrief;
  applicationCount: number;
  brandProfile?: { companyName: string; logo?: string; isVerified: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignListResponse {
  items: Campaign[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCampaignData {
  title: string;
  objective: string;
  description?: string;
  audience?: string;
  platforms: string[];
  contentTypes: string[];
  categories?: string[];
  deliverables?: string[];
  milestones?: string[];
  messaging?: string;
  tone?: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  source: 'manual' | 'ai';
  brief?: CampaignBrief;
}

export interface CampaignFilters {
  status?: CampaignStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MarketplaceCampaignFilters {
  platform?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RawCampaignApplication {
  id: string;
  campaignId: string;
  creatorUserId: string;
  message: string;
  proposedRate?: string | number | null;
  currency?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  creatorProfile?: { userId: string; bio?: string | null; avatar?: string | null; categories: string[]; averageRating: number };
  campaign?: { title: string; status: CampaignStatus; brandProfileId: string };
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  creatorUserId: string;
  message: string;
  proposedRate?: number;
  currency?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  creatorProfile?: { userId: string; bio?: string; avatar?: string; categories: string[]; averageRating: number };
  campaign?: { title: string; status: CampaignStatus; brandProfileId: string };
}

export interface ApplyToCampaignData {
  message: string;
  proposedRate?: number;
  currency?: string;
}

export interface CampaignStats {
  totalApplications: number;
  applicationsByStatus: Partial<Record<ApplicationStatus, number>>;
  acceptedCreators: number;
}

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
  suggestions?: string[];
}

export interface AiConversation {
  id: string;
  title: string;
  messages: AiChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export type ProposalStatus = 'DRAFT' | 'SUBMITTED';

export interface RawProposal {
  id: string;
  campaignId: string;
  creatorUserId: string;
  status: ProposalStatus;
  proposedRate?: string | number | null;
  currency?: string | null;
  deliverables: string[];
  timeline?: string | null;
  coverLetter?: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
}

export interface Proposal {
  id: string;
  campaignId: string;
  creatorUserId: string;
  status: ProposalStatus;
  proposedRate?: number;
  currency?: string;
  deliverables: string[];
  timeline?: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface SaveProposalData {
  proposedRate: number;
  currency: string;
  deliverables: string[];
  timeline: string;
  coverLetter: string;
}

export type MilestoneStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  dueDate?: string;
  amount: number;
  currency: string;
  status: MilestoneStatus;
  deliverables: string[];
  submittedAt?: string;
  approvedAt?: string;
}

export type MilestoneDeliveryItemType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LINK';

export interface MilestoneDeliveryItem {
  title: string;
  type: MilestoneDeliveryItemType;
  url: string;
  thumbnail?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface MilestoneDelivery {
  milestoneId: string;
  milestoneTitle: string;
  submittedBy: string;
  submittedAt: string;
  items: MilestoneDeliveryItem[];
  notes?: string;
  status: MilestoneStatus;
  reviewNotes?: string;
}

export interface SubmitMilestoneDeliveryData {
  items: MilestoneDeliveryItem[];
  notes?: string;
}
