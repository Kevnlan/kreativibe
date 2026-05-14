'use client';

import { useState } from 'react';
import { MessageSquare, Send, Paperclip, Download, User, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ChatMessage {
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
  isSystem?: boolean;
}

interface TicketChatProps {
  messages: ChatMessage[];
  onSendMessage?: (content: string, attachments?: string[]) => void;
  onDownloadAttachment?: (url: string) => void;
  currentUser?: {
    id: string;
    name: string;
    role: 'user' | 'support';
  };
}

export function TicketChat({ messages, onSendMessage, onDownloadAttachment, currentUser }: TicketChatProps) {
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
      <CardContent className="p-4">
        {/* Messages */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
          {messages.map((msg) => (
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
                  msg.sender.role === 'user' ? "bg-brand-blue" : msg.isSystem ? "bg-muted" : "bg-success"
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
                  msg.sender.role === 'user' ? "bg-brand-blue text-white" : msg.isSystem ? "bg-muted" : "bg-success text-white",
                  msg.isInternal && "border-l-4 border-l-warning"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.sender.name}</span>
                    <span className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleString()}</span>
                    {msg.isInternal && (
                      <Badge variant="warning" className="text-xs">Internal</Badge>
                    )}
                    {msg.isSystem && (
                      <Badge variant="secondary" className="text-xs">System</Badge>
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

        {/* Input */}
        <div className="space-y-3 pt-4 border-t">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={2}
          />
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Paperclip className="h-4 w-4" />}
            >
              Attach
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
      </CardContent>
    </Card>
  );
}
