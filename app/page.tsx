import { Navigation } from '../src/components/layout/Navigation';
import { HeroSection } from '../src/components/homepage/HeroSection';
import { FeaturesSection } from '../src/components/homepage/FeaturesSection';
import { CTASection } from '../src/components/homepage/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
