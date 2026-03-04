'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-brand-blue/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-orange/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-20 lg:py-28">
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

          {/* Right — hero image */}
          <div className="relative hidden lg:block">
            <Image
              src="/cover.png"
              alt="Kreativibe creators collaborating"
              width={680}
              height={520}
              className="w-full h-auto rounded-2xl object-cover"
              priority
            />
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
