import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { authenticate, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { toApiApplication } from '@/lib/server/campaign-utils';

const updateStatusSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED']),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const application = db.findApplicationById(id);
    if (!application) return errorResponse('Application not found', 'NOT_FOUND', 404);

    const campaign = db.findCampaignById(application.campaignId);
    const isOwningBrand = auth.role === 'BRAND' && campaign?.brandUserId === auth.userId;
    const isApplyingCreator = auth.role === 'CREATOR' && application.creatorUserId === auth.userId;
    if (!isOwningBrand && !isApplyingCreator) {
      return errorResponse('Application not found', 'NOT_FOUND', 404);
    }

    return successResponse(toApiApplication(application));
  } catch (error) {
    return internalError('[GET /api/campaigns/applications/[id]]', error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'BRAND') return errorResponse('BRAND access required', 'FORBIDDEN', 403);

    const { id } = await params;
    const application = db.findApplicationById(id);
    if (!application) return errorResponse('Application not found', 'NOT_FOUND', 404);

    const campaign = db.findCampaignById(application.campaignId);
    if (!campaign || campaign.brandUserId !== auth.userId) {
      return errorResponse('Application not found', 'NOT_FOUND', 404);
    }

    const body = await request.json();
    const result = updateStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const updated = db.updateApplication(id, { status: result.data.status })!;
    return successResponse(toApiApplication(updated));
  } catch (error) {
    return internalError('[PATCH /api/campaigns/applications/[id]]', error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    if (auth.role !== 'CREATOR') return errorResponse('CREATOR access required', 'FORBIDDEN', 403);

    const { id } = await params;
    const application = db.findApplicationById(id);
    if (!application || application.creatorUserId !== auth.userId) {
      return errorResponse('Application not found', 'NOT_FOUND', 404);
    }

    db.deleteApplication(id);
    return successResponse({ message: 'Application withdrawn' });
  } catch (error) {
    return internalError('[DELETE /api/campaigns/applications/[id]]', error);
  }
}
