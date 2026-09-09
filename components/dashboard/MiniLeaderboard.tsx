'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Trophy, ArrowRight, ArrowLeft, Crown } from 'lucide-react';

export const MiniLeaderboard: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const leaders = [
    { rank: 1, name: 'سارة خالد', nameEn: 'Sarah Khaled', nci: 945, badge: '👑' },
    { rank: 2, name: 'عمر التميمي', nameEn: 'Omar Al-Tamimi', nci: 912, badge: '🥈' },
    { rank: 3, name: 'ليلى الدوسري', nameEn: 'Layla Al-Dossary', nci: 889, badge: '🥉' },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground font-heading">
              {isRtl ? 'صدارة المتنافسين' : 'Leaderboard Podium'}
            </h3>
            <span className="text-[10px] text-muted-foreground">
              {isRtl ? 'الأعلى أداءً هذا الأسبوع' : 'Top Performers This Week'}
            </span>
          </div>
        </div>

        <Link
          href="/leaderboard"
          onClick={() => playSound('click')}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>{isRtl ? 'الكل' : 'View All'}</span>
          {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
        </Link>
      </div>

      <div className="space-y-2">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="p-3 rounded-2xl bg-accent/30 border border-border/40 flex items-center justify-between text-xs hover:bg-accent/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{leader.badge}</span>
              <span className="font-bold text-foreground">
                {isRtl ? leader.name : leader.nameEn}
              </span>
            </div>
            <span className="font-mono font-bold text-primary">{leader.nci} NCI</span>
          </div>
        ))}
      </div>
    </div>
  );
};
