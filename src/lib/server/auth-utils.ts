import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'kreativibe-access-dev-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'kreativibe-refresh-dev-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role, type: 'access' }, ACCESS_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'refresh' }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): { sub: string; role: string } | null {
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
    if (payload.type !== 'access' || typeof payload.sub !== 'string') return null;
    return { sub: payload.sub, role: payload.role as string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { sub: string } | null {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
    if (payload.type !== 'refresh' || typeof payload.sub !== 'string') return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getRefreshTokenExpiry(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export function getVerificationTokenExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 24);
  return d;
}

export function getPasswordResetExpiry(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d;
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
