'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface CampaignData {
  name?: string;
  objective?: string;
  audience?: string;
  budget?: number;
  platforms?: string[];
  contentTypes?: string[];
  duration?: string;
  messaging?: string;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! 👋 I'm your AI campaign assistant. I'll help you create a tailored content campaign. Let's start with the basics - what's the main goal of this campaign?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({});
  const [step, setStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, currentStep: number): Promise<string> => {
    // Mock AI responses based on conversation flow
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (currentStep) {
      case 1:
        // After objective
        return "Great! Now, who is your target audience? For example: 'Young professionals in Nairobi aged 25-35' or 'Fitness enthusiasts across Kenya'.";
      
      case 2:
        // After audience
        return "Perfect! What's your estimated budget for this campaign in KES? This will help me recommend the right content packages and number of creators.";
      
      case 3:
        // After budget
        return "Excellent! Which platforms do you want to focus on? You can choose multiple:\n\n• Instagram (Reels, Posts, Stories)\n• TikTok (Short videos)\n• YouTube (Long-form videos)\n• Facebook (Posts, Videos)\n• Radio (Audio ads)\n• Print (Designs, posters)\n\nJust list the platforms you're interested in.";
      
      case 4:
        // After platforms
        return "Awesome! What type of content would work best for your campaign? For example:\n\n• Product reviews/unboxing\n• Lifestyle integration\n• Tutorial/How-to content\n• Behind-the-scenes\n• User testimonials\n• Brand storytelling\n\nTell me what resonates with your brand.";
      
      case 5:
        // After content type
        return "How long should this campaign run? For example: '2 weeks', '1 month', '3 months', or specific dates.";
      
      case 6:
        // After duration
        return "Last question! What's the key message or tone you want to convey? For example: 'Fun and energetic', 'Professional and trustworthy', 'Authentic and relatable'.";
      
      case 7:
        // Generate campaign summary
        const budget = campaignData.budget || 0;
        const suggestedCreators = Math.ceil(budget / 5000);
        const suggestedContent = Math.ceil(budget / 3500);
        
        return `Perfect! 🎉 Based on our conversation, here's your campaign brief:\n\n**Campaign Overview:**\n• Objective: ${campaignData.objective}\n• Target Audience: ${campaignData.audience}\n• Budget: KES ${budget.toLocaleString()}\n• Platforms: ${campaignData.platforms?.join(', ')}\n• Duration: ${campaignData.duration}\n• Messaging: ${campaignData.messaging}\n\n**My Recommendations:**\n• Engage ${suggestedCreators}-${suggestedCreators + 2} creators\n• Commission ${suggestedContent}-${suggestedContent + 3} pieces of content\n• Mix of ${campaignData.contentTypes?.join(' and ')}\n• Estimated reach: ${(suggestedCreators * 50000).toLocaleString()}+ people\n\nReady to create this campaign and invite creators?`;
      
      default:
        return "I'm here to help! Please share more details about your campaign.";
    }
  };

  const extractCampaignData = (userMessage: string, currentStep: number) => {
    const updated = { ...campaignData };

    switch (currentStep) {
      case 1:
        updated.objective = userMessage;
        updated.name = userMessage.slice(0, 50);
        break;
      case 2:
        updated.audience = userMessage;
        break;
      case 3:
        const budgetMatch = userMessage.match(/\d+/);
        if (budgetMatch) {
          updated.budget = parseInt(budgetMatch[0]);
        }
        break;
      case 4:
        const platforms = [];
        if (/instagram/i.test(userMessage)) platforms.push('Instagram');
        if (/tiktok/i.test(userMessage)) platforms.push('TikTok');
        if (/youtube/i.test(userMessage)) platforms.push('YouTube');
        if (/facebook/i.test(userMessage)) platforms.push('Facebook');
        if (/radio/i.test(userMessage)) platforms.push('Radio');
        if (/print/i.test(userMessage)) platforms.push('Print');
        updated.platforms = platforms.length > 0 ? platforms : ['Instagram'];
        break;
      case 5:
        const contentTypes = [];
        if (/review|unbox/i.test(userMessage)) contentTypes.push('Product Reviews');
        if (/lifestyle|integration/i.test(userMessage)) contentTypes.push('Lifestyle Content');
        if (/tutorial|how-?to/i.test(userMessage)) contentTypes.push('Tutorials');
        if (/behind/i.test(userMessage)) contentTypes.push('Behind-the-Scenes');
        if (/testimonial/i.test(userMessage)) contentTypes.push('Testimonials');
        if (/story/i.test(userMessage)) contentTypes.push('Brand Stories');
        updated.contentTypes = contentTypes.length > 0 ? contentTypes : ['Lifestyle Content'];
        break;
      case 6:
        updated.duration = userMessage;
        break;
      case 7:
        updated.messaging = userMessage;
        break;
    }

    setCampaignData(updated);
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

    // Extract data from user message
    extractCampaignData(input.trim(), step);

    // Generate AI response
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

  const handleCreateCampaign = () => {
    // In real implementation, this would save to backend
    alert('Campaign created successfully! Redirecting to campaign details...');
    router.push('/dashboard/brand/campaigns');
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
                <Sparkles className="h-6 w-6 text-purple-600" />
                AI Campaign Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {Math.min(step, 7)} of 7 • Powered by conversational AI
              </p>
            </div>
          </div>
          {step > 7 && (
            <Button onClick={handleCreateCampaign} className="bg-purple-600 hover:bg-purple-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-purple-50/30 to-white p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-brand-blue text-white'
                    : 'bg-white border border-border shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
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
                  <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
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
              className="flex-1 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Tip: Be specific about your goals, audience, and budget for better recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
