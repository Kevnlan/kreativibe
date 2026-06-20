type Role = 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPPORT_AGENT';
type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  countryId?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbCreatorProfile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  instagram?: string;
  instagramFollowers?: number;
  tiktok?: string;
  tiktokFollowers?: number;
  youtube?: string;
  youtubeFollowers?: number;
  facebook?: string;
  twitter?: string;
  behance?: string;
  categories: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalReviews: number;
  totalEarnings: string;
  pricingJson: Record<string, number> | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbBrandProfile {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  logo?: string;
  website?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DbRefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbPasswordReset {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface DbEmailVerification {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbCampaignBrief {
  title: string;
  objective: string;
  targetAudience: {
    demographics: string[];
    interests: string[];
    location?: string;
  };
  platforms: string[];
  contentType: string[];
  budget: { min: number; max: number; currency: string };
  timeline: { startDate: string; endDate: string; milestones: string[] };
  deliverables: string[];
  kpis?: string[];
  additionalNotes?: string;
}

export interface DbCampaign {
  id: string;
  brandUserId: string;
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
  source: 'manual' | 'ai';
  brief?: DbCampaignBrief;
  createdAt: string;
  updatedAt: string;
}

export interface DbCampaignApplication {
  id: string;
  campaignId: string;
  creatorUserId: string;
  message: string;
  proposedRate?: number;
  currency?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DbAiConversation {
  id: string;
  brandUserId: string;
  title: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  createdAt: string;
  updatedAt: string;
}

class Database {
  users = new Map<string, DbUser>();
  creatorProfiles = new Map<string, DbCreatorProfile>(); // keyed by userId
  brandProfiles = new Map<string, DbBrandProfile>(); // keyed by userId
  refreshTokens = new Map<string, DbRefreshToken>(); // keyed by token
  passwordResets = new Map<string, DbPasswordReset>(); // keyed by token
  emailVerifications = new Map<string, DbEmailVerification>(); // keyed by token
  campaigns = new Map<string, DbCampaign>();
  applications = new Map<string, DbCampaignApplication>();
  aiConversations = new Map<string, DbAiConversation>();

  findUserByEmail(email: string): DbUser | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return undefined;
  }

  findUserById(id: string): DbUser | undefined {
    return this.users.get(id);
  }

  createUser(data: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt'>): DbUser {
    const now = new Date().toISOString();
    const user: DbUser = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.users.set(user.id, user);
    return user;
  }

  updateUser(id: string, updates: Partial<Omit<DbUser, 'id' | 'createdAt'>>): DbUser | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    this.users.set(id, updated);
    return updated;
  }

  createCreatorProfile(data: Omit<DbCreatorProfile, 'id' | 'createdAt' | 'updatedAt'>): DbCreatorProfile {
    const now = new Date().toISOString();
    const profile: DbCreatorProfile = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.creatorProfiles.set(profile.userId, profile);
    return profile;
  }

  findCreatorProfile(userId: string): DbCreatorProfile | undefined {
    return this.creatorProfiles.get(userId);
  }

  createBrandProfile(data: Omit<DbBrandProfile, 'id' | 'createdAt' | 'updatedAt'>): DbBrandProfile {
    const now = new Date().toISOString();
    const profile: DbBrandProfile = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.brandProfiles.set(profile.userId, profile);
    return profile;
  }

  findBrandProfile(userId: string): DbBrandProfile | undefined {
    return this.brandProfiles.get(userId);
  }

  createRefreshToken(userId: string, token: string, expiresAt: Date): DbRefreshToken {
    const record: DbRefreshToken = {
      id: crypto.randomUUID(),
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.refreshTokens.set(token, record);
    return record;
  }

  findRefreshToken(token: string): DbRefreshToken | undefined {
    return this.refreshTokens.get(token);
  }

  deleteRefreshToken(token: string): void {
    this.refreshTokens.delete(token);
  }

  deleteAllUserRefreshTokens(userId: string): void {
    for (const [key, rt] of this.refreshTokens.entries()) {
      if (rt.userId === userId) this.refreshTokens.delete(key);
    }
  }

  createPasswordReset(userId: string, token: string, expiresAt: Date): DbPasswordReset {
    const record: DbPasswordReset = {
      id: crypto.randomUUID(),
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: new Date().toISOString(),
    };
    this.passwordResets.set(token, record);
    return record;
  }

  findPasswordReset(token: string): DbPasswordReset | undefined {
    return this.passwordResets.get(token);
  }

  markPasswordResetUsed(token: string): void {
    const r = this.passwordResets.get(token);
    if (r) this.passwordResets.set(token, { ...r, used: true });
  }

  createEmailVerification(userId: string, token: string, expiresAt: Date): DbEmailVerification {
    const record: DbEmailVerification = {
      id: crypto.randomUUID(),
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.emailVerifications.set(token, record);
    return record;
  }

  findEmailVerification(token: string): DbEmailVerification | undefined {
    return this.emailVerifications.get(token);
  }

  deleteEmailVerification(token: string): void {
    this.emailVerifications.delete(token);
  }

  deleteAllUserEmailVerifications(userId: string): void {
    for (const [key, ev] of this.emailVerifications.entries()) {
      if (ev.userId === userId) this.emailVerifications.delete(key);
    }
  }

  createCampaign(data: Omit<DbCampaign, 'id' | 'createdAt' | 'updatedAt'>): DbCampaign {
    const now = new Date().toISOString();
    const campaign: DbCampaign = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  findCampaignById(id: string): DbCampaign | undefined {
    return this.campaigns.get(id);
  }

  findCampaignsByBrand(brandUserId: string): DbCampaign[] {
    return [...this.campaigns.values()].filter(c => c.brandUserId === brandUserId);
  }

  findActiveCampaigns(): DbCampaign[] {
    return [...this.campaigns.values()].filter(c => c.status === 'ACTIVE');
  }

  updateCampaign(id: string, updates: Partial<Omit<DbCampaign, 'id' | 'brandUserId' | 'createdAt'>>): DbCampaign | undefined {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    const updated = { ...campaign, ...updates, updatedAt: new Date().toISOString() };
    this.campaigns.set(id, updated);
    return updated;
  }

  deleteCampaign(id: string): boolean {
    return this.campaigns.delete(id);
  }

  createApplication(data: Omit<DbCampaignApplication, 'id' | 'createdAt' | 'updatedAt'>): DbCampaignApplication {
    const now = new Date().toISOString();
    const application: DbCampaignApplication = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.applications.set(application.id, application);
    return application;
  }

  findApplicationById(id: string): DbCampaignApplication | undefined {
    return this.applications.get(id);
  }

  findApplicationsByCampaign(campaignId: string): DbCampaignApplication[] {
    return [...this.applications.values()].filter(a => a.campaignId === campaignId);
  }

  findApplicationsByCreator(creatorUserId: string): DbCampaignApplication[] {
    return [...this.applications.values()].filter(a => a.creatorUserId === creatorUserId);
  }

  findApplication(campaignId: string, creatorUserId: string): DbCampaignApplication | undefined {
    return [...this.applications.values()].find(a => a.campaignId === campaignId && a.creatorUserId === creatorUserId);
  }

  updateApplication(id: string, updates: Partial<Omit<DbCampaignApplication, 'id' | 'campaignId' | 'creatorUserId' | 'createdAt'>>): DbCampaignApplication | undefined {
    const application = this.applications.get(id);
    if (!application) return undefined;
    const updated = { ...application, ...updates, updatedAt: new Date().toISOString() };
    this.applications.set(id, updated);
    return updated;
  }

  deleteApplication(id: string): boolean {
    return this.applications.delete(id);
  }

  createAiConversation(data: Omit<DbAiConversation, 'id' | 'createdAt' | 'updatedAt'>): DbAiConversation {
    const now = new Date().toISOString();
    const conversation: DbAiConversation = { id: crypto.randomUUID(), ...data, createdAt: now, updatedAt: now };
    this.aiConversations.set(conversation.id, conversation);
    return conversation;
  }

  findAiConversationById(id: string): DbAiConversation | undefined {
    return this.aiConversations.get(id);
  }

  findAiConversationsByBrand(brandUserId: string): DbAiConversation[] {
    return [...this.aiConversations.values()]
      .filter(c => c.brandUserId === brandUserId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  updateAiConversation(id: string, updates: Partial<Omit<DbAiConversation, 'id' | 'brandUserId' | 'createdAt'>>): DbAiConversation | undefined {
    const conversation = this.aiConversations.get(id);
    if (!conversation) return undefined;
    const updated = { ...conversation, ...updates, updatedAt: new Date().toISOString() };
    this.aiConversations.set(id, updated);
    return updated;
  }

  deleteAiConversation(id: string): boolean {
    return this.aiConversations.delete(id);
  }
}

// Singleton persists across Next.js hot reloads in development
const g = globalThis as typeof globalThis & { _kreativibeDb?: Database };
export const db = g._kreativibeDb ?? (g._kreativibeDb = new Database());
