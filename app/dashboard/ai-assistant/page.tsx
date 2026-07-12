'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Send, Loader2, Plus, Trash2, MessageSquare, Lightbulb, DollarSign, Users, X } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { aiAssistantService } from '@/services/ai-assistant.service';
import { AISession, AISessionType, ChatResponse } from '@/types/api-contracts/ai-assistant.types';
import { cn } from '@/lib/utils';

const sessionTypeLabels: Record<AISessionType, string> = {
  CAMPAIGN_BUILDER: 'Campaign Builder',
  CONTENT_IDEAS: 'Content Ideas',
  PRICING_ADVICE: 'Pricing Advice',
  CREATOR_MATCH: 'Creator Match',
  GENERAL: 'General',
};

const sessionTypeIcons: Record<AISessionType, React.ReactNode> = {
  CAMPAIGN_BUILDER: <Sparkles className="h-4 w-4" />,
  CONTENT_IDEAS: <Lightbulb className="h-4 w-4" />,
  PRICING_ADVICE: <DollarSign className="h-4 w-4" />,
  CREATOR_MATCH: <Users className="h-4 w-4" />,
  GENERAL: <MessageSquare className="h-4 w-4" />,
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export default function AIAssistantPage() {
  const [sessions, setSessions] = useState<AISession[]>([]);
  const [activeSession, setActiveSession] = useState<AISession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSessionType, setNewSessionType] = useState<AISessionType>('CAMPAIGN_BUILDER');
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // Tool states
  const [activeTool, setActiveTool] = useState<'chat' | 'content' | 'pricing' | 'match'>('chat');
  const [contentForm, setContentForm] = useState({ platform: 'INSTAGRAM', niche: '', audience: '', campaignObjective: '' });
  const [contentResults, setContentResults] = useState<any[]>([]);
  const [pricingForm, setPricingForm] = useState({ platform: 'INSTAGRAM', contentType: 'VIDEO', followers: '', averageEngagement: '', niche: '' });
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [matchForm, setMatchForm] = useState({ campaignObjective: '', targetAudience: '', platforms: 'INSTAGRAM', contentType: 'VIDEO', budgetMin: '', budgetMax: '', limit: '5' });
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [toolLoading, setToolLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiAssistantService.listSessions(1, 50);
      setSessions(res.items || []);
    } catch {
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const session = await aiAssistantService.createSession({ type: newSessionType, title: newSessionTitle });
      setSessions(prev => [session, ...prev]);
      setActiveSession(session);
      setMessages([]);
      setShowNewSession(false);
      setNewSessionTitle('');
    } catch {
      setError('Failed to create session.');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectSession = (session: AISession) => {
    setActiveSession(session);
    setMessages([]);
    setActiveTool('chat');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeSession) return;
    setSending(true);
    const userMsg = newMessage;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setNewMessage('');
    try {
      const res: ChatResponse = await aiAssistantService.chat({
        sessionId: activeSession.id,
        message: userMsg,
      });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.reply,
        suggestions: res.suggestions,
      }]);
    } catch {
      setError('Failed to get AI response.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await aiAssistantService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSession?.id === id) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch {
      setError('Failed to delete session.');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  const handleContentSuggestions = async () => {
    setToolLoading(true);
    setError(null);
    try {
      const res = await aiAssistantService.contentSuggestions({
        platform: contentForm.platform,
        niche: contentForm.niche,
        audience: contentForm.audience,
        campaignObjective: contentForm.campaignObjective,
      });
      setContentResults(res.suggestions || []);
    } catch {
      setError('Failed to get content suggestions.');
    } finally {
      setToolLoading(false);
    }
  };

  const handlePricingAdvice = async () => {
    setToolLoading(true);
    setError(null);
    try {
      const res = await aiAssistantService.pricingAdvice({
        platform: pricingForm.platform,
        contentType: pricingForm.contentType,
        followers: Number(pricingForm.followers) || 0,
        averageEngagement: Number(pricingForm.averageEngagement) || 0,
        niche: pricingForm.niche,
      });
      setPricingResult(res);
    } catch {
      setError('Failed to get pricing advice.');
    } finally {
      setToolLoading(false);
    }
  };

  const handleCreatorMatch = async () => {
    setToolLoading(true);
    setError(null);
    try {
      const res = await aiAssistantService.creatorMatch({
        campaignObjective: matchForm.campaignObjective,
        targetAudience: matchForm.targetAudience,
        platforms: matchForm.platforms.split(',').map(s => s.trim()),
        contentType: matchForm.contentType.split(',').map(s => s.trim()),
        budgetMin: Number(matchForm.budgetMin) || 0,
        budgetMax: Number(matchForm.budgetMax) || 0,
        limit: Number(matchForm.limit) || 5,
      });
      setMatchResults(res.matches || []);
    } catch {
      setError('Failed to get creator matches.');
    } finally {
      setToolLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading AI assistant...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {/* Sessions Sidebar */}
      <div className={cn('w-full md:w-72 border-r flex flex-col', activeSession && 'hidden md:flex')}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-blue" /> AI Assistant
            </h1>
          </div>
          <Button className="w-full" onClick={() => setShowNewSession(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New Session
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No sessions yet.</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className={cn(
                  'group p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                  activeSession?.id === session.id && 'bg-muted'
                )}
                onClick={() => handleSelectSession(session)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="p-1.5 rounded-lg bg-brand-blue/10 text-brand-blue flex-shrink-0">
                      {sessionTypeIcons[session.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">{sessionTypeLabels[session.type]}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className={cn('flex-1 flex flex-col', !activeSession && 'hidden md:flex')}>
        {activeSession ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue">
                {sessionTypeIcons[activeSession.type]}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activeSession.title}</p>
                <p className="text-xs text-muted-foreground">{sessionTypeLabels[activeSession.type]}</p>
              </div>
            </div>

            {/* Tool Tabs */}
            <div className="flex gap-1 p-2 border-b bg-muted/30">
              {[
                { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-3.5 w-3.5" /> },
                { id: 'content', label: 'Content Ideas', icon: <Lightbulb className="h-3.5 w-3.5" /> },
                { id: 'pricing', label: 'Pricing', icon: <DollarSign className="h-3.5 w-3.5" /> },
                { id: 'match', label: 'Creator Match', icon: <Users className="h-3.5 w-3.5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTool(tab.id as any)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    activeTool === tab.id ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Chat */}
            {activeTool === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>Start a conversation with the AI assistant!</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-muted text-foreground'
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.suggestions.map((s, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleSuggestionClick(s)}
                                  className={cn(
                                    'text-xs px-2 py-1 rounded-full border',
                                    msg.role === 'user'
                                      ? 'border-white/30 text-white/90 hover:bg-white/10'
                                      : 'border-border text-muted-foreground hover:bg-muted'
                                  )}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t">
                  {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask anything..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      disabled={sending}
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Content Suggestions Tool */}
            {activeTool === 'content' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Card>
                  <CardHeader><CardTitle>Content Suggestions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={contentForm.platform}
                        onChange={e => setContentForm({ ...contentForm, platform: e.target.value })}
                        className="px-3 py-2 border border-input bg-background rounded-lg text-sm"
                      >
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="YOUTUBE">YouTube</option>
                        <option value="X">X (Twitter)</option>
                      </select>
                      <Input placeholder="Niche (e.g. fashion)" value={contentForm.niche} onChange={e => setContentForm({ ...contentForm, niche: e.target.value })} />
                    </div>
                    <Input placeholder="Audience (e.g. Gen Z women in Kenya)" value={contentForm.audience} onChange={e => setContentForm({ ...contentForm, audience: e.target.value })} />
                    <Input placeholder="Campaign objective" value={contentForm.campaignObjective} onChange={e => setContentForm({ ...contentForm, campaignObjective: e.target.value })} />
                    <Button onClick={handleContentSuggestions} disabled={toolLoading} leftIcon={toolLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}>
                      Get Suggestions
                    </Button>
                  </CardContent>
                </Card>
                {contentResults.length > 0 && (
                  <div className="space-y-2">
                    {contentResults.map((s, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium text-sm">{s.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            <span>Format: {s.format}</span>
                            <span>Hook: {s.hook}</span>
                            <span>CTA: {s.cta}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pricing Advice Tool */}
            {activeTool === 'pricing' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Card>
                  <CardHeader><CardTitle>Pricing Advice</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={pricingForm.platform}
                        onChange={e => setPricingForm({ ...pricingForm, platform: e.target.value })}
                        className="px-3 py-2 border border-input bg-background rounded-lg text-sm"
                      >
                        <option value="INSTAGRAM">Instagram</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="YOUTUBE">YouTube</option>
                      </select>
                      <select
                        value={pricingForm.contentType}
                        onChange={e => setPricingForm({ ...pricingForm, contentType: e.target.value })}
                        className="px-3 py-2 border border-input bg-background rounded-lg text-sm"
                      >
                        <option value="VIDEO">Video</option>
                        <option value="IMAGE">Image</option>
                        <option value="STORY">Story</option>
                        <option value="REEL">Reel</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="number" placeholder="Followers" value={pricingForm.followers} onChange={e => setPricingForm({ ...pricingForm, followers: e.target.value })} />
                      <Input type="number" placeholder="Avg engagement %" value={pricingForm.averageEngagement} onChange={e => setPricingForm({ ...pricingForm, averageEngagement: e.target.value })} />
                    </div>
                    <Input placeholder="Niche" value={pricingForm.niche} onChange={e => setPricingForm({ ...pricingForm, niche: e.target.value })} />
                    <Button onClick={handlePricingAdvice} disabled={toolLoading} leftIcon={toolLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}>
                      Get Pricing Advice
                    </Button>
                  </CardContent>
                </Card>
                {pricingResult && (
                  <Card>
                    <CardContent className="pt-4 space-y-3">
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-green-600">
                          {new Intl.NumberFormat('en-KE', { style: 'currency', currency: pricingResult.currency || 'KES' }).format(pricingResult.suggestedPrice)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Suggested Price</p>
                        <p className="text-xs text-muted-foreground">
                          Range: {pricingResult.priceRange?.min} – {pricingResult.priceRange?.max}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{pricingResult.reasoning}</p>
                      </div>
                      {pricingResult.tips && pricingResult.tips.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Tips:</p>
                          <ul className="space-y-1">
                            {pricingResult.tips.map((tip: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-green-500">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Creator Match Tool */}
            {activeTool === 'match' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Card>
                  <CardHeader><CardTitle>Creator Match</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Input placeholder="Campaign objective" value={matchForm.campaignObjective} onChange={e => setMatchForm({ ...matchForm, campaignObjective: e.target.value })} />
                    <Input placeholder="Target audience" value={matchForm.targetAudience} onChange={e => setMatchForm({ ...matchForm, targetAudience: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Platforms (comma-separated)" value={matchForm.platforms} onChange={e => setMatchForm({ ...matchForm, platforms: e.target.value })} />
                      <Input placeholder="Content types (comma-separated)" value={matchForm.contentType} onChange={e => setMatchForm({ ...matchForm, contentType: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Input type="number" placeholder="Budget min" value={matchForm.budgetMin} onChange={e => setMatchForm({ ...matchForm, budgetMin: e.target.value })} />
                      <Input type="number" placeholder="Budget max" value={matchForm.budgetMax} onChange={e => setMatchForm({ ...matchForm, budgetMax: e.target.value })} />
                      <Input type="number" placeholder="Limit" value={matchForm.limit} onChange={e => setMatchForm({ ...matchForm, limit: e.target.value })} />
                    </div>
                    <Button onClick={handleCreatorMatch} disabled={toolLoading} leftIcon={toolLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}>
                      Find Creators
                    </Button>
                  </CardContent>
                </Card>
                {matchResults.length > 0 && (
                  <div className="space-y-2">
                    {matchResults.map((m, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                              <Users className="h-5 w-5 text-brand-blue" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{m.name}</p>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {m.matchScore}% match
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{m.reason}</p>
                              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                <span>{m.followers?.toLocaleString()} followers</span>
                                <span>★ {m.averageRating}</span>
                                <span>{m.platforms?.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Select a session or create a new one to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewSession(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New AI Session</CardTitle>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowNewSession(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Type</label>
                <select
                  value={newSessionType}
                  onChange={e => setNewSessionType(e.target.value as AISessionType)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                >
                  {Object.entries(sessionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newSessionTitle}
                  onChange={e => setNewSessionTitle(e.target.value)}
                  placeholder="e.g. Summer Campaign 2026"
                  onKeyDown={e => { if (e.key === 'Enter') handleCreateSession(); }}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowNewSession(false)}>Cancel</Button>
                <Button
                  onClick={handleCreateSession}
                  disabled={creating || !newSessionTitle.trim()}
                  leftIcon={creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                >
                  {creating ? 'Creating...' : 'Create Session'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
