'use client';

import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface BrandAssetUploaderProps {
  onAssetsSelect: (files: File[], previews: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes per file
  acceptedFormats?: string[];
  existingPreviews?: string[];
}

interface AssetFile {
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

export function BrandAssetUploader({
  onAssetsSelect,
  maxFiles = 20,
  maxSize = 20 * 1024 * 1024, // 20MB default per file
  acceptedFormats = [
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'application/pdf',
    'application/postscript', // .ai files
    'application/x-photoshop', // .psd files
  ],
  existingPreviews = [],
}: BrandAssetUploaderProps) {
  const [assets, setAssets] = useState<AssetFile[]>([]);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg', 'svg', 'pdf', 'ai', 'psd'];
    
    if (!validExtensions.includes(fileExt || '')) {
      return `Invalid file type. Accepted: ${validExtensions.join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB per file`;
    }
    return null;
  };

  const getFileType = (file: File): 'image' | 'document' => {
    return file.type.startsWith('image/') ? 'image' : 'document';
  };

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    setError('');
    const newAssets: AssetFile[] = [];
    const totalFiles = assets.length + fileList.length;

    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    let processedCount = 0;

    Array.from(fileList).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const fileType = getFileType(file);
      
      if (fileType === 'image') {
        // Create preview for images
        const reader = new FileReader();
        reader.onloadend = () => {
          newAssets.push({
            file,
            preview: reader.result as string,
            type: fileType,
          });
          processedCount++;
          
          if (processedCount === fileList.length) {
            updateAssets(newAssets);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // No preview for documents
        newAssets.push({
          file,
          type: fileType,
        });
        processedCount++;
        
        if (processedCount === fileList.length) {
          updateAssets(newAssets);
        }
      }
    });
  }, [assets, maxFiles]);

  const updateAssets = (newAssets: AssetFile[]) => {
    const updatedAssets = [...assets, ...newAssets];
    setAssets(updatedAssets);
    
    const files = updatedAssets.map(a => a.file);
    const previews = updatedAssets.map(a => a.preview || '');
    onAssetsSelect(files, previews);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeAsset = (index: number) => {
    const newAssets = assets.filter((_, i) => i !== index);
    setAssets(newAssets);
    
    const files = newAssets.map(a => a.file);
    const previews = newAssets.map(a => a.preview || '');
    onAssetsSelect(files, previews);
  };

  const getFileIcon = (asset: AssetFile) => {
    if (asset.type === 'image') {
      return <ImageIcon className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-purple-600" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-brand-blue bg-brand-blue/5'
            : 'border-border hover:border-brand-blue/50'
        }`}
      >
        <input
          type="file"
          id="asset-upload"
          multiple
          accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.psd"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <label htmlFor="asset-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop brand assets here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, SVG, PDF, AI, PSD up to {(maxSize / 1024 / 1024).toFixed(0)}MB each
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxFiles} files
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Assets List */}
      {assets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Uploaded Assets ({assets.length}/{maxFiles})</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                {/* Preview/Icon */}
                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {asset.preview ? (
                    <img
                      src={asset.preview}
                      alt={asset.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getFileIcon(asset)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(asset.file.size)}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {asset.file.name.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeAsset(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Clear All */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAssets([]);
                onAssetsSelect([], []);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Asset Categories */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm font-medium text-green-900 mb-2">Brand Asset Types</p>
        <ul className="text-xs text-green-800 space-y-1">
          <li>• <strong>Logos:</strong> PNG (transparent), SVG (vector)</li>
          <li>• <strong>Brand Guidelines:</strong> PDF documents</li>
          <li>• <strong>Design Files:</strong> AI, PSD source files</li>
          <li>• <strong>Graphics:</strong> JPG, PNG images</li>
        </ul>
      </div>
    </div>
  );
}
