import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { token } = result.data;

    const record = db.findEmailVerification(token);
    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    if (new Date(record.expiresAt) < new Date()) {
      db.deleteEmailVerification(token);
      return NextResponse.json(
        { success: false, message: 'Verification token has expired', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      );
    }

    db.updateUser(record.userId, { isEmailVerified: true });
    db.deleteEmailVerification(token);

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('[POST /api/auth/verify-email]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
