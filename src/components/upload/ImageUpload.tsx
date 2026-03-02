'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui';
import { Card, CardContent } from '../ui';
import { Avatar } from '../ui';
import { cn } from '../../lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
  disabled?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait';
  maxSize?: number; // in bytes
  showPreview?: boolean;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  className,
  disabled = false,
  aspectRatio = 'square',
  maxSize = 5 * 1024 * 1024, // 5MB default
  showPreview = true,
  placeholder = 'Upload image',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `Image size must be less than ${maxSizeMB}MB`;
    }
    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview immediately
      const previewUrl = await createPreview(file);
      setPreview(previewUrl);

      if (onUpload) {
        const uploadedUrl = await onUpload(file);
        setPreview(uploadedUrl);
        onChange?.(uploadedUrl);
      } else {
        // If no upload handler, just use the preview
        onChange?.(previewUrl);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.('');
    setError(null);
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Upload Area */}
      <div className={cn('relative group', aspectRatioClasses[aspectRatio])}>
        {preview && showPreview ? (
          // Preview state
          <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={openFileDialog}
                disabled={disabled || isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <Card 
            className="w-full h-full cursor-pointer hover:border-brand-blue transition-colors"
            onClick={openFileDialog}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-4 text-center">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-brand-blue animate-spin mb-2" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground">
                {isUploading ? 'Uploading...' : placeholder}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click to upload
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File Info */}
      {preview && !error && (
        <div className="text-xs text-muted-foreground">
          Image uploaded successfully
        </div>
      )}
    </div>
  );
}

// Avatar-specific upload component
export function AvatarUpload({
  value,
  onChange,
  onUpload,
  className,
  disabled = false,
}: {
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  className?: string;
  disabled?: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB for avatar
      return 'Avatar image must be less than 2MB';
    }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target?.result as string;
        setPreview(previewUrl);
        
        if (onUpload) {
          onUpload(file).then((uploadedUrl) => {
            setPreview(uploadedUrl);
            onChange?.(uploadedUrl);
          }).catch(() => {
            setError('Upload failed. Please try again.');
            setPreview(value || null);
          }).finally(() => {
            setIsUploading(false);
          });
        } else {
          onChange?.(previewUrl);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(value || null);
      setIsUploading(false);
    }

    // Reset input value
    e.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.('');
    setError(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative inline-block">
        <Avatar
          src={preview || undefined}
          alt="Avatar"
          size="xl"
          fallback={preview ? undefined : 'User'}
          className={cn(
            'cursor-pointer group',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        />
        
        {/* Upload indicator */}
        <div className="absolute bottom-0 right-0">
          <div className="bg-brand-blue text-white rounded-full p-1 cursor-pointer group-hover:bg-brand-blue-dark transition-colors">
            {isUploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Camera className="h-3 w-3" />
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      {preview && (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Change
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
