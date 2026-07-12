'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Eye, Plus, Search, Pin, ChevronRight, User, Camera, Building2, HelpCircle, Lightbulb, TrendingUp, Star, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { cn, formatNumber } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { communityService } from '@/services/community.service';
import { CommunityPost, PostType } from '@/types/api-contracts/community.types';

interface Post {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: 'CREATOR' | 'BRAND';
  authorInitials: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isQuestion: boolean;
  hasAnswer: boolean;
  createdAt: string;
  color: string;
}

const TYPE_TO_CATEGORY: Record<PostType, string> = {
  DISCUSSION: 'tips',
  QUESTION: 'qa',
  SHOWCASE: 'showcase',
  GUIDE: 'campaigns',
};

const COLORS = [
  'from-pink-400 to-rose-500',
  'from-blue-400 to-indigo-500',
  'from-orange-400 to-amber-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-green-500',
  'from-cyan-400 to-sky-500',
];

function mapPost(p: CommunityPost, idx: number): Post {
  const authorName = p.author?.name ?? 'Unknown';
  const initials = authorName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return {
    id: p.id,
    title: p.title,
    body: p.body,
    author: authorName,
    authorRole: (p.author?.role === 'BRAND' ? 'BRAND' : 'CREATOR') as 'CREATOR' | 'BRAND',
    authorInitials: initials,
    category: TYPE_TO_CATEGORY[p.type] ?? 'tips',
    tags: p.tags || [],
    likes: p.upvotes || 0,
    replies: p._count?.comments ?? 0,
    views: p.views || 0,
    isPinned: p.isPinned,
    isQuestion: p.type === 'QUESTION',
    hasAnswer: false,
    createdAt: p.createdAt,
    color: COLORS[idx % COLORS.length],
  };
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'tips', label: 'Creator Tips', icon: <Lightbulb className="h-4 w-4" /> },
  { id: 'campaigns', label: 'Campaign Insights', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'qa', label: 'Q&A', icon: <HelpCircle className="h-4 w-4" /> },
  { id: 'showcase', label: 'Content Showcase', icon: <Star className="h-4 w-4" /> },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityService.listPosts({ page: 1, limit: 50 });
      setPosts((response.items || []).map((p, idx) => mapPost(p, idx)));
    } catch {
      setError('Failed to load community posts.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = posts.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pinned = filtered.filter(p => p.isPinned);
  const regular = filtered.filter(p => !p.isPinned);

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const PostCard = ({ post }: { post: Post }) => (
    <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', post.isPinned && 'border-brand-blue/30')}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${post.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {post.authorInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                {post.isPinned && (
                  <span className="flex items-center gap-1 text-xs text-brand-blue font-semibold">
                    <Pin className="h-3 w-3" /> Pinned
                  </span>
                )}
                {post.isQuestion && (
                  <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    <HelpCircle className="h-3 w-3" /> Question
                    {post.hasAnswer && <span className="text-green-600 ml-1">✓ Answered</span>}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {new Date(post.createdAt).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h3 className="font-semibold text-foreground mb-1 leading-snug">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.body}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 mr-2">
                  {post.authorRole === 'CREATOR'
                    ? <Camera className="h-3 w-3" />
                    : <Building2 className="h-3 w-3" />
                  }
                  {post.author}
                </span>
                {post.tags.map(t => (
                  <span key={t} className="px-1.5 py-0.5 bg-muted rounded text-xs">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn('flex items-center gap-1 hover:text-brand-blue transition-colors', likedPosts.has(post.id) && 'text-brand-blue')}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />{post.replies}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />{formatNumber(post.views)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue/90 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold mb-3">Creator & Brand Community</h1>
            <p className="text-white/80 text-lg mb-8">
              Share insights, ask questions, and learn from creators and brands building authentic campaigns.
            </p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions, tips, or topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-foreground bg-white shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                    activeCategory === cat.id
                      ? 'bg-brand-blue text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {cat.icon}{cat.label}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted rounded-xl">
              <h3 className="font-semibold text-sm mb-3">Community Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Posts</span><span className="font-medium">248</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Members</span><span className="font-medium">1,247</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Questions answered</span><span className="font-medium">89%</span></div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {activeCategory === 'all' ? 'All Discussions' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
              </h2>
              {user && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading discussions...
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!loading && !error && pinned.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pinned</p>
                {pinned.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            )}

            {!loading && !error && regular.length > 0 && (
              <div className="space-y-3">
                {pinned.length > 0 && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Discussions</p>}
                {regular.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-16">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground mb-4">Try a different search or be the first to start this conversation.</p>
                {user && <Button><Plus className="h-4 w-4 mr-2" />Start Discussion</Button>}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
