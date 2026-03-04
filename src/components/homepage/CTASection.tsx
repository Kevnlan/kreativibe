'use client';

import Link from 'next/link';
import { ArrowRight, Camera, Building2 } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-brand-blue">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to grow with authentic content?
        </h2>
        <p className="text-xl text-white/75 mb-12 max-w-2xl mx-auto">
          Join hundreds of creators and brands already working together on Kreativibe. It's free to get started.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <Link href="/auth/signup" className="group">
            <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-colors text-left h-full">
              <Camera className="h-8 w-8 text-white mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">I'm a Creator</h3>
              <p className="text-sm text-white/65 mb-5">Start monetizing your content today</p>
              <span className="inline-flex items-center text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Join as Creator <ArrowRight className="ml-1.5 h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link href="/auth/signup" className="group">
            <div className="bg-white hover:bg-gray-50 rounded-2xl p-6 transition-colors text-left h-full">
              <Building2 className="h-8 w-8 text-brand-blue mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">I'm a Brand</h3>
              <p className="text-sm text-muted-foreground mb-5">Find creators for your next campaign</p>
              <span className="inline-flex items-center text-brand-blue font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Join as Brand <ArrowRight className="ml-1.5 h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-white/50 text-sm">No credit card required · Free to join</p>
      </div>
    </section>
  );
}
