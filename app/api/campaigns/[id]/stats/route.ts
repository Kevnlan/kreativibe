import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const campaign = db.findCampaignById(id);
    if (!campaign || campaign.brandUserId !== auth.userId) {
      return errorResponse('Campaign not found', 'NOT_FOUND', 404);
    }

    const applications = db.findApplicationsByCampaign(id);
    const stats = {
      totalApplications: applications.length,
      underReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
      shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
      accepted: applications.filter(a => a.status === 'ACCEPTED').length,
      rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    return successResponse(stats);
  } catch (error) {
    return internalError('[GET /api/campaigns/[id]/stats]', error);
  }
}
