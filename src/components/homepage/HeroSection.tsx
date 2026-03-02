'use client';

import Link from 'next/link';
import { ArrowRight, Play, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

export function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue to-brand-blue-dark text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 500+ creators and brands
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-slide-up">
            Connect with
            <span className="block text-brand-blue-light">Local Creators</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform your marketing with authentic content from trusted local voices. 
            Affordable, effective campaigns that resonate with your audience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="xl" className="bg-white text-brand-blue hover:bg-gray-100 shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="xl" className="bg-white text-brand-blue hover:bg-gray-100 shadow-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue">
                    <Play className="mr-2 h-5 w-5" />
                    Browse Creators
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-blue-light mb-2">500+</div>
              <div className="text-white/80">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-blue-light mb-2">200+</div>
              <div className="text-white/80">Brand Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-brand-blue-light mb-2">10K+</div>
              <div className="text-white/80">Campaigns Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
