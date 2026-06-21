export type ScheduledPostPlatform = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'FACEBOOK';
export type ScheduledPostStatus = 'SCHEDULED' | 'PUBLISHED' | 'FAILED';

export interface ScheduledPost {
  id: string;
  campaignId: string;
  title: string;
  platform: ScheduledPostPlatform;
  scheduledDate: string;
  scheduledTime: string;
  status: ScheduledPostStatus;
  content: string;
  media: string[];
  socialAccountId?: string;
  publishedAt?: string;
  platformPostUrl?: string;
}

export interface CreateScheduledPostData {
  title: string;
  platform: ScheduledPostPlatform;
  scheduledDate: string;
  scheduledTime: string;
  content: string;
  media: string[];
  socialAccountId?: string;
}

export type UpdateScheduledPostData = Partial<CreateScheduledPostData>;
