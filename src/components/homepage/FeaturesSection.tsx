'use client';

import { Shield, Zap, Users, TrendingUp, MessageSquare, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui';

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Verified Creators",
    description: "All creators go through our verification process to ensure quality and authenticity."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Quick Campaigns",
    description: "Launch campaigns in minutes with our streamlined process and intuitive platform."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Local Focus",
    description: "Connect with creators who understand your local market and audience."
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Real Analytics",
    description: "Track campaign performance with detailed analytics and insights."
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Direct Communication",
    description: "Chat directly with creators to discuss campaign details and requirements."
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Targeted Reach",
    description: "Find creators that match your brand values and target audience perfectly."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Kreativibe?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The most trusted platform for connecting brands with authentic local content creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center text-brand-blue mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
