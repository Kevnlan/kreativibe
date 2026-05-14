'use client';

import { useState } from 'react';
import { Users, MapPin, Calendar, PieChart, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface AudienceData {
  totalFollowers: number;
  growthRate: number;
  demographics: {
    age: { range: string; percentage: number }[];
    gender: { gender: string; percentage: number }[];
    location: { country: string; percentage: number }[];
  };
  engagement: {
    byAge: { range: string; rate: number }[];
    byLocation: { country: string; rate: number }[];
  };
  activeHours: { hour: number; activity: number }[];
}

interface AudienceInsightsProps {
  data: AudienceData;
  onExport?: () => void;
}

export function AudienceInsights({ data, onExport }: AudienceInsightsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleExpand = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Audience Insights</CardTitle>
          </div>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Followers</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(data.totalFollowers)}</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Growth Rate</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              data.growthRate >= 0 ? "text-success" : "text-destructive"
            )}>
              {data.growthRate >= 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Age Demographics */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('age')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Age Distribution</span>
              </div>
              {expandedSection === 'age' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
          {expandedSection === 'age' && (
            <div className="p-4 border-t space-y-2">
              {data.demographics.age.map((item) => (
                <div key={item.range} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.range}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-brand-blue h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gender Demographics */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('gender')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Gender Distribution</span>
              </div>
              {expandedSection === 'gender' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
          {expandedSection === 'gender' && (
            <div className="p-4 border-t space-y-2">
              {data.demographics.gender.map((item) => (
                <div key={item.gender} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{item.gender}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Demographics */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('location')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Top Locations</span>
              </div>
              {expandedSection === 'location' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
          {expandedSection === 'location' && (
            <div className="p-4 border-t space-y-2">
              {data.demographics.location.slice(0, 5).map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <span className="text-sm">{item.country}</span>
                  <Badge variant="outline" className="text-xs">{item.percentage}%</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Hours */}
        <div className="border rounded-lg overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand('hours')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Peak Activity Hours</span>
              </div>
              {expandedSection === 'hours' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
          {expandedSection === 'hours' && (
            <div className="p-4 border-t">
              <div className="flex gap-1 h-24 items-end">
                {data.activeHours.map((item) => (
                  <div
                    key={item.hour}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-brand-blue rounded-t"
                      style={{
                        height: `${(item.activity / Math.max(...data.activeHours.map(h => h.activity))) * 100}%`,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.hour}:00</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
