'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, Loader2, Download, X, Zap, Crown, Building } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@/components/ui';
import { subscriptionService } from '@/services/subscription.service';
import { SubscriptionPlan, Subscription, Invoice, SubscriptionTier, BillingCycle } from '@/types/api-contracts/subscription.types';
import { cn } from '@/lib/utils';

const tierIcons: Record<SubscriptionTier, React.ReactNode> = {
  FREE: <Zap className="h-5 w-5" />,
  CREATOR_PRO: <Zap className="h-5 w-5" />,
  BRAND_PRO: <Crown className="h-5 w-5" />,
  ENTERPRISE: <Building className="h-5 w-5" />,
};

const tierColors: Record<SubscriptionTier, string> = {
  FREE: 'text-blue-600 bg-blue-100',
  CREATOR_PRO: 'text-purple-600 bg-purple-100',
  BRAND_PRO: 'text-orange-600 bg-orange-100',
  ENTERPRISE: 'text-green-600 bg-green-100',
};

const invoiceStatusVariants: Record<string, string> = {
  PAID: 'success',
  PENDING: 'warning',
  FAILED: 'error',
  CANCELLED: 'default',
};

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [mySubscription, setMySubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [activeTab, setActiveTab] = useState<'plans' | 'invoices'>('plans');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansRes, subRes, invoicesRes] = await Promise.all([
        subscriptionService.listPlans(true),
        subscriptionService.mySubscription(),
        subscriptionService.listInvoices(1, 50),
      ]);
      setPlans(plansRes.items || []);
      setMySubscription(subRes);
      setInvoices(invoicesRes.items || []);
    } catch {
      setError('Failed to load subscription data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    setError(null);
    try {
      const res = await subscriptionService.subscribe({ planId, autoRenew: true });
      setMySubscription(res.subscription);
      if (res.invoices) setInvoices(prev => [...res.invoices!, ...prev]);
    } catch {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async () => {
    if (!mySubscription || !cancelReason.trim()) return;
    setCancelling(true);
    setError(null);
    try {
      const cancelled = await subscriptionService.cancel({
        subscriptionId: mySubscription.id,
        reason: cancelReason,
      });
      setMySubscription(cancelled);
      setShowCancelModal(false);
      setCancelReason('');
    } catch {
      setError('Failed to cancel subscription.');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const paid = await subscriptionService.payInvoice({ invoiceId, method: 'MPESA' });
      setInvoices(prev => prev.map(i => i.id === invoiceId ? paid : i));
    } catch {
      setError('Failed to pay invoice.');
    }
  };

  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading subscriptions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription plan and invoices</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Current Subscription */}
      {mySubscription && (
        <Card className={cn('border-2', mySubscription.status === 'ACTIVE' ? 'border-green-200 bg-green-50/50' : '')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">Current Subscription</h3>
                  <StatusBadge variant={mySubscription.status === 'ACTIVE' ? 'success' : 'default'} size="sm">
                    {mySubscription.status}
                  </StatusBadge>
                </div>
                {mySubscription.plan && (
                  <p className="text-lg font-medium">{mySubscription.plan.name}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Started: {formatDate(mySubscription.startDate)}</span>
                  <span>Renews: {formatDate(mySubscription.endDate)}</span>
                  <span>Auto-renew: {mySubscription.autoRenew ? 'Yes' : 'No'}</span>
                </div>
                {mySubscription.cancellationReason && (
                  <p className="text-sm text-red-600 mt-2">Cancelled: {mySubscription.cancellationReason}</p>
                )}
              </div>
              {mySubscription.status === 'ACTIVE' && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('plans')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'plans' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Plans
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'invoices' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Invoices
        </button>
      </div>

      {/* Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => {
            const isCurrent = mySubscription?.planId === plan.id;
            return (
              <Card key={plan.id} className={cn('flex flex-col', isCurrent && 'border-2 border-brand-blue')}>
                <CardContent className="pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn('p-2.5 rounded-xl', tierColors[plan.tier])}>
                      {tierIcons[plan.tier]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.tier.replace(/_/g, ' ').toLowerCase()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price, plan.currency)}</span>
                    <span className="text-sm text-muted-foreground">/{plan.billingCycle.toLowerCase()}</span>
                  </div>
                  {plan.trialDays > 0 && (
                    <p className="text-xs text-green-600 mb-3">{plan.trialDays}-day free trial</p>
                  )}
                  <div className="space-y-1.5 mb-4 flex-1">
                    {Object.entries(plan.features || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="text-muted-foreground">— {String(value)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full"
                    disabled={isCurrent || subscribing === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                    variant={isCurrent ? 'outline' : 'default'}
                  >
                    {isCurrent ? 'Current Plan' : subscribing === plan.id ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Subscribing...</>
                    ) : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <Card>
          <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No invoices yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(invoice.amount, invoice.currency)}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(invoice.dueDate)}
                          {invoice.paidAt && ` • Paid: ${formatDate(invoice.paidAt)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={(invoiceStatusVariants[invoice.status] as any) || 'default'} size="sm">
                        {invoice.status}
                      </StatusBadge>
                      {invoice.status === 'PENDING' && (
                        <Button size="sm" onClick={() => handlePayInvoice(invoice.id)}>
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCancelModal(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Cancel Subscription</h3>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowCancelModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your subscription will remain active until the end of the current billing period.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for cancellation</label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Tell us why you're cancelling..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCancelModal(false)}>Keep Subscription</Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={cancelling || !cancelReason.trim()}
                  leftIcon={cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
