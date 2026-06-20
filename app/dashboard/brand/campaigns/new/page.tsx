'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, Target, Users, Megaphone, Clock, FileText, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { campaignService } from '@/services/campaign.service';

interface CampaignData {
  name: string;
  objective: string;
  audience: string;
  budget: string;
  platforms: string[];
  contentTypes: string[];
  duration: string;
  startDate: string;
  messaging: string;
  tone: string;
}

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Radio', 'Print'];
const CONTENT_TYPES = ['Product Reviews', 'Lifestyle Content', 'Tutorials', 'Behind-the-Scenes', 'Testimonials', 'Brand Stories'];
const OBJECTIVES = ['Brand Awareness', 'Product Launch', 'Sales & Conversions', 'Engagement', 'Event Promotion', 'Content Creation'];
const TONES = ['Fun & Energetic', 'Professional & Trustworthy', 'Authentic & Relatable', 'Bold & Edgy', 'Warm & Friendly', 'Luxury & Premium'];

const STEPS = [
  { id: 1, label: 'Objective', icon: Target },
  { id: 2, label: 'Audience & Budget', icon: Users },
  { id: 3, label: 'Platforms & Content', icon: Megaphone },
  { id: 4, label: 'Duration & Messaging', icon: Clock },
  { id: 5, label: 'Review & Create', icon: FileText },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CampaignData>({
    name: '',
    objective: '',
    audience: '',
    budget: '',
    platforms: [],
    contentTypes: [],
    duration: '',
    startDate: '',
    messaging: '',
    tone: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof CampaignData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'platforms' | 'contentTypes', item: string) => {
    setData(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  const canNext = (): boolean => {
    switch (step) {
      case 1: return !!data.name.trim() && !!data.objective;
      case 2: return !!data.audience.trim() && !!data.budget.trim();
      case 3: return data.platforms.length > 0 && data.contentTypes.length > 0;
      case 4: return !!data.duration.trim() && !!data.messaging.trim();
      default: return true;
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    try {
      await campaignService.create({
        name: data.name,
        objective: data.objective,
        audience: data.audience,
        budget: budgetNum,
        platforms: data.platforms,
        contentTypes: data.contentTypes,
        startDate: data.startDate || undefined,
        endDate: data.duration || undefined,
        messaging: data.messaging,
        tone: data.tone,
        source: 'manual',
      });
      router.push('/dashboard/brand/campaigns');
    } catch (err) {
      setError('Failed to create campaign. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const budgetNum = parseInt(data.budget) || 0;
  const suggestedCreators = Math.max(1, Math.ceil(budgetNum / 5000));
  const suggestedContent = Math.max(1, Math.ceil(budgetNum / 3500));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Campaign</h1>
          <p className="text-sm text-muted-foreground">Create a new content campaign in a few steps</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => isDone && setStep(s.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive && 'bg-brand-blue text-white',
                  isDone && 'bg-green-100 text-green-700 cursor-pointer',
                  !isActive && !isDone && 'text-muted-foreground'
                )}
              >
                {isDone ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                <span className="hidden md:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-2', isDone ? 'bg-green-400' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="max-w-3xl">
        {/* Step 1: Objective */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Objective</CardTitle>
              <CardDescription>What do you want to achieve with this campaign?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Campaign Name"
                placeholder="e.g., Summer Product Launch 2026"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
              <div>
                <label className="text-sm font-medium mb-2 block">Objective</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {OBJECTIVES.map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => updateField('objective', obj)}
                      className={cn(
                        'p-3 rounded-lg border text-sm font-medium text-left transition-colors',
                        data.objective === obj
                          ? 'border-brand-blue bg-blue-50 text-brand-blue'
                          : 'border-border hover:border-brand-blue/50'
                      )}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Audience & Budget */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Audience & Budget</CardTitle>
              <CardDescription>Define who you want to reach and your spending limit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Target Audience</label>
                <textarea
                  placeholder="e.g., Young professionals in Nairobi aged 25-35 interested in fitness"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  rows={3}
                  value={data.audience}
                  onChange={(e) => updateField('audience', e.target.value)}
                />
              </div>
              <Input
                label="Budget (KES)"
                placeholder="e.g., 50000"
                type="number"
                value={data.budget}
                onChange={(e) => updateField('budget', e.target.value)}
              />
              {budgetNum > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  With KES {budgetNum.toLocaleString()}, we recommend engaging {suggestedCreators}-{suggestedCreators + 2} creators
                  for {suggestedContent}-{suggestedContent + 3} pieces of content.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Platforms & Content */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Platforms & Content Types</CardTitle>
              <CardDescription>Choose where and what type of content you want</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Platforms (select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggleArrayItem('platforms', p)}
                      className={cn(
                        'p-3 rounded-lg border text-sm font-medium transition-colors',
                        data.platforms.includes(p)
                          ? 'border-brand-blue bg-blue-50 text-brand-blue'
                          : 'border-border hover:border-brand-blue/50'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content Types (select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CONTENT_TYPES.map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => toggleArrayItem('contentTypes', ct)}
                      className={cn(
                        'p-3 rounded-lg border text-sm font-medium transition-colors',
                        data.contentTypes.includes(ct)
                          ? 'border-brand-blue bg-blue-50 text-brand-blue'
                          : 'border-border hover:border-brand-blue/50'
                      )}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Duration & Messaging */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Duration & Messaging</CardTitle>
              <CardDescription>Set the timeline and key message for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Duration"
                  placeholder="e.g., 2 weeks, 1 month"
                  value={data.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                />
                <Input
                  label="Start Date"
                  type="date"
                  value={data.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Key Message</label>
                <textarea
                  placeholder="What's the main message you want to communicate?"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  rows={3}
                  value={data.messaging}
                  onChange={(e) => updateField('messaging', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tone & Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateField('tone', t)}
                      className={cn(
                        'p-3 rounded-lg border text-sm font-medium transition-colors',
                        data.tone === t
                          ? 'border-brand-blue bg-blue-50 text-brand-blue'
                          : 'border-border hover:border-brand-blue/50'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Campaign</CardTitle>
              <CardDescription>Confirm your campaign details before creating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Campaign Name</p>
                    <p className="font-semibold mt-0.5">{data.name}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Objective</p>
                    <p className="font-semibold mt-0.5">{data.objective}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold mt-0.5">KES {budgetNum.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold mt-0.5">{data.duration}{data.startDate ? ` (from ${data.startDate})` : ''}</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Target Audience</p>
                  <p className="font-semibold mt-0.5">{data.audience}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Platforms</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.platforms.map(p => (
                      <span key={p} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{p}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Content Types</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.contentTypes.map(ct => (
                      <span key={ct} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{ct}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Key Message</p>
                    <p className="font-semibold mt-0.5">{data.messaging}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">Tone</p>
                    <p className="font-semibold mt-0.5">{data.tone || 'Not specified'}</p>
                  </div>
                </div>

                {budgetNum > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">Recommendation</p>
                    <p>Engage {suggestedCreators}-{suggestedCreators + 2} creators for {suggestedContent}-{suggestedContent + 3} pieces of content. Estimated reach: {(suggestedCreators * 50000).toLocaleString()}+ people.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-3xl flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {step < 5 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={isCreating} className="bg-green-600 hover:bg-green-700">
            {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            {isCreating ? 'Creating...' : 'Create Campaign'}
          </Button>
        )}
      </div>
      {error && (
        <div className="max-w-3xl bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
