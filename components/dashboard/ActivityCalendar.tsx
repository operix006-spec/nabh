'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';

export const ActivityCalendar: React.FC = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  const days = [
    3, 4, 2, 4, 3, 0, 2,
    4, 4, 3, 2, 4, 1, 3,
    4, 3, 4, 4, 2, 0, 3,
    4, 4, 3, 4, 4, 4, 3,
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground font-heading">
              {isRtl ? 'تقويم النشاط والمواظبة' : 'Training Calendar'}
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {isRtl ? 'آخر 28 يوماً' : 'Last 28 Days'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs font-mono">
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          <span>7 Days Active</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 p-3 rounded-2xl bg-accent/30 border border-border/40">
        {days.map((level, idx) => {
          const colors = [
            'bg-muted/40 border-border/30',
            'bg-emerald-500/30 border-emerald-500/40',
            'bg-emerald-500/50 border-emerald-500/60',
            'bg-emerald-500/80 border-emerald-500',
            'bg-emerald-500 border-emerald-400 shadow-sm',
          ];
          return (
            <div
              key={idx}
              title={`Day ${idx + 1}`}
              className={`aspect-square rounded-lg border transition-transform hover:scale-125 cursor-pointer ${colors[level]}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-1">
        <span>{isRtl ? 'أقل نشاطاً' : 'Less'}</span>
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-muted/40" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/30" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/60" />
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
        </div>
        <span>{isRtl ? 'أكثر نشاطاً' : 'More'}</span>
      </div>
    </div>
  );
};
