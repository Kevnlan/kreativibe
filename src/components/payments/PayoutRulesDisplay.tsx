'use client';

import { useState } from 'react';
import { Settings, DollarSign, Clock, AlertCircle, Info, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PayoutRule {
  id: string;
  name: string;
  description: string;
  type: 'threshold' | 'fee' | 'timing' | 'restriction';
  value: number;
  currency?: string;
  unit?: string;
  status: 'active' | 'inactive';
  appliesTo: 'all' | 'creators' | 'brands';
}

interface PayoutRulesDisplayProps {
  rules: PayoutRule[];
  onEdit?: (ruleId: string) => void;
  onToggle?: (ruleId: string) => void;
}

const ruleTypeColors = {
  threshold: 'text-purple-700 dark:text-purple-400 bg-purple-500/10',
  fee: 'text-orange-700 dark:text-orange-400 bg-orange-500/10',
  timing: 'text-blue-700 dark:text-blue-400 bg-blue-500/10',
  restriction: 'text-red-700 dark:text-red-400 bg-red-500/10',
} as const;

export function PayoutRulesDisplay({ rules, onEdit, onToggle }: PayoutRulesDisplayProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

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

  const activeRules = rules.filter(r => r.status === 'active');
  const thresholdRules = activeRules.filter(r => r.type === 'threshold');
  const feeRules = activeRules.filter(r => r.type === 'fee');
  const timingRules = activeRules.filter(r => r.type === 'timing');
  const restrictionRules = activeRules.filter(r => r.type === 'restriction');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Payout Rules</CardTitle>
          </div>
          <Badge variant="outline">{activeRules.length} Active Rules</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Threshold Rules */}
        {thresholdRules.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-700 dark:text-purple-400" />
              <h4 className="font-medium text-sm">Threshold Rules</h4>
            </div>
            {thresholdRules.map((rule) => (
              <div
                key={rule.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rule.name}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", ruleTypeColors[rule.type])}
                      >
                        {rule.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {rule.currency}{rule.value.toLocaleString()}
                    </span>
                    {expandedRules.has(rule.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRules.has(rule.id) && (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50 flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(rule.id);
                        }}
                        leftIcon={<Edit className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                    )}
                    {onToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(rule.id);
                        }}
                      >
                        Disable
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Fee Rules */}
        {feeRules.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-700 dark:text-orange-400" />
              <h4 className="font-medium text-sm">Fee Rules</h4>
            </div>
            {feeRules.map((rule) => (
              <div
                key={rule.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rule.name}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", ruleTypeColors[rule.type])}
                      >
                        {rule.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {rule.value}%{rule.unit}
                    </span>
                    {expandedRules.has(rule.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRules.has(rule.id) && (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50 flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(rule.id);
                        }}
                        leftIcon={<Edit className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Timing Rules */}
        {timingRules.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-700 dark:text-blue-400" />
              <h4 className="font-medium text-sm">Timing Rules</h4>
            </div>
            {timingRules.map((rule) => (
              <div
                key={rule.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rule.name}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", ruleTypeColors[rule.type])}
                      >
                        {rule.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {rule.value} {rule.unit}
                    </span>
                    {expandedRules.has(rule.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRules.has(rule.id) && (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50 flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(rule.id);
                        }}
                        leftIcon={<Edit className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Restriction Rules */}
        {restrictionRules.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-700 dark:text-red-400" />
              <h4 className="font-medium text-sm">Restriction Rules</h4>
            </div>
            {restrictionRules.map((rule) => (
              <div
                key={rule.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(rule.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rule.name}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", ruleTypeColors[rule.type])}
                      >
                        {rule.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedRules.has(rule.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRules.has(rule.id) && (
                  <div className="px-3 pb-3 pt-0 border-t border-border/50 flex gap-2">
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(rule.id);
                        }}
                        leftIcon={<Edit className="h-3 w-3" />}
                      >
                        Edit
                      </Button>
                    )}
                    {onToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(rule.id);
                        }}
                      >
                        Disable
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
          <Info className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-blue">
            These rules determine when and how payouts are processed. Threshold rules set minimum amounts, fee rules determine platform fees, timing rules control processing schedules, and restriction rules limit certain payout scenarios.
          </p>
        </div>

        {rules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payout rules configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
