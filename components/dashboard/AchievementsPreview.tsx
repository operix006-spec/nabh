'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Award, Zap, Flame, Sparkles, Brain, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

export const AchievementsPreview: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const badges = [
    { id: 1, nameAr: 'الشرارة الأولى', nameEn: 'First Spark', icon: Zap, unlocked: true, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
    { id: 2, nameAr: 'سلسلة 7 أيام', nameEn: '7-Day Streak', icon: Flame, unlocked: true, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
    { id: 3, nameAr: 'سيد السرعة', nameEn: 'Speed Demon', icon: Sparkles, unlocked: true, color: 'text-amber-400 bg-amber-400/15 border-amber-400/40' },
    { id: 4, nameAr: 'فاتح المستوى 1', nameEn: 'Tier 1 Conqueror', icon: Trophy, unlocked: false, color: 'text-muted-foreground bg-muted/40 border-border/60' },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground font-heading">
              {isRtl ? 'الأوسمة والجوائز' : 'Trophies & Badges'}
            </h3>
            <span className="text-[10px] text-muted-foreground">
              3 / 6 {isRtl ? 'أوسمة مكتملة' : 'Badges Earned'}
            </span>
          </div>
        </div>

        <Link
          href="/achievements"
          onClick={() => playSound('click')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isRtl ? 'الخزانة' : 'View All'}</span>
          {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border text-center transition-transform hover:scale-105 cursor-pointer ${b.color}`}
              title={isRtl ? b.nameAr : b.nameEn}
            >
              <Icon className="h-6 w-6 mx-auto mb-1" />
              <span className="text-[10px] font-bold block truncate">
                {isRtl ? b.nameAr : b.nameEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
