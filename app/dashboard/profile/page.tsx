'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, MapPin, Globe, Instagram, Youtube, Twitter, CheckCircle, Shield, Award, Star, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { AvatarUpload, ImageUpload } from '@/components/upload/ImageUpload';
import { Badge } from '@/components/ui';
import { useUser, useUserRole, useCreatorProfile, useBrandProfile, useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Creator profile schema
const creatorProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagram: z.string().max(50).optional(),
  tiktok: z.string().max(50).optional(),
  youtube: z.string().max(50).optional(),
  twitter: z.string().max(50).optional(),
  pricing: z.object({
    instagramStory: z.number().min(0).optional(),
    instagramPost: z.number().min(0).optional(),
    instagramReel: z.number().min(0).optional(),
    tiktokVideo: z.number().min(0).optional(),
    youtubeShort: z.number().min(0).optional(),
    youtubeVideo: z.number().min(0).optional(),
  }).optional(),
});

// Brand profile schema
const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  instagram: z.string().max(50).optional(),
  tiktok: z.string().max(50).optional(),
  youtube: z.string().max(50).optional(),
  twitter: z.string().max(50).optional(),
  facebook: z.string().max(100).optional(),
  linkedin: z.string().max(100).optional(),
});

type CreatorFormData = z.infer<typeof creatorProfileSchema>;
type BrandFormData = z.infer<typeof brandProfileSchema>;

// Badge tier definitions
type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD';

const BADGE_CONFIG: Record<BadgeTier, { label: string; color: string; bgColor: string; borderColor: string; description: string }> = {
  BRONZE: {
    label: 'Bronze',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    description: 'New member. Complete your profile to level up.',
  },
  SILVER: {
    label: 'Silver',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    description: 'Verified member. KYC completed and approved.',
  },
  GOLD: {
    label: 'Gold',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    description: 'Top creator. Actively using the platform with strong track record.',
  },
};

function getBadgeTier(isVerified: boolean, points: number): BadgeTier {
  if (isVerified && points >= 500) return 'GOLD';
  if (isVerified) return 'SILVER';
  return 'BRONZE';
}

function CreatorBadge({ tier }: { tier: BadgeTier }) {
  const config = BADGE_CONFIG[tier];
  const Icon = tier === 'GOLD' ? Star : tier === 'SILVER' ? Shield : Award;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{config.label}</span>
    </div>
  );
}

function FieldVerificationStatus({ isVerified, fieldName, showVerifyBtn, onVerify }: { isVerified: boolean; fieldName: string; showVerifyBtn?: boolean; onVerify?: () => void }) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
        <CheckCircle className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <XCircle className="h-3.5 w-3.5" />
        Unverified
      </span>
      {showVerifyBtn && (
        <button
          type="button"
          onClick={onVerify}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-300 bg-orange-50 rounded px-2 py-0.5 transition-colors"
        >
          Verify
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const user = useUser();
  const userRole = useUserRole();
  const creatorProfile = useCreatorProfile();
  const brandProfile = useBrandProfile();
  const { updateProfile } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'social'>('profile');

  // Mock points for badge calculation
  const mockPoints = 120;
  const isVerified = creatorProfile?.isVerified || false;
  const badgeTier = getBadgeTier(isVerified, mockPoints);

  // Derive verification state from badge tier — Bronze means nothing is verified yet
  const kycVerified = badgeTier !== 'BRONZE';
  const fieldVerification: Record<string, boolean> = {
    bio: kycVerified,
    location: kycVerified,
    website: false,
    nationalId: kycVerified,
    kraPin: kycVerified,
    instagram: false,
    tiktok: false,
    youtube: false,
    twitter: false,
  };

  // Documents also derive from tier
  const docsVerified = kycVerified;

  const creatorForm = useForm<CreatorFormData>({
    resolver: zodResolver(creatorProfileSchema),
    defaultValues: {
      bio: creatorProfile?.bio || '',
      location: creatorProfile?.location || '',
      website: creatorProfile?.website || '',
      instagram: creatorProfile?.instagram || '',
      tiktok: creatorProfile?.tiktok || '',
      youtube: creatorProfile?.youtube || '',
      twitter: creatorProfile?.twitter || '',
      pricing: creatorProfile?.pricing || {},
    },
  });

  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: brandProfile?.companyName || '',
      industry: brandProfile?.industry || '',
      description: brandProfile?.description || '',
      website: brandProfile?.website || '',
      location: brandProfile?.location || '',
      size: brandProfile?.size || '',
      instagram: '',
      tiktok: '',
      youtube: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
  });

  const [brandTab, setBrandTab] = useState<'profile' | 'details' | 'social'>('profile');

  const onCreatorSubmit = async (data: CreatorFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onBrandSubmit = async (data: BrandFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully!');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const handleAvatarUpload = async (url: string) => {
    await updateProfile({ avatar: url });
  };

  const handleCoverImageUpload = async (url: string) => {
    await updateProfile({ coverImage: url });
  };

  const handleLogoUpload = async (url: string) => {
    await updateProfile({ logo: url });
  };

  const handleBrandCoverUpload = async (url: string) => {
    await updateProfile({ coverImage: url });
  };

  const isBronze = badgeTier === 'BRONZE';

  const handleVerifyField = (field: string) => {
    router.push('/onboarding/creator');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile' },
    { id: 'social' as const, label: 'Social Media' },
  ];

  if (userRole === 'CREATOR') {
    return (
      <div className="space-y-6">
        {/* Header with Badge */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Creator Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your profile, details, and social accounts</p>
          </div>
          <CreatorBadge tier={badgeTier} />
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* Cover Banner + Avatar */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-brand-blue via-indigo-500 to-purple-600 relative">
            {creatorProfile?.coverImage && (
              <img src={creatorProfile.coverImage} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-3 right-3">
              <ImageUpload
                value={creatorProfile?.coverImage}
                onChange={handleCoverImageUpload}
                onUpload={handleImageUpload}
                aspectRatio="video"
                placeholder=""
                showPreview={false}
              />
            </div>
          </div>
          <div className="bg-card px-6 pb-4 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative z-10">
                <AvatarUpload
                  value={creatorProfile?.avatar}
                  onChange={handleAvatarUpload}
                  onUpload={handleImageUpload}
                />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  {isVerified && <CheckCircle className="h-5 w-5 text-blue-600" />}
                  <CreatorBadge tier={badgeTier} />
                </div>
                <p className="text-sm text-muted-foreground">{creatorProfile?.bio || 'No bio added yet'}</p>
              </div>
              <div className="flex items-center gap-6 text-center pb-1">
                <div>
                  <p className="text-lg font-bold">{mockPoints}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-lg font-bold">{isVerified ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
              </div>
            </div>

            {/* Badge Progression */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-orange-600 font-semibold">Bronze</span>
                <span className="text-gray-500 font-semibold">Silver</span>
                <span className="text-yellow-600 font-semibold">Gold</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    badgeTier === 'GOLD' ? 'w-full bg-yellow-500' :
                    badgeTier === 'SILVER' ? 'w-2/3 bg-gray-400' :
                    'w-1/3 bg-orange-400'
                  )}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{BADGE_CONFIG[badgeTier].description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-6">
          {/* TAB: Profile */}
          {activeTab === 'profile' && (
            <>
              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>Your personal and professional information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">Bio</label>
                      <FieldVerificationStatus isVerified={fieldVerification.bio} fieldName="bio" showVerifyBtn={isBronze && !fieldVerification.bio} onVerify={() => handleVerifyField('bio')} />
                    </div>
                    <textarea
                      placeholder="Tell brands about yourself and your content"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                      rows={3}
                      {...creatorForm.register('bio')}
                    />
                    {creatorForm.formState.errors.bio && (
                      <p className="text-xs text-red-600 mt-1">{creatorForm.formState.errors.bio.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Location</label>
                        <FieldVerificationStatus isVerified={fieldVerification.location} fieldName="location" showVerifyBtn={isBronze && !fieldVerification.location} onVerify={() => handleVerifyField('location')} />
                      </div>
                      <Input
                        placeholder="Nairobi, Kenya"
                        leftIcon={<MapPin className="h-4 w-4" />}
                        {...creatorForm.register('location')}
                        error={creatorForm.formState.errors.location?.message}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Website</label>
                        <FieldVerificationStatus isVerified={fieldVerification.website} fieldName="website" showVerifyBtn={isBronze && !fieldVerification.website} onVerify={() => handleVerifyField('website')} />
                      </div>
                      <Input
                        placeholder="https://yourwebsite.com"
                        leftIcon={<Globe className="h-4 w-4" />}
                        {...creatorForm.register('website')}
                        error={creatorForm.formState.errors.website?.message}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Email</label>
                        <FieldVerificationStatus isVerified={true} fieldName="email" />
                      </div>
                      <Input placeholder="Email" value={user?.email || ''} disabled />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Phone</label>
                        <FieldVerificationStatus isVerified={true} fieldName="phone" />
                      </div>
                      <Input placeholder="Phone" value="+254 7•• ••• •89" disabled />
                    </div>
                  </div>
                  {/* KYC & Identity */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold mb-3">Identity & KYC</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm font-medium">National ID</label>
                          <FieldVerificationStatus isVerified={fieldVerification.nationalId} fieldName="nationalId" showVerifyBtn={isBronze && !fieldVerification.nationalId} onVerify={() => handleVerifyField('nationalId')} />
                        </div>
                        <Input placeholder="National ID Number" value="••••••78" disabled />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm font-medium">KRA PIN</label>
                          <FieldVerificationStatus isVerified={fieldVerification.kraPin} fieldName="kraPin" showVerifyBtn={isBronze && !fieldVerification.kraPin} onVerify={() => handleVerifyField('kraPin')} />
                        </div>
                        <Input placeholder="KRA PIN" value="A•••••••9X" disabled />
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'ID Front', verified: docsVerified },
                      { name: 'ID Back', verified: docsVerified },
                      { name: 'KRA Certificate', verified: docsVerified },
                      { name: 'Selfie', verified: false },
                    ].map((doc) => (
                      <div key={doc.name} className={`border rounded-lg p-3 flex flex-col items-center gap-2 text-center ${
                        doc.verified ? 'border-green-200 bg-green-50' : 'border-border bg-muted/30'
                      }`}>
                        {doc.verified
                          ? <CheckCircle className="h-5 w-5 text-green-600" />
                          : <XCircle className="h-5 w-5 text-muted-foreground" />
                        }
                        <p className="text-xs font-medium">{doc.name}</p>
                        <p className={`text-[10px] ${doc.verified ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {doc.verified ? 'Verified' : 'Missing'}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isBronze && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900">Upgrade to Silver</p>
                        <p className="text-xs text-orange-800 mt-0.5">
                          Complete your KYC verification to earn the Silver badge and unlock withdrawals.
                        </p>
                        <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700" onClick={() => router.push('/onboarding/creator')}>
                          Complete Verification
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                  <CardDescription>Set your rates for different content types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Instagram Story" placeholder="2000" type="number" {...creatorForm.register('pricing.instagramStory', { valueAsNumber: true })} />
                    <Input label="Instagram Post" placeholder="5000" type="number" {...creatorForm.register('pricing.instagramPost', { valueAsNumber: true })} />
                    <Input label="Instagram Reel" placeholder="8000" type="number" {...creatorForm.register('pricing.instagramReel', { valueAsNumber: true })} />
                    <Input label="TikTok Video" placeholder="4000" type="number" {...creatorForm.register('pricing.tiktokVideo', { valueAsNumber: true })} />
                    <Input label="YouTube Short" placeholder="3000" type="number" {...creatorForm.register('pricing.youtubeShort', { valueAsNumber: true })} />
                    <Input label="YouTube Video" placeholder="15000" type="number" {...creatorForm.register('pricing.youtubeVideo', { valueAsNumber: true })} />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* TAB: Social Media */}
          {activeTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media Accounts</CardTitle>
                <CardDescription>Connect and verify your social media accounts to build trust with brands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Instagram</label>
                    <FieldVerificationStatus isVerified={fieldVerification.instagram} fieldName="instagram" showVerifyBtn={isBronze && !fieldVerification.instagram} onVerify={() => handleVerifyField('instagram')} />
                  </div>
                  <Input
                    placeholder="@username"
                    leftIcon={<Instagram className="h-4 w-4" />}
                    {...creatorForm.register('instagram')}
                    error={creatorForm.formState.errors.instagram?.message}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">TikTok</label>
                    <FieldVerificationStatus isVerified={fieldVerification.tiktok} fieldName="tiktok" showVerifyBtn={isBronze && !fieldVerification.tiktok} onVerify={() => handleVerifyField('tiktok')} />
                  </div>
                  <Input
                    placeholder="@username"
                    {...creatorForm.register('tiktok')}
                    error={creatorForm.formState.errors.tiktok?.message}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">YouTube</label>
                    <FieldVerificationStatus isVerified={fieldVerification.youtube} fieldName="youtube" showVerifyBtn={isBronze && !fieldVerification.youtube} onVerify={() => handleVerifyField('youtube')} />
                  </div>
                  <Input
                    placeholder="channel name"
                    leftIcon={<Youtube className="h-4 w-4" />}
                    {...creatorForm.register('youtube')}
                    error={creatorForm.formState.errors.youtube?.message}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Twitter / X</label>
                    <FieldVerificationStatus isVerified={fieldVerification.twitter} fieldName="twitter" showVerifyBtn={isBronze && !fieldVerification.twitter} onVerify={() => handleVerifyField('twitter')} />
                  </div>
                  <Input
                    placeholder="@username"
                    leftIcon={<Twitter className="h-4 w-4" />}
                    {...creatorForm.register('twitter')}
                    error={creatorForm.formState.errors.twitter?.message}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Why verify social accounts?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>- Verified accounts earn more points towards your badge tier</li>
                    <li>- Brands are more likely to work with verified creators</li>
                    <li>- Unlocks priority in campaign invitations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (userRole === 'BRAND') {
    const brandTabs = [
      { id: 'profile' as const, label: 'Profile' },
      { id: 'details' as const, label: 'Details' },
      { id: 'social' as const, label: 'Social Media' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brand Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your brand information and preferences</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* Cover Banner + Logo */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative">
            {brandProfile?.coverImage && (
              <img src={brandProfile.coverImage} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-3 right-3">
              <ImageUpload
                value={brandProfile?.coverImage}
                onChange={handleBrandCoverUpload}
                onUpload={handleImageUpload}
                aspectRatio="video"
                placeholder=""
                showPreview={false}
              />
            </div>
          </div>
          <div className="bg-card px-6 pb-4 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative z-10">
                <AvatarUpload
                  value={brandProfile?.logo}
                  onChange={handleLogoUpload}
                  onUpload={handleImageUpload}
                />
              </div>
              <div className="flex-1 pb-1">
                <h2 className="text-xl font-bold">{brandProfile?.companyName || user?.name}</h2>
                <p className="text-sm text-muted-foreground">{brandProfile?.industry || 'No industry set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-0">
            {brandTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBrandTab(tab.id)}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  brandTab === tab.id
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-6">
          {/* TAB: Profile */}
          {brandTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your brand information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input label="Company Name" placeholder="Your company name" {...brandForm.register('companyName')} error={brandForm.formState.errors.companyName?.message} />
                <Input label="Industry" placeholder="e.g., Fashion, Technology, Food & Beverage" {...brandForm.register('industry')} error={brandForm.formState.errors.industry?.message} />
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    placeholder="Tell creators about your brand"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                    rows={3}
                    {...brandForm.register('description')}
                  />
                  {brandForm.formState.errors.description && (
                    <p className="text-xs text-red-600 mt-1">{brandForm.formState.errors.description.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Website" placeholder="https://yourcompany.com" leftIcon={<Globe className="h-4 w-4" />} {...brandForm.register('website')} error={brandForm.formState.errors.website?.message} />
                  <Input label="Location" placeholder="Nairobi, Kenya" leftIcon={<MapPin className="h-4 w-4" />} {...brandForm.register('location')} error={brandForm.formState.errors.location?.message} />
                </div>
                <Input label="Company Size" placeholder="e.g., 1-10, 11-50, 51-200, 201+" {...brandForm.register('size')} error={brandForm.formState.errors.size?.message} />
              </CardContent>
            </Card>
          )}

          {/* TAB: Details */}
          {brandTab === 'details' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Verification</CardTitle>
                  <CardDescription>Business registration and compliance documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Business Registration No.</label>
                      <Input placeholder="Business Reg. Number" value="BRN-••••••42" disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">KRA PIN</label>
                      <Input placeholder="KRA PIN" value="P•••••••7K" disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Contact Person</label>
                      <Input placeholder="Contact person" value={user?.name || ''} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input placeholder="Email" value={user?.email || ''} disabled />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: 'Business Reg. Certificate', verified: true },
                      { name: 'Tax Compliance', verified: true },
                      { name: 'CR12 / Incorporation', verified: false },
                    ].map((doc) => (
                      <div key={doc.name} className={`border rounded-lg p-3 flex flex-col items-center gap-2 text-center ${
                        doc.verified ? 'border-green-200 bg-green-50' : 'border-border bg-muted/30'
                      }`}>
                        {doc.verified
                          ? <CheckCircle className="h-5 w-5 text-green-600" />
                          : <XCircle className="h-5 w-5 text-muted-foreground" />
                        }
                        <p className="text-xs font-medium">{doc.name}</p>
                        <p className={`text-[10px] ${doc.verified ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {doc.verified ? 'Verified' : 'Missing'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* TAB: Social Media */}
          {brandTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media Accounts</CardTitle>
                <CardDescription>Connect your brand social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Instagram" placeholder="@brandname" leftIcon={<Instagram className="h-4 w-4" />} {...brandForm.register('instagram')} />
                  <Input label="TikTok" placeholder="@brandname" {...brandForm.register('tiktok')} />
                  <Input label="YouTube" placeholder="Channel name" leftIcon={<Youtube className="h-4 w-4" />} {...brandForm.register('youtube')} />
                  <Input label="Twitter / X" placeholder="@brandname" leftIcon={<Twitter className="h-4 w-4" />} {...brandForm.register('twitter')} />
                  <Input label="Facebook" placeholder="facebook.com/brandname" {...brandForm.register('facebook')} />
                  <Input label="LinkedIn" placeholder="linkedin.com/company/brandname" {...brandForm.register('linkedin')} />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Loading profile...</p>
    </div>
  );
}
