'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 1. FULL DASHBOARD SKELETON (Apple Specular Shimmer Layout)
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation Bar Skeleton */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="rounded-4xl border border-primary/20 bg-card/60 p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 w-full md:w-2/3">
          <Skeleton className="h-6 w-36 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-xl" />
          <Skeleton className="h-4 w-5/6 rounded-xl" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-40 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 4 Metrics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-border/60 bg-card/60 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3 Columns Sub-grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-border/60 bg-card/60 space-y-3">
          <Skeleton className="h-6 w-32 rounded-xl mb-4" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <div className="p-6 rounded-3xl border border-border/60 bg-card/60 space-y-3">
          <Skeleton className="h-6 w-32 rounded-xl mb-4" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <div className="p-6 rounded-3xl border border-border/60 bg-card/60 space-y-3">
          <Skeleton className="h-6 w-32 rounded-xl mb-4" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * 2. GAME ARENA SKELETON
 */
export const GameArenaSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* HUD Header */}
      <div className="flex items-center justify-between p-4 rounded-3xl border border-border/60 bg-card/70">
        <Skeleton className="h-6 w-36 rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>

      {/* Main Canvas Stimulus Frame */}
      <div className="h-96 rounded-4xl border-2 border-border/60 bg-card/40 flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <Skeleton className="h-20 w-20 rounded-3xl mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-32 mx-auto rounded-lg" />
        </div>
      </div>

      {/* Answer Controls Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  );
};
