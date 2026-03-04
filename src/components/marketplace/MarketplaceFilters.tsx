'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, MapPin, DollarSign, Star } from 'lucide-react';
import { Button } from '../ui';
import { Input } from '../ui';
import { Badge } from '../ui';
import { cn } from '../../lib/utils';

interface MarketplaceFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const categories = [
  'Fashion', 'Beauty', 'Lifestyle', 'Food', 'Travel', 
  'Tech', 'Fitness', 'Gaming', 'Music', 'Art'
];

const locations = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru',
  'Thika', 'Kitale', 'Garissa', 'Malindi', 'Kericho'
];

const priceRanges = [
  { label: 'Under KES 1,000', min: 0, max: 1000 },
  { label: 'KES 1,000 - 5,000', min: 1000, max: 5000 },
  { label: 'KES 5,000 - 10,000', min: 5000, max: 10000 },
  { label: 'KES 10,000 - 25,000', min: 10000, max: 25000 },
  { label: 'Over KES 25,000', min: 25000, max: Infinity },
];

const platforms = [
  'Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook'
];

export function MarketplaceFilters({ onFiltersChange }: MarketplaceFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ label: string; min: number; max: number } | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = () => {
    onFiltersChange({
      searchQuery,
      categories: selectedCategories,
      locations: selectedLocations,
      priceRange: selectedPriceRange,
      platforms: selectedPlatforms,
      minRating,
    });
  };

  useEffect(() => {
    updateFilters();
  }, [searchQuery, selectedCategories, selectedLocations, selectedPriceRange, selectedPlatforms, minRating]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedPriceRange(null);
    setSelectedPlatforms([]);
    setMinRating(0);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedLocations.length > 0 || 
    selectedPriceRange !== null || 
    selectedPlatforms.length > 0 || 
    minRating > 0;

  return (
    <div className="sticky top-20 space-y-1 bg-card border border-border rounded-2xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-brand-blue hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search creators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 text-sm"
        />
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pb-4 border-b border-border">
          {selectedCategories.map(c => (
            <span key={c} className="inline-flex items-center gap-1 text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full">
              {c} <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(c)} />
            </span>
          ))}
          {selectedLocations.map(l => (
            <span key={l} className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {l} <X className="h-3 w-3 cursor-pointer" onClick={() => toggleLocation(l)} />
            </span>
          ))}
          {selectedPriceRange && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {selectedPriceRange.label} <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriceRange(null)} />
            </span>
          )}
        </div>
      )}

      {/* Categories */}
      <div className="py-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Niche / Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border transition-colors",
                selectedCategories.includes(category)
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                  : "border-border text-muted-foreground hover:border-brand-blue/40"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="py-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform</p>
        <div className="flex flex-wrap gap-1.5">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border transition-colors",
                selectedPlatforms.includes(platform)
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                  : "border-border text-muted-foreground hover:border-brand-blue/40"
              )}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="py-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Location</p>
        <div className="flex flex-wrap gap-1.5">
          {locations.map(location => (
            <button
              key={location}
              onClick={() => toggleLocation(location)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border transition-colors",
                selectedLocations.includes(location)
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                  : "border-border text-muted-foreground hover:border-brand-blue/40"
              )}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="py-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Budget</p>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange?.label === range.label}
                onChange={() => setSelectedPriceRange(range)}
                className="accent-brand-blue"
              />
              <span className={cn(
                "text-sm transition-colors",
                selectedPriceRange?.label === range.label ? "text-brand-blue font-medium" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Min Rating</p>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors",
                minRating === rating
                  ? "border-brand-blue bg-brand-blue/10 text-brand-blue font-medium"
                  : "border-border text-muted-foreground hover:border-brand-blue/40"
              )}
            >
              <Star className={cn("h-3.5 w-3.5", rating <= minRating ? "fill-yellow-400 text-yellow-400" : "")} />
              {rating}+
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
