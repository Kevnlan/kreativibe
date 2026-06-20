import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/server/auth-utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    db.createRefreshToken(user.id, refreshToken, getRefreshTokenExpiry());

    const creatorProfile = user.role === 'CREATOR' ? db.findCreatorProfile(user.id) ?? null : null;
    const brandProfile = user.role === 'BRAND' ? db.findBrandProfile(user.id) ?? null : null;

    const { passwordHash: _pw, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: { user: safeUser, accessToken, refreshToken, creatorProfile, brandProfile },
    });
  } catch (error) {
    console.error('[POST /api/auth/login]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
