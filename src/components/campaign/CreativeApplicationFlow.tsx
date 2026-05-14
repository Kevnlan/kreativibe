'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Instagram, Youtube, Twitter, Facebook, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ApplicationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface CreativeProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  socialMedia: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
  categories: string[];
  portfolio: string[];
  pricing: {
    minRate: number;
    maxRate: number;
    currency: string;
  };
  availability: string[];
}

interface CreativeApplicationFlowProps {
  campaignId: string;
  campaignTitle: string;
  onSubmit: (profile: CreativeProfile) => void;
}

const steps: ApplicationStep[] = [
  { id: 'profile', title: 'Profile Information', description: 'Basic information about you', completed: false },
  { id: 'social', title: 'Social Media', description: 'Link your social accounts', completed: false },
  { id: 'categories', title: 'Categories', description: 'Select your content categories', completed: false },
  { id: 'portfolio', title: 'Portfolio', description: 'Showcase your best work', completed: false },
  { id: 'pricing', title: 'Pricing', description: 'Set your rates', completed: false },
  { id: 'availability', title: 'Availability', description: 'When are you available?', completed: false },
  { id: 'review', title: 'Review', description: 'Review your application', completed: false },
];

export function CreativeApplicationFlow({ campaignId, campaignTitle, onSubmit }: CreativeApplicationFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [profile, setProfile] = useState<Partial<CreativeProfile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep.id) {
      case 'profile':
        if (!profile.name) newErrors.name = 'Name is required';
        if (!profile.email) newErrors.email = 'Email is required';
        if (!profile.phone) newErrors.phone = 'Phone is required';
        if (!profile.location) newErrors.location = 'Location is required';
        break;
      case 'social':
        if (!profile.socialMedia?.instagram && !profile.socialMedia?.youtube && !profile.socialMedia?.tiktok) {
          newErrors.social = 'At least one social media account is required';
        }
        break;
      case 'categories':
        if (!profile.categories || profile.categories.length === 0) {
          newErrors.categories = 'Select at least one category';
        }
        break;
      case 'portfolio':
        if (!profile.portfolio || profile.portfolio.length === 0) {
          newErrors.portfolio = 'Add at least one portfolio item';
        }
        break;
      case 'pricing':
        if (!profile.pricing?.minRate || !profile.pricing?.maxRate) {
          newErrors.pricing = 'Set your pricing range';
        }
        break;
      case 'availability':
        if (!profile.availability || profile.availability.length === 0) {
          newErrors.availability = 'Select your availability';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (profile.name && profile.email) {
      onSubmit(profile as CreativeProfile);
    }
  };

  const updateProfile = (field: keyof CreativeProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Apply for Campaign</CardTitle>
          <p className="text-muted-foreground">{campaignTitle}</p>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStepIndex && setCurrentStepIndex(index)}
                className={cn(
                  "flex-shrink-0 px-3 py-2 rounded-lg border text-sm transition-all",
                  index === currentStepIndex
                    ? "border-brand-blue bg-brand-blue/5"
                    : index < currentStepIndex
                    ? "border-success bg-success/5"
                    : "border-border"
                )}
              >
                <div className="flex items-center gap-2">
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                  )}
                  <span className="hidden md:inline">{step.title}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </CardHeader>
        <CardContent>
          {currentStep.id === 'profile' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => updateProfile('name', e.target.value)}
                    className={cn(
                      "w-full pl-9 pr-4 py-2 rounded-lg border",
                      errors.name ? "border-destructive" : "border-input"
                    )}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => updateProfile('email', e.target.value)}
                    className={cn(
                      "w-full pl-9 pr-4 py-2 rounded-lg border",
                      errors.email ? "border-destructive" : "border-input"
                    )}
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => updateProfile('phone', e.target.value)}
                    className={cn(
                      "w-full pl-9 pr-4 py-2 rounded-lg border",
                      errors.phone ? "border-destructive" : "border-input"
                    )}
                    placeholder="+254 700 000 000"
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    className={cn(
                      "w-full pl-9 pr-4 py-2 rounded-lg border",
                      errors.location ? "border-destructive" : "border-input"
                    )}
                    placeholder="Nairobi, Kenya"
                  />
                </div>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input resize-none"
                  rows={4}
                  placeholder="Tell us about yourself and your content..."
                />
              </div>
            </div>
          )}

          {currentStep.id === 'social' && (
            <div className="space-y-4">
              {[
                { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: '@username' },
                { key: 'youtube', icon: Youtube, label: 'YouTube', placeholder: 'channel URL' },
                { key: 'tiktok', icon: null, label: 'TikTok', placeholder: '@username' },
                { key: 'twitter', icon: Twitter, label: 'Twitter', placeholder: '@username' },
                { key: 'facebook', icon: Facebook, label: 'Facebook', placeholder: 'page URL' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <div key={social.key} className="space-y-2">
                    <label className="text-sm font-medium">{social.label}</label>
                    <div className="relative">
                      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
                      <input
                        type="text"
                        value={profile.socialMedia?.[social.key as keyof typeof profile.socialMedia] || ''}
                        onChange={(e) => updateProfile('socialMedia', {
                          ...profile.socialMedia,
                          [social.key]: e.target.value,
                        })}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-input"
                        placeholder={social.placeholder}
                      />
                    </div>
                  </div>
                );
              })}
              {errors.social && <p className="text-sm text-destructive">{errors.social}</p>}
            </div>
          )}

          {currentStep.id === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {['Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 'Tech', 'Fitness', 'Gaming', 'Music', 'Art'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      const currentCategories = profile.categories || [];
                      updateProfile(
                        'categories',
                        currentCategories.includes(category)
                          ? currentCategories.filter(c => c !== category)
                          : [...currentCategories, category]
                      );
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm transition-all",
                      profile.categories?.includes(category)
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && <p className="text-sm text-destructive">{errors.categories}</p>}
            </div>
          )}

          {currentStep.id === 'portfolio' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">Add portfolio items (URLs or file uploads)</p>
                <Button variant="outline">Add Portfolio Item</Button>
              </div>
              {errors.portfolio && <p className="text-sm text-destructive">{errors.portfolio}</p>}
            </div>
          )}

          {currentStep.id === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rate (KES)</label>
                  <input
                    type="number"
                    value={profile.pricing?.minRate || ''}
                    onChange={(e) => updateProfile('pricing', {
                      ...profile.pricing,
                      minRate: parseInt(e.target.value),
                      currency: 'KES',
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-input"
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Rate (KES)</label>
                  <input
                    type="number"
                    value={profile.pricing?.maxRate || ''}
                    onChange={(e) => updateProfile('pricing', {
                      ...profile.pricing,
                      maxRate: parseInt(e.target.value),
                      currency: 'KES',
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-input"
                    placeholder="50000"
                  />
                </div>
              </div>
              {errors.pricing && <p className="text-sm text-destructive">{errors.pricing}</p>}
            </div>
          )}

          {currentStep.id === 'availability' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening', 'Flexible'].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      const currentAvailability = profile.availability || [];
                      updateProfile(
                        'availability',
                        currentAvailability.includes(slot)
                          ? currentAvailability.filter(a => a !== slot)
                          : [...currentAvailability, slot]
                      );
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm transition-all",
                      profile.availability?.includes(slot)
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-border hover:border-brand-blue/50"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.availability && <p className="text-sm text-destructive">{errors.availability}</p>}
            </div>
          )}

          {currentStep.id === 'review' && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <p className="text-sm">{profile.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email:</span>
                  <p className="text-sm">{profile.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Location:</span>
                  <p className="text-sm">{profile.location}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Categories:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.categories?.map((cat) => (
                      <Badge key={cat} variant="outline">{cat}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Pricing:</span>
                  <p className="text-sm">
                    KES {profile.pricing?.minRate?.toLocaleString()} - {profile.pricing?.maxRate?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentStepIndex > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              variant="brand"
              onClick={currentStepIndex === steps.length - 1 ? handleSubmit : handleNext}
              className="flex-1"
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              {currentStepIndex === steps.length - 1 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
