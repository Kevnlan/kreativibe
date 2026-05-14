'use client';

import { useState } from 'react';
import { DollarSign, Calendar, MessageSquare, Send, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface CounterOfferData {
  originalOfferId: string;
  amount: number;
  currency: string;
  deliverables: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  message: string;
  additionalNotes?: string;
}

interface CounterOfferFormProps {
  originalOffer: any;
  onSubmit: (counterOffer: CounterOfferData) => void;
  onCancel: () => void;
}

export function CounterOfferForm({ originalOffer, onSubmit, onCancel }: CounterOfferFormProps) {
  const [amount, setAmount] = useState(originalOffer?.amount || 0);
  const [currency] = useState('KES');
  const [startDate, setStartDate] = useState(originalOffer?.timeline?.startDate || '');
  const [endDate, setEndDate] = useState(originalOffer?.timeline?.endDate || '');
  const [deliverables, setDeliverables] = useState<string[]>(originalOffer?.deliverables || []);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [message, setMessage] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !startDate || !endDate || deliverables.length === 0) {
      return;
    }

    const counterOffer: CounterOfferData = {
      originalOfferId: originalOffer.id,
      amount,
      currency,
      deliverables,
      timeline: {
        startDate,
        endDate,
      },
      message,
      additionalNotes,
    };

    onSubmit(counterOffer);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Counter Offer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Offer Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input text-lg font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="50000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Original offer: {originalOffer?.currency} {originalOffer?.amount?.toLocaleString()}
            </p>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Deliverables</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                placeholder="Add a deliverable..."
                className="flex-1 px-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
              />
              <Button type="button" variant="outline" onClick={handleAddDeliverable} leftIcon={<Plus className="h-4 w-4" />}>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm flex-1">{deliverable}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveDeliverable(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your counter offer..."
              className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes (Optional)</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any additional terms or conditions..."
              className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={2}
            />
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-blue">
              Your counter offer will be sent to the other party for review. They can accept, reject, or make another counter offer.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              className="flex-1"
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send Counter Offer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
