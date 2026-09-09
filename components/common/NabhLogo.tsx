'use client';

import React from 'react';
import Image from 'next/image';

interface NabhLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const NabhLogo: React.FC<NabhLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 32, box: 'h-8 w-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { img: 44, box: 'h-11 w-11', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    lg: { img: 64, box: 'h-16 w-16', text: 'text-3xl sm:text-4xl', sub: 'text-xs' },
    xl: { img: 96, box: 'h-24 w-24', text: 'text-4xl sm:text-5xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${current.box} rounded-2xl overflow-hidden flex items-center justify-center p-0.5 bg-gradient-to-b from-white/90 to-white/60 dark:from-white/10 dark:to-white/5 border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
        <img
          src="/logo.png"
          alt="نَبِـه | Nabh"
          className="w-full h-full object-contain drop-shadow-sm"
          onError={(e) => {
            // Fallback if image not yet loaded
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className={`font-black font-heading tracking-tight text-foreground ${current.text}`}>
              نَبِـه
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              NABH
            </span>
          </div>
          <span className={`text-muted-foreground font-medium line-clamp-1 ${current.sub}`}>
            منصة التدريب الإدراكي وعلم الأعصاب
          </span>
        </div>
      )}
    </div>
  );
};
