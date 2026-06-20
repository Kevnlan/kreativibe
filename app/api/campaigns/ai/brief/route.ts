import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { generateBriefFromConversation } from '@/lib/server/campaign-utils';

const briefSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const body = await request.json();
    const result = briefSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    return successResponse(generateBriefFromConversation(result.data.messages));
  } catch (error) {
    return internalError('[POST /api/campaigns/ai/brief]', error);
  }
}
