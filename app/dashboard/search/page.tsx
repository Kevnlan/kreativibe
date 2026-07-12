'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2, Star, BadgeCheck, Image as ImageIcon, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { searchService } from '@/services/search.service';
import { ContentSearchResult, CreatorSearchResult, CampaignSearchResult, SearchSortBy } from '@/types/api-contracts/search.types';

type Tab = 'content' | 'creators' | 'campaigns';

const SORT_OPTIONS: { value: SearchSortBy; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SearchSortBy>('newest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [contentResults, setContentResults] = useState<ContentSearchResult[]>([]);
  const [creatorResults, setCreatorResults] = useState<CreatorSearchResult[]>([]);
  const [campaignResults, setCampaignResults] = useState<CampaignSearchResult[]>([]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      if (activeTab === 'content') {
        const res = await searchService.searchContent({ query, sortBy });
        setContentResults(res.items || []);
      } else if (activeTab === 'creators') {
        const res = await searchService.searchCreators({ query, sortBy });
        setCreatorResults(res.items || []);
      } else {
        const res = await searchService.searchCampaigns({ query });
        setCampaignResults(res.items || []);
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query, sortBy, activeTab]);

  const tabs = [
    { id: 'content' as const, label: 'Content', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'creators' as const, label: 'Creators', icon: <Users className="h-4 w-4" /> },
    { id: 'campaigns' as const, label: 'Campaigns', icon: <ShoppingBag className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search</h1>
        <p className="text-muted-foreground mt-1">Find content, creators, and campaigns</p>
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setHasSearched(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        {activeTab !== 'campaigns' && (
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SearchSortBy)}
            className="px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Searching...
        </div>
      )}

      {!loading && !error && hasSearched && activeTab === 'content' && (
        <div className="space-y-3">
          {contentResults.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">No content found. Try a different search.</p>
          ) : (
            contentResults.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                    {item.creatorProfile && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        {item.creatorProfile.isVerified && <BadgeCheck className="h-3 w-3 text-brand-blue" />}
                        <span>Rating: {item.creatorProfile.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.currency} {item.price.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {!loading && !error && hasSearched && activeTab === 'creators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creatorResults.length === 0 ? (
            <p className="col-span-full text-center py-16 text-muted-foreground">No creators found. Try a different search.</p>
          ) : (
            creatorResults.map(creator => (
              <Card key={creator.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center text-white font-bold">
                      {creator.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold truncate">{creator.name}</h3>
                        {creator.isVerified && <BadgeCheck className="h-4 w-4 text-brand-blue flex-shrink-0" />}
                      </div>
                      {creator.category && <p className="text-xs text-muted-foreground">{creator.category}</p>}
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {creator.averageRating.toFixed(1)}
                        </span>
                        {creator.totalFollowers && (
                          <span>{creator.totalFollowers.toLocaleString()} followers</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {!loading && !error && hasSearched && activeTab === 'campaigns' && (
        <div className="space-y-3">
          {campaignResults.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">No campaigns found. Try a different search.</p>
          ) : (
            campaignResults.map(campaign => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{campaign.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{campaign.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {campaign.brandName && <span>{campaign.brandName}</span>}
                        {campaign.platform && <span>• {campaign.platform}</span>}
                        <span className={`px-2 py-0.5 rounded-full font-medium ${
                          campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                        }`}>{campaign.status}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold">{campaign.currency} {campaign.budget.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {!loading && !error && !hasSearched && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Start searching for {activeTab} above.</p>
        </div>
      )}
    </div>
  );
}
