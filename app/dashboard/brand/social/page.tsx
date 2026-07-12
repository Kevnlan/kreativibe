'use client';

import { useState, useEffect, useCallback } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Linkedin, Link2, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { socialService } from '@/services/social.service';
import { SocialAccount, SocialPlatform } from '@/types/api-contracts/social.types';

const ALL_PLATFORMS: SocialPlatform[] = ['INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'TWITTER', 'LINKEDIN'];

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await socialService.getAccounts();
      setAccounts(response.accounts || []);
    } catch {
      setError('Failed to load social accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleConnect = async (platform: SocialPlatform) => {
    setActionLoading(platform);
    try {
      const { authUrl } = await socialService.connectAccount({
        platform,
        redirectUrl: typeof window !== 'undefined' ? window.location.href : '',
      });
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch {
      setError(`Failed to connect ${platform}. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    setActionLoading(accountId);
    try {
      await socialService.disconnectAccount(accountId);
      setAccounts(prev => prev.filter(a => a.id !== accountId));
    } catch {
      setError('Failed to disconnect account. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = async (accountId: string) => {
    setActionLoading(accountId);
    try {
      const synced = await socialService.syncAccount(accountId);
      setAccounts(prev => prev.map(a => (a.id === accountId ? synced : a)));
    } catch {
      setError('Failed to sync account. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram className="h-5 w-5" />;
      case 'FACEBOOK':
        return <Facebook className="h-5 w-5" />;
      case 'YOUTUBE':
        return <Youtube className="h-5 w-5" />;
      case 'TWITTER':
        return <Twitter className="h-5 w-5" />;
      case 'LINKEDIN':
        return <Linkedin className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'INSTAGRAM':
        return 'from-pink-500 to-purple-600';
      case 'FACEBOOK':
        return 'from-blue-600 to-blue-700';
      case 'YOUTUBE':
        return 'from-red-600 to-red-700';
      case 'TWITTER':
        return 'from-sky-500 to-blue-600';
      case 'LINKEDIN':
        return 'from-blue-700 to-blue-800';
    }
  };

  const connectedAccounts = accounts.filter(a => a.isActive);
  const connectedCount = connectedAccounts.length;

  const getAccountForPlatform = (platform: SocialPlatform) =>
    accounts.find(a => a.platform === platform && a.isActive);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading social accounts...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Social Media Accounts</h1>
        <p className="text-muted-foreground mt-2">
          Connect your social media accounts to publish purchased content
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Connected Accounts</p>
              <p className="text-3xl font-bold">{connectedCount} / {ALL_PLATFORMS.length}</p>
            </div>
            <div className="p-4 bg-brand-blue/10 rounded-full">
              <Link2 className="h-8 w-8 text-brand-blue" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_PLATFORMS.map((platform) => {
          const account = getAccountForPlatform(platform);
          const isConnected = !!account;
          return (
            <Card key={platform} className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${getPlatformColor(platform)}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-br ${getPlatformColor(platform)} rounded-lg text-white`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{platform}</h3>
                      {isConnected && account?.username && (
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                      )}
                    </div>
                  </div>
                  {isConnected ? (
                    <StatusBadge variant="success" size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant="default" size="sm">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Connected
                    </StatusBadge>
                  )}
                </div>

                {isConnected && account ? (
                  <div className="space-y-4">
                    {/* Display name */}
                    {account.displayName && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Account</p>
                        <p className="text-sm font-medium">{account.displayName}</p>
                      </div>
                    )}

                    {/* Permissions */}
                    {account.permissions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Permissions</p>
                        <div className="flex flex-wrap gap-2">
                          {account.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                            >
                              {perm.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Sync */}
                    {account.lastSyncedAt && (
                      <p className="text-xs text-muted-foreground">
                        Last synced: {new Date(account.lastSyncedAt).toLocaleString()}
                      </p>
                    )}

                    {/* Token expiry */}
                    {account.tokenExpiresAt && (
                      <p className="text-xs text-muted-foreground">
                        Token expires: {new Date(account.tokenExpiresAt).toLocaleString()}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefresh(account.id)}
                        disabled={actionLoading === account.id}
                        className="flex-1"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {actionLoading === account.id ? 'Syncing...' : 'Refresh'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                        disabled={actionLoading === account.id}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect your {platform} account to publish content directly from the platform.
                    </p>
                    <Button
                      onClick={() => handleConnect(platform)}
                      disabled={actionLoading === platform}
                      className="w-full"
                    >
                      {actionLoading === platform ? 'Connecting...' : `Connect ${platform}`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Why Connect Social Media?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Publish purchased content directly to your social media accounts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Schedule posts for optimal engagement times</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Track performance and analytics across all platforms</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Manage multiple accounts from one dashboard</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Security & Privacy</p>
              <p className="text-sm text-blue-800">
                We use OAuth 2.0 for secure authentication. We never store your passwords and only request 
                the minimum permissions needed to publish content. You can revoke access at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
