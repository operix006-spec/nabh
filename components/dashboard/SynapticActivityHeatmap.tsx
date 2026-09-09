'use client';

import React, { useState } from 'react';
import { Flame, Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DaySession {
  dayNumber: number;
  dateStr: string;
  intensity: 0 | 1 | 2 | 3 | 4; // 0=none, 1=light, 2=moderate, 3=high, 4=mastery
  xpEarned: number;
  skillsTrained: number;
}

export function SynapticActivityHeatmap({
  currentStreak = 7,
  totalXpThisMonth = 4850,
  isRtl = false,
}: {
  currentStreak?: number;
  totalXpThisMonth?: number;
  isRtl?: boolean;
}) {
  // 30 days of simulated synaptic activity
  const [selectedDay, setSelectedDay] = useState<DaySession | null>(null);

  const days: DaySession[] = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    // Streak days at the end have high intensity
    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    let xp = 0;
    let skills = 0;

    if (day > 23) {
      intensity = (day % 2 === 0 ? 4 : 3) as 3 | 4;
      xp = intensity === 4 ? 350 : 250;
      skills = intensity === 4 ? 4 : 3;
    } else if (day % 3 === 0) {
      intensity = 2;
      xp = 180;
      skills = 2;
    } else if (day % 2 === 0) {
      intensity = 1;
      xp = 90;
      skills = 1;
    }

    return {
      dayNumber: day,
      dateStr: `Sep ${day}, 2026`,
      intensity,
      xpEarned: xp,
      skillsTrained: skills,
    };
  });

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return 'bg-[#00E5A8] shadow-[0_0_8px_#00E5A8]';
      case 3:
        return 'bg-[#6C63FF] shadow-[0_0_6px_#6C63FF]';
      case 2:
        return 'bg-[#8B5CF6]/70';
      case 1:
        return 'bg-[#6C63FF]/35';
      default:
        return 'bg-muted/40 border border-border/40';
    }
  };

  return (
    <Card className="p-6 rounded-3xl glass-panel shadow-floating border border-white/60 dark:border-white/10 space-y-4">
      {/* Header with Streak Fire */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm font-heading text-foreground">
              {isRtl ? 'خريطة النشاط والتحفيز العصبي' : 'Synaptic Activity & Daily Heatmap'}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {isRtl ? 'سجل التدريب اليومي لآخر 30 يوماً' : 'Daily cognitive stimulation history (last 30 days)'}
            </p>
          </div>
        </div>

        {/* Duolingo Streak Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs shadow-sm">
          <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>
            {currentStreak} {isRtl ? 'أيام متتالية' : 'Day Streak'}
          </span>
          <span className="w-1 h-1 rounded-full bg-amber-500" />
          <span className="font-mono text-[11px]">+{totalXpThisMonth} XP</span>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="space-y-2">
        <div className="grid grid-cols-10 sm:grid-cols-15 gap-2 pt-2">
          {days.map((day) => (
            <button
              key={day.dayNumber}
              onMouseEnter={() => setSelectedDay(day)}
              onClick={() => setSelectedDay(day)}
              className={`group relative aspect-square rounded-xl transition-all duration-200 hover:scale-125 focus:outline-none ${getIntensityColor(
                day.intensity
              )}`}
              aria-label={`Day ${day.dayNumber}`}
            >
              <span className="sr-only">Day {day.dayNumber}</span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
          <span>{isRtl ? 'أقل نشاطاً' : 'Less Active'}</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-muted/50 border border-border/40" />
            <span className="w-2.5 h-2.5 rounded-md bg-[#6C63FF]/35" />
            <span className="w-2.5 h-2.5 rounded-md bg-[#8B5CF6]/70" />
            <span className="w-2.5 h-2.5 rounded-md bg-[#6C63FF]" />
            <span className="w-2.5 h-2.5 rounded-md bg-[#00E5A8]" />
          </div>
          <span>{isRtl ? 'إتقان فائق' : 'Peak Mastery'}</span>
        </div>
      </div>

      {/* Selected Day Telemetry Card */}
      {selectedDay && (
        <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00E5A8]" />
            <span className="font-bold text-foreground">{selectedDay.dateStr}</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-muted-foreground">
              {selectedDay.skillsTrained} {isRtl ? 'مهارات' : 'skills'}
            </span>
            <span className="font-bold text-primary">+{selectedDay.xpEarned} XP</span>
          </div>
        </div>
      )}
    </Card>
  );
}
