'use client';

import { useState } from 'react';
import { MessageSquare, Clock, ChevronDown, ChevronRight, Trash2, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  status: 'active' | 'completed' | 'archived';
  summary?: string;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  onLoadConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onExportConversation?: (id: string) => void;
}

const statusColors = {
  active: 'success',
  completed: 'secondary',
  archived: 'outline',
} as const;

export function ConversationHistory({
  conversations,
  onLoadConversation,
  onDeleteConversation,
  onExportConversation,
}: ConversationHistoryProps) {
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sortedConversations = [...conversations].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Conversation History</CardTitle>
          </div>
          <Badge variant="outline">{conversations.length} conversations</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedConversations.map((conversation) => {
            const isExpanded = expandedConversations.has(conversation.id);

            return (
              <div
                key={conversation.id}
                className="border rounded-lg overflow-hidden transition-all hover:border-brand-blue/50"
              >
                <div
                  className="p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{conversation.title}</h4>
                      <Badge variant={statusColors[conversation.status] as any} className="text-xs">
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(conversation.updatedAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>{conversation.messageCount} messages</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    {conversation.summary && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">{conversation.summary}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoadConversation(conversation.id);
                        }}
                      >
                        Load Conversation
                      </Button>
                      {onExportConversation && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportConversation(conversation.id);
                          }}
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Export
                        </Button>
                      )}
                      {onDeleteConversation && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this conversation?')) {
                              onDeleteConversation(conversation.id);
                            }
                          }}
                          leftIcon={<Trash2 className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No conversation history yet</p>
            <p className="text-sm">Start a new conversation to see it here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
