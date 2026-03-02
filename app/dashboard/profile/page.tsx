'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Camera, MapPin, Globe, Instagram, Youtube, Twitter, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { AvatarUpload, ImageUpload } from '@/components/upload/ImageUpload';
import { Badge } from '@/components/ui';
import { useUser, useUserRole, useCreatorProfile, useBrandProfile, useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Creator profile schema
const creatorProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagram: z.string().max(50, 'Instagram handle must be less than 50 characters').optional(),
  tiktok: z.string().max(50, 'TikTok handle must be less than 50 characters').optional(),
  youtube: z.string().max(50, 'YouTube handle must be less than 50 characters').optional(),
  twitter: z.string().max(50, 'Twitter handle must be less than 50 characters').optional(),
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
  industry: z.string().max(100, 'Industry must be less than 100 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  size: z.string().max(50, 'Company size must be less than 50 characters').optional(),
});

type CreatorFormData = z.infer<typeof creatorProfileSchema>;
type BrandFormData = z.infer<typeof brandProfileSchema>;

export default function ProfilePage() {
  const user = useUser();
  const userRole = useUserRole();
  const creatorProfile = useCreatorProfile();
  const brandProfile = useBrandProfile();
  const { updateProfile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Creator form
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

  // Brand form
  const brandForm = useForm<BrandFormData>({
    resolver: zodResolver(brandProfileSchema),
    defaultValues: {
      companyName: brandProfile?.companyName || '',
      industry: brandProfile?.industry || '',
      description: brandProfile?.description || '',
      website: brandProfile?.website || '',
      location: brandProfile?.location || '',
      size: brandProfile?.size || '',
    },
  });

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
    // Mock upload - in real app, upload to server
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

  if (userRole === 'CREATOR') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Creator Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your creator profile and pricing
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-success/10 border border-success/20 text-success p-3 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <AvatarUpload
                value={creatorProfile?.avatar}
                onChange={handleAvatarUpload}
                onUpload={handleImageUpload}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  {creatorProfile?.isVerified && (
                    <CheckCircle className="h-5 w-5 text-brand-blue" />
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  {creatorProfile?.bio || 'No bio added yet'}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {creatorProfile?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{creatorProfile.location}</span>
                    </div>
                  )}
                  {creatorProfile?.website && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <a href={creatorProfile.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <form onSubmit={creatorForm.handleSubmit(onCreatorSubmit)} className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Add a cover image to showcase your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={creatorProfile?.coverImage}
                onChange={handleCoverImageUpload}
                onUpload={handleImageUpload}
                aspectRatio="video"
                placeholder="Upload cover image"
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Bio"
                placeholder="Tell brands about yourself and your content"
                {...creatorForm.register('bio')}
                error={creatorForm.formState.errors.bio?.message}
              />
              <Input
                label="Location"
                placeholder="Nairobi, Kenya"
                leftIcon={<MapPin className="h-4 w-4" />}
                {...creatorForm.register('location')}
                error={creatorForm.formState.errors.location?.message}
              />
              <Input
                label="Website"
                placeholder="https://yourwebsite.com"
                leftIcon={<Globe className="h-4 w-4" />}
                {...creatorForm.register('website')}
                error={creatorForm.formState.errors.website?.message}
              />
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Instagram"
                placeholder="@username"
                leftIcon={<Instagram className="h-4 w-4" />}
                {...creatorForm.register('instagram')}
                error={creatorForm.formState.errors.instagram?.message}
              />
              <Input
                label="TikTok"
                placeholder="@username"
                {...creatorForm.register('tiktok')}
                error={creatorForm.formState.errors.tiktok?.message}
              />
              <Input
                label="YouTube"
                placeholder="channel name"
                leftIcon={<Youtube className="h-4 w-4" />}
                {...creatorForm.register('youtube')}
                error={creatorForm.formState.errors.youtube?.message}
              />
              <Input
                label="Twitter"
                placeholder="@username"
                leftIcon={<Twitter className="h-4 w-4" />}
                {...creatorForm.register('twitter')}
                error={creatorForm.formState.errors.twitter?.message}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your rates for different types of content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Instagram Story"
                  placeholder="2000"
                  type="number"
                  {...creatorForm.register('pricing.instagramStory', { valueAsNumber: true })}
                />
                <Input
                  label="Instagram Post"
                  placeholder="5000"
                  type="number"
                  {...creatorForm.register('pricing.instagramPost', { valueAsNumber: true })}
                />
                <Input
                  label="Instagram Reel"
                  placeholder="8000"
                  type="number"
                  {...creatorForm.register('pricing.instagramReel', { valueAsNumber: true })}
                />
                <Input
                  label="TikTok Video"
                  placeholder="4000"
                  type="number"
                  {...creatorForm.register('pricing.tiktokVideo', { valueAsNumber: true })}
                />
                <Input
                  label="YouTube Short"
                  placeholder="3000"
                  type="number"
                  {...creatorForm.register('pricing.youtubeShort', { valueAsNumber: true })}
                />
                <Input
                  label="YouTube Video"
                  placeholder="15000"
                  type="number"
                  {...creatorForm.register('pricing.youtubeVideo', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

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
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Brand Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your brand information and preferences
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-success/10 border border-success/20 text-success p-3 rounded-md">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={brandForm.handleSubmit(onBrandSubmit)} className="space-y-6">
          {/* Logo and Cover */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>
                Upload your logo and cover image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Logo</label>
                <AvatarUpload
                  value={brandProfile?.logo}
                  onChange={handleLogoUpload}
                  onUpload={handleImageUpload}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cover Image</label>
                <ImageUpload
                  value={brandProfile?.coverImage}
                  onChange={handleBrandCoverUpload}
                  onUpload={handleImageUpload}
                  aspectRatio="video"
                  placeholder="Upload cover image"
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your brand information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Company Name"
                placeholder="Your company name"
                {...brandForm.register('companyName')}
                error={brandForm.formState.errors.companyName?.message}
              />
              <Input
                label="Industry"
                placeholder="e.g., Fashion, Technology, Food & Beverage"
                {...brandForm.register('industry')}
                error={brandForm.formState.errors.industry?.message}
              />
              <Input
                label="Description"
                placeholder="Tell creators about your brand"
                {...brandForm.register('description')}
                error={brandForm.formState.errors.description?.message}
              />
              <Input
                label="Website"
                placeholder="https://yourcompany.com"
                leftIcon={<Globe className="h-4 w-4" />}
                {...brandForm.register('website')}
                error={brandForm.formState.errors.website?.message}
              />
              <Input
                label="Location"
                placeholder="Nairobi, Kenya"
                leftIcon={<MapPin className="h-4 w-4" />}
                {...brandForm.register('location')}
                error={brandForm.formState.errors.location?.message}
              />
              <Input
                label="Company Size"
                placeholder="e.g., 1-10, 11-50, 51-200, 201+"
                {...brandForm.register('size')}
                error={brandForm.formState.errors.size?.message}
              />
            </CardContent>
          </Card>

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

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Loading profile...</p>
    </div>
  );
}
