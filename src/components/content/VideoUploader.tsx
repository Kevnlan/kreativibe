'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Video as VideoIcon, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui';

interface VideoUploaderProps {
  onVideoSelect: (file: File | null, preview: string | null, metadata?: VideoMetadata) => void;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  existingPreview?: string;
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
}

export function VideoUploader({
  onVideoSelect,
  maxSize = 500 * 1024 * 1024, // 500MB default
  acceptedFormats = ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  existingPreview,
}: VideoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingPreview || null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    }
    return null;
  };

  const extractVideoMetadata = (videoElement: HTMLVideoElement): VideoMetadata => {
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    const duration = videoElement.duration;
    
    // Calculate aspect ratio
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    const aspectRatio = `${width / divisor}:${height / divisor}`;

    return {
      duration,
      width,
      height,
      aspectRatio,
    };
  };

  const handleFile = useCallback((selectedFile: File) => {
    setError('');

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      
      // Extract metadata after video loads
      const tempVideo = document.createElement('video');
      tempVideo.src = previewUrl;
      tempVideo.onloadedmetadata = () => {
        const meta = extractVideoMetadata(tempVideo);
        setMetadata(meta);
        onVideoSelect(selectedFile, previewUrl, meta);
      };
    };
    reader.readAsDataURL(selectedFile);
  }, [onVideoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeVideo = () => {
    setFile(null);
    setPreview(null);
    setMetadata(null);
    setIsPlaying(false);
    onVideoSelect(null, null);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {!preview ? (
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
            id="video-upload"
            accept={acceptedFormats.join(',')}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop video here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {(maxSize / 1024 / 1024).toFixed(0)}MB
                </p>
                <p className="text-xs text-muted-foreground">
                  Max duration: 10 minutes
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="relative rounded-lg overflow-hidden bg-black group">
            <video
              ref={videoRef}
              src={preview}
              className="w-full aspect-video object-contain"
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={togglePlay}
                className="p-4 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-black" />
                ) : (
                  <Play className="h-8 w-8 text-black ml-1" />
                )}
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeVideo}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Video Metadata */}
          {metadata && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{formatDuration(metadata.duration)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resolution</p>
                <p className="text-sm font-medium">{metadata.width}x{metadata.height}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aspect Ratio</p>
                <p className="text-sm font-medium">{metadata.aspectRatio}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-sm font-medium">
                  {file ? (file.size / 1024 / 1024).toFixed(1) : '0'} MB
                </p>
              </div>
            </div>
          )}

          {/* File Info */}
          {file && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeVideo}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Platform Requirements */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-2">Platform Requirements</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>TikTok:</strong> 9:16 vertical, max 3 min</li>
          <li>• <strong>Instagram Reels:</strong> 9:16 vertical, max 90 sec</li>
          <li>• <strong>YouTube:</strong> 16:9 horizontal, max 10 min</li>
          <li>• <strong>Facebook:</strong> 1:1 or 16:9, max 4 min</li>
        </ul>
      </div>
    </div>
  );
}
