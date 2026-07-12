'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, Users, Star, Eye, TrendingUp, Film, ImageIcon, Youtube, Music2, Play, Briefcase, Target, DollarSign, MapPin, ShoppingBag, Send, Calendar } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { CreatorCardData } from '@/components/marketplace/CreatorPostCard';
import { Button } from '@/components/ui';
import { formatNumber, formatCurrency, cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { marketplaceService, MarketplaceContentItem } from '@/services/marketplace.service';
import { campaignService } from '@/services/campaign.service';
import { Campaign } from '@/types/campaign.types';

// ── Creator data (Brand sees these) ──
const allCreators: CreatorCardData[] = [
  { id: '1', initials: 'SK', name: 'Sarah Kimani', bio: 'Fashion & lifestyle creator obsessed with East African street style and sustainable fashion.', location: 'Nairobi', isVerified: true, averageRating: 4.8, totalReviews: 45, niche: 'Fashion', platforms: ['Instagram', 'TikTok'], color: 'from-pink-400 to-rose-500', minPrice: 5000, stats: { followers: 125000, engagement: 4.2, posts: 234 } },
  { id: '2', initials: 'MK', name: 'Michael Kamau', bio: 'In-depth tech reviews and gadget comparisons for the African market.', location: 'Mombasa', isVerified: true, averageRating: 4.6, totalReviews: 32, niche: 'Tech', platforms: ['YouTube', 'TikTok'], color: 'from-blue-400 to-indigo-500', minPrice: 3000, stats: { followers: 89000, engagement: 3.8, posts: 156 } },
  { id: '3', initials: 'GW', name: 'Grace Wanjiru', bio: 'Food blogger recreating traditional Kenyan recipes with a modern twist.', location: 'Kisumu', isVerified: false, averageRating: 4.9, totalReviews: 28, niche: 'Food', platforms: ['Instagram', 'YouTube'], color: 'from-orange-400 to-amber-500', minPrice: 2500, stats: { followers: 67000, engagement: 5.1, posts: 189 } },
  { id: '4', initials: 'JM', name: 'James Mutua', bio: "Travel vlogger exploring Kenya's hidden gems and coastal getaways.", location: 'Mombasa', isVerified: true, averageRating: 4.7, totalReviews: 38, niche: 'Travel', platforms: ['YouTube', 'Instagram'], color: 'from-cyan-400 to-sky-500', minPrice: 8000, stats: { followers: 128000, engagement: 5.4, posts: 201 } },
  { id: '5', initials: 'AN', name: 'Aisha Ndungu', bio: 'Beauty creator championing African skincare routines and local brands.', location: 'Nairobi', isVerified: true, averageRating: 4.9, totalReviews: 61, niche: 'Beauty', platforms: ['Instagram', 'TikTok'], color: 'from-violet-400 to-purple-500', minPrice: 4000, stats: { followers: 82500, engagement: 6.3, posts: 312 } },
  { id: '6', initials: 'TO', name: 'Tom Ochieng', bio: 'Fitness coach and transformation content creator based in Kisumu.', location: 'Kisumu', isVerified: false, averageRating: 4.5, totalReviews: 19, niche: 'Fitness', platforms: ['Instagram', 'YouTube'], color: 'from-green-400 to-teal-500', minPrice: 4500, stats: { followers: 34000, engagement: 8.1, posts: 98 } },
  { id: '7', initials: 'RM', name: 'Rita Mwangi', bio: 'Lifestyle and parenting creator connecting with modern Kenyan families.', location: 'Nairobi', isVerified: true, averageRating: 4.7, totalReviews: 44, niche: 'Lifestyle', platforms: ['TikTok', 'Instagram'], color: 'from-emerald-400 to-green-500', minPrice: 7000, stats: { followers: 91000, engagement: 5.9, posts: 278 } },
  { id: '8', initials: 'BK', name: 'Brian Karuri', bio: 'Gaming and esports content creator covering African gaming culture.', location: 'Nairobi', isVerified: false, averageRating: 4.4, totalReviews: 15, niche: 'Gaming', platforms: ['YouTube', 'TikTok'], color: 'from-red-400 to-rose-600', minPrice: 2000, stats: { followers: 55000, engagement: 4.7, posts: 143 } },
  { id: '9', initials: 'FO', name: 'Faith Otieno', bio: "Music and entertainment creator spotlighting Kenya's emerging artists.", location: 'Nairobi', isVerified: true, averageRating: 4.8, totalReviews: 36, niche: 'Music', platforms: ['Instagram', 'YouTube'], color: 'from-yellow-400 to-orange-500', minPrice: 6000, stats: { followers: 73000, engagement: 5.2, posts: 167 } },
  { id: '10', initials: 'DC', name: 'David Chege', bio: 'Art and design creator showcasing East African contemporary illustration.', location: 'Eldoret', isVerified: false, averageRating: 4.6, totalReviews: 22, niche: 'Art', platforms: ['Instagram', 'TikTok'], color: 'from-fuchsia-400 to-pink-500', minPrice: 3500, stats: { followers: 41000, engagement: 7.3, posts: 210 } },
  { id: '11', initials: 'NW', name: 'Nancy Wambui', bio: 'Micro-influencer specialising in eco-living and sustainable Nairobi lifestyle.', location: 'Nairobi', isVerified: true, averageRating: 4.9, totalReviews: 29, niche: 'Lifestyle', platforms: ['Instagram'], color: 'from-lime-400 to-green-500', minPrice: 3000, stats: { followers: 28000, engagement: 9.4, posts: 176 } },
  { id: '12', initials: 'PK', name: 'Peter Kiprop', bio: 'Sports and athletics creator covering Kenyan running culture and marathons.', location: 'Eldoret', isVerified: true, averageRating: 4.7, totalReviews: 33, niche: 'Fitness', platforms: ['YouTube', 'Instagram'], color: 'from-sky-400 to-blue-500', minPrice: 5500, stats: { followers: 62000, engagement: 4.9, posts: 134 } },
];

// ── Brand campaigns data (Creator sees these) ──
interface BrandCampaign {
  id: string;
  brandName: string;
  brandInitials: string;
  brandColor: string;
  campaignName: string;
  objective: string;
  description: string;
  budget: number;
  perCreatorBudget: number;
  platforms: string[];
  contentTypes: string[];
  niche: string;
  deadline: string;
  creatorsNeeded: number;
  creatorsJoined: number;
  status: 'open' | 'filling' | 'closed';
}

const allCampaigns: BrandCampaign[] = [
  { id: 'c1', brandName: 'TechBrand KE', brandInitials: 'TB', brandColor: 'from-blue-500 to-indigo-600', campaignName: 'Gadget Launch 2026', objective: 'Product Launch', description: 'We need creators to unbox and review our latest smartphone. Show real-world usage, camera quality, and battery life in your everyday routine.', budget: 80000, perCreatorBudget: 15000, platforms: ['YouTube', 'TikTok'], contentTypes: ['Product Reviews', 'Tutorials'], niche: 'Tech', deadline: 'Apr 15, 2026', creatorsNeeded: 5, creatorsJoined: 2, status: 'open' },
  { id: 'c2', brandName: 'FashionHouse', brandInitials: 'FH', brandColor: 'from-pink-500 to-rose-600', campaignName: 'Summer Style Drop', objective: 'Brand Awareness', description: 'Showcase our new summer collection through street-style lookbooks, outfit transitions, and styling tips. Target young professionals in Nairobi.', budget: 60000, perCreatorBudget: 10000, platforms: ['Instagram', 'TikTok'], contentTypes: ['Lifestyle Content', 'Brand Stories'], niche: 'Fashion', deadline: 'Apr 30, 2026', creatorsNeeded: 6, creatorsJoined: 4, status: 'filling' },
  { id: 'c3', brandName: 'FitLife Kenya', brandInitials: 'FL', brandColor: 'from-green-500 to-emerald-600', campaignName: '30-Day Challenge', objective: 'Engagement', description: 'Create a 30-day fitness challenge series featuring our protein supplement. Document transformation, daily routines, and honest results.', budget: 45000, perCreatorBudget: 8000, platforms: ['Instagram', 'YouTube'], contentTypes: ['Testimonials', 'Behind-the-Scenes'], niche: 'Fitness', deadline: 'May 10, 2026', creatorsNeeded: 4, creatorsJoined: 1, status: 'open' },
  { id: 'c4', brandName: 'Safari Bites', brandInitials: 'SB', brandColor: 'from-orange-500 to-amber-600', campaignName: 'Taste of Kenya', objective: 'Content Creation', description: 'Create recipe videos and food posts featuring our new snack range. Show creative ways to enjoy our products with friends and family.', budget: 35000, perCreatorBudget: 5000, platforms: ['Instagram', 'TikTok'], contentTypes: ['Product Reviews', 'Lifestyle Content'], niche: 'Food', deadline: 'Apr 20, 2026', creatorsNeeded: 7, creatorsJoined: 5, status: 'filling' },
  { id: 'c5', brandName: 'GlowUp Beauty', brandInitials: 'GB', brandColor: 'from-violet-500 to-purple-600', campaignName: 'Skincare Secrets', objective: 'Sales & Conversions', description: 'Feature our skincare line in morning/evening routine content. Show before/after results and honest reviews to drive product purchases.', budget: 50000, perCreatorBudget: 12000, platforms: ['TikTok', 'Instagram'], contentTypes: ['Tutorials', 'Testimonials'], niche: 'Beauty', deadline: 'May 1, 2026', creatorsNeeded: 4, creatorsJoined: 0, status: 'open' },
  { id: 'c6', brandName: 'WanderKenya', brandInitials: 'WK', brandColor: 'from-cyan-500 to-sky-600', campaignName: 'Hidden Gems Tour', objective: 'Brand Awareness', description: 'Travel to offbeat Kenyan destinations and create vlogs featuring our travel packages. Capture stunning visuals and authentic experiences.', budget: 100000, perCreatorBudget: 20000, platforms: ['YouTube', 'Instagram'], contentTypes: ['Brand Stories', 'Behind-the-Scenes'], niche: 'Travel', deadline: 'Jun 1, 2026', creatorsNeeded: 5, creatorsJoined: 3, status: 'filling' },
  { id: 'c7', brandName: 'SoundWave KE', brandInitials: 'SW', brandColor: 'from-yellow-500 to-orange-600', campaignName: 'New Artist Spotlight', objective: 'Engagement', description: 'Cover and promote emerging Kenyan artists on your platform. Create reaction videos, interviews, and event coverage for music fans.', budget: 40000, perCreatorBudget: 8000, platforms: ['YouTube', 'TikTok'], contentTypes: ['Brand Stories', 'Lifestyle Content'], niche: 'Music', deadline: 'Apr 25, 2026', creatorsNeeded: 5, creatorsJoined: 2, status: 'open' },
  { id: 'c8', brandName: 'HomeStyle KE', brandInitials: 'HS', brandColor: 'from-emerald-500 to-teal-600', campaignName: 'Modern Living', objective: 'Product Launch', description: 'Showcase our new home decor collection in lifestyle content. Style rooms, create home tours, and share design inspiration with your audience.', budget: 55000, perCreatorBudget: 9000, platforms: ['Instagram', 'TikTok'], contentTypes: ['Lifestyle Content', 'Tutorials'], niche: 'Lifestyle', deadline: 'May 15, 2026', creatorsNeeded: 6, creatorsJoined: 1, status: 'open' },
];

interface ContentPost {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'Reel' | 'Post' | 'TikTok' | 'YouTube' | 'Story';
  platform: string;
  niche: string;
  price: number;
  views: number;
  engagement: number;
  deliveryDays: number;
  color: string;
}

const allPosts: ContentPost[] = [
  { id: 'p1', creatorId: '1', title: 'Fashion Lookbook Reel', description: 'Trendy outfit transitions showcasing your brand in an engaging 30s Reel with styling tips.', type: 'Reel', platform: 'Instagram', niche: 'Fashion', price: 5000, views: 48000, engagement: 6.2, deliveryDays: 3, color: 'from-pink-400 to-rose-500' },
  { id: 'p2', creatorId: '2', title: 'Unboxing & Review Video', description: 'Full unboxing experience with honest review, specs breakdown and recommendation for your tech product.', type: 'YouTube', platform: 'YouTube', niche: 'Tech', price: 15000, views: 32000, engagement: 4.8, deliveryDays: 5, color: 'from-blue-400 to-indigo-500' },
  { id: 'p3', creatorId: '3', title: 'Recipe Integration Post', description: 'Your ingredient or product naturally woven into a beautiful recipe post with step-by-step photos.', type: 'Post', platform: 'Instagram', niche: 'Food', price: 3500, views: 21000, engagement: 7.1, deliveryDays: 2, color: 'from-orange-400 to-amber-500' },
  { id: 'p4', creatorId: '5', title: 'Skincare Routine TikTok', description: 'Morning or evening skincare routine featuring your product with honest before/after results.', type: 'TikTok', platform: 'TikTok', niche: 'Beauty', price: 4000, views: 91000, engagement: 8.4, deliveryDays: 3, color: 'from-violet-400 to-purple-500' },
  { id: 'p5', creatorId: '4', title: 'Destination Travel Vlog', description: 'A full travel vlog featuring your hotel, tour, or product at a stunning Kenyan destination.', type: 'YouTube', platform: 'YouTube', niche: 'Travel', price: 18000, views: 54000, engagement: 5.9, deliveryDays: 7, color: 'from-cyan-400 to-sky-500' },
  { id: 'p6', creatorId: '6', title: 'Fitness Challenge Video', description: '30-day challenge promo featuring your supplement or fitness equipment with transformation results.', type: 'Reel', platform: 'Instagram', niche: 'Fitness', price: 6000, views: 38000, engagement: 9.2, deliveryDays: 4, color: 'from-green-400 to-teal-500' },
  { id: 'p7', creatorId: '7', title: 'Family Lifestyle Integration', description: 'Natural product placement in a warm family day-in-the-life video connecting with parents.', type: 'TikTok', platform: 'TikTok', niche: 'Lifestyle', price: 7000, views: 44000, engagement: 6.7, deliveryDays: 3, color: 'from-emerald-400 to-green-500' },
  { id: 'p8', creatorId: '9', title: 'Music Event Coverage', description: 'Live event or product launch coverage with behind-the-scenes access and artist features.', type: 'Reel', platform: 'Instagram', niche: 'Music', price: 8000, views: 29000, engagement: 5.4, deliveryDays: 2, color: 'from-yellow-400 to-orange-500' },
  { id: 'p9', creatorId: '8', title: 'Gaming Sponsored Stream', description: 'Live stream with your brand banner, verbal mentions, and product showcase during gameplay.', type: 'YouTube', platform: 'YouTube', niche: 'Gaming', price: 5000, views: 18000, engagement: 4.9, deliveryDays: 5, color: 'from-red-400 to-rose-600' },
  { id: 'p10', creatorId: '10', title: 'Brand Identity Illustration', description: 'Custom digital illustration featuring your brand, perfect for social media and campaign visuals.', type: 'Post', platform: 'Instagram', niche: 'Art', price: 4500, views: 14000, engagement: 8.8, deliveryDays: 4, color: 'from-fuchsia-400 to-pink-500' },
  { id: 'p11', creatorId: '11', title: 'Eco Lifestyle Story Series', description: '5-part Instagram Story series showcasing your sustainable product in daily eco-conscious routines.', type: 'Story', platform: 'Instagram', niche: 'Lifestyle', price: 3000, views: 12000, engagement: 11.2, deliveryDays: 3, color: 'from-lime-400 to-green-500' },
  { id: 'p12', creatorId: '12', title: 'Marathon Training Vlog', description: 'Feature your brand alongside elite Kenyan runners in a compelling training documentary.', type: 'YouTube', platform: 'YouTube', niche: 'Fitness', price: 12000, views: 41000, engagement: 5.6, deliveryDays: 7, color: 'from-sky-400 to-blue-500' },
];

function TypeIcon({ type }: { type: string }) {
  if (type === 'Reel') return <Film className="h-3 w-3" />;
  if (type === 'TikTok') return <Music2 className="h-3 w-3" />;
  if (type === 'YouTube') return <Youtube className="h-3 w-3" />;
  if (type === 'Story') return <Eye className="h-3 w-3" />;
  return <ImageIcon className="h-3 w-3" />;
}

const campaignStatusStyles: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  filling: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const userRole = user?.role;
  const isCreator = userRole === 'CREATOR';

  const [filters, setFilters] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCreators, setFilteredCreators] = useState(allCreators);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceContentItem[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ContentPost[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<BrandCampaign[]>([]);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [submittedCampaigns, setSubmittedCampaigns] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCreator) {
      loadMarketplaceContent();
    }
  }, [isCreator]);

  const loadMarketplaceContent = async () => {
    setLoading(true);
    try {
      const response = await marketplaceService.browse({ limit: 50 });
      setMarketplaceItems(response.items || []);
    } catch (error) {
      console.error('Failed to load marketplace content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCreator && marketplaceItems.length > 0) {
      const posts: ContentPost[] = marketplaceItems.map((item, idx) => {
        const creator = allCreators.find(c => c.id === item.creatorProfileId);
        return {
          id: item.id,
          creatorId: item.creatorProfileId,
          title: item.title,
          description: item.description ?? '',
          type: item.type === 'VIDEO' ? 'YouTube' : item.type === 'IMAGE' ? 'Post' : 'Reel',
          platform: item.platforms?.[0] ?? 'Instagram',
          niche: 'General',
          price: item.price,
          views: 0,
          engagement: 0,
          deliveryDays: 3,
          color: creator?.color ?? 'from-blue-400 to-indigo-500',
        };
      });
      setFilteredPosts(posts);
    }
  }, [marketplaceItems, isCreator]);

  useEffect(() => {
    let creators = [...allCreators];
    let posts = [...filteredPosts];
    let campaigns = [...allCampaigns];
    const q = (filters.searchQuery || searchQuery || '').toLowerCase();

    if (q) {
      creators = creators.filter(c => c.name.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
      posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.niche.toLowerCase().includes(q));
      campaigns = campaigns.filter(c => c.campaignName.toLowerCase().includes(q) || c.brandName.toLowerCase().includes(q) || c.niche.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (filters.categories?.length > 0) {
      creators = creators.filter(c => filters.categories.includes(c.niche));
      posts = posts.filter(p => filters.categories.includes(p.niche));
      campaigns = campaigns.filter(c => filters.categories.includes(c.niche));
    }
    if (filters.platforms?.length > 0) {
      creators = creators.filter(c => c.platforms.some((p: string) => filters.platforms.includes(p)));
      posts = posts.filter(p => filters.platforms.includes(p.platform));
      campaigns = campaigns.filter(c => c.platforms.some((p: string) => filters.platforms.includes(p)));
    }
    if (filters.locations?.length > 0) {
      creators = creators.filter(c => filters.locations.includes(c.location));
      posts = posts.filter(p => { const cr = allCreators.find(c => c.id === p.creatorId); return cr && filters.locations.includes(cr.location); });
    }
    if (filters.priceRange) {
      creators = creators.filter(c => c.minPrice >= filters.priceRange.min && (filters.priceRange.max === Infinity || c.minPrice <= filters.priceRange.max));
      posts = posts.filter(p => p.price >= filters.priceRange.min && (filters.priceRange.max === Infinity || p.price <= filters.priceRange.max));
      campaigns = campaigns.filter(c => c.perCreatorBudget >= filters.priceRange.min && (filters.priceRange.max === Infinity || c.perCreatorBudget <= filters.priceRange.max));
    }
    if (filters.minRating > 0) {
      const qualifiedIds = new Set(creators.filter(c => c.averageRating >= filters.minRating).map(c => c.id));
      creators = creators.filter(c => c.averageRating >= filters.minRating);
      posts = posts.filter(p => qualifiedIds.has(p.creatorId));
    }

    setFilteredCreators(creators);
    setFilteredPosts(posts);
    setFilteredCampaigns(campaigns);
  }, [filters, searchQuery]);

  const verifiedCount = allCreators.filter(c => c.isVerified).length;
  const minPrice = Math.min(...allPosts.map(p => p.price));
  const openCampaigns = allCampaigns.filter(c => c.status !== 'closed').length;

  const handleSubmitPost = (campaignId: string) => {
    setSubmittedCampaigns(prev => new Set(prev).add(campaignId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero header */}
      <div className={cn(
        'text-white',
        isCreator
          ? 'bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500'
          : 'bg-gradient-to-br from-brand-blue via-brand-blue/90 to-indigo-700'
      )}>
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
              {isCreator ? 'Brand Campaigns' : 'Creator Marketplace'}
            </h1>
            <p className="text-white/80 text-lg mb-8">
              {isCreator
                ? 'Discover brand campaigns that match your niche — submit content and earn.'
                : "Browse content packages from Kenya's top creators — book exactly what your brand needs."}
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={isCreator ? 'Search campaigns, brands, or niches…' : 'Search content, niche, or creator…'}
                onChange={e => { setSearchQuery(e.target.value); setFilters((f: any) => ({ ...f, searchQuery: e.target.value })); }}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-foreground bg-white shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-border bg-white">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-3.5 flex flex-wrap items-center gap-3">
          {isCreator ? (
            <>
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <Target className="h-3.5 w-3.5" />
                {filteredCampaigns.length} campaigns
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <Briefcase className="h-3.5 w-3.5" />
                {openCampaigns} open for submissions
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <DollarSign className="h-3.5 w-3.5" />
                Up to {formatCurrency(Math.max(...allCampaigns.map(c => c.perCreatorBudget)))} per creator
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <Film className="h-3.5 w-3.5" />
                {filteredPosts.length} content packages
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <CheckCircle className="h-3.5 w-3.5" />
                {verifiedCount} verified creators
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                From {formatCurrency(minPrice)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3-column layout */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-10">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Left: Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <MarketplaceFilters onFiltersChange={setFilters} />
          </div>

          {/* Centre */}
          <div className="flex-1 min-w-0">
            {isCreator ? (
              /* ── Creator view: Brand campaigns ── */
              filteredCampaigns.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button variant="outline" onClick={() => setFilters({})}>Clear filters</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map(campaign => {
                    const isExpanded = expandedCampaign === campaign.id;
                    const isSubmitted = submittedCampaigns.has(campaign.id);
                    const spotsLeft = campaign.creatorsNeeded - campaign.creatorsJoined;
                    return (
                      <div key={campaign.id} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${campaign.brandColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {campaign.brandInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-foreground truncate">{campaign.campaignName}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${campaignStatusStyles[campaign.status]}`}>
                                  {campaign.status === 'filling' ? `${spotsLeft} spots left` : campaign.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">by {campaign.brandName}</p>
                              <p className="text-sm text-foreground/80 line-clamp-2">{campaign.description}</p>

                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">
                                  <Target className="h-3 w-3" /> {campaign.objective}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-medium">
                                  <DollarSign className="h-3 w-3" /> {formatCurrency(campaign.perCreatorBudget)}/creator
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-medium">
                                  <Calendar className="h-3 w-3" /> {campaign.deadline}
                                </span>
                                {campaign.platforms.map(p => (
                                  <span key={p} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg">{p}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <Button variant="outline" size="sm" onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}>
                                {isExpanded ? 'Less' : 'Details'}
                              </Button>
                              {isSubmitted ? (
                                <Button size="sm" disabled className="bg-green-600 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Submitted
                                </Button>
                              ) : campaign.status !== 'closed' ? (
                                <Button size="sm" onClick={() => handleSubmitPost(campaign.id)} className="bg-orange-600 hover:bg-orange-700 text-white">
                                  <Send className="h-3 w-3 mr-1" /> Submit Post
                                </Button>
                              ) : null}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Total Budget</p>
                                <p className="font-bold text-sm">{formatCurrency(campaign.budget)}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Creators Needed</p>
                                <p className="font-bold text-sm">{campaign.creatorsJoined}/{campaign.creatorsNeeded}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Content Types</p>
                                <p className="font-bold text-sm text-xs">{campaign.contentTypes.join(', ')}</p>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Niche</p>
                                <p className="font-bold text-sm">{campaign.niche}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* ── Brand view: Creator content posts ── */
              filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No content found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button variant="outline" onClick={() => setFilters({})}>Clear filters</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredPosts.map(post => {
                      const creator = allCreators.find(c => c.id === post.creatorId)!;
                      return (
                        <div key={post.id} className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200">
                          <div className={`aspect-[9/16] bg-gradient-to-b ${post.color} relative flex flex-col`}>
                            <div className="flex items-start justify-between p-2.5">
                              <div className="flex items-center gap-1 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                                <TypeIcon type={post.type} />
                                {post.type}
                              </div>
                              <div className="flex items-center gap-1 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {post.platform}
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            <div className="bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3">
                              <div className="flex items-center gap-1.5 mb-2">
                                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${creator.color} border border-white/60 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>
                                  {creator.initials}
                                </div>
                                <span className="text-white text-[11px] font-medium truncate">{creator.name}</span>
                                {creator.isVerified && <CheckCircle className="h-3 w-3 text-blue-300 flex-shrink-0" />}
                              </div>
                              <p className="text-white text-xs font-semibold leading-snug line-clamp-2 mb-2">{post.title}</p>
                              <div className="flex items-center gap-3 text-white/70 text-[10px] mb-2.5">
                                <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(post.views)}</div>
                                <div className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{post.engagement}%</div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-white font-bold text-sm">{formatCurrency(post.price)}</span>
                                <button className="bg-white text-foreground text-[10px] font-bold px-3 py-1 rounded-full hover:bg-white/90 transition-colors">
                                  Buy
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-10 text-center">
                    <Button variant="outline" size="lg">Load More Content</Button>
                  </div>
                </>
              )
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-20 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCreator ? <Briefcase className="h-4 w-4 text-muted-foreground" /> : <Users className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-semibold">{isCreator ? 'Brands' : 'Creators'}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {isCreator ? filteredCampaigns.length : filteredCreators.length}
                </span>
              </div>
              <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
                {isCreator ? (
                  /* Brand list for creators */
                  filteredCampaigns.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No brands match filters</p>
                  ) : [...new Map(filteredCampaigns.map(c => [c.brandName, c])).values()].map(campaign => (
                    <div key={campaign.brandName} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${campaign.brandColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {campaign.brandInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate block">{campaign.brandName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {allCampaigns.filter(c => c.brandName === campaign.brandName).length} campaign(s)
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Creator list for brands */
                  filteredCreators.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">No creators match filters</p>
                  ) : filteredCreators.map(creator => (
                    <div key={creator.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${creator.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {creator.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-foreground truncate">{creator.name}</span>
                          {creator.isVerified && <CheckCircle className="h-3 w-3 text-brand-blue flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span>{creator.niche}</span><span>·</span><span>{formatNumber(creator.stats.followers)}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-[10px] font-medium">{creator.averageRating}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] px-2 py-1 h-auto flex-shrink-0">
                        Buy
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
