import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'pulse' | 'shimmer';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'shimmer',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl ${
        variant === 'shimmer'
          ? 'skeleton-shimmer'
          : 'animate-pulse bg-muted/70'
      } ${className}`}
      {...props}
    />
  );
};
