import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { toApiCampaign } from '@/lib/server/campaign-utils';

const createCampaignSchema = z.object({
  title: z.string().min(2),
  objective: z.string().min(2),
  description: z.string().optional(),
  audience: z.string().optional(),
  platforms: z.array(z.string()).min(1),
  contentTypes: z.array(z.string()).min(1),
  categories: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  milestones: z.array(z.string()).optional(),
  messaging: z.string().optional(),
  tone: z.string().optional(),
  budgetMin: z.number().nonnegative(),
  budgetMax: z.number().nonnegative(),
  currency: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  source: z.enum(['manual', 'ai']),
  brief: z.any().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status')?.toUpperCase();
    const search = searchParams.get('search')?.toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20);

    let campaigns = db.findCampaignsByBrand(auth.userId);
    if (status) campaigns = campaigns.filter(c => c.status === status);
    if (search) campaigns = campaigns.filter(c => c.title.toLowerCase().includes(search));
    campaigns = campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = campaigns.length;
    const start = (page - 1) * limit;
    const items = campaigns.slice(start, start + limit).map(toApiCampaign);

    return successResponse({ data: items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    return internalError('[GET /api/campaigns]', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const body = await request.json();
    const result = createCampaignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const campaign = db.createCampaign({
      brandUserId: auth.userId,
      title: data.title,
      objective: data.objective,
      description: data.description,
      audience: data.audience,
      platforms: data.platforms,
      contentTypes: data.contentTypes,
      categories: data.categories ?? [],
      deliverables: data.deliverables ?? [],
      milestones: data.milestones ?? [],
      messaging: data.messaging,
      tone: data.tone,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      currency: data.currency,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'DRAFT',
      source: data.source,
      brief: data.brief,
    });

    return successResponse(toApiCampaign(campaign), 201);
  } catch (error) {
    return internalError('[POST /api/campaigns]', error);
  }
}
