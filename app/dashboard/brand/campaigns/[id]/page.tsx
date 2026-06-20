'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  FileText,
  BarChart3,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Avatar, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { campaignService } from '@/services/campaign.service';
import { Campaign, CampaignApplication, CampaignStats, CampaignStatus, ApplicationStatus } from '@/types/campaign.types';

const CAMPAIGN_STATUS_STYLES: Record<CampaignStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  SHORTLISTED: 'bg-purple-100 text-purple-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const APPLICATION_ACTIONS: Record<string, { label: string; status: ApplicationStatus; variant: 'outline' | 'success' | 'destructive' }[]> = {
  PENDING: [
    { label: 'Shortlist', status: 'SHORTLISTED', variant: 'outline' },
    { label: 'Reject', status: 'REJECTED', variant: 'destructive' },
  ],
  UNDER_REVIEW: [
    { label: 'Shortlist', status: 'SHORTLISTED', variant: 'outline' },
    { label: 'Reject', status: 'REJECTED', variant: 'destructive' },
  ],
  SHORTLISTED: [
    { label: 'Accept', status: 'ACCEPTED', variant: 'success' },
    { label: 'Reject', status: 'REJECTED', variant: 'destructive' },
  ],
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([campaignService.get(id), campaignService.stats(id), campaignService.listApplications(id)])
      .then(([campaignData, statsData, applicationsData]) => {
        setCampaign(campaignData);
        setStats(statsData);
        setApplications(applicationsData);
      })
      .catch(() => setError('Failed to load campaign. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const runTransition = async (action: (campaignId: string) => Promise<Campaign>) => {
    setIsTransitioning(true);
    setError(null);
    try {
      const updated = await action(id);
      setCampaign(updated);
    } catch {
      setError('Failed to update campaign status. Please try again.');
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleUpdateApplication = async (applicationId: string, status: ApplicationStatus) => {
    setUpdatingApplicationId(applicationId);
    setError(null);
    try {
      const updated = await campaignService.updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(a => (a.id === applicationId ? updated : a)));
    } catch {
      setError('Failed to update application. Please try again.');
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.push('/dashboard/brand/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error || 'Campaign not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/brand/campaigns')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{campaign.title}</h1>
              <span className={cn('inline-flex text-xs px-2.5 py-0.5 rounded-full font-medium capitalize', CAMPAIGN_STATUS_STYLES[campaign.status])}>
                {campaign.status.toLowerCase()}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">{campaign.objective}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/brand/campaigns/${id}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/brand/campaigns/${id}/contract`)}>
            <FileText className="h-4 w-4 mr-2" />
            Contract
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Status actions */}
      <div className="flex flex-wrap gap-2">
        {campaign.status === 'DRAFT' && (
          <Button onClick={() => runTransition(campaignService.publish)} disabled={isTransitioning} variant="brand">
            <Play className="h-4 w-4 mr-2" />
            Publish
          </Button>
        )}
        {campaign.status === 'ACTIVE' && (
          <>
            <Button onClick={() => runTransition(campaignService.pause)} disabled={isTransitioning} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={() => runTransition(campaignService.complete)} disabled={isTransitioning} variant="success">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete
            </Button>
            <Button onClick={() => runTransition(campaignService.cancel)} disabled={isTransitioning} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
        {campaign.status === 'PAUSED' && (
          <>
            <Button onClick={() => runTransition(campaignService.resume)} disabled={isTransitioning} variant="brand">
              <RotateCcw className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button onClick={() => runTransition(campaignService.cancel)} disabled={isTransitioning} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Total Applications</p>
              <p className="text-xl font-bold">{stats.totalApplications}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Accepted Creators</p>
              <p className="text-xl font-bold">{stats.acceptedCreators}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Shortlisted</p>
              <p className="text-xl font-bold">{stats.applicationsByStatus.SHORTLISTED ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-xl font-bold">{stats.applicationsByStatus.REJECTED ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.description && (
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm mt-0.5">{campaign.description}</p>
              </div>
            )}
            {campaign.audience && (
              <div>
                <p className="text-xs text-muted-foreground">Target Audience</p>
                <p className="text-sm mt-0.5">{campaign.audience}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-medium mt-0.5">
                  {formatCurrency(campaign.budgetMin, campaign.currency)} - {formatCurrency(campaign.budgetMax, campaign.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dates</p>
                <p className="text-sm font-medium mt-0.5">
                  {campaign.startDate ? formatDate(campaign.startDate) : '—'} - {campaign.endDate ? formatDate(campaign.endDate) : '—'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.map(p => (
                  <span key={p} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Content Types</p>
              <div className="flex flex-wrap gap-2">
                {campaign.contentTypes.map(ct => (
                  <span key={ct} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{ct}</span>
                ))}
              </div>
            </div>
            {campaign.categories.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.categories.map(c => (
                    <span key={c} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {campaign.deliverables.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Deliverables</p>
                <ul className="text-sm list-disc list-inside space-y-0.5">
                  {campaign.deliverables.map(d => <li key={d}>{d}</li>)}
                </ul>
              </div>
            )}
            {campaign.milestones.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Milestones</p>
                <ul className="text-sm list-disc list-inside space-y-0.5">
                  {campaign.milestones.map(m => <li key={m}>{m}</li>)}
                </ul>
              </div>
            )}
            {campaign.messaging && (
              <div>
                <p className="text-xs text-muted-foreground">Key Message</p>
                <p className="text-sm mt-0.5">{campaign.messaging}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Applications ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <EmptyState title="No applications yet" description="Creators who apply to this campaign will show up here." />
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm" src={app.creatorProfile?.avatar} fallback={app.creatorProfile?.userId} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Creator {app.creatorProfile?.userId.slice(0, 8) ?? app.creatorUserId.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.creatorProfile && `★ ${app.creatorProfile.averageRating.toFixed(1)}`}
                        </p>
                      </div>
                      <span className={cn('inline-flex text-xs px-2 py-0.5 rounded-full font-medium capitalize', APPLICATION_STATUS_STYLES[app.status])}>
                        {app.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.message}</p>
                    {app.proposedRate != null && (
                      <p className="text-xs font-medium">Proposed: {formatCurrency(app.proposedRate, app.currency || campaign.currency)}</p>
                    )}
                    {APPLICATION_ACTIONS[app.status] && (
                      <div className="flex gap-2 pt-1">
                        {APPLICATION_ACTIONS[app.status].map(action => (
                          <Button
                            key={action.status}
                            size="sm"
                            variant={action.variant}
                            disabled={updatingApplicationId === app.id}
                            onClick={() => handleUpdateApplication(app.id, action.status)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
