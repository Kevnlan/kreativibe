'use client';

import { useState } from 'react';
import { Calendar, Clock, Play, Pause, Trash2, Plus, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused';
  recipients: string[];
  format: 'pdf' | 'csv' | 'excel';
}

interface ReportScheduleProps {
  schedules: ScheduledReport[];
  onAdd?: () => void;
  onEdit?: (scheduleId: string) => void;
  onDelete?: (scheduleId: string) => void;
  onToggleStatus?: (scheduleId: string) => void;
}

const frequencyColors = {
  daily: 'text-blue-600 dark:text-blue-400',
  weekly: 'text-purple-600 dark:text-purple-400',
  monthly: 'text-green-600 dark:text-green-400',
} as const;

const statusColors = {
  active: 'success',
  paused: 'warning',
} as const;

export function ReportSchedule({ schedules, onAdd, onEdit, onDelete, onToggleStatus }: ReportScheduleProps) {
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);

  const toggleExpand = (scheduleId: string) => {
    setExpandedSchedule(expandedSchedule === scheduleId ? null : scheduleId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">Scheduled Reports</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{schedules.length} schedules</Badge>
            {onAdd && (
              <Button variant="outline" size="sm" onClick={onAdd} leftIcon={<Plus className="h-4 w-4" />}>
                Add Schedule
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const isExpanded = expandedSchedule === schedule.id;

            return (
              <div
                key={schedule.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(schedule.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        schedule.status === 'active' ? "bg-success" : "bg-muted"
                      )}>
                        <Calendar className={cn("h-5 w-5", schedule.status === 'active' ? "text-white" : "text-muted-foreground")} />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{schedule.name}</h4>
                          <Badge variant={statusColors[schedule.status] as any} className="text-xs">
                            {schedule.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn("text-xs capitalize", frequencyColors[schedule.frequency])}
                          >
                            {schedule.frequency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Next run: {new Date(schedule.nextRun).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStatus?.(schedule.id);
                        }}
                      >
                        {schedule.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(schedule.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(schedule.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {isExpanded ? <Clock className="h-4 w-4 text-muted-foreground rotate-180" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    {/* Last Run */}
                    {schedule.lastRun && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last run:</span>
                        <span>{new Date(schedule.lastRun).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Format */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format:</span>
                      <Badge variant="outline" className="text-xs uppercase">{schedule.format}</Badge>
                    </div>

                    {/* Recipients */}
                    <div>
                      <span className="text-sm text-muted-foreground mb-1 block">Recipients:</span>
                      <div className="flex flex-wrap gap-1">
                        {schedule.recipients.slice(0, 3).map((email, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {email}
                          </Badge>
                        ))}
                        {schedule.recipients.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{schedule.recipients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No scheduled reports</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
