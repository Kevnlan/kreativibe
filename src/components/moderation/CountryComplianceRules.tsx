'use client';

import { useState } from 'react';
import { Globe, Check, X, AlertTriangle, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface CountryRule {
  id: string;
  country: string;
  countryCode: string;
  category: 'content' | 'advertising' | 'data' | 'payments' | 'general';
  ruleName: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non-compliant' | 'pending' | 'not-applicable';
  lastChecked: string;
  details?: string;
  actionRequired?: string;
}

interface CountryComplianceRulesProps {
  rules: CountryRule[];
  onCheckCompliance?: (ruleId: string) => void;
}

const severityColors = {
  low: 'text-muted-foreground',
  medium: 'text-warning',
  high: 'text-destructive',
  critical: 'text-destructive font-bold',
} as const;

const statusIcons = {
  compliant: Check,
  'non-compliant': X,
  pending: AlertTriangle,
  'not-applicable': Check,
} as const;

const statusColors = {
  compliant: 'success',
  'non-compliant': 'destructive',
  pending: 'warning',
  'not-applicable': 'secondary',
} as const;

const categoryColors = {
  content: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  advertising: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  data: 'bg-green-500/10 text-green-700 dark:text-green-400',
  payments: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  general: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
} as const;

export function CountryComplianceRules({ rules, onCheckCompliance }: CountryComplianceRulesProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const countries = Array.from(new Set(rules.map(r => r.country)));
  const categories = Array.from(new Set(rules.map(r => r.category)));

  const filteredRules = rules.filter(rule => {
    const matchesCountry = selectedCountry === 'all' || rule.country === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    return matchesCountry && matchesCategory;
  });

  const toggleExpand = (ruleId: string) => {
    setExpandedRules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ruleId)) {
        newSet.delete(ruleId);
      } else {
        newSet.add(ruleId);
      }
      return newSet;
    });
  };

  const compliantCount = filteredRules.filter(r => r.status === 'compliant').length;
  const nonCompliantCount = filteredRules.filter(r => r.status === 'non-compliant').length;
  const pendingCount = filteredRules.filter(r => r.status === 'pending').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Country Compliance Rules</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="success">{compliantCount} Compliant</Badge>
            {nonCompliantCount > 0 && <Badge variant="destructive">{nonCompliantCount} Non-Compliant</Badge>}
            {pendingCount > 0 && <Badge variant="warning">{pendingCount} Pending</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {filteredRules.map((rule) => {
            const StatusIcon = statusIcons[rule.status];
            const isExpanded = expandedRules.has(rule.id);

            return (
              <div
                key={rule.id}
                className={cn(
                  "border rounded-lg overflow-hidden transition-all",
                  rule.status === 'non-compliant' && "border-destructive/50 bg-destructive/5",
                  rule.status === 'pending' && "border-warning/50 bg-warning/5",
                  rule.status === 'compliant' && "border-success/50 bg-success/5"
                )}
              >
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <StatusIcon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      rule.status === 'compliant' && "text-success",
                      rule.status === 'non-compliant' && "text-destructive",
                      rule.status === 'pending' && "text-warning",
                      rule.status === 'not-applicable' && "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{rule.country}</span>
                      <Badge variant="outline" className="text-xs">{rule.countryCode}</Badge>
                      <Badge variant={statusColors[rule.status]} className="text-xs">{rule.status}</Badge>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", categoryColors[rule.category as keyof typeof categoryColors])}
                      >
                        {rule.category}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm">{rule.ruleName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium", severityColors[rule.severity])}>
                      {rule.severity}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-3">
                    {rule.details && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Details</h5>
                        <p className="text-sm text-muted-foreground">{rule.details}</p>
                      </div>
                    )}
                    {rule.actionRequired && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Action Required</h5>
                        <p className="text-sm text-muted-foreground">{rule.actionRequired}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last checked: {new Date(rule.lastChecked).toLocaleString()}
                      </span>
                      {onCheckCompliance && rule.status !== 'compliant' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCheckCompliance(rule.id);
                          }}
                        >
                          Re-check Compliance
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No compliance rules match your filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
