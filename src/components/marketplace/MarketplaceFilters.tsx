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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search creators, categories, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map(category => (
          <Badge key={category} variant="secondary" className="cursor-pointer">
            {category}
            <X 
              className="h-3 w-3 ml-1" 
              onClick={() => toggleCategory(category)}
            />
          </Badge>
        ))}
        {selectedLocations.map(location => (
          <Badge key={location} variant="secondary" className="cursor-pointer">
            <MapPin className="h-3 w-3 mr-1" />
            {location}
            <X 
              className="h-3 w-3 ml-1" 
              onClick={() => toggleLocation(location)}
            />
          </Badge>
        ))}
        {selectedPriceRange && (
          <Badge variant="secondary" className="cursor-pointer">
            <DollarSign className="h-3 w-3 mr-1" />
            {selectedPriceRange.label}
            <X 
              className="h-3 w-3 ml-1" 
              onClick={() => setSelectedPriceRange(null)}
            />
          </Badge>
        )}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full justify-between"
      >
        <span className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-6 p-4 border border-border rounded-lg bg-muted/30">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-medium mb-3">Location</h3>
            <div className="flex flex-wrap gap-2">
              {locations.map(location => (
                <Badge
                  key={location}
                  variant={selectedLocations.includes(location) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleLocation(location)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label
                  key={range.label}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange?.label === range.label}
                    onChange={() => setSelectedPriceRange(range)}
                    className="text-brand-blue"
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-medium mb-3">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <Badge
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePlatform(platform)}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors",
                    minRating === rating
                      ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Star className={cn(
                    "h-4 w-4",
                    rating <= minRating ? "fill-yellow-400 text-yellow-400" : ""
                  )} />
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
