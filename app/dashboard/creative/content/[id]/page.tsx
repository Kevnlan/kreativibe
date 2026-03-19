'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { ImageUploader } from '@/components/content/ImageUploader';
import { PlatformSelector } from '@/components/content/PlatformSelector';
import { Content, ContentCategory, ContentStatus, Platform, UpdateContentData } from '@/types/api-contracts/content.types';

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

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Content | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ContentCategory>('LIFESTYLE');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [tags, setTags] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<ContentStatus>('DRAFT');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    loadContent();
  }, [contentId]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockContent: Content = {
        id: contentId,
        creatorId: 'user-1',
        type: 'IMAGE',
        format: 'IMAGE',
        metadata: {
          title: 'Summer Beach Lifestyle',
          description: 'Beautiful beach sunset photos',
          category: 'LIFESTYLE',
          platforms: ['INSTAGRAM', 'FACEBOOK'],
          tags: ['summer', 'beach', 'sunset'],
          brand: 'Nike',
        },
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
        mediaUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
        price: 5000,
        currency: 'KES',
        status: 'PUBLISHED',
        moderationStatus: 'APPROVED',
        currentVersion: 1,
        views: 245,
        likes: 32,
        purchases: 3,
        revenue: 15000,
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z',
        publishedAt: '2024-03-15T12:00:00Z',
      };

      setContent(mockContent);
      setTitle(mockContent.metadata.title);
      setDescription(mockContent.metadata.description || '');
      setCategory(mockContent.metadata.category);
      setPlatforms(mockContent.metadata.platforms);
      setTags(mockContent.metadata.tags?.join(', ') || '');
      setBrand(mockContent.metadata.brand || '');
      setPrice(mockContent.price);
      setStatus(mockContent.status);
      setPreviews(mockContent.mediaUrls);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: UpdateContentData = {
        metadata: {
          title,
          description,
          category,
          platforms,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          brand: brand || undefined,
        },
        price,
        status,
        mediaUrls: previews,
        coverImage: previews[0],
      };

      // Mock save - replace with actual API call
      console.log('Updating content:', updateData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push('/dashboard/creative/content?updated=true');
    } catch (error) {
      console.error('Failed to update content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        // Mock delete - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard/creative/content?deleted=true');
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const handleImagesSelect = (newFiles: File[], newPreviews: string[]) => {
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const getStatusVariant = (status: ContentStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'pending';
      case 'APPROVED':
      case 'PUBLISHED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'SOLD':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Content not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Content</h1>
            <p className="text-muted-foreground mt-1">
              Update your content details and media
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/creative/content/${contentId}/preview`)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge variant={getStatusVariant(content.status)} className="mt-1">
                {content.status.replace('_', ' ')}
              </StatusBadge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Views</p>
              <p className="text-lg font-semibold">{content.views}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Likes</p>
              <p className="text-lg font-semibold">{content.likes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sales</p>
              <p className="text-lg font-semibold">{content.purchases}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(content.revenue, content.currency)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                type="text"
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
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
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
                contentType={content.type}
              />

              <Input
                label="Tags (comma separated)"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

              <Input
                label="Brand/Product Featured"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onImagesSelect={handleImagesSelect}
                maxFiles={content.format === 'CAROUSEL' ? 10 : 1}
                existingPreviews={previews}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price ({content.currency})
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You receive: {formatCurrency(price * 0.85, content.currency)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Content Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  disabled={content.status === 'UNDER_REVIEW' || content.status === 'SOLD'}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submit for Review</option>
                  {content.status === 'APPROVED' && <option value="PUBLISHED">Published</option>}
                  {content.status === 'UNDER_REVIEW' && <option value="UNDER_REVIEW">Under Review</option>}
                  {content.status === 'SOLD' && <option value="SOLD">Sold</option>}
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {content.moderationStatus && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Moderation Status</p>
                  <StatusBadge variant={content.moderationStatus === 'APPROVED' ? 'success' : 'pending'}>
                    {content.moderationStatus}
                  </StatusBadge>
                </div>
              )}

              {content.rejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{content.rejectionReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{content.currentVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {new Date(content.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" loading={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
