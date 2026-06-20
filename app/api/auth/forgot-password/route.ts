import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { generateSecureToken, getPasswordResetExpiry } from '@/lib/server/auth-utils';
import { sendPasswordResetEmail } from '@/lib/server/email';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const user = db.findUserByEmail(email);

    // Always return 200 to avoid user enumeration
    if (user) {
      const token = generateSecureToken();
      db.createPasswordReset(user.id, token, getPasswordResetExpiry());
      sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
