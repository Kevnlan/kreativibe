'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Award, TrendingUp, CheckCircle, Lock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, StatusBadge } from '@/components/ui';
import { useUser } from '@/contexts/AuthContext';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { reputationService } from '@/services/reputation.service';
import { ReputationLevel as ReputationLevelKey, ReputationSummary, PointsHistoryItem, Achievement } from '@/types/reputation.types';

interface LevelMeta {
  key: ReputationLevelKey;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  bgColor: string;
  icon: string;
  perks: string[];
}

const LEVELS: LevelMeta[] = [
  { key: 'RISING_STAR', name: 'Rising Star', minPoints: 0, maxPoints: 500, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '⭐', perks: ['Basic profile listing', 'Access to marketplace'] },
  { key: 'CONTENT_PRO', name: 'Content Pro', minPoints: 500, maxPoints: 1500, color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '💎', perks: ['Priority in search results', 'Featured in brand recommendations', 'Blue badge'] },
  { key: 'TOP_CREATOR', name: 'Top Creator', minPoints: 1500, maxPoints: 3000, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '🏆', perks: ['Campaign invitation priority', 'Higher search ranking', 'Purple badge', 'Early access to new brands'] },
  { key: 'ELITE_CREATOR', name: 'Elite Creator', minPoints: 3000, maxPoints: Infinity, color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '👑', perks: ['Top placement in all searches', 'Gold verification badge', 'Dedicated account manager', 'Premium brand matching'] },
];

const TYPE_COLORS: Record<string, string> = {
  EARNED: 'bg-blue-100 text-blue-700',
  BONUS: 'bg-yellow-100 text-yellow-700',
  MILESTONE: 'bg-green-100 text-green-700',
};

const TYPE_ICONS: Record<string, string> = { EARNED: '📌', BONUS: '⚡', MILESTONE: '🎯' };

export default function ReputationPage() {
  const user = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');
  const [summary, setSummary] = useState<ReputationSummary | null>(null);
  const [points, setPoints] = useState<PointsHistoryItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      reputationService.getSummary(),
      reputationService.listPointsHistory(),
      reputationService.listAchievements(),
    ])
      .then(([summaryData, pointsData, achievementsData]) => {
        setSummary(summaryData);
        setPoints(pointsData.items);
        setAchievements(achievementsData.items);
      })
      .catch(() => setError('Failed to load reputation data. Please try again.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading reputation...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
        {error || 'Failed to load reputation data.'}
      </div>
    );
  }

  const currentLevel = LEVELS.find(l => l.key === summary.currentLevel) ?? LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const earnedAchievements = achievements.filter(a => a.earnedAt);

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
            <p className="text-3xl font-bold">{formatNumber(summary.totalPoints)}</p>
            <p className="text-white/80 text-sm">Total Points</p>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Progress to {nextLevel.icon} {nextLevel.name}</span>
              <span className="font-semibold">{formatNumber(Math.max(0, nextLevel.minPoints - summary.totalPoints))} pts needed</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${summary.progressToNext}%` }} />
            </div>
            <p className="text-xs text-white/60">{summary.totalPoints} / {nextLevel.minPoints} pts</p>
          </div>
        )}

        {!nextLevel && (
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="font-semibold">🎉 You've reached the highest level!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <span className="text-2xl font-bold">{points.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Point Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{points.filter(p => p.type === 'BONUS').reduce((s, p) => s + p.points, 0)}</span>
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
          {LEVELS.map((level) => {
            const isCurrentLevel = level.key === currentLevel.key;
            const isPastLevel = summary.totalPoints > level.maxPoints && level.maxPoints !== Infinity;
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
            {points.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No points earned yet.</p>
            ) : (
              <div className="space-y-3">
                {points.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm', p.type === 'MILESTONE' ? 'bg-green-100' : p.type === 'BONUS' ? 'bg-yellow-100' : 'bg-blue-100')}>
                        {TYPE_ICONS[p.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.activity}</p>
                        <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TYPE_COLORS[p.type])}>{p.type.toLowerCase()}</span>
                      <span className="font-bold text-green-600">+{p.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(a => {
            const isEarned = !!a.earnedAt;
            const progressPct = a.target ? Math.min(100, (a.progress / a.target) * 100) : 0;
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
                      ) : a.target ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{a.progress} / {a.target}</span>
                            <span>{Math.round(progressPct)}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      ) : null}
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
