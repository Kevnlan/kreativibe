'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface ImageUploaderProps {
  onImagesSelect: (files: File[], previews: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  existingPreviews?: string[];
}

export function ImageUploader({
  onImagesSelect,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  existingPreviews = [],
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(existingPreviews);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    }
    return null;
  };

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    setError('');
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    const totalFiles = files.length + fileList.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    Array.from(fileList).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      newFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === fileList.length) {
          const updatedFiles = [...files, ...newFiles];
          const updatedPreviews = [...previews, ...newPreviews];
          setFiles(updatedFiles);
          setPreviews(updatedPreviews);
          onImagesSelect(updatedFiles, updatedPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [files, previews, maxFiles, onImagesSelect]);

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

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesSelect(newFiles, newPreviews);
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
          id="image-upload"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-muted rounded-full">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop images here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {(maxSize / 1024 / 1024).toFixed(0)}MB
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxFiles} images
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

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Stats */}
      {previews.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{previews.length} of {maxFiles} images</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([]);
              setPreviews([]);
              onImagesSelect([], []);
            }}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
