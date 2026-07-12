'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Loader2, ArrowLeft, Paperclip, Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { messagingService } from '@/services/messaging.service';
import { Conversation, Message } from '@/types/api-contracts/messaging.types';
import { useUser } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function MessagingPage() {
  const user = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await messagingService.listConversations(1, 50);
      setConversations(res.items || []);
    } catch {
      setError('Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await messagingService.getUnreadCount();
      setUnreadCount(res.count || 0);
    } catch {}
  };

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const res = await messagingService.listMessages({ conversationId, page: 1, limit: 100 });
      setMessages(res.items || []);
      await messagingService.markConversationRead(conversationId);
      loadUnreadCount();
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    setSending(true);
    try {
      const msg = await messagingService.sendMessage({
        conversationId: activeConversation.id,
        body: newMessage,
      });
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    !searchQuery ||
    c.lastMessageText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < 24) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diffHrs < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)] text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading conversations...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {/* Conversation List */}
      <div className={cn('w-full md:w-80 border-r flex flex-col', activeConversation && 'hidden md:flex')}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No conversations yet.</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={cn(
                  'w-full p-4 border-b text-left hover:bg-muted/50 transition-colors',
                  activeConversation?.id === conv.id && 'bg-muted'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {conv.recipientId === user?.id ? conv.initiatorId : conv.recipientId}
                      </p>
                      {conv.lastMessageAt && (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {conv.lastMessageText || 'No messages yet'}
                    </p>
                  </div>
                  {conv.unreadCount && conv.unreadCount > 0 ? (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className={cn('flex-1 flex flex-col', !activeConversation && 'hidden md:flex')}>
        {activeConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                onClick={() => setActiveConversation(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <p className="font-medium">
                  {activeConversation.recipientId === user?.id ? activeConversation.initiatorId : activeConversation.recipientId}
                </p>
                <p className="text-xs text-muted-foreground">Direct message</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        isOwn ? 'bg-brand-blue text-white' : 'bg-muted text-foreground'
                      )}>
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  'flex items-center gap-2 text-xs underline',
                                  isOwn ? 'text-white/80' : 'text-muted-foreground'
                                )}
                              >
                                <Paperclip className="h-3 w-3" /> {att.name}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className={cn('text-xs mt-1', isOwn ? 'text-white/60' : 'text-muted-foreground')}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t">
              {error && (
                <p className="text-xs text-red-600 mb-2">{error}</p>
              )}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  disabled={sending}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
