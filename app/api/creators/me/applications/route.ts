import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { toApiApplication } from '@/lib/server/campaign-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'CREATOR');
    if (forbidden) return forbidden;

    const applications = db
      .findApplicationsByCreator(auth.userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toApiApplication);

    return successResponse(applications);
  } catch (error) {
    return internalError('[GET /api/creators/me/applications]', error);
  }
}
