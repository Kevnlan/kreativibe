'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, ArrowLeft, CheckCircle, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface ContentOptimization {
  contentType?: string;
  niche?: string;
  platforms?: string[];
  currentFollowers?: number;
  engagementRate?: number;
  pricingStrategy?: string;
  targetAudience?: string;
  contentStyle?: string;
}

export default function ContentOptimizationPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! 👋 I'm your AI content advisor. I'll help you optimize your content strategy to attract more brands and increase your earnings. Let's start - what type of content do you primarily create?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [optimization, setOptimization] = useState<ContentOptimization>({});
  const [step, setStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, currentStep: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (currentStep) {
      case 1:
        return "Great choice! What's your main niche or industry? For example: Fashion, Beauty, Tech, Food, Fitness, Travel, Lifestyle, etc.";
      
      case 2:
        return "Perfect! Which platforms are you most active on? You can mention multiple:\n\n• Instagram (Reels, Posts, Stories)\n• TikTok (Short videos)\n• YouTube (Long-form content)\n• Facebook\n• Twitter/X\n\nJust list the ones you use regularly.";
      
      case 3:
        return "Awesome! How many followers do you currently have across your main platform? Just give me a rough number.";
      
      case 4:
        return "Nice! What's your average engagement rate? If you're not sure, just tell me:\n\n• High (5%+)\n• Medium (2-5%)\n• Low (under 2%)\n• Not sure";
      
      case 5:
        return "Got it! How do you currently price your content? For example:\n\n• Per post/video\n• Package deals\n• Based on follower count\n• Haven't set pricing yet";
      
      case 6:
        return "Understood! Who is your target audience? Describe them briefly - age range, interests, location, etc.";
      
      case 7:
        return "Last question! How would you describe your content style? For example: Authentic & relatable, Professional & polished, Fun & energetic, Educational, etc.";
      
      case 8:
        const followers = optimization.currentFollowers || 0;
        const engagementRate = optimization.engagementRate || 3;
        const suggestedPrice = Math.max(2000, Math.min(20000, Math.floor((followers / 1000) * 100 + (engagementRate * 500))));
        const monthlyEarnings = suggestedPrice * 4;
        
        return `Excellent! 🎉 Based on your profile, here's my optimization strategy:\n\n**Your Profile:**\n• Content Type: ${optimization.contentType}\n• Niche: ${optimization.niche}\n• Platforms: ${optimization.platforms?.join(', ')}\n• Followers: ${followers.toLocaleString()}\n• Engagement: ${engagementRate}%\n• Style: ${optimization.contentStyle}\n\n**My Recommendations:**\n\n💰 **Pricing Strategy:**\n• Suggested price per post: KES ${suggestedPrice.toLocaleString()}\n• Package deal (3 posts): KES ${(suggestedPrice * 2.5).toLocaleString()}\n• Potential monthly earnings: KES ${monthlyEarnings.toLocaleString()}+\n\n📈 **Growth Tips:**\n• Post consistently (3-5 times/week)\n• Use trending audio/hashtags in your niche\n• Engage with your audience within 1 hour of posting\n• Collaborate with creators in ${optimization.niche}\n\n🎯 **Content Strategy:**\n• Create ${optimization.contentType?.toLowerCase()} that showcases products naturally\n• Focus on ${optimization.targetAudience}\n• Maintain your ${optimization.contentStyle?.toLowerCase()} style\n• Add clear CTAs for brand partnerships\n\n🏢 **Attract Brands:**\n• Update your bio with "Open for collaborations"\n• Create a media kit with your stats\n• Tag brands you genuinely use\n• Share case studies of past collaborations\n\n**Next Steps:**\n1. Update your pricing based on these recommendations\n2. Upload 3-5 of your best content pieces\n3. Complete your creator profile with portfolio\n4. Start applying to brand campaigns\n\nReady to implement these strategies?`;
      
      default:
        return "I'm here to help optimize your content strategy!";
    }
  };

  const extractOptimizationData = (userMessage: string, currentStep: number) => {
    const updated = { ...optimization };

    switch (currentStep) {
      case 1:
        updated.contentType = userMessage;
        break;
      case 2:
        updated.niche = userMessage;
        break;
      case 3:
        const platforms = [];
        if (/instagram/i.test(userMessage)) platforms.push('Instagram');
        if (/tiktok/i.test(userMessage)) platforms.push('TikTok');
        if (/youtube/i.test(userMessage)) platforms.push('YouTube');
        if (/facebook/i.test(userMessage)) platforms.push('Facebook');
        if (/twitter|x/i.test(userMessage)) platforms.push('Twitter/X');
        updated.platforms = platforms.length > 0 ? platforms : ['Instagram'];
        break;
      case 4:
        const followersMatch = userMessage.match(/\d+/);
        if (followersMatch) {
          let followers = parseInt(followersMatch[0]);
          if (/k/i.test(userMessage)) followers *= 1000;
          if (/m/i.test(userMessage)) followers *= 1000000;
          updated.currentFollowers = followers;
        } else {
          updated.currentFollowers = 10000;
        }
        break;
      case 5:
        if (/high/i.test(userMessage) || /5|6|7|8|9|10/i.test(userMessage)) {
          updated.engagementRate = 6;
        } else if (/medium/i.test(userMessage) || /2|3|4/i.test(userMessage)) {
          updated.engagementRate = 3;
        } else if (/low/i.test(userMessage) || /1/i.test(userMessage)) {
          updated.engagementRate = 1.5;
        } else {
          updated.engagementRate = 3;
        }
        break;
      case 6:
        updated.pricingStrategy = userMessage;
        break;
      case 7:
        updated.targetAudience = userMessage;
        break;
      case 8:
        updated.contentStyle = userMessage;
        break;
    }

    setOptimization(updated);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    extractOptimizationData(input.trim(), step);

    const aiResponse = await generateAIResponse(input.trim(), step);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
    setStep(prev => prev + 1);
  };

  const handleImplement = () => {
    alert('Great! Your optimization strategy has been saved. Redirecting to upload content...');
    router.push('/dashboard/creative/content/new');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-600" />
                AI Content Advisor
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {Math.min(step, 8)} of 8 • Optimize your content strategy
              </p>
            </div>
          </div>
          {step > 8 && (
            <Button onClick={handleImplement} className="bg-orange-600 hover:bg-orange-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Implement Strategy
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-orange-50/30 to-white p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white border border-border shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-semibold text-orange-600">AI Advisor</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-border shadow-sm rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is analyzing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Tip: Be honest about your stats for accurate recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
