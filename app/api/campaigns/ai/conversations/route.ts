import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, internalError } from '@/lib/server/api-utils';
import { toApiAiConversation } from '@/lib/server/campaign-utils';

const createConversationSchema = z.object({
  title: z.string().min(1),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })),
});

export async function GET(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const conversations = db.findAiConversationsByBrand(auth.userId).map(toApiAiConversation);
    return successResponse(conversations);
  } catch (error) {
    return internalError('[GET /api/campaigns/ai/conversations]', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const body = await request.json();
    const result = createConversationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const conversation = db.createAiConversation({
      brandUserId: auth.userId,
      title: result.data.title,
      messages: result.data.messages,
    });

    return successResponse(toApiAiConversation(conversation), 201);
  } catch (error) {
    return internalError('[POST /api/campaigns/ai/conversations]', error);
  }
}
