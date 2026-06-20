import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { toApiCampaign } from '@/lib/server/campaign-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'CREATOR');
    if (forbidden) return forbidden;

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform')?.toUpperCase();
    const category = searchParams.get('category')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20);

    let campaigns = db.findActiveCampaigns();
    if (platform) campaigns = campaigns.filter(c => c.platforms.includes(platform));
    if (category) campaigns = campaigns.filter(c => c.categories.some(cat => cat.toLowerCase() === category));
    if (search) campaigns = campaigns.filter(c => c.title.toLowerCase().includes(search));
    campaigns = campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = campaigns.length;
    const start = (page - 1) * limit;
    const items = campaigns.slice(start, start + limit).map(toApiCampaign);

    return successResponse({ data: items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    return internalError('[GET /api/campaigns/marketplace]', error);
  }
}
