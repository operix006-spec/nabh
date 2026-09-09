'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Medal,
  Flame,
  Sparkles,
  Users,
  Globe,
  School,
  ChevronUp,
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  country: string;
  nci: number;
  xp: number;
  streakDays: number;
  league: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'زيد الهاشمي', avatar: 'ZH', country: '🇸🇦', nci: 948, xp: 18450, streakDays: 45, league: 'Diamond' },
  { rank: 2, name: 'نور السويدي', avatar: 'NS', country: '🇦🇪', nci: 932, xp: 16900, streakDays: 38, league: 'Diamond' },
  { rank: 3, name: 'عمر القحطاني', avatar: 'OQ', country: '🇸🇦', nci: 915, xp: 15400, streakDays: 32, league: 'Diamond' },
  { rank: 4, name: 'سارة المنصور (أنت)', avatar: 'SM', country: '🇸🇦', nci: 824, xp: 12450, streakDays: 14, league: 'Platinum', isCurrentUser: true },
  { rank: 5, name: 'خالد بن فيصل', avatar: 'KF', country: '🇰🇼', nci: 818, xp: 11980, streakDays: 21, league: 'Platinum' },
  { rank: 6, name: 'ليلى الدوسري', avatar: 'LD', country: '🇸🇦', nci: 805, xp: 11200, streakDays: 19, league: 'Platinum' },
  { rank: 7, name: 'طارق الزهراني', avatar: 'TZ', country: '🇸🇦', nci: 792, xp: 10850, streakDays: 16, league: 'Gold' },
  { rank: 8, name: 'ريم العبدالله', avatar: 'RA', country: '🇶🇦', nci: 780, xp: 10200, streakDays: 12, league: 'Gold' },
  { rank: 9, name: 'يوسف المالكي', avatar: 'YM', country: '🇧🇭', nci: 765, xp: 9800, streakDays: 10, league: 'Gold' },
  { rank: 10, name: 'فاطمة الشهري', avatar: 'FS', country: '🇸🇦', nci: 752, xp: 9300, streakDays: 8, league: 'Gold' },
];

export default function LeaderboardPage() {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const [filterTab, setFilterTab] = useState<'global' | 'cohort' | 'classroom'>('global');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. HEADER & TABS */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border-amber-500/30">
          Global League Standings
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
          {t('navLeaderboard')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {language === 'ar'
            ? 'تصنيف المتدربين المتميزين وفقاً لمؤشر نَبِه الإدراكي (NCI) ونقاط الخبرة المحققة'
            : 'Top cognitive athletes ranked by Nabh Cognitive Index (NCI) and cumulative neuro-XP'}
        </p>

        {/* Tab switcher */}
        <div className="pt-3 flex items-center justify-center gap-2">
          <Button
            variant={filterTab === 'global' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { playSound('click'); setFilterTab('global'); }}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === 'ar' ? 'العالمي' : 'Global'}</span>
          </Button>

          <Button
            variant={filterTab === 'cohort' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { playSound('click'); setFilterTab('cohort'); }}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{language === 'ar' ? 'فئتي العمرية (18-25)' : 'Age Cohort'}</span>
          </Button>

          <Button
            variant={filterTab === 'classroom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { playSound('click'); setFilterTab('classroom'); }}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            <School className="h-3.5 w-3.5" />
            <span>{language === 'ar' ? 'المدرسة / الفصل' : 'School / Academy'}</span>
          </Button>
        </div>
      </div>

      {/* 2. TOP 3 PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto items-end">
        
        {/* Rank 2 (Silver) */}
        <Card className="p-6 rounded-3xl border-2 border-slate-300/40 bg-card text-center space-y-3 order-2 md:order-1 hover:shadow-card transition-all">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            2
          </div>
          <Badge variant="outline" className="border-slate-400 text-slate-500 text-[10px] font-bold">
            Silver Neuro-Athlete
          </Badge>
          <h3 className="font-bold text-base">{LEADERBOARD_DATA[1].name} {LEADERBOARD_DATA[1].country}</h3>
          <div className="text-2xl font-black font-mono text-primary">
            NCI {LEADERBOARD_DATA[1].nci}
          </div>
          <span className="text-xs text-muted-foreground block">
            {LEADERBOARD_DATA[1].xp.toLocaleString()} XP
          </span>
        </Card>

        {/* Rank 1 (Gold) */}
        <Card className="p-8 rounded-4xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-card to-card text-center space-y-3 order-1 md:order-2 shadow-elevated hover:shadow-elevated transition-all md:-translate-y-4">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
            <Trophy className="h-10 w-10" />
          </div>
          <Badge variant="amber" className="text-xs font-extrabold px-3 py-1">
            👑 Grand Master #{1}
          </Badge>
          <h3 className="font-black text-lg">{LEADERBOARD_DATA[0].name} {LEADERBOARD_DATA[0].country}</h3>
          <div className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400">
            NCI {LEADERBOARD_DATA[0].nci}
          </div>
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-muted-foreground">
            <span>{LEADERBOARD_DATA[0].xp.toLocaleString()} XP</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-500">
              <Flame className="h-3.5 w-3.5" />
              {LEADERBOARD_DATA[0].streakDays} {t('days')}
            </span>
          </div>
        </Card>

        {/* Rank 3 (Bronze) */}
        <Card className="p-6 rounded-3xl border-2 border-amber-700/30 bg-card text-center space-y-3 order-3 hover:shadow-card transition-all">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-900 text-white flex items-center justify-center font-black text-xl shadow-md">
            3
          </div>
          <Badge variant="outline" className="border-amber-700/50 text-amber-700 text-[10px] font-bold">
            Bronze Neuro-Athlete
          </Badge>
          <h3 className="font-bold text-base">{LEADERBOARD_DATA[2].name} {LEADERBOARD_DATA[2].country}</h3>
          <div className="text-2xl font-black font-mono text-primary">
            NCI {LEADERBOARD_DATA[2].nci}
          </div>
          <span className="text-xs text-muted-foreground block">
            {LEADERBOARD_DATA[2].xp.toLocaleString()} XP
          </span>
        </Card>

      </div>

      {/* 3. DETAILED STANDINGS TABLE */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 overflow-hidden">
        <div className="space-y-2">
          {LEADERBOARD_DATA.map((entry) => (
            <div
              key={`rank-${entry.rank}`}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                entry.isCurrentUser
                  ? 'bg-primary/10 border-2 border-primary/40 shadow-sm'
                  : 'hover:bg-secondary/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                  entry.rank <= 3 ? 'bg-primary text-white' : 'text-muted-foreground bg-secondary'
                }`}>
                  #{entry.rank}
                </span>

                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center font-bold text-xs text-primary border border-border">
                  {entry.avatar}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{entry.name}</span>
                    <span className="text-xs">{entry.country}</span>
                    {entry.isCurrentUser && (
                      <Badge variant="default" className="text-[10px] font-bold">
                        {language === 'ar' ? 'أنت' : 'You'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-amber-500 font-bold flex items-center gap-0.5">
                      <Flame className="h-3 w-3" />
                      {entry.streakDays} {t('days')}
                    </span>
                    <span>•</span>
                    <span>{entry.league}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black font-mono text-primary block">
                  NCI {entry.nci}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
