'use client';

import { Brain, AlertTriangle, Shield, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export interface MLAnalysis {
  overallRiskScore: number;
  confidence: number;
  categories: {
    name: string;
    score: number;
    confidence: number;
    flagged: boolean;
    details?: string;
  }[];
  recommendations: string[];
  processedAt: string;
  modelVersion: string;
}

interface MLModerationResultsProps {
  analysis: MLAnalysis;
}

const riskLevelColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-destructive',
  critical: 'text-destructive font-bold',
} as const;

const riskLevelBg = {
  low: 'bg-success/10',
  medium: 'bg-warning/10',
  high: 'bg-destructive/10',
  critical: 'bg-destructive/20',
} as const;

const getRiskLevel = (score: number): keyof typeof riskLevelColors => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export function MLModerationResults({ analysis }: MLModerationResultsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const riskLevel = getRiskLevel(analysis.overallRiskScore);
  const flaggedCategories = analysis.categories.filter(c => c.flagged);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  return (
    <Card className={cn(
      "border-2",
      analysis.overallRiskScore >= 60 && "border-destructive/50",
      analysis.overallRiskScore >= 40 && analysis.overallRiskScore < 60 && "border-warning/50"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">AI Moderation Analysis</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              riskLevelBg[riskLevel],
              riskLevelColors[riskLevel]
            )}
          >
            {analysis.overallRiskScore}% Risk
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Model v{analysis.modelVersion} • {new Date(analysis.processedAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Risk Score</span>
            <span className={cn("font-bold", riskLevelColors[riskLevel])}>
              {analysis.overallRiskScore}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                analysis.overallRiskScore >= 60 && "bg-destructive",
                analysis.overallRiskScore >= 40 && analysis.overallRiskScore < 60 && "bg-warning",
                analysis.overallRiskScore < 40 && "bg-success"
              )}
              style={{ width: `${analysis.overallRiskScore}%` }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Confidence: {analysis.confidence}%</span>
          </div>
        </div>

        {/* Flagged Categories Summary */}
        {flaggedCategories.length > 0 && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive text-sm">
                {flaggedCategories.length} Category{flaggedCategories.length > 1 ? 'ies' : ''} Flagged
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {flaggedCategories.map(cat => (
                <Badge key={cat.name} variant="destructive" className="text-xs">
                  {cat.name} ({cat.score}%)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="space-y-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm font-medium hover:text-brand-blue transition-colors"
          >
            {showDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Category Breakdown
          </button>

          {showDetails && (
            <div className="space-y-2 pt-2">
              {analysis.categories.map(category => {
                const isExpanded = expandedCategories.has(category.name);
                const categoryRisk = getRiskLevel(category.score);

                return (
                  <div
                    key={category.name}
                    className={cn(
                      "border rounded-lg overflow-hidden",
                      category.flagged && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <div
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleCategory(category.name)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-bold", riskLevelColors[categoryRisk])}>
                              {category.score}%
                            </span>
                            {category.flagged && (
                              <Badge variant="destructive" className="text-xs">Flagged</Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all",
                              category.score >= 60 && "bg-destructive",
                              category.score >= 40 && category.score < 60 && "bg-warning",
                              category.score < 40 && "bg-success"
                            )}
                            style={{ width: `${category.score}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    {isExpanded && category.details && (
                      <div className="px-3 pb-3 pt-0 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">{category.details}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-brand-blue" />
              Recommendations
            </div>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-brand-blue mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
