import { NextRequest, NextResponse } from 'next/server';
import { extractBearerToken, verifyAccessToken } from './auth-utils';

export interface AuthContext {
  userId: string;
  role: string;
}

export function authenticate(request: NextRequest): AuthContext | NextResponse {
  const token = extractBearerToken(request.headers.get('authorization'));
  if (!token) {
    return errorResponse('Missing authorization token', 'UNAUTHORIZED', 401);
  }
  const payload = verifyAccessToken(token);
  if (!payload) {
    return errorResponse('Invalid or expired token', 'UNAUTHORIZED', 401);
  }
  return { userId: payload.sub, role: payload.role };
}

export function requireRole(auth: AuthContext, role: string): NextResponse | null {
  if (auth.role !== role) {
    return errorResponse(`${role} access required`, 'FORBIDDEN', 403);
  }
  return null;
}

export function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json({ success: false, message, code, details: null }, { status });
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function internalError(context: string, error: unknown) {
  console.error(context, error);
  return errorResponse('Internal server error', 'INTERNAL_ERROR', 500);
}
