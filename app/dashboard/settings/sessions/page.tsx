'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Tablet, MapPin, Clock, LogOut } from 'lucide-react';
import { Button, Card, CardContent, StatusBadge, ConfirmDialog } from '@/components/ui';

interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      setSessions([
        {
          id: '1',
          deviceType: 'desktop',
          deviceName: 'Windows PC',
          browser: 'Chrome 120',
          location: 'Nairobi, Kenya',
          ipAddress: '197.232.61.45',
          lastActive: 'Active now',
          isCurrent: true,
        },
        {
          id: '2',
          deviceType: 'mobile',
          deviceName: 'iPhone 14',
          browser: 'Safari',
          location: 'Nairobi, Kenya',
          ipAddress: '197.232.61.46',
          lastActive: '2 hours ago',
          isCurrent: false,
        },
        {
          id: '3',
          deviceType: 'tablet',
          deviceName: 'iPad Pro',
          browser: 'Safari',
          location: 'Mombasa, Kenya',
          ipAddress: '197.232.62.12',
          lastActive: '1 day ago',
          isCurrent: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (type: Session['deviceType']) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessionToLogout(sessionId);
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    if (!sessionToLogout) return;

    try {
      // Mock API call - replace with actual logout
      await new Promise(resolve => setTimeout(resolve, 500));
      setSessions(sessions.filter(s => s.id !== sessionToLogout));
      setShowLogoutDialog(false);
      setSessionToLogout(null);
    } catch (error) {
      console.error('Failed to logout session:', error);
    }
  };

  const handleLogoutAllOthers = async () => {
    try {
      // Mock API call - replace with actual logout all
      await new Promise(resolve => setTimeout(resolve, 500));
      setSessions(sessions.filter(s => s.isCurrent));
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Active Sessions</h1>
          <p className="text-muted-foreground mt-2">
            Manage devices where you're currently signed in
          </p>
        </div>
        {sessions.filter(s => !s.isCurrent).length > 0 && (
          <Button
            variant="outline"
            onClick={handleLogoutAllOthers}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout All Other Sessions
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{session.deviceName}</h3>
                        {session.isCurrent && (
                          <StatusBadge variant="success" size="sm">
                            Current
                          </StatusBadge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-3 w-3" />
                          <span>{session.browser}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{session.location}</span>
                          <span className="text-xs">({session.ipAddress})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogoutSession(session.id)}
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Logout
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Security Tip</h3>
              <p className="text-sm text-muted-foreground">
                If you see a session you don't recognize, logout immediately and change your password. 
                Consider enabling two-factor authentication for additional security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Logout Session"
        description="Are you sure you want to logout this session? You will need to sign in again on that device."
        confirmLabel="Logout"
        variant="warning"
      />
    </div>
  );
}
