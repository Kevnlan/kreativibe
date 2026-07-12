'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, ShieldCheck, Loader2, Eye, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge, EmptyState } from '@/components/ui';
import { licenseService } from '@/services/license.service';
import { License } from '@/types/api-contracts/license.types';
import { formatCurrency } from '@/lib/utils';

export default function BrandLicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string } | null>(null);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await licenseService.listLicenses({ limit: 50 });
      setLicenses(response.items || []);
    } catch {
      setError('Failed to load licenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (contentId: string) => {
    setActionLoading(contentId);
    try {
      const result = await licenseService.downloadContent(contentId);
      window.open(result.downloadUrl, '_blank');
    } catch {
      setError('Failed to get download link.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerify = async (contentId: string) => {
    setActionLoading(contentId);
    setVerifyResult(null);
    try {
      const result = await licenseService.verifyLicense(contentId);
      setVerifyResult({
        valid: result.valid,
        message: result.valid ? 'License is valid and active.' : 'License is not valid.',
      });
    } catch {
      setVerifyResult({ valid: false, message: 'Failed to verify license.' });
    } finally {
      setActionLoading(null);
    }
  };

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
        <h1 className="text-2xl font-bold">Licenses</h1>
        <p className="text-muted-foreground">Your purchased content licenses and download links</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {licenses.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No licenses yet"
          description="Licenses are issued automatically when your offer is accepted by a creator."
        />
      ) : (
        <div className="space-y-3">
          {licenses.map((license) => (
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
                          by {license.content.creatorProfile.bio ?? 'Unknown creator'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(license.contentId)}
                      disabled={actionLoading === license.contentId}
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      {actionLoading === license.contentId ? 'Loading...' : 'Download'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(license.contentId)}
                      disabled={actionLoading === license.contentId}
                      leftIcon={<ShieldCheck className="h-4 w-4" />}
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {verifyResult && actionLoading === null && selectedLicense?.id === license.id && (
                  <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
                    verifyResult.valid
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {verifyResult.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-red-600" />
                    )}
                    {verifyResult.message}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
