'use client';

import { useState } from 'react';
import { BookOpen, PlayCircle, Award, CheckCircle, Lock, Star, Clock, ChevronRight, Trophy, Target, Zap } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, StatusBadge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: number;
  isLocked: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  certification?: string;
}

interface ContentExample {
  id: string;
  title: string;
  creator: string;
  platform: string;
  views: string;
  engagement: string;
  niche: string;
  color: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Content Creation Fundamentals',
    description: 'Learn the basics of creating high-converting marketing content for brands. Covers storytelling, framing, and audience targeting.',
    duration: '2h 30m',
    lessons: 12,
    completed: 12,
    isLocked: false,
    level: 'Beginner',
    category: 'Foundation',
    certification: 'Kreativibe Content Creator',
  },
  {
    id: '2',
    title: 'Brand Collaboration Best Practices',
    description: 'Master the art of working with brands — from reading briefs, meeting expectations, to delivering content that drives results.',
    duration: '1h 45m',
    lessons: 8,
    completed: 6,
    isLocked: false,
    level: 'Beginner',
    category: 'Collaboration',
  },
  {
    id: '3',
    title: 'Video Production for Social Media',
    description: 'Professional-grade video content for TikTok, Instagram Reels, YouTube Shorts, and Facebook — using just your phone.',
    duration: '3h 15m',
    lessons: 16,
    completed: 3,
    isLocked: false,
    level: 'Intermediate',
    category: 'Video',
  },
  {
    id: '4',
    title: 'Photography for Brands',
    description: 'Product photography, lifestyle shoots, and Instagram-ready images. Natural lighting, composition, and editing basics.',
    duration: '2h',
    lessons: 10,
    completed: 0,
    isLocked: false,
    level: 'Intermediate',
    category: 'Photography',
  },
  {
    id: '5',
    title: 'Audio Content for Radio & Podcasts',
    description: 'Create compelling audio content, voice-overs, and radio ad scripts that move audiences to act.',
    duration: '1h 30m',
    lessons: 7,
    completed: 0,
    isLocked: true,
    level: 'Intermediate',
    category: 'Audio',
  },
  {
    id: '6',
    title: 'Analytics & Content Performance',
    description: 'Understand engagement metrics, reach, and conversion data. Learn to optimize content based on performance.',
    duration: '2h',
    lessons: 9,
    completed: 0,
    isLocked: true,
    level: 'Advanced',
    category: 'Analytics',
    certification: 'Kreativibe Analytics Pro',
  },
];

const standards = [
  { title: 'Resolution & Quality', description: 'Minimum 1080p for video, 1200px+ for images. No watermarks, pixelation, or compression artifacts.', passed: true },
  { title: 'Brand Safety', description: 'No prohibited content: violence, explicit material, or competing brand mentions without approval.', passed: true },
  { title: 'Authentic Disclosure', description: 'All sponsored content must include #ad or #sponsored disclosure as per ASA guidelines.', passed: false },
  { title: 'Audio Quality', description: 'Clean audio for video content — no background noise, echo, or distortion above acceptable thresholds.', passed: true },
  { title: 'Metadata Accuracy', description: 'Accurate title, description, platform tags, and pricing for all uploaded content.', passed: false },
];

const contentExamples: ContentExample[] = [
  { id: '1', title: 'Fashion Unboxing Reel', creator: 'Sarah K.', platform: 'Instagram', views: '2.4M', engagement: '8.3%', niche: 'Fashion', color: 'from-pink-400 to-rose-500' },
  { id: '2', title: 'Tech Review Video', creator: 'Michael K.', platform: 'YouTube', views: '890K', engagement: '6.1%', niche: 'Tech', color: 'from-blue-400 to-indigo-500' },
  { id: '3', title: 'Recipe TikTok', creator: 'Grace W.', platform: 'TikTok', views: '5.1M', engagement: '12.4%', niche: 'Food', color: 'from-orange-400 to-amber-500' },
  { id: '4', title: 'Skincare Routine', creator: 'Aisha N.', platform: 'TikTok', views: '3.2M', engagement: '9.7%', niche: 'Beauty', color: 'from-violet-400 to-purple-500' },
];

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export default function CreatorEducationPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'standards' | 'examples'>('courses');
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const completedCourses = courses.filter(c => c.completed === c.lessons).length;
  const totalLessons = courses.reduce((s, c) => s + c.completed, 0);
  const certifications = courses.filter(c => c.certification && c.completed === c.lessons).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-brand-blue" />
            Creator Learning Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Build your skills, earn certifications, and create content that brands love
          </p>
        </div>
        {certifications > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">{certifications} Certificate{certifications > 1 ? 's' : ''} Earned</span>
          </div>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCourses}/{courses.length}</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessons}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certifications}</p>
                <p className="text-sm text-muted-foreground">Certifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'courses', label: 'Courses', icon: <BookOpen className="h-4 w-4" /> },
          { id: 'standards', label: 'Content Standards', icon: <Target className="h-4 w-4" /> },
          { id: 'examples', label: 'Best Examples', icon: <Star className="h-4 w-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeTab === tab.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.map(course => {
            const progress = Math.round((course.completed / course.lessons) * 100);
            const isComplete = course.completed === course.lessons;
            return (
              <Card key={course.id} className={cn(course.isLocked && 'opacity-60')}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        isComplete ? 'bg-green-100' : course.isLocked ? 'bg-muted' : 'bg-brand-blue/10'
                      )}>
                        {isComplete ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : course.isLocked ? (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <PlayCircle className="h-6 w-6 text-brand-blue" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[course.level]}`}>
                            {course.level}
                          </span>
                          {course.certification && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center gap-1">
                              <Award className="h-3 w-3" /> Certificate
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons} lessons</span>
                          <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {course.category}</span>
                        </div>
                        {!course.isLocked && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{course.completed}/{course.lessons} lessons</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full transition-all', isComplete ? 'bg-green-500' : 'bg-brand-blue')}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {course.isLocked ? (
                        <Button variant="outline" size="sm" disabled>
                          <Lock className="h-4 w-4 mr-1" />Locked
                        </Button>
                      ) : isComplete ? (
                        <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-1" />Review
                        </Button>
                      ) : (
                        <Button size="sm">
                          {course.completed > 0 ? 'Continue' : 'Start'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Content Standards */}
      {activeTab === 'standards' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              These standards apply to all content uploaded to Kreativibe. Meeting these standards ensures your content
              reaches brands quickly through our moderation queue.
            </p>
          </div>
          {standards.map((s, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', s.passed ? 'bg-green-100' : 'bg-orange-100')}>
                    {s.passed ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Target className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{s.title}</h3>
                      <StatusBadge variant={s.passed ? 'success' : 'warning'} size="sm">
                        {s.passed ? 'Compliant' : 'Review Needed'}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Best Examples */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              These are top-performing content pieces from verified creators on the platform. Study them to understand what brands love.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentExamples.map(ex => (
              <div key={ex.id} className={`bg-gradient-to-br ${ex.color} rounded-2xl p-5 text-white`}>
                <div className="mb-3">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{ex.platform}</span>
                </div>
                <h3 className="font-bold mb-1">{ex.title}</h3>
                <p className="text-white/80 text-sm mb-3">by {ex.creator}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Views</span>
                    <span className="font-semibold">{ex.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Engagement</span>
                    <span className="font-semibold">{ex.engagement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Niche</span>
                    <span className="font-semibold">{ex.niche}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Takeaways from Top Content</CardTitle>
              <CardDescription>What makes high-performing content stand out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { tip: 'Hook in the first 3 seconds', detail: 'Top videos start with an immediate visual hook — no slow intros.' },
                  { tip: 'Authentic product placement', detail: 'Products are woven naturally into the story, not just placed in front of a camera.' },
                  { tip: 'Clear call to action', detail: 'Always include a specific CTA: visit website, use discount code, follow the brand.' },
                  { tip: 'Consistent brand voice', detail: 'The creator\'s personal style shines through while matching the brand\'s tone.' },
                  { tip: 'Captions & accessibility', detail: 'Auto-captions or manual subtitles significantly boost engagement.' },
                  { tip: 'Optimal duration', detail: 'TikTok/Reels: 15-30s. YouTube reviews: 5-10 min. Instagram posts: concise captions.' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{t.tip}</p>
                      <p className="text-xs text-muted-foreground">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
