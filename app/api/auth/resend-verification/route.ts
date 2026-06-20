import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import { generateSecureToken, getVerificationTokenExpiry } from '@/lib/server/auth-utils';
import { sendVerificationEmail } from '@/lib/server/email';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const user = db.findUserByEmail(email);

    // Always respond 200 to avoid email enumeration
    if (!user || user.isEmailVerified) {
      return NextResponse.json({ success: true, message: 'If that email is unverified, a new link has been sent.' });
    }

    db.deleteAllUserEmailVerifications(user.id);
    const token = generateSecureToken();
    db.createEmailVerification(user.id, token, getVerificationTokenExpiry());
    sendVerificationEmail(email, token);

    return NextResponse.json({ success: true, message: 'Verification email resent.' });
  } catch (error) {
    console.error('[POST /api/auth/resend-verification]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
