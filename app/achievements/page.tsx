'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Zap,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function AchievementsPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [claimedMap, setClaimedMap] = useState<Record<string, boolean>>({
    ach_first_game: true,
  });

  const handleClaim = (id: string, xp: number) => {
    playSound('fanfare');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
    });
    setClaimedMap((prev) => ({ ...prev, [id]: true }));
  };

  const achievements = [
    {
      id: 'ach_first_game',
      tier: 'bronze',
      titleAr: 'الشرارة الأولى (First Spark)',
      titleEn: 'First Neural Spark',
      descAr: 'أكمل أول جلسة تدريبية بنجاح على منصة نَبِه.',
      descEn: 'Successfully complete your first cognitive training game.',
      xp: 50,
      progress: 100,
      isUnlocked: true,
      icon: Zap,
    },
    {
      id: 'ach_streak_7',
      tier: 'silver',
      titleAr: 'عاصفة التركيز (7-Day Streak)',
      titleEn: 'Focus Tempest (7-Day Streak)',
      descAr: 'حافظ على تدريبك اليومي لمدة 7 أيام متتالية دون انقطاع.',
      descEn: 'Maintain a 7-day daily cognitive training streak.',
      xp: 200,
      progress: 85,
      isUnlocked: true,
      icon: Flame,
    },
    {
      id: 'ach_speed_demon',
      tier: 'gold',
      titleAr: 'سيد سرعة البديهة (Speed Demon)',
      titleEn: 'Speed Demon',
      descAr: 'حقق زمن رجع يقل عن 250ms في اختبار نبض السرعة.',
      descEn: 'Clock a sub-250ms reaction time in Speed Reflex.',
      xp: 350,
      progress: 100,
      isUnlocked: true,
      icon: Sparkles,
    },
    {
      id: 'ach_tier_master',
      tier: 'platinum',
      titleAr: 'فاتح المستوى الأول (Tier 1 Conqueror)',
      titleEn: 'Tier 1 Conqueror',
      descAr: 'أكمل المهارات الـ 10 الأساسية بنسبة 3 نجوم كاملة.',
      descEn: 'Master all 10 foundational skills with 3 golden stars.',
      xp: 500,
      progress: 60,
      isUnlocked: false,
      icon: Trophy,
    },
    {
      id: 'ach_matrix_mind',
      tier: 'diamond',
      titleAr: 'عبقري المصفوفات (Matrix Mastermind)',
      titleEn: 'Matrix Mastermind',
      descAr: 'أنجز 9 جولات متتالية بدون أي خطأ في مصفوفة الذاكرة.',
      descEn: 'Reach round 9 in Memory Matrix without a single error.',
      xp: 750,
      progress: 40,
      isUnlocked: false,
      icon: Brain,
    },
    {
      id: 'ach_polymath',
      tier: 'diamond',
      titleAr: 'العقل الشامل (The Polymath)',
      titleEn: 'The Universal Polymath',
      descAr: 'احصل على مؤشر NCI يتجاوز 900 نقطة عبر كافة المجالات.',
      descEn: 'Achieve an overall NCI exceeding 900 points across all 7 domains.',
      xp: 1000,
      progress: 30,
      isUnlocked: false,
      icon: Award,
    },
  ];

  const tierColors: Record<string, { badge: string; border: string }> = {
    bronze: { badge: 'bg-amber-600/10 text-amber-700 dark:text-amber-500 border-amber-600/20', border: 'border-amber-600/30' },
    silver: { badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20', border: 'border-slate-400/40' },
    gold: { badge: 'bg-amber-400/15 text-amber-500 border-amber-400/30', border: 'border-amber-400/50' },
    platinum: { badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30', border: 'border-cyan-500/40' },
    diamond: { badge: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30', border: 'border-indigo-500/50' },
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
          <Trophy className="h-4 w-4" />
          <span>{isRtl ? 'خزانة الأوسمة والإنجازات' : 'Trophy Cabinet & Badges'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground mb-4">
          {isRtl ? 'أوسمة الإتقان والتميز العصبي' : 'Cognitive Mastery Medals'}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isRtl
            ? 'تُمنح الأوسمة عند بلوغ محطات معرفية استثنائية وتمنحك نقاط خبرة مضاعفة لترقية رتبتك الذهنية.'
            : 'Earned upon reaching high cognitive benchmarks, unlocking bonus XP boosts and tier titles.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((ach) => {
          const Icon = ach.icon;
          const isClaimed = claimedMap[ach.id];
          const canClaim = ach.isUnlocked && !isClaimed && ach.progress === 100;
          const styling = tierColors[ach.tier] || tierColors.bronze;

          return (
            <div
              key={ach.id}
              className={`relative overflow-hidden rounded-3xl border bg-card/70 backdrop-blur-xl p-6 shadow-lg flex flex-col justify-between transition-all duration-300 glow-card ${
                styling.border
              }`}
            >
              <div>
                {/* Header: Icon & Tier */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 to-purple-500/20 text-primary border border-primary/30 shadow-inner">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${styling.badge}`}>
                    {ach.tier}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  {isRtl ? ach.titleAr : ach.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {isRtl ? ach.descAr : ach.descEn}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-muted-foreground">{isRtl ? 'نسبة الإنجاز' : 'Progress'}</span>
                    <span className="text-foreground">{ach.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/70 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Claim / Status CTA */}
              <div className="pt-2">
                {isClaimed ? (
                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isRtl ? 'تم استلام الجائزة' : 'Reward Claimed (+XP)'}</span>
                  </div>
                ) : canClaim ? (
                  <Button
                    onClick={() => handleClaim(ach.id, ach.xp)}
                    className="w-full rounded-2xl font-bold btn-3d btn-3d-emerald bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{isRtl ? `استلم ${ach.xp} XP الآن!` : `Claim +${ach.xp} XP!`}</span>
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-accent/40 text-muted-foreground font-semibold text-xs border border-border/50">
                    <Lock className="h-3.5 w-3.5" />
                    <span>{isRtl ? `مكافأة: ${ach.xp} XP` : `Reward: +${ach.xp} XP`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
