'use client';

import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Video, Music, Package, Eye, Edit, Trash2, Copy, Sparkles } from 'lucide-react';
import { Button, DataTable, StatCard, StatusBadge, Input, EmptyState } from '@/components/ui';
import { Content, ContentStatus, ContentType } from '@/types/api-contracts/content.types';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/AuthContext';

export default function ContentManagementPage() {
  const router = useRouter();
  const user = useUser();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');

  useEffect(() => {
    if (user) {
      loadContents();
    }
  }, [user]);

  const loadContents = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockContents: Content[] = [
        {
          id: '1',
          creatorId: user!.id,
          type: 'IMAGE',
          format: 'IMAGE',
          metadata: {
            title: 'Summer Beach Lifestyle',
            description: 'Beautiful beach sunset photos',
            category: 'LIFESTYLE',
            platforms: ['INSTAGRAM', 'FACEBOOK'],
            tags: ['summer', 'beach', 'sunset'],
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
        },
        {
          id: '2',
          creatorId: user!.id,
          type: 'IMAGE',
          format: 'CAROUSEL',
          metadata: {
            title: 'Fashion Product Showcase',
            description: 'Professional product photography',
            category: 'FASHION',
            platforms: ['INSTAGRAM', 'TIKTOK'],
            tags: ['fashion', 'product', 'commercial'],
          },
          coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
          mediaUrls: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'],
          price: 8000,
          currency: 'KES',
          status: 'UNDER_REVIEW',
          moderationStatus: 'IN_REVIEW',
          currentVersion: 1,
          views: 0,
          likes: 0,
          purchases: 0,
          revenue: 0,
          createdAt: '2024-03-18T08:00:00Z',
          updatedAt: '2024-03-18T08:00:00Z',
        },
        {
          id: '3',
          creatorId: user!.id,
          type: 'IMAGE',
          format: 'STORY',
          metadata: {
            title: 'Food Photography Collection',
            description: 'Delicious food shots for restaurants',
            category: 'FOOD',
            platforms: ['INSTAGRAM'],
            tags: ['food', 'restaurant', 'culinary'],
          },
          coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
          mediaUrls: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
          price: 3500,
          currency: 'KES',
          status: 'DRAFT',
          currentVersion: 1,
          views: 0,
          likes: 0,
          purchases: 0,
          revenue: 0,
          createdAt: '2024-03-18T14:00:00Z',
          updatedAt: '2024-03-18T14:00:00Z',
        },
      ];
      setContents(mockContents);
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setLoading(false);
    }
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
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-4 w-4" />;
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'AUDIO':
        return <Music className="h-4 w-4" />;
      case 'BRAND_ASSET':
        return <Package className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContents(contents.filter(c => c.id !== id));
    }
  };

  const handleDuplicate = async (id: string) => {
    const content = contents.find(c => c.id === id);
    if (content) {
      // Mock duplicate
      const duplicate = {
        ...content,
        id: `${id}-copy`,
        metadata: {
          ...content.metadata,
          title: `${content.metadata.title} (Copy)`,
        },
        status: 'DRAFT' as ContentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setContents([duplicate, ...contents]);
    }
  };

  const columns = [
    {
      key: 'coverImage',
      label: 'Preview',
      render: (value: string, row: Content) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
          {value ? (
            <img src={value} alt={row.metadata.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getTypeIcon(row.type)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'metadata',
      label: 'Content',
      sortable: true,
      render: (value: Content['metadata'], row: Content) => (
        <div>
          <div className="font-medium">{value.title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            {getTypeIcon(row.type)}
            <span>{row.format}</span>
            <span>•</span>
            <span>{value.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'metadata.platforms',
      label: 'Platforms',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((platform) => (
            <span key={platform} className="text-xs px-2 py-1 bg-muted rounded">
              {platform}
            </span>
          ))}
          {value.length > 2 && (
            <span className="text-xs px-2 py-1 bg-muted rounded">
              +{value.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number, row: Content) => (
        <span className="font-semibold">{formatCurrency(value, row.currency)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: ContentStatus) => (
        <StatusBadge variant={getStatusVariant(value)} size="sm">
          {value.replace('_', ' ')}
        </StatusBadge>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'purchases',
      label: 'Sales',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm font-medium">{value}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Content) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/creative/content/${row.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDuplicate(row.id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const stats = {
    total: contents.length,
    published: contents.filter(c => c.status === 'PUBLISHED').length,
    draft: contents.filter(c => c.status === 'DRAFT').length,
    underReview: contents.filter(c => c.status === 'UNDER_REVIEW').length,
    totalRevenue: contents.reduce((sum, c) => sum + c.revenue, 0),
  };

  const filteredContents = contents.filter(content => {
    if (filterStatus !== 'ALL' && content.status !== filterStatus) return false;
    if (filterType !== 'ALL' && content.type !== filterType) return false;
    if (searchQuery && !content.metadata.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Content</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your uploaded content
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/dashboard/creative/content/optimize')}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Advisor
          </Button>
          <Button onClick={() => router.push('/dashboard/creative/content/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Content"
          value={stats.total.toString()}
          icon={<ImageIcon className="h-4 w-4" />}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Published"
          value={stats.published.toString()}
          icon={<Eye className="h-4 w-4" />}
          iconColor="text-green-600"
        />
        <StatCard
          title="Drafts"
          value={stats.draft.toString()}
          icon={<Edit className="h-4 w-4" />}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Under Review"
          value={stats.underReview.toString()}
          icon={<Package className="h-4 w-4" />}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<Package className="h-4 w-4" />}
          iconColor="text-green-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ContentStatus | 'ALL')}
          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="PUBLISHED">Published</option>
          <option value="SOLD">Sold</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ContentType | 'ALL')}
          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <option value="ALL">All Types</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
          <option value="BRAND_ASSET">Brand Asset</option>
        </select>
      </div>

      {/* Content Table */}
      {loading ? (
        <DataTable data={[]} columns={columns} loading={true} />
      ) : filteredContents.length === 0 ? (
        <EmptyState
          icon={<ImageIcon className="h-12 w-12" />}
          title="No content yet"
          description="Start uploading content to showcase your work to brands"
          action={{
            label: 'Upload Content',
            onClick: () => router.push('/dashboard/creative/content/new'),
          }}
        />
      ) : (
        <DataTable
          data={filteredContents}
          columns={columns}
          searchable={false}
        />
      )}
    </div>
  );
}
