'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui';

const creators = [
  { initials: 'SK', name: 'Sarah Kimani', niche: 'Fashion', platform: 'Instagram', followers: '45.2K', price: 'From KES 5,000', color: 'from-pink-400 to-rose-500', location: 'Nairobi' },
  { initials: 'JM', name: 'James Mutua', niche: 'Food & Travel', platform: 'TikTok', followers: '128K', price: 'From KES 8,000', color: 'from-violet-400 to-purple-600', location: 'Mombasa' },
  { initials: 'AN', name: 'Aisha Ndungu', niche: 'Beauty', platform: 'YouTube', followers: '82.5K', price: 'From KES 12,000', color: 'from-orange-400 to-red-500', location: 'Nairobi' },
  { initials: 'TO', name: 'Tom Ochieng', niche: 'Fitness', platform: 'Instagram', followers: '34K', price: 'From KES 4,500', color: 'from-green-400 to-teal-500', location: 'Kisumu' },
  { initials: 'RM', name: 'Rita Mwangi', niche: 'Lifestyle', platform: 'TikTok', followers: '91K', price: 'From KES 7,000', color: 'from-blue-400 to-cyan-500', location: 'Nairobi' },
  { initials: 'BK', name: 'Brian Kamau', niche: 'Tech', platform: 'YouTube', followers: '55K', price: 'From KES 9,500', color: 'from-indigo-400 to-blue-600', location: 'Nairobi' },
];

export function CreatorShowcaseSection() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Meet Our Creators</h2>
            <p className="text-lg text-muted-foreground">Verified local creators ready to work with your brand</p>
          </div>
          <Link href="/marketplace">
            <Button variant="outline">
              Browse all creators <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.09)] transition-all duration-200"
            >
              {/* Cover */}
              <div className={`h-20 bg-gradient-to-r ${c.color}`} />

              <div className="px-5 pb-5">
                {/* Avatar overlap */}
                <div
                  className={`-mt-8 mb-3 w-16 h-16 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-xl border-[3px] border-white shadow-sm`}
                >
                  {c.initials}
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      <CheckCircle className="h-3.5 w-3.5 text-brand-blue flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.location}</div>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium text-muted-foreground">
                    {c.niche}
                  </span>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  <span className="font-bold text-foreground">{c.followers}</span> followers · {c.platform}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-blue">{c.price}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                    View profile →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
