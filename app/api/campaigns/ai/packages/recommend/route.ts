import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { recommendPackagesForBrief } from '@/lib/server/campaign-utils';

const recommendSchema = z.object({
  brief: z.object({
    budget: z.object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      currency: z.string(),
    }),
  }).passthrough(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const body = await request.json();
    const result = recommendSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    return successResponse(recommendPackagesForBrief(result.data.brief));
  } catch (error) {
    return internalError('[POST /api/campaigns/ai/packages/recommend]', error);
  }
}
