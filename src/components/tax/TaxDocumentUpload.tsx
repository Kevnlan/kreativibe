'use client';

import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

interface TaxDocumentUploadProps {
  onUpload?: (file: File) => Promise<void>;
  onRemove?: (docId: string) => void;
}

export function TaxDocumentUpload({ onUpload, onRemove }: TaxDocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      await onUpload?.(file);
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type || 'application/pdf',
        size: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
      };
      setUploadedDocs([...uploadedDocs, newDoc]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (docId: string) => {
    setUploadedDocs(uploadedDocs.filter(d => d.id !== docId));
    onRemove?.(docId);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-blue" />
          <CardTitle className="text-lg">Tax Documents</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all",
            isDragging ? "border-brand-blue bg-brand-blue/5" : "border-border"
          )}
        >
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="tax-doc-upload"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="tax-doc-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your tax documents here, or
            </p>
            <Button variant="outline" size="sm" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Browse Files'}
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            Accepted formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>

        {/* Uploaded Documents */}
        {uploadedDocs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents</h4>
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatSize(doc.size)}</span>
                    <span>•</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge
                  variant={doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'destructive' : 'warning'}
                  className="text-xs"
                >
                  {doc.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-brand-blue/10 rounded-lg">
          <CheckCircle className="h-5 w-5 text-brand-blue mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-blue">
            All uploaded documents are securely encrypted and stored. Documents will be verified within 1-2 business days.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
