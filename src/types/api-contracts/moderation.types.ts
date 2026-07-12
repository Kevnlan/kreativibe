export type ModerationStatus = 'QUEUED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export type ModerationRuleType =
  | 'BRAND_MENTION'
  | 'COPYRIGHT'
  | 'QUALITY'
  | 'SAFETY'
  | 'DISCLOSURE'
  | 'PLATFORM_COMPLIANCE'
  | 'CUSTOM';

export interface RejectionReason {
  id: string;
  reasonCode: string;
  notes: string;
}

export interface ModerationContentSummary {
  id: string;
  title: string;
  type: string;
  thumbnailUrl?: string;
  creatorProfile?: {
    id: string;
    avatar?: string;
    bio?: string;
  };
}

export interface ModerationRuleResult {
  id: string;
  ruleId: string;
  ruleName: string;
  passed: boolean;
  details?: string;
}

export interface ModerationEntry {
  id: string;
  contentId: string;
  status: ModerationStatus;
  assignedAdminId: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  content: ModerationContentSummary;
  ruleResults: ModerationRuleResult[];
  rejectionReasons: RejectionReason[];
}

export interface ModerationQueueResponse {
  items: ModerationEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface ModerationQueueFilters {
  status?: ModerationStatus;
  page?: number;
  limit?: number;
}

export interface RejectContentData {
  contentId: string;
  reasons: { reasonCode: string; notes: string }[];
  notes?: string;
}

export interface ApproveContentData {
  contentId: string;
  notes?: string;
}

export interface ModerationRule {
  id: string;
  name: string;
  description?: string;
  ruleType: ModerationRuleType;
  countryId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModerationRuleData {
  name: string;
  description?: string;
  ruleType: ModerationRuleType;
  countryId?: string;
  isActive: boolean;
}

export interface UpdateModerationRuleData {
  id: string;
  name?: string;
  description?: string;
  ruleType?: ModerationRuleType;
  countryId?: string;
  isActive?: boolean;
}

export interface CreatorModerationStatus {
  moderationStatus: ModerationStatus;
  contentStatus: string;
  rejectionReasons: RejectionReason[];
  reviewedAt?: string;
}
