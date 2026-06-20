import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { toApiCampaign } from '@/lib/server/campaign-utils';

const updateCampaignSchema = z.object({
  title: z.string().min(2).optional(),
  objective: z.string().min(2).optional(),
  description: z.string().optional(),
  audience: z.string().optional(),
  platforms: z.array(z.string()).min(1).optional(),
  contentTypes: z.array(z.string()).min(1).optional(),
  categories: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  milestones: z.array(z.string()).optional(),
  messaging: z.string().optional(),
  tone: z.string().optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

function getOwnedCampaign(id: string, brandUserId: string) {
  const campaign = db.findCampaignById(id);
  if (!campaign || campaign.brandUserId !== brandUserId) return undefined;
  return campaign;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const campaign = getOwnedCampaign(id, auth.userId);
    if (!campaign) return errorResponse('Campaign not found', 'NOT_FOUND', 404);

    return successResponse(toApiCampaign(campaign));
  } catch (error) {
    return internalError('[GET /api/campaigns/[id]]', error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const campaign = getOwnedCampaign(id, auth.userId);
    if (!campaign) return errorResponse('Campaign not found', 'NOT_FOUND', 404);

    const body = await request.json();
    const result = updateCampaignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const updated = db.updateCampaign(id, result.data);
    return successResponse(toApiCampaign(updated!));
  } catch (error) {
    return internalError('[PUT /api/campaigns/[id]]', error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const campaign = getOwnedCampaign(id, auth.userId);
    if (!campaign) return errorResponse('Campaign not found', 'NOT_FOUND', 404);

    db.deleteCampaign(id);
    return successResponse({ message: 'Campaign deleted' });
  } catch (error) {
    return internalError('[DELETE /api/campaigns/[id]]', error);
  }
}
