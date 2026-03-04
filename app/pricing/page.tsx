import { CheckCircle, X, Zap, Building2, Crown, Users } from 'lucide-react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';

const creatorPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started and build your presence on Kreativibe.',
    color: 'border-border',
    badge: null,
    icon: <Users className="h-5 w-5" />,
    features: [
      { label: 'Creator profile', included: true },
      { label: 'Up to 3 active listings', included: true },
      { label: 'Direct brand messages', included: true },
      { label: 'Basic analytics', included: true },
      { label: 'Platform fee: 12%', included: true },
      { label: 'Priority listing placement', included: false },
      { label: 'Verified badge', included: false },
      { label: 'Advanced analytics', included: false },
      { label: 'Dedicated account manager', included: false },
    ],
    cta: 'Get Started Free',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: 1499,
    description: 'For active creators ready to scale their brand partnerships.',
    color: 'border-orange-500',
    badge: 'Most Popular',
    icon: <Zap className="h-5 w-5" />,
    features: [
      { label: 'Creator profile', included: true },
      { label: 'Unlimited active listings', included: true },
      { label: 'Direct brand messages', included: true },
      { label: 'Advanced analytics', included: true },
      { label: 'Platform fee: 8%', included: true },
      { label: 'Priority listing placement', included: true },
      { label: 'Verified badge', included: true },
      { label: 'Campaign performance reports', included: true },
      { label: 'Dedicated account manager', included: false },
    ],
    cta: 'Start Pro',
    ctaVariant: 'default' as const,
  },
];

const brandPlans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Explore the marketplace and run your first campaign.',
    color: 'border-border',
    badge: null,
    icon: <Building2 className="h-5 w-5" />,
    features: [
      { label: 'Brand profile', included: true },
      { label: 'Up to 2 active campaigns', included: true },
      { label: 'Access to all creators', included: true },
      { label: 'Basic campaign analytics', included: true },
      { label: 'Platform fee: 10%', included: true },
      { label: 'Unlimited campaigns', included: false },
      { label: 'Advanced analytics & ROAS', included: false },
      { label: 'Creator recommendations AI', included: false },
      { label: 'Dedicated brand manager', included: false },
    ],
    cta: 'Get Started Free',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Growth',
    price: 4999,
    description: 'Scale your influencer marketing with powerful tools.',
    color: 'border-brand-blue',
    badge: 'Best Value',
    icon: <Crown className="h-5 w-5" />,
    features: [
      { label: 'Brand profile', included: true },
      { label: 'Unlimited active campaigns', included: true },
      { label: 'Access to all creators', included: true },
      { label: 'Advanced analytics & ROAS', included: true },
      { label: 'Platform fee: 6%', included: true },
      { label: 'Creator recommendations AI', included: true },
      { label: 'Campaign performance export', included: true },
      { label: 'Priority creator access', included: true },
      { label: 'Dedicated brand manager', included: true },
    ],
    cta: 'Start Growth',
    ctaVariant: 'default' as const,
  },
];

function PlanCard({ plan, accent }: { plan: typeof creatorPlans[0]; accent: string }) {
  const isHighlighted = plan.badge !== null;
  return (
    <div className={`relative bg-card rounded-3xl p-8 border-2 ${plan.color} ${isHighlighted ? 'shadow-lg' : 'shadow-sm'} flex flex-col`}>
      {plan.badge && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white ${accent}`}>
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${isHighlighted ? `${accent} text-white` : 'bg-muted text-muted-foreground'}`}>
          {plan.icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-foreground">
            {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}`}
          </span>
          {plan.price > 0 && <span className="text-muted-foreground mb-1">/month</span>}
        </div>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map(f => (
          <li key={f.label} className="flex items-center gap-2.5 text-sm">
            {f.included
              ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              : <X className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />}
            <span className={f.included ? 'text-foreground' : 'text-muted-foreground/60'}>{f.label}</span>
          </li>
        ))}
      </ul>

      <Link href="/auth/signup">
        <Button
          variant={plan.ctaVariant}
          className={`w-full ${isHighlighted ? `${accent} text-white hover:opacity-90` : ''}`}
        >
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue/90 to-indigo-700 text-white">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">Simple, Transparent Pricing</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            No setup fees, no hidden charges. Start free and upgrade as you grow.
          </p>
        </div>
      </div>

      {/* Creator Plans */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-3">
            🎬 For Creators
          </span>
          <h2 className="text-2xl font-bold text-foreground">Creator Plans</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {creatorPlans.map(plan => (
            <PlanCard key={plan.name} plan={plan} accent="bg-orange-500" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Brand Plans */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-sm font-semibold rounded-full mb-3">
            🏢 For Brands
          </span>
          <h2 className="text-2xl font-bold text-foreground">Brand Plans</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {brandPlans.map(plan => (
            <PlanCard key={plan.name} plan={plan} accent="bg-brand-blue" />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-muted/40 border-t border-border">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Pricing FAQs</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { q: 'What does the platform fee cover?', a: 'The platform fee covers payment processing, escrow protection, dispute resolution, and access to the Kreativibe marketplace and tools.' },
              { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel or downgrade at any time. Your plan remains active until the end of the current billing cycle.' },
              { q: 'Are there any transaction minimums?', a: 'No minimum transaction amounts. You can book a creator for as little as KES 2,000.' },
              { q: 'Do you offer annual billing?', a: 'Yes! Annual billing gives you 2 months free. Contact our team to switch to an annual plan.' },
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
