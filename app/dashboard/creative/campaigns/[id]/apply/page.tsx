'use client';

import { useState, useEffect } from 'react';
import { CreativeApplicationFlow, CreativeProfile } from '@/components/campaign/CreativeApplicationFlow';
import { ApplicationStatusTracker, ApplicationStatusEvent } from '@/components/campaign/ApplicationStatusTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { campaignService } from '@/services/campaign.service';
import { Campaign, CampaignApplication } from '@/types/campaign.types';

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [profile, setProfile] = useState<CreativeProfile | null>(null);
  const [application, setApplication] = useState<CampaignApplication | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    campaignService
      .getMarketplaceCampaign(campaignId)
      .then(setCampaign)
      .catch(() => setLoadError('Failed to load campaign. Please try again.'))
      .finally(() => setIsLoading(false));
  }, [campaignId]);

  const handleBack = () => {
    router.push('/dashboard/creative/campaigns');
  };

  const handleSubmitApplication = async (submittedProfile: CreativeProfile) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await campaignService.applyToCampaign(campaignId, {
        message: submittedProfile.bio,
        proposedRate: submittedProfile.pricing?.minRate,
        currency: submittedProfile.pricing?.currency,
      });
      setProfile(submittedProfile);
      setApplication(result);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusEvents: ApplicationStatusEvent[] = application
    ? [
        {
          id: application.id,
          timestamp: application.createdAt,
          type: 'submitted',
          status: 'completed',
          message: 'Application submitted successfully',
          actor: 'You',
        },
      ]
    : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Apply for Campaign</h1>
            <p className="text-muted-foreground">Campaign ID: {campaignId}</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {loadError}
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading campaign...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!application ? (
              <CreativeApplicationFlow
                campaignId={campaignId}
                campaignTitle={campaign?.title ?? 'Campaign'}
                onSubmit={handleSubmitApplication}
              />
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-success/10 border border-success/20 rounded-lg">
                  <h2 className="text-lg font-semibold text-success mb-2">Application Submitted!</h2>
                  <p className="text-sm text-muted-foreground">
                    Your application has been submitted successfully. You will be notified once the brand reviews your application.
                  </p>
                </div>

                <div className="p-6 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-4">Application Summary</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{profile?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p className="font-medium">{profile?.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile?.categories.map((cat) => (
                          <span key={cat} className="px-2 py-1 bg-brand-blue/10 text-brand-blue rounded text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isSubmitting && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Submitting application...
              </div>
            )}
          </div>

          <div>
            {application && (
              <ApplicationStatusTracker
                events={statusEvents}
                currentStatus="under_review"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
