'use client';

import { FileText, Download, Share2, Edit, Check, Calendar, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ProposalData } from './ProposalSubmission';

interface ProposalPreviewProps {
  proposal: ProposalData;
  campaignTitle: string;
  creativeName: string;
  creativeAvatar?: string;
  onEdit?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

export function ProposalPreview({
  proposal,
  campaignTitle,
  creativeName,
  creativeAvatar,
  onEdit,
  onDownload,
  onShare,
}: ProposalPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Proposal Preview</CardTitle>
              <p className="text-muted-foreground">{campaignTitle}</p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" onClick={onEdit} leftIcon={<Edit className="h-4 w-4" />}>
                  Edit
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" onClick={onDownload} leftIcon={<Download className="h-4 w-4" />}>
                  Download PDF
                </Button>
              )}
              {onShare && (
                <Button variant="outline" onClick={onShare} leftIcon={<Share2 className="h-4 w-4" />}>
                  Share
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Creative Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Creative Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {creativeAvatar ? (
              <img
                src={creativeAvatar}
                alt={creativeName}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center text-white text-xl font-semibold">
                {creativeName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{creativeName}</h3>
              <p className="text-sm text-muted-foreground">Content Creator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposal Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {proposal.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attachments */}
      {proposal.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {proposal.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing & Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <DollarSign className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Proposed Rate</p>
              <p className="text-2xl font-bold">
                {proposal.currency} {proposal.proposedRate.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-brand-blue" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="text-lg font-semibold">
                {new Date(proposal.estimatedDelivery).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {proposal.additionalNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {proposal.additionalNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="border-brand-blue/50 bg-brand-blue/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-brand-blue mb-1">Proposal Summary</h4>
              <p className="text-sm text-muted-foreground">
                This proposal includes {proposal.sections.length} sections, {proposal.attachments.length} attachment(s),
                and is priced at {proposal.currency} {proposal.proposedRate.toLocaleString()} with delivery by{' '}
                {new Date(proposal.estimatedDelivery).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
