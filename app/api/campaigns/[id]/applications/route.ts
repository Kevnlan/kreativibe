import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { authenticate, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { toApiApplication } from '@/lib/server/campaign-utils';

const applySchema = z.object({
  message: z.string().min(1),
  proposedRate: z.number().nonnegative().optional(),
  currency: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'BRAND') return errorResponse('BRAND access required', 'FORBIDDEN', 403);

    const { id } = await params;
    const campaign = db.findCampaignById(id);
    if (!campaign || campaign.brandUserId !== auth.userId) {
      return errorResponse('Campaign not found', 'NOT_FOUND', 404);
    }

    const applications = db.findApplicationsByCampaign(id).map(toApiApplication);
    return successResponse(applications);
  } catch (error) {
    return internalError('[GET /api/campaigns/[id]/applications]', error);
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'CREATOR') return errorResponse('CREATOR access required', 'FORBIDDEN', 403);

    const { id } = await params;
    const campaign = db.findCampaignById(id);
    if (!campaign || campaign.status !== 'ACTIVE') {
      return errorResponse('Campaign not found', 'NOT_FOUND', 404);
    }

    if (db.findApplication(id, auth.userId)) {
      return errorResponse('You have already applied to this campaign', 'ALREADY_APPLIED', 409);
    }

    const body = await request.json();
    const result = applySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const application = db.createApplication({
      campaignId: id,
      creatorUserId: auth.userId,
      message: result.data.message,
      proposedRate: result.data.proposedRate,
      currency: result.data.currency,
      status: 'PENDING',
    });

    return successResponse(toApiApplication(application), 201);
  } catch (error) {
    return internalError('[POST /api/campaigns/[id]/applications]', error);
  }
}
