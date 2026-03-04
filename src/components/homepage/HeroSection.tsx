'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

const mockCreators = [
  {
    initials: 'SK',
    name: 'Sarah Kimani',
    niche: 'Fashion & Lifestyle',
    followers: '45.2K',
    platform: 'Instagram',
    color: 'from-pink-400 to-rose-500',
    verified: true,
  },
  {
    initials: 'JM',
    name: 'James Mutua',
    niche: 'Food & Travel',
    followers: '128K',
    platform: 'TikTok',
    color: 'from-violet-400 to-purple-600',
    verified: true,
  },
  {
    initials: 'AN',
    name: 'Aisha Ndungu',
    niche: 'Beauty & Skincare',
    followers: '82.5K',
    platform: 'YouTube',
    color: 'from-orange-400 to-red-500',
    verified: true,
  },
];

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-brand-blue/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-orange/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Africa's Content Creator Marketplace
            </div>

            <h1 className="text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.1] tracking-tight mb-5">
              Where brands meet{' '}
              <span className="text-brand-blue">their perfect</span>{' '}
              creator match
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Kreativibe connects businesses with verified local content creators across Instagram, TikTok, YouTube and more. Real people, authentic content, measurable results.
            </p>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="xl" variant="brand">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/signup">
                  <Button size="xl" variant="brand">
                    I'm a Brand <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="xl" variant="outline">
                    I'm a Creator
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {['SK', 'JM', 'AN', 'TL', 'RB'].map((init, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {init[0]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">500+</strong> creators joined
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to join
              </div>
            </div>
          </div>

          {/* Right — creator cards */}
          <div className="relative hidden lg:flex flex-col gap-4 pt-6">
            {mockCreators.map((c, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-border/50 p-4 transition-transform hover:-translate-y-0.5 ${
                  i === 1 ? 'ml-10' : i === 2 ? 'ml-5' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-base`}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-foreground">{c.name}</span>
                    {c.verified && (
                      <div className="w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.niche}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-sm text-foreground">{c.followers}</div>
                  <div className="text-xs text-muted-foreground">{c.platform}</div>
                </div>
              </div>
            ))}

            <div className="absolute -bottom-2 -left-6 bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] border border-border/60 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">New deal closed</div>
                <div className="text-xs text-muted-foreground">KES 65,000 campaign</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 pt-10 border-t border-border grid grid-cols-3 gap-6">
          {[
            { value: '500+', label: 'Verified Creators' },
            { value: '200+', label: 'Brand Partners' },
            { value: '10K+', label: 'Campaigns Delivered' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-blue">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
