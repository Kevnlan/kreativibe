'use client';

import { useState, useEffect } from 'react';
import { FileText, Ban, Loader2, Search, AlertTriangle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { licenseService } from '@/services/license.service';
import { License } from '@/types/api-contracts/license.types';
import { formatCurrency } from '@/lib/utils';

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState<License | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await licenseService.listAllLicenses({ limit: 100 });
      setLicenses(response.items || []);
    } catch {
      setError('Failed to load licenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!showRevokeModal || !revokeReason.trim()) return;
    setActionLoading(showRevokeModal.id);
    try {
      await licenseService.revokeLicense({
        contentId: showRevokeModal.contentId,
        reason: revokeReason,
      });
      setShowRevokeModal(null);
      setRevokeReason('');
      await loadLicenses();
    } catch {
      setError('Failed to revoke license.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLicenses = licenses.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.content?.title?.toLowerCase().includes(q) ||
      l.brandUserId.toLowerCase().includes(q) ||
      l.contentId.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading licenses...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">License Management</h1>
        <p className="text-muted-foreground">View and manage all issued content licenses</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by content title, brand ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {filteredLicenses.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No licenses found"
          description="No licenses have been issued yet."
        />
      ) : (
        <div className="space-y-3">
          {filteredLicenses.map((license) => (
            <Card key={license.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {license.content?.thumbnailUrl ? (
                      <img
                        src={license.content.thumbnailUrl}
                        alt={license.content.title}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{license.content?.title ?? 'Untitled Content'}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>Brand: {license.brandUserId.slice(0, 8)}...</span>
                        <span>·</span>
                        <span>Issued {new Date(license.issuedAt).toLocaleDateString()}</span>
                        {license.offer && (
                          <>
                            <span>·</span>
                            <span>{formatCurrency(license.offer.currentAmount, license.offer.currency)}</span>
                          </>
                        )}
                      </div>
                      {license.content?.creatorProfile && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Creator: {license.content.creatorProfile.bio ?? 'Unknown'}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRevokeModal(license);
                      setRevokeReason('');
                    }}
                    disabled={actionLoading === license.id}
                    leftIcon={<Ban className="h-4 w-4" />}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle>Revoke License</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are about to revoke the license for <strong>{showRevokeModal.content?.title ?? 'this content'}</strong>.
                This action cannot be undone.
              </p>
              <div>
                <label className="text-sm font-medium">Reason for revocation</label>
                <textarea
                  value={revokeReason}
                  onChange={e => setRevokeReason(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                  rows={3}
                  placeholder="Explain why this license is being revoked..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRevokeModal(null);
                    setRevokeReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRevoke}
                  disabled={!revokeReason.trim() || actionLoading === showRevokeModal.id}
                  leftIcon={<Ban className="h-4 w-4" />}
                >
                  {actionLoading === showRevokeModal.id ? 'Revoking...' : 'Revoke License'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
