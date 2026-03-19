'use client';

import { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Linkedin, Link2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';

interface SocialAccount {
  id: string;
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'TWITTER' | 'LINKEDIN';
  username: string;
  isConnected: boolean;
  followers?: number;
  connectedAt?: string;
  lastSync?: string;
  permissions: string[];
}

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockAccounts: SocialAccount[] = [
        {
          id: '1',
          platform: 'INSTAGRAM',
          username: '@mybrand',
          isConnected: true,
          followers: 15000,
          connectedAt: '2024-03-01T10:00:00Z',
          lastSync: '2024-03-18T14:00:00Z',
          permissions: ['publish_content', 'read_insights'],
        },
        {
          id: '2',
          platform: 'FACEBOOK',
          username: 'My Brand Page',
          isConnected: true,
          followers: 8500,
          connectedAt: '2024-03-05T12:00:00Z',
          lastSync: '2024-03-18T14:00:00Z',
          permissions: ['publish_content', 'read_insights'],
        },
        {
          id: '3',
          platform: 'YOUTUBE',
          username: 'MyBrandChannel',
          isConnected: false,
          permissions: [],
        },
        {
          id: '4',
          platform: 'TWITTER',
          username: '',
          isConnected: false,
          permissions: [],
        },
        {
          id: '5',
          platform: 'LINKEDIN',
          username: '',
          isConnected: false,
          permissions: [],
        },
      ];
      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    // Mock OAuth flow
    alert(`Redirecting to ${platform} for authorization...`);
    // In real implementation, this would redirect to OAuth URL
  };

  const handleDisconnect = async (accountId: string) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      setAccounts(accounts.map(acc => 
        acc.id === accountId ? { ...acc, isConnected: false, username: '', followers: undefined } : acc
      ));
    }
  };

  const handleRefresh = async (accountId: string) => {
    alert('Refreshing account data...');
    // Mock refresh
  };

  const getPlatformIcon = (platform: SocialAccount['platform']) => {
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

  const getPlatformColor = (platform: SocialAccount['platform']) => {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const connectedCount = accounts.filter(a => a.isConnected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Social Media Accounts</h1>
        <p className="text-muted-foreground mt-2">
          Connect your social media accounts to publish purchased content
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Connected Accounts</p>
              <p className="text-3xl font-bold">{connectedCount} / {accounts.length}</p>
            </div>
            <div className="p-4 bg-brand-blue/10 rounded-full">
              <Link2 className="h-8 w-8 text-brand-blue" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getPlatformColor(account.platform)}`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-br ${getPlatformColor(account.platform)} rounded-lg text-white`}>
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{account.platform}</h3>
                    {account.isConnected && account.username && (
                      <p className="text-sm text-muted-foreground">{account.username}</p>
                    )}
                  </div>
                </div>
                {account.isConnected ? (
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

              {account.isConnected ? (
                <div className="space-y-4">
                  {/* Stats */}
                  {account.followers && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Followers</p>
                      <p className="text-xl font-bold">{formatNumber(account.followers)}</p>
                    </div>
                  )}

                  {/* Permissions */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-2">
                      {account.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                        >
                          {perm.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Last Sync */}
                  {account.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(account.lastSync).toLocaleString()}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefresh(account.id)}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(account.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect your {account.platform} account to publish content directly from the platform.
                  </p>
                  <Button
                    onClick={() => handleConnect(account.platform)}
                    className="w-full"
                  >
                    Connect {account.platform}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
