import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/server/db';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/server/auth-utils';

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = refreshSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', code: 'VALIDATION_ERROR', details: result.error.issues },
        { status: 400 }
      );
    }

    const { refreshToken } = result.data;

    const stored = db.findRefreshToken(refreshToken);
    if (!stored) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    if (new Date(stored.expiresAt) < new Date()) {
      db.deleteRefreshToken(refreshToken);
      return NextResponse.json(
        { success: false, message: 'Refresh token has expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      db.deleteRefreshToken(refreshToken);
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const user = db.findUserById(stored.userId);
    if (!user) {
      db.deleteRefreshToken(refreshToken);
      return NextResponse.json(
        { success: false, message: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Rotate: delete old token, issue new pair
    db.deleteRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);
    db.createRefreshToken(user.id, newRefreshToken, getRefreshTokenExpiry());

    return NextResponse.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    console.error('[POST /api/auth/refresh]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
