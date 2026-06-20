import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { authenticate, requireRole, successResponse, errorResponse, internalError } from '@/lib/server/api-utils';
import { toApiAiConversation } from '@/lib/server/campaign-utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const conversation = db.findAiConversationById(id);
    if (!conversation || conversation.brandUserId !== auth.userId) {
      return errorResponse('Conversation not found', 'NOT_FOUND', 404);
    }

    return successResponse(toApiAiConversation(conversation));
  } catch (error) {
    return internalError('[GET /api/campaigns/ai/conversations/[id]]', error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;
    const forbidden = requireRole(auth, 'BRAND');
    if (forbidden) return forbidden;

    const { id } = await params;
    const conversation = db.findAiConversationById(id);
    if (!conversation || conversation.brandUserId !== auth.userId) {
      return errorResponse('Conversation not found', 'NOT_FOUND', 404);
    }

    db.deleteAiConversation(id);
    return successResponse({ message: 'Conversation deleted' });
  } catch (error) {
    return internalError('[DELETE /api/campaigns/ai/conversations/[id]]', error);
  }
}
