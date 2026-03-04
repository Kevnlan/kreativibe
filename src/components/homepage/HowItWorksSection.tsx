'use client';

import { Camera, Search, Handshake, DollarSign } from 'lucide-react';

const creatorSteps = [
  {
    icon: <Camera className="h-5 w-5" />,
    title: 'List your content',
    description: 'Create your profile and list your content packages — Reels, Posts, Stories, TikToks and more. Set your own rates.',
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: 'Get discovered',
    description: 'Brands browse the marketplace and reach out directly. Our algorithm also matches you with relevant campaigns.',
  },
  {
    icon: <DollarSign className="h-5 w-5" />,
    title: 'Deliver & get paid',
    description: 'Deliver the content, get reviewed, and receive payment securely through the platform wallet.',
  },
];

const brandSteps = [
  {
    icon: <Search className="h-5 w-5" />,
    title: 'Browse creators',
    description: 'Filter by niche, platform, location, followers and price. Find the perfect creator for your campaign.',
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: 'Book & brief',
    description: 'Purchase content packages directly. Communicate with creators, share briefs and track progress.',
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    title: 'Launch & measure',
    description: 'Receive your content, post it, and track campaign performance with built-in analytics.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and transparent — whether you create content or need it
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For Creators */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-8">
              🎬 For Creators
            </div>
            <div className="space-y-7">
              {creatorSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Brands */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-border/60">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full mb-8">
              🏢 For Brands
            </div>
            <div className="space-y-7">
              {brandSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
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
