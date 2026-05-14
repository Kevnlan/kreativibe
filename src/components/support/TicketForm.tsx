'use client';

import { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Upload, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface NewTicketData {
  subject: string;
  description: string;
  category: 'general' | 'payment' | 'campaign' | 'technical' | 'account';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

interface TicketFormProps {
  onSubmit?: (data: NewTicketData) => void;
  onCancel?: () => void;
}

export function TicketForm({ onSubmit, onCancel }: TicketFormProps) {
  const [formData, setFormData] = useState<NewTicketData>({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit?.(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, attachments: files });
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Create Support Ticket</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="general">General</option>
              <option value="payment">Payment</option>
              <option value="campaign">Campaign</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about your issue..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={5}
              required
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Attachments</label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="ticket-attachments"
              />
              <label htmlFor="ticket-attachments" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Max 10MB per file</p>
              </label>
            </div>

            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-brand-blue">
              Your ticket will be reviewed by our support team. You'll receive updates via email and in your notification center.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <AlertCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
