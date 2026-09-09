'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSound } from '@/context/SoundContext';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryActionClick?: () => void;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onActionClick,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryActionClick,
  variant = 'indigo',
  className = '',
}) => {
  const { playSound } = useSound();

  const variantGradients = {
    indigo: 'from-indigo-500/20 via-primary/10 to-transparent text-primary',
    emerald: 'from-emerald-500/20 via-teal/10 to-transparent text-emerald-500',
    amber: 'from-amber-500/20 via-orange/10 to-transparent text-amber-500',
    rose: 'from-rose-500/20 via-pink/10 to-transparent text-rose-500',
  };

  const iconGlow = {
    indigo: 'shadow-indigo-500/20 bg-indigo-500/10 border-indigo-500/30',
    emerald: 'shadow-emerald-500/20 bg-emerald-500/10 border-emerald-500/30',
    amber: 'shadow-amber-500/20 bg-amber-500/10 border-amber-500/30',
    rose: 'shadow-rose-500/20 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-8 sm:p-12 text-center backdrop-blur-xl shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background Soft Glow */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-gradient-to-b ${variantGradients[variant]} blur-3xl opacity-70 pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        {/* Floating Glow Icon Bubble */}
        <div className="relative mb-6">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-3xl border shadow-xl ${iconGlow[variant]} transition-transform duration-300 hover:scale-110`}
          >
            <Icon className="h-10 w-10" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm">
            <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            actionHref ? (
              <Link href={actionHref} onClick={() => playSound('click')}>
                <Button size="lg" className="rounded-2xl font-bold px-6 shadow-md btn-3d btn-3d-primary">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  playSound('click');
                  onActionClick?.();
                }}
                className="rounded-2xl font-bold px-6 shadow-md btn-3d btn-3d-primary"
              >
                {actionLabel}
              </Button>
            )
          )}

          {secondaryActionLabel && (
            secondaryActionHref ? (
              <Link href={secondaryActionHref} onClick={() => playSound('click')}>
                <Button variant="outline" size="lg" className="rounded-2xl font-semibold px-6 border-border/60">
                  {secondaryActionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  playSound('click');
                  onSecondaryActionClick?.();
                }}
                className="rounded-2xl font-semibold px-6 border-border/60"
              >
                {secondaryActionLabel}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
