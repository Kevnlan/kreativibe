'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Music, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui';

interface AudioUploaderProps {
  onAudioSelect: (file: File | null, preview: string | null, metadata?: AudioMetadata) => void;
  maxSize?: number; // in bytes
  acceptedFormats?: string[];
  existingPreview?: string;
}

interface AudioMetadata {
  duration: number;
  bitrate?: number;
  format: string;
}

export function AudioUploader({
  onAudioSelect,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/mp4'],
  existingPreview,
}: AudioUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingPreview || null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSize) {
      return `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
    }
    return null;
  };

  const extractAudioMetadata = (audioElement: HTMLAudioElement, file: File): AudioMetadata => {
    return {
      duration: audioElement.duration,
      format: file.type.split('/')[1].toUpperCase(),
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
      
      // Extract metadata after audio loads
      const tempAudio = document.createElement('audio');
      tempAudio.src = previewUrl;
      tempAudio.onloadedmetadata = () => {
        const meta = extractAudioMetadata(tempAudio, selectedFile);
        setMetadata(meta);
        onAudioSelect(selectedFile, previewUrl, meta);
      };
    };
    reader.readAsDataURL(selectedFile);
  }, [onAudioSelect]);

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

  const removeAudio = () => {
    setFile(null);
    setPreview(null);
    setMetadata(null);
    setIsPlaying(false);
    setCurrentTime(0);
    onAudioSelect(null, null);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number): string => {
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
            id="audio-upload"
            accept={acceptedFormats.join(',')}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop audio here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {(maxSize / 1024 / 1024).toFixed(0)}MB
                </p>
                <p className="text-xs text-muted-foreground">
                  Max duration: 5 minutes
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Audio Player */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <audio
              ref={audioRef}
              src={preview}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            {/* Waveform Visualization (Mock) */}
            <div className="flex items-center justify-center h-24 mb-4 bg-white/50 rounded-lg">
              <div className="flex items-end gap-1 h-16">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-500 rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 100}%`,
                      opacity: currentTime > (metadata?.duration || 0) * (i / 40) ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max={metadata?.duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9333ea ${(currentTime / (metadata?.duration || 1)) * 100}%, #e9d5ff ${(currentTime / (metadata?.duration || 1)) * 100}%)`,
                    }}
                  />
                </div>

                <div className="text-sm font-medium text-purple-900 min-w-[80px] text-right">
                  {formatTime(currentTime)} / {metadata ? formatTime(metadata.duration) : '0:00'}
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeAudio}
              className="mt-4 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Audio Metadata */}
          {metadata && (
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium">{formatTime(metadata.duration)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Format</p>
                <p className="text-sm font-medium">{metadata.format}</p>
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
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeAudio}
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
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm font-medium text-purple-900 mb-2">Audio Requirements</p>
        <ul className="text-xs text-purple-800 space-y-1">
          <li>• <strong>Radio:</strong> MP3/WAV, min 128kbps, max 5 min</li>
          <li>• <strong>Podcast:</strong> MP3/AAC, stereo recommended</li>
          <li>• <strong>Commercial:</strong> High quality (256kbps+)</li>
        </ul>
      </div>
    </div>
  );
}
