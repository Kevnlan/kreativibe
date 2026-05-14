'use client';

import { useState } from 'react';
import { CreditCard, DollarSign, Save, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface PaymentMethod {
  id: string;
  type: 'm_pesa' | 'card' | 'bank_transfer';
  name: string;
  isDefault: boolean;
  details: {
    phone?: string;
    last4?: string;
    bankName?: string;
    accountNumber?: string;
  };
  status: 'active' | 'inactive';
}

export interface PaymentRule {
  id: string;
  name: string;
  type: 'threshold' | 'fee' | 'timing';
  value: number;
  unit?: string;
  status: 'active' | 'inactive';
}

interface PaymentSettingsProps {
  paymentMethods: PaymentMethod[];
  paymentRules: PaymentRule[];
  onAddPaymentMethod?: () => void;
  onRemovePaymentMethod?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  onSaveRules?: (rules: PaymentRule[]) => void;
}

const typeIcons = {
  m_pesa: '📱',
  card: '💳',
  bank_transfer: '🏦',
} as const;

export function PaymentSettings({
  paymentMethods,
  paymentRules,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefault,
  onSaveRules,
}: PaymentSettingsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [localRules, setLocalRules] = useState<PaymentRule[]>(paymentRules);
  const [isSaving, setIsSaving] = useState(false);

  const toggleExpand = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const updateRule = (ruleId: string, value: number) => {
    setLocalRules(prev =>
      prev.map(r => r.id === ruleId ? { ...r, value } : r)
    );
  };

  const handleSaveRules = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveRules?.(localRules);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-blue" />
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{paymentMethods.length} methods</Badge>
              {onAddPaymentMethod && (
                <Button variant="outline" size="sm" onClick={onAddPaymentMethod} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Method
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{typeIcons[method.type]}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{method.name}</span>
                      {method.isDefault && <Badge variant="brand" className="text-xs">Default</Badge>}
                      <Badge variant={method.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">
                        {method.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.type === 'm_pesa' && `Phone: ${method.details.phone}`}
                      {method.type === 'card' && `Card ending in ${method.details.last4}`}
                      {method.type === 'bank_transfer' && `${method.details.bankName} - ${method.details.accountNumber}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && onSetDefault && (
                    <Button variant="outline" size="sm" onClick={() => onSetDefault(method.id)}>
                      Set Default
                    </Button>
                  )}
                  {onRemovePaymentMethod && (
                    <Button variant="ghost" size="icon-sm" onClick={() => onRemovePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {paymentMethods.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods configured</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-brand-blue" />
              <CardTitle className="text-lg">Payment Rules</CardTitle>
            </div>
            <Button
              variant="brand"
              onClick={handleSaveRules}
              disabled={isSaving}
              leftIcon={isSaving ? <Save className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            >
              {isSaving ? 'Saving...' : 'Save Rules'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {localRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{rule.name}</span>
                  <Badge variant={rule.status === 'active' ? 'success' : 'secondary'} className="text-xs capitalize">
                    {rule.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Value:</span>
                  <input
                    type="number"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, parseFloat(e.target.value))}
                    className="w-24 px-3 py-1 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {rule.unit && <span className="text-sm">{rule.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {localRules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment rules configured</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
