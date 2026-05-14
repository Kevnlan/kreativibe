'use client';

import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Send, Paperclip, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface TicketMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    role: 'user' | 'support' | 'system';
    avatar?: string;
  };
  content: string;
  attachments?: string[];
  timestamp: string;
  isInternal?: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: 'general' | 'payment' | 'campaign' | 'technical' | 'account';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketDetailProps {
  ticket: SupportTicket;
  onSendMessage?: (content: string, attachments?: string[]) => void;
  onAssign?: (userId: string) => void;
  onCloseTicket?: () => void;
  onReopenTicket?: () => void;
  onDownloadAttachment?: (url: string) => void;
}

const statusColors = {
  open: 'secondary',
  in_progress: 'brand',
  resolved: 'success',
  closed: 'destructive',
} as const;

const priorityColors = {
  low: 'text-gray-600 dark:text-gray-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-orange-600 dark:text-orange-400',
  urgent: 'text-red-600 dark:text-red-400',
} as const;

export function TicketDetail({ ticket, onSendMessage, onAssign, onCloseTicket, onReopenTicket, onDownloadAttachment }: TicketDetailProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setIsSending(true);
      onSendMessage?.(message);
      setMessage('');
      setTimeout(() => setIsSending(false), 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{ticket.subject}</h3>
              <Badge variant={statusColors[ticket.status] as any} className="text-xs capitalize">
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className={cn("text-xs capitalize", priorityColors[ticket.priority])}>
                {ticket.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="capitalize">{ticket.category}</span>
              <span>•</span>
              <span>Created {new Date(ticket.createdAt).toLocaleString()}</span>
              {ticket.assignedTo && (
                <>
                  <span>•</span>
                  <span>Assigned to {ticket.assignedTo.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {ticket.status !== 'closed' && onCloseTicket && (
              <Button variant="outline" size="sm" onClick={onCloseTicket}>
                Close
              </Button>
            )}
            {ticket.status === 'closed' && onReopenTicket && (
              <Button variant="brand" size="sm" onClick={onReopenTicket}>
                Reopen
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Ticket Description
          </h4>
          <p className="text-sm">{ticket.description}</p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <h4 className="font-medium">Conversation</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender.role === 'user' ? "flex-row" : "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                {msg.sender.avatar ? (
                  <img src={msg.sender.avatar} alt={msg.sender.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                    msg.sender.role === 'user' ? "bg-brand-blue" : "bg-muted"
                  )}>
                    {msg.sender.name.charAt(0)}
                  </div>
                )}

                {/* Message */}
                <div className={cn(
                  "max-w-[70%]",
                  msg.sender.role === 'user' ? "text-left" : "text-right"
                )}>
                  <div className={cn(
                    "p-3 rounded-lg",
                    msg.sender.role === 'user' ? "bg-brand-blue text-white" : "bg-muted",
                    msg.isInternal && "border-l-4 border-l-warning"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{msg.sender.name}</span>
                      <span className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleString()}</span>
                      {msg.isInternal && (
                        <Badge variant="warning" className="text-xs">Internal</Badge>
                      )}
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-muted rounded text-xs"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate">{attachment}</span>
                          {onDownloadAttachment && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => onDownloadAttachment(attachment)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        {ticket.status !== 'closed' && (
          <div className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Paperclip className="h-4 w-4" />}
              >
                Attach File
              </Button>
              <Button
                variant="brand"
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                leftIcon={isSending ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
