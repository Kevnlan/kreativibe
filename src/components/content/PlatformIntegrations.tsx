'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Settings, Link, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PlatformIntegration {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync?: string;
  accountName?: string;
  accountHandle?: string;
  followerCount?: number;
  errorMessage?: string;
}

interface PlatformIntegrationsProps {
  integrations: PlatformIntegration[];
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  onSync?: (platformId: string) => void;
  onSettings?: (platformId: string) => void;
}

const platformIcons = {
  instagram: '📷',
  tiktok: '🎵',
  youtube: '▶️',
  twitter: '🐦',
  facebook: '📘',
} as const;

const statusColors = {
  connected: 'success',
  disconnected: 'secondary',
  error: 'destructive',
  syncing: 'brand',
} as const;

const statusIcons = {
  connected: CheckCircle,
  disconnected: XCircle,
  error: AlertCircle,
  syncing: RefreshCw,
} as const;

export function PlatformIntegrations({ integrations, onConnect, onDisconnect, onSync, onSettings }: PlatformIntegrationsProps) {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  const toggleExpand = (platformId: string) => {
    setExpandedPlatform(expandedPlatform === platformId ? null : platformId);
  };

  const handleSync = (platformId: string) => {
    onSync?.(platformId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Platform Integrations</CardTitle>
          </div>
          <Badge variant="outline">
            {integrations.filter(i => i.status === 'connected').length} Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integrations.map((integration) => {
            const StatusIcon = statusIcons[integration.status];
            const isExpanded = expandedPlatform === integration.id;

            return (
              <div
                key={integration.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(integration.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Platform Icon */}
                    <div className="text-3xl">{platformIcons[integration.platform]}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <Badge variant={statusColors[integration.status] as any} className="text-xs">
                          {integration.status}
                        </Badge>
                      </div>
                      {integration.accountName && (
                        <p className="text-sm text-muted-foreground">
                          {integration.accountName} {integration.accountHandle && `(${integration.accountHandle})`}
                        </p>
                      )}
                      {integration.followerCount && (
                        <p className="text-xs text-muted-foreground">
                          {integration.followerCount.toLocaleString()} followers
                        </p>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className={cn(
                      "flex items-center gap-2",
                      integration.status === 'syncing' && 'animate-pulse'
                    )}>
                      <StatusIcon className={cn(
                        "h-5 w-5",
                        integration.status === 'connected' && 'text-success',
                        integration.status === 'disconnected' && 'text-muted-foreground',
                        integration.status === 'error' && 'text-destructive',
                        integration.status === 'syncing' && 'text-brand-blue'
                      )} />
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Last Sync */}
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last synced: {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                    {/* Error Message */}
                    {integration.errorMessage && (
                      <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-destructive">{integration.errorMessage}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {integration.status === 'disconnected' && onConnect && (
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() => onConnect(integration.id)}
                          leftIcon={<Link className="h-4 w-4" />}
                        >
                          Connect
                        </Button>
                      )}
                      {integration.status === 'connected' && (
                        <>
                          {onSync && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSync(integration.id)}
                              leftIcon={<RefreshCw className="h-4 w-4" />}
                            >
                              Sync Now
                            </Button>
                          )}
                          {onSettings && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSettings(integration.id)}
                              leftIcon={<Settings className="h-4 w-4" />}
                            >
                              Settings
                            </Button>
                          )}
                          {onDisconnect && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDisconnect(integration.id)}
                              leftIcon={<XCircle className="h-4 w-4" />}
                            >
                              Disconnect
                            </Button>
                          )}
                        </>
                      )}
                      {integration.status === 'error' && onConnect && (
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() => onConnect(integration.id)}
                          leftIcon={<RefreshCw className="h-4 w-4" />}
                        >
                          Reconnect
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {integrations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No platform integrations configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
