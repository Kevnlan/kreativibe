import { NextRequest, NextResponse } from 'next/server';
import { authenticate, requireRole, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { transitionCampaignStatus, toApiCampaign } from '@/lib/server/campaign-utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const result = transitionCampaignStatus(id, auth.userId, ['DRAFT'], 'ACTIVE');
    if ('error' in result) return errorResponse(result.error.message, result.error.code, result.error.status);

    return successResponse(toApiCampaign(result.campaign));
  } catch (error) {
    return internalError('[POST /api/campaigns/[id]/publish]', error);
  }
}
