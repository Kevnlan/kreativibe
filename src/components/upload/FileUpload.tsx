'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, Film, Music, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import { Card, CardContent } from '../ui';
import { Badge } from '../ui';
import { cn } from '../../lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
}

const FILE_ICONS = {
  image: <Image className="h-4 w-4" />,
  video: <Film className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  default: <File className="h-4 w-4" />,
};

const getFileType = (file: File): keyof typeof FILE_ICONS => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.includes('pdf') || file.type.includes('document')) return 'document';
  return 'default';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUpload({
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  onFilesChange,
  onUpload,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`;
    }
    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const addFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    // Check max files limit
    if (!multiple && fileArray.length > 1) {
      alert('Only one file is allowed');
      return;
    }
    
    if (files.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        uploadedFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          error,
        });
        continue;
      }

      const preview = await createPreview(file);
      uploadedFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview,
      });
    }

    const updatedFiles = multiple ? [...files, ...uploadedFiles] : uploadedFiles;
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [disabled, multiple, files.length, maxFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const validFiles = files.filter(f => !f.error);
      await onUpload(validFiles.map(f => f.file));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed transition-colors cursor-pointer',
          isDragOver
            ? 'border-brand-blue bg-brand-blue/5'
            : 'border-border hover:border-muted-foreground',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: {formatFileSize(maxSize)} • Max {maxFiles} files
            </p>
          </div>
          <Button variant="outline" className="mt-4" disabled={disabled}>
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Selected Files ({files.length})
            </h4>
            {onUpload && (
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || files.some(f => f.error)}
                loading={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {files.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="p-3">
                <div className="flex items-center space-x-3">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        {FILE_ICONS[getFileType(uploadedFile.file)]}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                      <span>•</span>
                      <span>{uploadedFile.file.type || 'Unknown'}</span>
                    </div>
                    {uploadedFile.error && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-destructive" />
                        <span className="text-xs text-destructive">
                          {uploadedFile.error}
                        </span>
                      </div>
                    )}
                    {uploadedFile.progress !== undefined && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-brand-blue h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFile(uploadedFile.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
