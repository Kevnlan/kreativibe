import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { toApiCampaign } from '@/lib/server/campaign-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'CREATOR');
    if (forbidden) return forbidden;

    const { id } = await params;
    const campaign = db.findCampaignById(id);
    if (!campaign || campaign.status !== 'ACTIVE') {
      return errorResponse('Campaign not found', 'NOT_FOUND', 404);
    }

    return successResponse(toApiCampaign(campaign));
  } catch (error) {
    return internalError('[GET /api/campaigns/marketplace/[id]]', error);
  }
}
