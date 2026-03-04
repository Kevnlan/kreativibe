import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/homepage/HeroSection';
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection';
import { CreatorShowcaseSection } from '@/components/homepage/CreatorShowcaseSection';
import { FeaturesSection } from '@/components/homepage/FeaturesSection';
import { CTASection } from '@/components/homepage/CTASection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <CreatorShowcaseSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
