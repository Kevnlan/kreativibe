'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  existingFiles?: UploadedFile[];
  onRemoveFile?: (index: number) => void;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
  if (type.startsWith('video/')) return <Film className="h-5 w-5" />;
  if (type.startsWith('application/pdf')) return <FileText className="h-5 w-5" />;
  return <File className="h-5 w-5" />;
};

export function FileUploader({
  onFileSelect,
  accept = '*',
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 5,
  preview = true,
  disabled = false,
  error,
  className,
  existingFiles = [],
  onRemoveFile,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles || disabled) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`);
        return;
      }

      if (!multiple && files.length + validFiles.length >= 1) {
        errors.push('Only one file allowed');
        return;
      }

      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      setFiles(prev => [...prev, ...uploadedFiles]);
      onFileSelect(validFiles);
    }
  }, [disabled, files.length, maxFiles, maxSize, multiple, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    onRemoveFile?.(index);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragging && 'border-brand-blue bg-brand-blue/5',
          !isDragging && !error && 'border-border hover:border-brand-blue',
          error && 'border-red-500',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-muted-foreground">
          {accept === '*' ? 'Any file type' : accept} • Max {formatFileSize(maxSize)}
          {multiple && ` • Up to ${maxFiles} files`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              {preview && file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-12 w-12 object-cover rounded"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center bg-background rounded">
                  {getFileIcon(file.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
