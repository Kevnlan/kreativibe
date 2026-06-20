import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  generateSecureToken,
  getRefreshTokenExpiry,
  getVerificationTokenExpiry,
} from '@/lib/server/auth-utils';
import { sendVerificationEmail } from '@/lib/server/email';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  role: z.enum(['CREATOR', 'BRAND']),
  countryId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, role, countryId } = result.data;

    if (db.findUserByEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered', code: 'EMAIL_EXISTS' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = db.createUser({ email, passwordHash, name, role, countryId, isEmailVerified: false, isActive: true });

    let creatorProfile = null;
    let brandProfile = null;

    if (role === 'CREATOR') {
      creatorProfile = db.createCreatorProfile({
        userId: user.id,
        categories: [],
        isVerified: false,
        verificationStatus: 'PENDING',
        averageRating: 0,
        totalReviews: 0,
        totalEarnings: '0',
        pricingJson: null,
      });
    } else {
      brandProfile = db.createBrandProfile({
        userId: user.id,
        companyName: name,
        isVerified: false,
        verificationStatus: 'PENDING',
      });
    }

    const verificationToken = generateSecureToken();
    db.createEmailVerification(user.id, verificationToken, getVerificationTokenExpiry());
    sendVerificationEmail(email, verificationToken);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    db.createRefreshToken(user.id, refreshToken, getRefreshTokenExpiry());

    const { passwordHash: _pw, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        data: { user: safeUser, accessToken, refreshToken, creatorProfile, brandProfile },
        message: 'Account created. Please verify your email.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/auth/signup]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
