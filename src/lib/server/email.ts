const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function sendVerificationEmail(email: string, token: string): void {
  const url = `${APP_URL}/auth/new-verification?token=${token}`;
  console.log(`[Email] Verification → ${email}\n  URL: ${url}`);
}

export function sendPasswordResetEmail(email: string, token: string): void {
  const url = `${APP_URL}/auth/reset-password?token=${token}`;
  console.log(`[Email] Password reset → ${email}\n  URL: ${url}`);
}
