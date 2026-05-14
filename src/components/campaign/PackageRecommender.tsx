'use client';

import { useState } from 'react';
import { Package, TrendingUp, Users, Zap, Check, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  recommended: boolean;
  estimatedReach: number;
  estimatedEngagement: number;
  suitableFor: string[];
}

interface PackageRecommenderProps {
  packages: PackageOption[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  onSelectPackage: (packageId: string) => void;
}

export function PackageRecommender({
  packages,
  budget,
  onSelectPackage,
}: PackageRecommenderProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());

  const toggleExpand = (packageId: string) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const handleSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    onSelectPackage(packageId);
  };

  const filteredPackages = packages.filter(pkg => {
    const price = pkg.price;
    return price >= budget.min && price <= budget.max;
  });

  const recommendedPackage = packages.find(pkg => pkg.recommended);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Recommended Packages</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your budget ({budget.currency} {budget.min.toLocaleString()} - {budget.max.toLocaleString()}),
          we recommend {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPackages.has(pkg.id);
            const isSelected = selectedPackage === pkg.id;
            const isRecommended = pkg.recommended;

            return (
              <div
                key={pkg.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  isSelected && "border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20",
                  isRecommended && !isSelected && "border-warning/50 bg-warning/5",
                  !isSelected && !isRecommended && "border-border"
                )}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(pkg.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{pkg.name}</h4>
                        {isRecommended && (
                          <Badge variant="warning" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                        {isSelected && (
                          <Badge variant="success" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold">
                        {pkg.currency} {pkg.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-blue" />
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Reach</p>
                        <p className="text-sm font-medium">{pkg.estimatedReach.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Engagement</p>
                        <p className="text-sm font-medium">{pkg.estimatedEngagement.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-warning" />
                      <div>
                        <p className="text-xs text-muted-foreground">Value Score</p>
                        <p className="text-sm font-medium">
                          {Math.round((pkg.estimatedEngagement / pkg.price) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {pkg.suitableFor.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {pkg.suitableFor.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{pkg.suitableFor.length - 2}
                        </Badge>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-4">
                    {/* Features */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Features</h5>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suitable For */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Suitable For</h5>
                      <div className="flex flex-wrap gap-1">
                        {pkg.suitableFor.map((tag, idx) => (
                          <Badge key={idx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
                      <Info className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-brand-blue">
                        This package is optimized for your campaign requirements and budget constraints.
                      </p>
                    </div>

                    {/* Action */}
                    <Button
                      variant={isSelected ? 'success' : 'brand'}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(pkg.id);
                      }}
                      leftIcon={isSelected ? <Check className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    >
                      {isSelected ? 'Package Selected' : 'Select This Package'}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No packages match your budget range</p>
            <p className="text-sm">Consider adjusting your budget to see more options</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
