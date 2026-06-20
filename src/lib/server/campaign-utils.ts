import { db, DbCampaign, DbCampaignApplication, DbAiConversation, CampaignStatus } from './db';

export function transitionCampaignStatus(
  id: string,
  brandUserId: string,
  allowedFrom: CampaignStatus[],
  to: CampaignStatus
): { error: { message: string; code: string; status: number } } | { campaign: DbCampaign } {
  const campaign = db.findCampaignById(id);
  if (!campaign || campaign.brandUserId !== brandUserId) {
    return { error: { message: 'Campaign not found', code: 'NOT_FOUND', status: 404 } };
  }
  if (!allowedFrom.includes(campaign.status)) {
    return {
      error: {
        message: `Campaign must be ${allowedFrom.join(' or ')} to perform this action (currently ${campaign.status})`,
        code: 'INVALID_STATUS_TRANSITION',
        status: 409,
      },
    };
  }
  const updated = db.updateCampaign(id, { status: to })!;
  return { campaign: updated };
}

export function toApiCampaign(c: DbCampaign) {
  const { brandUserId: _brandUserId, ...rest } = c;
  return { ...rest, brandId: _brandUserId };
}

export function toApiApplication(a: DbCampaignApplication) {
  return a;
}

export function toApiAiConversation(c: DbAiConversation) {
  const { brandUserId: _brandUserId, ...rest } = c;
  return rest;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const FOLLOWUP_QUESTIONS = [
  "Great! What platforms would you like to focus on, and what's your budget range?",
  'Got it. Who is your target audience, and what content types do you have in mind (video, images, etc.)?',
  'Nice. When would you like the campaign to run, and what are the key deliverables or milestones?',
  "Thanks, that gives me a solid picture. Want me to generate a campaign brief from this conversation?",
];

const FOLLOWUP_SUGGESTIONS = [
  ['Instagram + TikTok', 'KES 20,000 - 50,000'],
  ['Women 18-35, skincare lovers', 'Video and image posts'],
  ['Launch next month', '2 milestones: draft review, final delivery'],
  ['Yes, generate the brief', 'Let me add more details first'],
];

// Mock AI logic — there's no LLM key wired up in this repo, so chat/brief/package
// generation are rule-based stand-ins for the real AI assistant described in the
// postman collection.
export function generateAiChatReply(messages: ChatMessage[]): { reply: string; suggestions?: string[] } {
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const idx = Math.min(Math.max(userMessageCount - 1, 0), FOLLOWUP_QUESTIONS.length - 1);
  return { reply: FOLLOWUP_QUESTIONS[idx], suggestions: FOLLOWUP_SUGGESTIONS[idx] };
}

const PLATFORM_KEYWORDS: Record<string, string> = {
  instagram: 'INSTAGRAM',
  tiktok: 'TIKTOK',
  youtube: 'YOUTUBE',
  facebook: 'FACEBOOK',
  twitter: 'TWITTER',
};

export function generateBriefFromConversation(messages: ChatMessage[]) {
  const text = messages.map(m => m.content).join(' ');
  const lowerText = text.toLowerCase();

  const platforms = [...new Set(
    Object.entries(PLATFORM_KEYWORDS)
      .filter(([keyword]) => lowerText.includes(keyword))
      .map(([, platform]) => platform)
  )];

  const numbers = (text.match(/\d{1,3}(,\d{3})*|\d{4,}/g) ?? []).map(n => parseInt(n.replace(/,/g, ''), 10));
  const min = numbers.length ? Math.min(...numbers) : 10000;
  const max = numbers.length > 1 ? Math.max(...numbers) : Math.round(min * 2);

  const currencyMatch = text.match(/\b(KES|USD|NGN|GHS|ZAR|EUR|GBP)\b/i);
  const currency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD';

  const firstUserMessage = messages.find(m => m.role === 'user')?.content ?? 'New Campaign';
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    title: firstUserMessage.length > 60 ? `${firstUserMessage.slice(0, 57)}...` : firstUserMessage,
    objective: firstUserMessage,
    targetAudience: { demographics: [] as string[], interests: [] as string[], location: undefined as string | undefined },
    platforms: platforms.length ? platforms : ['INSTAGRAM'],
    contentType: ['VIDEO', 'IMAGE'],
    budget: { min, max, currency },
    timeline: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      milestones: ['Draft review', 'Final delivery'],
    },
    deliverables: ['1 social media post'],
    kpis: ['Reach', 'Engagement rate'],
  };
}

export function recommendPackagesForBrief(brief: { budget: { min: number; max: number; currency: string } }) {
  const { min, max, currency } = brief.budget;
  const mid = Math.round((min + max) / 2);

  return [
    {
      id: crypto.randomUUID(),
      name: 'Starter Package',
      description: 'Best for testing the waters with a small group of creators.',
      price: min,
      currency,
      features: ['1-2 creators', 'Basic content review', '2 week turnaround'],
      recommended: false,
      estimatedReach: 5000,
      estimatedEngagement: 4,
      suitableFor: ['Awareness'],
    },
    {
      id: crypto.randomUUID(),
      name: 'Growth Package',
      description: 'A balanced package for solid reach and engagement.',
      price: mid,
      currency,
      features: ['3-5 creators', 'Content + revisions', '3 week turnaround'],
      recommended: true,
      estimatedReach: 20000,
      estimatedEngagement: 6,
      suitableFor: ['Awareness', 'Engagement'],
    },
    {
      id: crypto.randomUUID(),
      name: 'Premium Package',
      description: 'Maximum reach with top-tier creators.',
      price: max,
      currency,
      features: ['6+ creators', 'Full creative direction', '4 week turnaround'],
      recommended: false,
      estimatedReach: 50000,
      estimatedEngagement: 8,
      suitableFor: ['Awareness', 'Engagement', 'Conversions'],
    },
  ];
}
