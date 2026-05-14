'use client';

import { useState } from 'react';
import { Trophy, Star, Zap, TrendingUp, Award, Target, Flame, CheckCircle, Clock, Lock, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, StatusBadge } from '@/components/ui';
import { useUser } from '@/contexts/AuthContext';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ReputationLevel {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  bgColor: string;
  icon: string;
  perks: string[];
}

interface ActivityPoint {
  id: string;
  activity: string;
  points: number;
  date: string;
  type: 'earned' | 'bonus' | 'milestone';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earnedAt?: string;
  progress?: number;
  target?: number;
}

const LEVELS: ReputationLevel[] = [
  { name: 'Rising Star', minPoints: 0, maxPoints: 500, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '⭐', perks: ['Basic profile listing', 'Access to marketplace'] },
  { name: 'Content Pro', minPoints: 500, maxPoints: 1500, color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '💎', perks: ['Priority in search results', 'Featured in brand recommendations', 'Blue badge'] },
  { name: 'Top Creator', minPoints: 1500, maxPoints: 3000, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🏆', perks: ['Campaign invitation priority', 'Higher search ranking', 'Purple badge', 'Early access to new brands'] },
  { name: 'Elite Creator', minPoints: 3000, maxPoints: Infinity, color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '👑', perks: ['Top placement in all searches', 'Gold verification badge', 'Dedicated account manager', 'Premium brand matching'] },
];

const mockPoints: ActivityPoint[] = [
  { id: '1', activity: 'Content piece purchased by brand', points: 50, date: '2026-03-22T10:00:00Z', type: 'earned' },
  { id: '2', activity: '7-day activity streak', points: 25, date: '2026-03-21T12:00:00Z', type: 'bonus' },
  { id: '3', activity: 'KYC verification completed', points: 100, date: '2026-03-20T09:00:00Z', type: 'milestone' },
  { id: '4', activity: 'Content piece published', points: 10, date: '2026-03-19T14:00:00Z', type: 'earned' },
  { id: '5', activity: 'First brand campaign accepted', points: 75, date: '2026-03-18T11:00:00Z', type: 'milestone' },
  { id: '6', activity: 'Community post with 50+ likes', points: 20, date: '2026-03-17T16:00:00Z', type: 'bonus' },
  { id: '7', activity: 'Content piece published', points: 10, date: '2026-03-16T10:00:00Z', type: 'earned' },
];

const achievements: Achievement[] = [
  { id: '1', title: 'First Sale', description: 'Sell your first content piece to a brand', icon: '🎉', points: 75, earnedAt: '2026-03-18T11:00:00Z' },
  { id: '2', title: 'Verified Creator', description: 'Complete KYC verification', icon: '✅', points: 100, earnedAt: '2026-03-20T09:00:00Z' },
  { id: '3', title: 'Prolific Creator', description: 'Publish 10 content pieces', icon: '📸', points: 150, progress: 7, target: 10 },
  { id: '4', title: 'Hot Streak', description: 'Maintain a 30-day activity streak', icon: '🔥', points: 200, progress: 7, target: 30 },
  { id: '5', title: 'Brand Favourite', description: 'Get 5 repeat purchases from the same brand', icon: '❤️', points: 250, progress: 1, target: 5 },
  { id: '6', title: 'Community Leader', description: 'Get 10 helpful post badges in the community', icon: '🌟', points: 300, progress: 2, target: 10 },
  { id: '7', title: 'Multi-Platform Pro', description: 'Publish content for 3+ different platforms', icon: '🌐', points: 150, progress: 2, target: 3 },
  { id: '8', title: 'Top Earner', description: 'Earn over KES 100,000 in total', icon: '💰', points: 500, progress: 45000, target: 100000 },
];

export default function ReputationPage() {
  const user = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');

  const totalPoints = mockPoints.reduce((s, p) => s + p.points, 0);
  const currentLevel = LEVELS.reduce((best, level) =>
    totalPoints >= level.minPoints ? level : best, LEVELS[0]);
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progressToNext = nextLevel
    ? ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;
  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const streakDays = 7;

  const TYPE_COLORS = {
    earned: 'bg-blue-100 text-blue-700',
    bonus: 'bg-yellow-100 text-yellow-700',
    milestone: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Reputation & Points
        </h1>
        <p className="text-muted-foreground mt-1">
          Build your reputation to rank higher in search results and attract more brands
        </p>
      </div>

      {/* Level Card */}
      <div className={cn('rounded-2xl p-6 text-white', 'bg-gradient-to-br from-brand-blue via-brand-blue to-indigo-700')}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{currentLevel.icon}</span>
              <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
            </div>
            <p className="text-white/80">{user?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{formatNumber(totalPoints)}</p>
            <p className="text-white/80 text-sm">Total Points</p>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Progress to {nextLevel.icon} {nextLevel.name}</span>
              <span className="font-semibold">{formatNumber(nextLevel.minPoints - totalPoints)} pts needed</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progressToNext}%` }} />
            </div>
            <p className="text-xs text-white/60">{totalPoints} / {nextLevel.minPoints} pts</p>
          </div>
        )}

        {!nextLevel && (
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="font-semibold">🎉 You've reached the highest level!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{streakDays}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{earnedAchievements.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">#47</span>
            </div>
            <p className="text-sm text-muted-foreground">Search Rank</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{mockPoints.filter(p => p.type === 'bonus').reduce((s, p) => s + p.points, 0)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Bonus Points</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Level Perks' },
          { id: 'history', label: 'Points History' },
          { id: 'achievements', label: 'Achievements' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEVELS.map((level, i) => {
            const isCurrentLevel = level === currentLevel;
            const isPastLevel = totalPoints > level.maxPoints && level.maxPoints !== Infinity;
            return (
              <Card key={level.name} className={cn(isCurrentLevel && 'ring-2 ring-brand-blue')}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl', level.bgColor)}>
                      {level.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{level.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {level.maxPoints === Infinity ? `${formatNumber(level.minPoints)}+ pts` : `${formatNumber(level.minPoints)} – ${formatNumber(level.maxPoints)} pts`}
                      </p>
                    </div>
                    {isCurrentLevel && <StatusBadge variant="info" size="sm">Current</StatusBadge>}
                    {isPastLevel && <StatusBadge variant="success" size="sm">Achieved</StatusBadge>}
                  </div>
                  <ul className="space-y-1.5">
                    {level.perks.map(perk => (
                      <li key={perk} className="flex items-center gap-2 text-sm">
                        {isPastLevel || isCurrentLevel
                          ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          : <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        }
                        <span className={cn(!isPastLevel && !isCurrentLevel && 'text-muted-foreground')}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
            <CardDescription>How you've earned your points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPoints.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm', p.type === 'milestone' ? 'bg-green-100' : p.type === 'bonus' ? 'bg-yellow-100' : 'bg-blue-100')}>
                      {p.type === 'milestone' ? '🎯' : p.type === 'bonus' ? '⚡' : '📌'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.activity}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_COLORS[p.type])}>{p.type}</span>
                    <span className="font-bold text-green-600">+{p.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(a => {
            const isEarned = !!a.earnedAt;
            const progressPct = a.target ? Math.min(100, ((a.progress || 0) / a.target) * 100) : 0;
            return (
              <Card key={a.id} className={cn(!isEarned && 'opacity-80')}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0', isEarned ? 'bg-yellow-100' : 'bg-muted')}>
                      {a.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-semibold">{a.title}</h3>
                        <span className="text-sm font-bold text-yellow-600">+{a.points} pts</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{a.description}</p>
                      {isEarned ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Earned {new Date(a.earnedAt!).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      ) : a.target && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{a.progress} / {a.target}</span>
                            <span>{Math.round(progressPct)}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
