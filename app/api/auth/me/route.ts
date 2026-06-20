import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { verifyAccessToken, extractBearerToken } from '@/lib/server/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing authorization token', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const user = db.findUserById(payload.sub);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const creatorProfile = user.role === 'CREATOR' ? db.findCreatorProfile(user.id) ?? null : null;
    const brandProfile = user.role === 'BRAND' ? db.findBrandProfile(user.id) ?? null : null;

    const { passwordHash: _pw, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: { user: safeUser, creatorProfile, brandProfile },
    });
  } catch (error) {
    console.error('[GET /api/auth/me]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
