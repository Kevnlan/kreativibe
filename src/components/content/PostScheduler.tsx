'use client';

import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Edit, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ScheduledPost {
  id: string;
  title: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  content: string;
  media?: string[];
  campaignId?: string;
}

interface PostSchedulerProps {
  posts: ScheduledPost[];
  onAddPost?: (post: Omit<ScheduledPost, 'id'>) => void;
  onEditPost?: (id: string, post: Partial<ScheduledPost>) => void;
  onDeletePost?: (id: string) => void;
  onPublishNow?: (id: string) => void;
}

const platformColors = {
  instagram: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
  tiktok: 'bg-black/10 text-black dark:text-white',
  youtube: 'bg-red-500/10 text-red-700 dark:text-red-400',
  twitter: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  facebook: 'bg-blue-600/10 text-blue-800 dark:text-blue-300',
} as const;

const statusColors = {
  scheduled: 'warning',
  published: 'success',
  failed: 'destructive',
} as const;

export function PostScheduler({ posts, onAddPost, onEditPost, onDeletePost, onPublishNow }: PostSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border/50 bg-muted/30" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayPosts = getPostsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          onClick={() => selectDate(date)}
          className={cn(
            "h-24 border border-border/50 p-2 cursor-pointer transition-all hover:border-brand-blue/50",
            isToday && "bg-brand-blue/5 border-brand-blue/50"
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={cn("text-sm font-medium", isToday && "text-brand-blue")}>{day}</span>
            <div className="flex gap-1">
              {dayPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    platformColors[post.platform]
                  )}
                  title={post.title}
                />
              ))}
              {dayPosts.length > 3 && (
                <span className="text-xs text-muted-foreground">+{dayPosts.length - 3}</span>
              )}
            </div>
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="text-xs truncate text-muted-foreground"
                title={post.title}
              >
                {post.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Post Scheduler</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            />
            <span className="font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            />
            <Button
              variant="brand"
              size="sm"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Schedule Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Platforms:</span>
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded-full", color)} />
              <span className="text-xs capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
