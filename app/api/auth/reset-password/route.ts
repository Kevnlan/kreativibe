import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { hashPassword } from '@/lib/server/auth-utils';

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = result.data;

    const record = db.findPasswordReset(token);
    if (!record || record.used) {
      return NextResponse.json(
        { success: false, message: 'Invalid or already used reset token', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Password reset token has expired', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    db.updateUser(record.userId, { passwordHash });
    db.markPasswordResetUsed(token);

    // Revoke all existing refresh tokens for security
    db.deleteAllUserRefreshTokens(record.userId);

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('[POST /api/auth/reset-password]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
