'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Video, Music, Package, Save, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, MultiStepWizard } from '@/components/ui';
import { ImageUploader } from '@/components/content/ImageUploader';
import { VideoUploader } from '@/components/content/VideoUploader';
import { AudioUploader } from '@/components/content/AudioUploader';
import { BrandAssetUploader } from '@/components/content/BrandAssetUploader';
import { PlatformSelector } from '@/components/content/PlatformSelector';
import type { WizardStep } from '@/components/ui/multi-step-wizard';
import { ContentType, ContentFormat, ContentCategory, Platform, CreateContentData } from '@/types/api-contracts/content.types';
import { useUser } from '@/contexts/AuthContext';
import { generateId } from '@/lib/mock-data/generators';

const CONTENT_TYPES = [
  { value: 'IMAGE' as ContentType, label: 'Image', icon: ImageIcon, description: 'Photos, graphics, designs' },
  { value: 'VIDEO' as ContentType, label: 'Video', icon: Video, description: 'TikTok, Reels, YouTube' },
  { value: 'AUDIO' as ContentType, label: 'Audio', icon: Music, description: 'Radio ads, podcasts' },
  { value: 'BRAND_ASSET' as ContentType, label: 'Brand Asset', icon: Package, description: 'Logos, brand kits' },
];

const CATEGORIES: { value: ContentCategory; label: string }[] = [
  { value: 'FASHION', label: 'Fashion' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'FOOD', label: 'Food & Beverage' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'FITNESS', label: 'Fitness & Health' },
  { value: 'TECH', label: 'Technology' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'OTHER', label: 'Other' },
];

export default function NewContentPage() {
  const router = useRouter();
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Content Type
  const [contentType, setContentType] = useState<ContentType>('IMAGE');
  const [format, setFormat] = useState<ContentFormat>('IMAGE');

  // Step 2: File Upload
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [audioMetadata, setAudioMetadata] = useState<any>(null);

  // Step 3: Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContentCategory>('LIFESTYLE');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [tags, setTags] = useState('');
  const [brand, setBrand] = useState('');

  // Step 4: Pricing
  const [price, setPrice] = useState(0);
  const [currency] = useState('KES');

  const handleImagesSelect = (newFiles: File[], newPreviews: string[]) => {
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleVideoSelect = (file: File | null, preview: string | null, metadata?: any) => {
    if (file && preview) {
      setFiles([file]);
      setPreviews([preview]);
      setVideoMetadata(metadata);
    } else {
      setFiles([]);
      setPreviews([]);
      setVideoMetadata(null);
    }
  };

  const handleAudioSelect = (file: File | null, preview: string | null, metadata?: any) => {
    if (file && preview) {
      setFiles([file]);
      setPreviews([preview]);
      setAudioMetadata(metadata);
    } else {
      setFiles([]);
      setPreviews([]);
      setAudioMetadata(null);
    }
  };

  const handleAssetsSelect = (newFiles: File[], newPreviews: string[]) => {
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const buildContentData = (status: 'DRAFT' | 'SUBMITTED'): CreateContentData => ({
    type: contentType,
    format,
    metadata: {
      title,
      description,
      category,
      platforms,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      brand: brand || undefined,
    },
    mediaUrls: previews,
    coverImage: previews[0],
    thumbnailUrl: previews[0],
    price,
    currency,
  });

  const handleSaveDraft = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const contentData = buildContentData('DRAFT');
      console.log('Saving draft:', contentData);
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/dashboard/creative/content?draft=true');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const contentData = buildContentData('SUBMITTED');
      console.log('Submitting for review:', contentData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard/creative/content?success=true');
    } catch (error) {
      console.error('Failed to submit content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps: WizardStep[] = [
    {
      id: 'type',
      title: 'Content Type',
      description: 'Choose type',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">What type of content are you uploading?</h2>
            <p className="text-muted-foreground">
              Select the content type that best matches your upload
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = contentType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setContentType(type.value);
                    setFormat(type.value as ContentFormat);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-border hover:border-brand-blue/50'
                  }`}
                >
                  <Icon className={`h-8 w-8 mb-3 ${isSelected ? 'text-brand-blue' : 'text-muted-foreground'}`} />
                  <h3 className="font-semibold text-lg mb-1">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              );
            })}
          </div>

          {contentType === 'IMAGE' && (
            <div className="max-w-3xl mx-auto">
              <label className="block text-sm font-medium text-foreground mb-2">
                Image Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['IMAGE', 'CAROUSEL', 'STORY'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt as ContentFormat)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      format === fmt
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                        : 'border-border hover:border-brand-blue/50'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
      isValid: !!contentType,
    },
    {
      id: 'upload',
      title: 'Upload Files',
      description: 'Add media',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Upload Your {contentType}</h2>
            <p className="text-muted-foreground">
              {contentType === 'IMAGE' && 'Upload high-quality images for your content'}
              {contentType === 'VIDEO' && 'Upload your video file'}
              {contentType === 'AUDIO' && 'Upload your audio file'}
              {contentType === 'BRAND_ASSET' && 'Upload brand assets and materials'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {contentType === 'IMAGE' && (
              <ImageUploader
                onImagesSelect={handleImagesSelect}
                maxFiles={format === 'CAROUSEL' ? 10 : 1}
                existingPreviews={previews}
              />
            )}
            {contentType === 'VIDEO' && (
              <VideoUploader
                onVideoSelect={handleVideoSelect}
                existingPreview={previews[0]}
              />
            )}
            {contentType === 'AUDIO' && (
              <AudioUploader
                onAudioSelect={handleAudioSelect}
                existingPreview={previews[0]}
              />
            )}
            {contentType === 'BRAND_ASSET' && (
              <BrandAssetUploader
                onAssetsSelect={handleAssetsSelect}
                existingPreviews={previews}
              />
            )}
          </div>
        </div>
      ),
      isValid: previews.length > 0,
    },
    {
      id: 'metadata',
      title: 'Details',
      description: 'Add info',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Content Details</h2>
            <p className="text-muted-foreground">
              Add information to help brands discover your content
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Input
              label="Title"
              type="text"
              placeholder="Give your content a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your content, what makes it special..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContentCategory)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <PlatformSelector
              selected={platforms}
              onChange={setPlatforms}
              contentType={contentType}
            />

            <Input
              label="Tags (comma separated)"
              type="text"
              placeholder="e.g., summer, beach, lifestyle"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <Input
              label="Brand/Product Featured (optional)"
              type="text"
              placeholder="e.g., Nike, Coca-Cola"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>
      ),
      isValid: !!(title && platforms.length > 0),
    },
    {
      id: 'pricing',
      title: 'Pricing',
      description: 'Set price',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Set Your Price</h2>
            <p className="text-muted-foreground">
              How much should brands pay for this content?
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price ({currency}) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue text-lg font-semibold"
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Platform commission: 15% • You receive: {currency} {(price * 0.85).toFixed(2)}
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Pricing Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Research similar content prices</li>
                  <li>• Consider your follower count</li>
                  <li>• Factor in production quality</li>
                  <li>• Account for usage rights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
      isValid: price > 0,
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Review Your Content</h2>
            <p className="text-muted-foreground">
              Make sure everything looks good before submitting
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {/* Preview */}
            {previews.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Preview</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {previews.slice(0, 3).map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  {previews.length > 3 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      +{previews.length - 3} more images
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-semibold">{title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type & Format</p>
                  <p className="font-semibold">{contentType} - {format}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platforms</p>
                  <p className="font-semibold">{platforms.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold text-green-600">{currency} {price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Save className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Save as Draft</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save your progress and come back later to finish editing before publishing.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-green-400 hover:bg-green-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">Submit for Review</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submit your content for moderation. Once approved, it will be visible in the marketplace.
                  </p>
                </div>
              </button>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">Content Review Process</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> <strong>Draft</strong> — Saved but not yet submitted</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> <strong>Submitted</strong> — Sent for platform review</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> <strong>Under Review</strong> — Being reviewed by our team</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> <strong>Approved</strong> — Live in the marketplace</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5" /> <strong>Sold</strong> — Purchased by a brand</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      isValid: true,
    },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <MultiStepWizard
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onComplete={handleComplete}
        onCancel={() => router.back()}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
