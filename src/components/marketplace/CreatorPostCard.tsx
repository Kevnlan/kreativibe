'use client';

import { MapPin, Star, CheckCircle, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../ui';
import { Button } from '../ui';
import { formatCurrency, formatNumber } from '../../lib/utils';

export interface CreatorCardData {
  id: string;
  name: string;
  initials: string;
  bio: string;
  location: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  niche: string;
  platforms: string[];
  color: string;
  minPrice: number;
  stats: {
    followers: number;
    engagement: number;
    posts: number;
  };
}

export function CreatorPostCard({ creator }: { creator: CreatorCardData }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 border border-border">
      {/* Gradient header band */}
      <div className={`h-20 bg-gradient-to-r ${creator.color} relative`} />

      <CardContent className="pt-0 pb-5 px-5">
        {/* Avatar overlapping the band */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold text-xl border-[3px] border-white shadow-md flex-shrink-0`}>
            {creator.initials}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 bg-white border border-border rounded-full px-2.5 py-1 shadow-sm mb-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{creator.averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({creator.totalReviews})</span>
          </div>
        </div>

        {/* Name + verified */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-semibold text-foreground">{creator.name}</h3>
          {creator.isVerified && (
            <CheckCircle className="h-4 w-4 text-brand-blue flex-shrink-0" />
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          <span>{creator.location}</span>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {creator.bio}
        </p>

        {/* Niche + platforms */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs bg-brand-blue/10 text-brand-blue font-medium px-2 py-0.5 rounded-full">
            {creator.niche}
          </span>
          {creator.platforms.map(p => (
            <span key={p} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {p}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-border mb-4">
          <div>
            <p className="text-sm font-bold text-foreground">{formatNumber(creator.stats.followers)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{creator.stats.engagement}%</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Engagement</p>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{creator.stats.posts}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Posts</p>
          </div>
        </div>

        {/* Pricing */}
        <p className="text-sm font-semibold text-brand-blue mb-3">
          From {formatCurrency(creator.minPrice)}
        </p>

        {/* CTAs */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white">
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
