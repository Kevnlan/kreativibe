'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Eye, MapPin, Star, MoreVertical, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui';
import { Button } from '../ui';
import { Avatar, Badge } from '../ui';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface CreatorPostCardProps {
  creator: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    pricing: {
      instagramStory?: number;
      instagramPost?: number;
      instagramReel?: number;
      tiktokVideo?: number;
      youtubeShort?: number;
      youtubeVideo?: number;
    };
    stats: {
      followers: number;
      engagement: number;
      posts: number;
    };
  };
  post: {
    id: string;
    title: string;
    description: string;
    media: string[];
    category: string;
    tags: string[];
    createdAt: string;
    likes: number;
    comments: number;
    views: number;
  };
}

export function CreatorPostCard({ creator, post }: CreatorPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  const getMinPrice = () => {
    const prices = Object.values(creator.pricing).filter(p => p && p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const minPrice = getMinPrice();

  return (
    <Link href={`/marketplace/creator/${creator.id}/post/${post.id}`}>
      <Card className="group cursor-pointer hover:shadow-medium transition-all duration-200 overflow-hidden">
        {/* Media Preview */}
        <div className="relative h-48 bg-gradient-to-br from-brand-blue/10 to-brand-blue-light/10">
          {post.media.length > 0 ? (
            <img
              src={post.media[0]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center">
                <span className="text-brand-blue text-2xl font-bold">
                  {creator.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
          
          {/* Price Badge */}
          {minPrice && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-brand-blue text-white">
                From {formatCurrency(minPrice)}
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary">
              {post.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Creator Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar
                src={creator.avatar}
                alt={creator.name}
                size="sm"
                fallback={creator.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <h3 className="font-medium text-foreground truncate">
                    {creator.name}
                  </h3>
                  {creator.isVerified && (
                    <CheckCircle className="h-4 w-4 text-brand-blue flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {creator.location && (
                    <>
                      <MapPin className="h-3 w-3" />
                      <span>{creator.location}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatNumber(creator.stats.followers)} followers</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => e.preventDefault()}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Post Content */}
          <h4 className="font-medium text-foreground mb-2 line-clamp-2">
            {post.title}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Pricing */}
          {minPrice && (
            <div className="mb-3">
              <p className="text-sm font-medium text-brand-blue">
                Starting from {formatCurrency(minPrice)}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(post.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{formatNumber(post.likes + (isLiked ? 1 : 0))}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(post.comments)}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{creator.averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({creator.totalReviews})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSave}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
