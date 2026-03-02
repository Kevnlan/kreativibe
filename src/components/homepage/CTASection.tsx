'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../ui';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-brand-blue to-brand-blue-light text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of brands and creators already using Kreativibe to create amazing content together.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="xl" className="bg-white text-brand-blue hover:bg-gray-100 shadow-lg">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue">
              Browse Marketplace
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-white/80 text-sm">
          No credit card required • Free to join • Cancel anytime
        </p>
      </div>
    </section>
  );
}
