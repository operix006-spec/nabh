'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { CognitiveSkill } from '@/types/cognitive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/dashboard/ProgressCircle';
import {
  Play,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  Zap,
  Award,
} from 'lucide-react';

interface TodayFocusHeroProps {
  currentSkill: CognitiveSkill;
  completedCount: number;
  totalSkills: number;
  progressPercentage: number;
  totalStars: number;
  maxStars: number;
}

export const TodayFocusHero: React.FC<TodayFocusHeroProps> = ({
  currentSkill,
  completedCount,
  totalSkills,
  progressPercentage,
  totalStars,
  maxStars,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-tr from-[#6C63FF]/15 via-[#8B5CF6]/10 to-card/90 p-4 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-2xl shadow-primary/5 mb-10 glow-card transition-all">
      {/* Soft Ambient Radiance */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#6C63FF]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#00E5A8]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Priority Workout Directive */}
        <div className="space-y-4 text-center lg:text-start max-w-xl">
          {/* Action Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6C63FF]/15 text-[#6C63FF] text-xs font-bold border border-[#6C63FF]/25 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>
              {isRtl ? 'التمرين المقترح التالي من الذكاء الاصطناعي' : "Today's Recommended AI Priority Workout"}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="text-xs font-mono font-bold text-[#6C63FF] px-2 py-0.5 rounded-lg bg-[#6C63FF]/10">
                #{currentSkill.number} • {currentSkill.domain.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>~3 {isRtl ? 'دقائق' : 'min'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-foreground tracking-tight">
              {isRtl ? currentSkill.nameAr : currentSkill.nameEn}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {isRtl ? currentSkill.descriptionAr : currentSkill.descriptionEn}
          </p>

          {/* Reward Callout */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/80 border border-border/60 text-xs font-bold font-mono">
            <span className="text-emerald-500">🎁 {isRtl ? 'مكافأة الإنجاز:' : 'Completion Reward:'}</span>
            <span className="text-foreground">+120 XP</span>
            <span>•</span>
            <span className="text-amber-500">⭐ {isRtl ? '3 نجوم إتقان' : 'Up to 3 Stars'}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              href={`/games/${currentSkill.targetGameId}`}
              onClick={() => playSound('fanfare')}
            >
              <Button
                size="lg"
                className="rounded-2xl font-black btn-3d btn-3d-primary shadow-xl shadow-primary/25 gap-2 px-8 h-12 sm:h-14 text-sm sm:text-base"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>{isRtl ? 'ابدأ التمرين الآن' : 'Launch Workout Now'}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>

            <Link
              href={`/skills/${currentSkill.id}`}
              onClick={() => playSound('click')}
            >
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl font-bold border-border/80 bg-background/50 hover:bg-accent/60 px-5 h-12 sm:h-14 text-xs sm:text-sm"
              >
                <Brain className="h-4 w-4 text-[#6C63FF]" />
                <span>{isRtl ? 'الأسس العصبية' : 'Neural Science'}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Dual Radial Gauges (Mastery & Composite NCI) */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-card/80 p-6 rounded-3xl border border-border/70 backdrop-blur-2xl shadow-xl shadow-primary/5">
          <div className="relative">
            <ProgressCircle
              progress={progressPercentage}
              size={135}
              strokeWidth={11}
              label={`${completedCount}/50`}
              sublabel={isRtl ? 'مهارة مكتملة' : 'Mastered'}
            />
          </div>

          <div className="space-y-3 text-center sm:text-start text-xs divide-y divide-border/40 sm:divide-y-0">
            <div>
              <span className="text-muted-foreground block text-[11px] font-bold">
                {isRtl ? 'المؤشر الإدراكي المركب (NCI)' : 'Nabh Cognitive Index'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5 justify-center sm:justify-start">
                <span className="text-2xl font-black font-mono text-[#6C63FF]">
                  {user?.overallCognitiveIndex || 824}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">/ 1000</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-0">
              <span className="text-muted-foreground block text-[11px] font-bold">
                {isRtl ? 'نجوم الإتقان المحققة' : 'Mastery Stars Gathered'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 justify-center sm:justify-start font-mono font-bold text-amber-500">
                <Award className="h-4 w-4" />
                <span>{totalStars} / {maxStars}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
