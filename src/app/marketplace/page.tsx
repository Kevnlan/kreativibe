'use client';

import { useState, useEffect } from 'react';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Navigation } from '../../components/layout/Navigation';
import { MarketplaceFilters } from '../../components/marketplace/MarketplaceFilters';
import { CreatorPostCard } from '../../components/marketplace/CreatorPostCard';
import { Button } from '../../components/ui';
import { Badge } from '../../components/ui';

// Mock data for demonstration
const mockCreators = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    bio: 'Fashion and lifestyle content creator',
    location: 'Nairobi',
    isVerified: true,
    averageRating: 4.8,
    totalReviews: 45,
    pricing: {
      instagramPost: 5000,
      instagramStory: 2000,
      instagramReel: 8000,
    },
    stats: {
      followers: 125000,
      engagement: 4.2,
      posts: 234,
    },
  },
  {
    id: '2',
    name: 'Michael Kimani',
    avatar: '/avatars/michael.jpg',
    bio: 'Tech reviewer and gadget enthusiast',
    location: 'Mombasa',
    isVerified: true,
    averageRating: 4.6,
    totalReviews: 32,
    pricing: {
      youtubeVideo: 15000,
      youtubeShort: 3000,
      tiktokVideo: 4000,
    },
    stats: {
      followers: 89000,
      engagement: 3.8,
      posts: 156,
    },
  },
  {
    id: '3',
    name: 'Grace Wanjiru',
    avatar: '/avatars/grace.jpg',
    bio: 'Food blogger and recipe developer',
    location: 'Kisumu',
    isVerified: false,
    averageRating: 4.9,
    totalReviews: 28,
    pricing: {
      instagramPost: 3500,
      instagramReel: 6000,
      tiktokVideo: 2500,
    },
    stats: {
      followers: 67000,
      engagement: 5.1,
      posts: 189,
    },
  },
];

const mockPosts = [
  {
    id: '1',
    title: 'Summer Fashion Collection 2024',
    description: 'Check out the latest summer trends and styles perfect for the Kenyan climate',
    media: ['/posts/fashion1.jpg'],
    category: 'Fashion',
    tags: ['summer', 'fashion', 'trends', 'style'],
    createdAt: '2024-01-15T10:00:00Z',
    likes: 234,
    comments: 45,
    views: 12500,
  },
  {
    id: '2',
    title: 'Latest Smartphone Review',
    description: 'In-depth review of the newest flagship smartphone with camera tests',
    media: ['/posts/tech1.jpg'],
    category: 'Tech',
    tags: ['smartphone', 'review', 'technology', 'camera'],
    createdAt: '2024-01-14T15:30:00Z',
    likes: 189,
    comments: 67,
    views: 8900,
  },
  {
    id: '3',
    title: 'Traditional Kenyan Recipe',
    description: 'Learn how to make authentic Ugali with Sukuma Wiki step by step',
    media: ['/posts/food1.jpg'],
    category: 'Food',
    tags: ['recipe', 'kenyan', 'traditional', 'cooking'],
    createdAt: '2024-01-13T12:00:00Z',
    likes: 456,
    comments: 89,
    views: 15600,
  },
];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply filters to posts
    let filtered = [...mockPosts];
    
    if (filters.searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );
    }
    
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(post => 
        filters.categories.includes(post.category)
      );
    }
    
    if (filters.minRating > 0) {
      filtered = filtered.filter(post => {
        const creator = mockCreators.find(c => c.id === post.id);
        return creator && creator.averageRating >= filters.minRating;
      });
    }
    
    setFilteredPosts(filtered);
  }, [filters]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const postsWithCreators = filteredPosts.map(post => ({
    post,
    creator: mockCreators.find(c => c.id === post.id) || mockCreators[0],
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Creator Marketplace
              </h1>
              <p className="text-muted-foreground">
                Discover and connect with talented content creators
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{filteredPosts.length} creators found</span>
            <span>•</span>
            <span>Starting from KES 2,000</span>
            <span>•</span>
            <Badge variant="secondary">Verified creators available</Badge>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <MarketplaceFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No creators found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {postsWithCreators.map(({ post, creator }) => (
                  <CreatorPostCard
                    key={post.id}
                    creator={creator}
                    post={post}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline">
                  Load More Creators
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
