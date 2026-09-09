'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Sparkles, Zap, Flame, Award, Gift, CheckCircle2 } from 'lucide-react';

export const XpLevelBar: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const { celebrate, notify } = useFeedback();
  const isRtl = language === 'ar';

  const [chestClaimed, setChestClaimed] = useState(false);

  const currentXp = user?.totalXp || 8450;
  const xpPerLevel = 500;
  const level = user?.level || Math.floor(currentXp / xpPerLevel) + 1;
  const currentTierXp = currentXp % xpPerLevel;
  const nextTierXp = xpPerLevel;
  const percentage = Math.min(100, Math.round((currentTierXp / nextTierXp) * 100));

  const levelTitles: Record<number, { ar: string; en: string }> = {
    1: { ar: 'مستكشف الممرات العصبية', en: 'Neural Explorer' },
    2: { ar: 'موقظ الحواس الإدراكية', en: 'Sensory Awakener' },
    3: { ar: 'فارس الانتباه المركز', en: 'Attentional Knight' },
    4: { ar: 'متحدي سرعة المعالجة', en: 'Velocity Striker' },
    5: { ar: 'مهندس الذاكرة الفائقة', en: 'Memory Architect' },
    6: { ar: 'رائد المرونة الذهنية', en: 'Synaptic Pioneer' },
    7: { ar: 'سيد المنطق التحليلي', en: 'Logic Grandmaster' },
    8: { ar: 'خبير التوليف العصبي', en: 'Neuro-Synthesis Specialist' },
    9: { ar: 'حكيم الفكر التكيفي', en: 'Adaptive Sage' },
    10: { ar: 'أسطورة الذكاء السائل', en: 'Fluid Intelligence Titan' },
  };

  const currentTitle =
    levelTitles[level] ||
    (level > 10 ? { ar: 'عقل متسامٍ نخبوي', en: 'Transcendent Polymath' } : levelTitles[1]);

  const nextTitle =
    levelTitles[level + 1] || { ar: 'مستوى استثنائي جديد', en: 'Elite Next Tier' };

  const handleClaimChest = () => {
    if (percentage < 100 && !chestClaimed) {
      playSound('pop');
      notify({
        title: isRtl ? 'صندوق المكافأة اليومية' : 'Daily Reward Chest',
        subtitle: isRtl
          ? `أكمل ${nextTierXp - currentTierXp} XP إضافية لفتح الصندوق اليوم!`
          : `Earn ${nextTierXp - currentTierXp} more XP to unlock today's chest!`,
        type: 'info',
      });
      return;
    }

    if (!chestClaimed) {
      setChestClaimed(true);
      celebrate(
        isRtl ? 'مبروك! فتحت صندوق التطور اليومي' : 'Congratulations! Daily Chest Unlocked',
        isRtl ? '+150 XP مجانية وبطاقة مضاعفة النقاط' : '+150 Bonus XP & 2x Multiplier'
      );
    }
  };

  return (
    <section aria-label="XP and Level Status" className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 p-5 sm:p-6 backdrop-blur-2xl shadow-xl shadow-primary/5 mb-8 glow-card transition-all">
      {/* Background Soft Mesh Glow */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#6C63FF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#00E5A8]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* Level Avatar & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white font-black font-mono text-xl shadow-lg shadow-[#6C63FF]/30 shrink-0">
            {level}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00E5A8] border-2 border-card"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-mono">
                {isRtl ? `المستوى الإدراكي ${level}` : `Cognitive Tier ${level}`}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/20">
                1.5x Streak Boost 🔥
              </span>
            </div>
            <h2 className="text-xl font-black font-heading text-foreground mt-0.5">
              {isRtl ? currentTitle.ar : currentTitle.en}
            </h2>
          </div>
        </div>

        {/* XP Status & Milestone Chest */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-start md:text-end font-mono">
            <div className="flex items-center md:justify-end gap-1.5 text-[#6C63FF] font-black text-sm">
              <Sparkles className="h-4 w-4" />
              <span>{currentXp.toLocaleString()} Total XP</span>
            </div>
            <span className="text-[11px] text-muted-foreground block">
              {nextTierXp - currentTierXp} XP {isRtl ? 'لفتح المستوى التالي' : 'to Tier ' + (level + 1)}
            </span>
          </div>

          {/* Duolingo-style Interactive Reward Chest Button */}
          <button
            onClick={handleClaimChest}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              percentage >= 100 || chestClaimed
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-md animate-bounce'
                : 'bg-accent/60 border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            title={isRtl ? 'صندوق المكافأة اليومية' : 'Daily Reward Chest'}
          >
            <Gift className={`h-5 w-5 ${percentage >= 100 || chestClaimed ? 'text-amber-500' : 'text-muted-foreground'}`} />
            <span className="hidden sm:inline">
              {chestClaimed
                ? isRtl ? 'تم الاستلام ✨' : 'Claimed ✨'
                : isRtl ? 'صندوق المكافأة' : 'Reward Chest'}
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Milestone Track Bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded-full bg-muted/60 overflow-hidden relative border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#00E5A8] rounded-full transition-all duration-700 relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Milestone Pinpoints (25%, 50%, 75%, 100%) */}
        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono font-bold px-1">
          <div className="flex items-center gap-1">
            <span className="text-[#6C63FF]">{currentTierXp}</span>
            <span>/</span>
            <span>{nextTierXp} XP</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={percentage >= 50 ? 'text-[#00E5A8]' : ''}>
              {percentage >= 50 ? '✓ 50% Milestone' : '50%'}
            </span>
            <span className="text-foreground font-black text-xs">{percentage}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
