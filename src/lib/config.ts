export const config = {
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
  oauthRedirectUrl: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || 'http://localhost:3000/auth/callback',
  
  features: {
    enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA !== 'false',
    enableSocialConnect: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_CONNECT !== 'false',
    enableWallet: process.env.NEXT_PUBLIC_ENABLE_WALLET !== 'false',
  },
};
