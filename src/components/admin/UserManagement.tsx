'use client';

import { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Shield, Ban, CheckCircle, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'brand' | 'creative' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  lastActive?: string;
  campaigns?: number;
}

interface UserManagementProps {
  users: UserAccount[];
  onSuspend?: (userId: string) => void;
  onActivate?: (userId: string) => void;
  onRoleChange?: (userId: string, role: string) => void;
  onViewDetails?: (userId: string) => void;
}

const roleColors = {
  admin: 'text-red-600 dark:text-red-400',
  brand: 'text-blue-600 dark:text-blue-400',
  creative: 'text-purple-600 dark:text-purple-400',
  moderator: 'text-orange-600 dark:text-orange-400',
} as const;

const statusColors = {
  active: 'success',
  suspended: 'destructive',
  pending: 'warning',
} as const;

const statusIcons = {
  active: CheckCircle,
  suspended: Ban,
  pending: Clock,
} as const;

export function UserManagement({ users, onSuspend, onActivate, onRoleChange, onViewDetails }: UserManagementProps) {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            <CardTitle className="text-lg">User Management</CardTitle>
          </div>
          <Badge variant="outline">{users.length} users</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="brand">Brand</option>
              <option value="creative">Creative</option>
              <option value="moderator">Moderator</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const StatusIcon = statusIcons[user.status];
            const isExpanded = expandedUser === user.id;

            return (
              <div
                key={user.id}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpand(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant="outline" className={cn("text-xs capitalize", roleColors[user.role])}>
                            {user.role}
                          </Badge>
                          <Badge variant={statusColors[user.status] as any} className="text-xs capitalize">
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                          {user.lastActive && (
                            <>
                              <span>•</span>
                              <span>Last active {new Date(user.lastActive).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails?.(user.id);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t space-y-3">
                    {user.campaigns !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Campaigns:</span>
                        <span>{user.campaigns}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {user.status === 'active' && onSuspend && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onSuspend(user.id)}
                          leftIcon={<Ban className="h-4 w-4" />}
                        >
                          Suspend
                        </Button>
                      )}
                      {user.status === 'suspended' && onActivate && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => onActivate(user.id)}
                          leftIcon={<CheckCircle className="h-4 w-4" />}
                        >
                          Activate
                        </Button>
                      )}
                      {onRoleChange && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRoleChange(user.id, 'admin')}
                          leftIcon={<Shield className="h-4 w-4" />}
                        >
                          Change Role
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
