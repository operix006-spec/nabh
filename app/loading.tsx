import React from 'react';
import { DashboardSkeleton } from '@/components/common/Skeletons';

export default function Loading() {
  return (
    <div className="min-h-screen py-8">
      <DashboardSkeleton />
    </div>
  );
}
