'use client';

import { useState } from 'react';
import { Platform } from '@/types/api-contracts/content.types';

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
  contentType?: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'BRAND_ASSET';
}

const PLATFORM_OPTIONS: { value: Platform; label: string; color: string }[] = [
  { value: 'INSTAGRAM', label: 'Instagram', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { value: 'TIKTOK', label: 'TikTok', color: 'bg-black text-white border-black' },
  { value: 'YOUTUBE', label: 'YouTube', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'FACEBOOK', label: 'Facebook', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'TWITTER', label: 'Twitter/X', color: 'bg-sky-100 text-sky-700 border-sky-300' },
  { value: 'RADIO', label: 'Radio', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'PRINT', label: 'Print', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'DIGITAL', label: 'Digital', color: 'bg-green-100 text-green-700 border-green-300' },
];

export function PlatformSelector({ selected, onChange, contentType }: PlatformSelectorProps) {
  const getAvailablePlatforms = () => {
    if (contentType === 'AUDIO') {
      return PLATFORM_OPTIONS.filter(p => ['RADIO', 'DIGITAL'].includes(p.value));
    }
    if (contentType === 'BRAND_ASSET') {
      return PLATFORM_OPTIONS.filter(p => ['PRINT', 'DIGITAL'].includes(p.value));
    }
    // IMAGE and VIDEO support most platforms
    return PLATFORM_OPTIONS.filter(p => !['RADIO'].includes(p.value));
  };

  const availablePlatforms = getAvailablePlatforms();

  const togglePlatform = (platform: Platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter(p => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Target Platforms *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availablePlatforms.map((platform) => {
          const isSelected = selected.includes(platform.value);
          return (
            <button
              key={platform.value}
              type="button"
              onClick={() => togglePlatform(platform.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? platform.color + ' border-2'
                  : 'bg-white border-border hover:border-brand-blue/50'
              }`}
            >
              <span className="text-sm font-medium">{platform.label}</span>
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="text-xs text-red-600">Please select at least one platform</p>
      )}
    </div>
  );
}
