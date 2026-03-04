import { Camera, Search, Handshake, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';

const creatorSteps = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'Create your profile',
    description: 'Sign up as a creator, build your profile, and list your content packages — Reels, Posts, Stories, TikToks, YouTube videos and more. Set your own rates and availability.',
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Get discovered by brands',
    description: 'Brands browse the marketplace and reach out directly. Our algorithm also matches you with relevant campaigns based on your niche, platform, and audience demographics.',
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: 'Collaborate & deliver',
    description: 'Receive a campaign brief, communicate with the brand, and deliver high-quality content on time. Use built-in messaging to stay aligned throughout.',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Get paid securely',
    description: 'Once the brand approves your content, payment is released automatically to your wallet. Withdraw to M-Pesa or bank at any time with zero hidden fees.',
  },
];

const brandSteps = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Browse the marketplace',
    description: 'Filter creators by niche, platform, location, follower count, engagement rate, and budget. Find the perfect fit for every campaign in minutes.',
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'Book & brief creators',
    description: 'Purchase content packages directly or send custom proposals. Share your campaign brief, timeline, and brand guidelines all in one place.',
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: 'Review & approve content',
    description: 'Creators submit content for your review. Request revisions or approve — payment is only released when you are fully satisfied.',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Launch & measure results',
    description: 'Publish your content and track campaign performance through your brand analytics dashboard — reach, engagement, conversions, and ROAS all in one view.',
  },
];

const creatorBenefits = [
  'Set your own rates and terms',
  'Get paid securely and on time',
  'Access hundreds of brand campaigns',
  'Build your portfolio with real brand deals',
  'Dedicated creator support team',
];

const brandBenefits = [
  'Access 1,000+ vetted Kenyan creators',
  'Filter by any metric that matters',
  'Escrow payment — only pay on approval',
  'Built-in analytics and reporting',
  'Dedicated brand success manager',
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue/90 to-indigo-700 text-white">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">How Kreativibe Works</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            A simple, transparent process connecting Kenya's best creators with forward-thinking brands.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/signup">
              <Button className="bg-white text-brand-blue hover:bg-white/90 font-semibold px-6">
                Get Started Free
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6">
                Browse Creators
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-20">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* For Creators */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-8">
              🎬 For Creators
            </div>
            <div className="space-y-8">
              {creatorSteps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-base">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-1.5 text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Creator benefits</p>
              <ul className="space-y-2">
                {creatorBenefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-6 inline-flex">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  Join as Creator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* For Brands */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full mb-8">
              🏢 For Brands
            </div>
            <div className="space-y-8">
              {brandSteps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-base">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground mb-1.5 text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Brand benefits</p>
              <ul className="space-y-2">
                {brandBenefits.map(b => (
                  <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-brand-blue flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-6 inline-flex">
                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white gap-2">
                  Join as Brand <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ strip */}
      <div className="bg-muted/40 border-y border-border">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'Is Kreativibe free to join?', a: 'Yes, creating an account is completely free for both creators and brands. We only charge a small platform fee on successful transactions.' },
              { q: 'How does payment work?', a: 'Brands fund campaigns upfront and payments are held in escrow. Creators receive payment automatically once their content is approved.' },
              { q: 'What platforms are supported?', a: 'We support Instagram, TikTok, YouTube, Twitter/X, and Facebook. More platforms are being added regularly.' },
              { q: 'Can I set my own rates?', a: 'Absolutely. Creators set their own prices for each content type. Brands can also send custom proposals for negotiation.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6 border border-border">
                <p className="font-semibold text-foreground mb-2">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
