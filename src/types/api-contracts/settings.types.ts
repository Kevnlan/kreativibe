export type EmailFrequency = 'INSTANT' | 'DAILY' | 'WEEKLY' | 'NEVER';

export interface UserSettings {
  id: string;
  userId: string;
  emailFrequency: EmailFrequency;
  pushEnabled: boolean;
  smsEnabled: boolean;
  notificationTypes: string[];
  profileVisible: boolean;
  showEarnings: boolean;
  allowDirectMessages: boolean;
  showInSearch: boolean;
  preferredLanguage: string;
  preferredCurrency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsData {
  emailFrequency?: EmailFrequency;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  notificationTypes?: string[];
  profileVisible?: boolean;
  showEarnings?: boolean;
  allowDirectMessages?: boolean;
  showInSearch?: boolean;
  preferredLanguage?: string;
  preferredCurrency?: string;
  timezone?: string;
}
