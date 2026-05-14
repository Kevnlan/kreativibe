'use client';

import { useState } from 'react';
import { CreativeApplicationFlow, CreativeProfile } from '@/components/campaign/CreativeApplicationFlow';
import { ApplicationStatusTracker, ApplicationStatusEvent } from '@/components/campaign/ApplicationStatusTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for development
const mockStatusEvents: ApplicationStatusEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'submitted',
    status: 'completed',
    message: 'Application submitted successfully',
    actor: 'You',
  },
];

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const [hasApplied, setHasApplied] = useState(false);
  const [profile, setProfile] = useState<CreativeProfile | null>(null);

  const handleBack = () => {
    router.push('/dashboard/creative/campaigns');
  };

  const handleSubmitApplication = (submittedProfile: CreativeProfile) => {
    setProfile(submittedProfile);
    setHasApplied(true);
    // In production, submit to API
    console.log('Submitting application:', submittedProfile);
  };

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
            <p className="text-muted-foreground">Campaign ID: {params.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!hasApplied ? (
            <CreativeApplicationFlow
              campaignId={params.id as string}
              campaignTitle="Summer Fashion Campaign"
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
        </div>

        <div>
          {hasApplied && (
            <ApplicationStatusTracker
              events={mockStatusEvents}
              currentStatus="under_review"
            />
          )}
        </div>
      </div>
    </div>
  );
}
