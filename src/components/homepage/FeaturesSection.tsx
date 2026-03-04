'use client';

import { Shield, Zap, TrendingUp, Star, DollarSign, Target, BarChart3, Users } from 'lucide-react';

const creatorBenefits = [
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: 'Set your own rates',
    description: 'Price your content packages freely — Stories, Posts, Reels, Videos. You control what you charge.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Get a verified badge',
    description: 'Complete KYC once and earn a verified badge that builds instant trust with brands.',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Instant brand discovery',
    description: 'Get found by brands actively looking for creators in your niche — no cold outreach needed.',
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: 'Build your reputation',
    description: 'Showcase past work and grow your portfolio through verified brand reviews.',
  },
];

const brandBenefits = [
  {
    icon: <Target className="h-5 w-5" />,
    title: 'Find your exact niche fit',
    description: 'Filter by niche, platform, location, and follower count to find creators who match your audience.',
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Vetted talent only',
    description: 'Every creator is identity-verified. No bots, no fake followers, no surprises.',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Campaign analytics',
    description: 'Track reach, engagement, and conversions across all your active creator campaigns in one dashboard.',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Affordable campaigns',
    description: 'Access local micro-influencers at a fraction of celebrity costs, with better engagement rates.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Both Sides</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you create content or need it, Kreativibe is designed to work for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Creators */}
          <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-6">
              🎬 For Creators
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-7">Turn your content into income</h3>
            <div className="space-y-6">
              {creatorBenefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-orange-500 flex-shrink-0 shadow-sm">
                    {b.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-0.5">{b.title}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Brands */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/15 text-brand-blue text-sm font-semibold rounded-full mb-6">
              🏢 For Brands
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-7">Find creators that drive results</h3>
            <div className="space-y-6">
              {brandBenefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-brand-blue flex-shrink-0 shadow-sm">
                    {b.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-0.5">{b.title}</div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
