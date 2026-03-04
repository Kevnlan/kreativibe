'use client';

import Link from 'next/link';

const links = {
  Platform: [
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Get Started', href: '/auth/signup' },
  ],
  Creators: [
    { label: 'Join as Creator', href: '/auth/signup' },
    { label: 'Creator Guide', href: '#' },
    { label: 'KYC Verification', href: '#' },
    { label: 'Pricing your content', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background/70 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">K</span>
              </div>
              <span className="text-white font-bold text-xl">Kreativibe</span>
            </Link>
            <p className="text-sm leading-relaxed text-background/50">
              Africa's content creator marketplace. Connecting brands and creators for authentic, results-driven campaigns.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/35">© 2025 Kreativibe. All rights reserved.</p>
          <p className="text-xs text-background/35">Made with ❤️ in Kenya</p>
        </div>
      </div>
    </footer>
  );
}
