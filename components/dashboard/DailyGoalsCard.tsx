'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Sparkles, Flame, Trophy, Target, Zap, Brain } from 'lucide-react';

export const DailyGoalsCard: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { celebrate, notify } = useFeedback();
  const isRtl = language === 'ar';

  const [goals, setGoals] = useState([
    { id: 1, titleAr: 'إنهاء جلسة تمرين اليوم (3 ألعاب)', titleEn: 'Finish Daily Workout (3 Games)', completed: true, xp: 50, tag: 'Daily' },
    { id: 2, titleAr: 'دقة تتجاوز 85% في صراع ستروب', titleEn: 'Score >=85% in Stroop Clash', completed: true, xp: 75, tag: 'Focus' },
    { id: 3, titleAr: 'إتقان مهارة جديدة في شجرة المهارات', titleEn: 'Master 1 New Skill in Roadmap', completed: false, xp: 100, tag: 'Mastery' },
  ]);

  const [claimed, setClaimed] = useState(false);

  // Read saved state if available
  useEffect(() => {
    const savedClaim = localStorage.getItem('nabh_daily_goal_claimed');
    if (savedClaim) {
      setClaimed(true);
    }
  }, []);

  const completedCount = goals.filter((g) => g.completed).length;
  const percentage = Math.round((completedCount / goals.length) * 100);

  const toggleGoal = (id: number) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const nextState = !target.completed;
    if (nextState) {
      playSound('correct');
      notify({
        title: isRtl ? `أنجزت: ${target.titleAr}` : `Completed: ${target.titleEn}`,
        subtitle: `+${target.xp} XP`,
        type: 'xp',
      });
    } else {
      playSound('pop');
    }

    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: nextState } : g))
    );
  };

  const handleClaimBonus = () => {
    setClaimed(true);
    localStorage.setItem('nabh_daily_goal_claimed', 'true');
    celebrate(
      isRtl ? 'تم استلام مكافأة الأهداف اليومية!' : 'Daily Mission Reward Unlocked!',
      isRtl ? '+150 نقطة خبرة إضافية وسام الإصرار' : '+150 Bonus XP & Daily Persistence Badge'
    );
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card/85 p-5 sm:p-6 backdrop-blur-2xl shadow-xl shadow-primary/5 space-y-4 glow-card flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground font-heading">
                {isRtl ? 'مهام اليوم الإدراكية' : 'Daily Missions'}
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono">
                {completedCount} / {goals.length} {isRtl ? 'مكتملة' : 'Achieved'}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs font-mono">
            +225 XP Max
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-[#00E5A8] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs group ${
                goal.completed
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'border-border/60 bg-background/50 text-foreground hover:bg-accent/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {goal.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                )}
                <span className={`font-semibold truncate text-[11px] sm:text-xs ${goal.completed ? 'line-through opacity-75' : ''}`}>
                  {isRtl ? goal.titleAr : goal.titleEn}
                </span>
              </div>
              <span className="font-mono font-bold text-[10px] sm:text-[11px] text-primary shrink-0">
                +{goal.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus reward claim */}
      <div className="pt-2">
        {completedCount >= 2 && !claimed && (
          <Button
            onClick={handleClaimBonus}
            size="sm"
            className="w-full rounded-2xl font-bold btn-3d btn-3d-amber bg-amber-500 hover:bg-amber-600 text-slate-950 gap-2 shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isRtl ? 'استلام جائزة اليوم (+150 XP)' : 'Claim Daily Bonus (+150 XP)'}</span>
          </Button>
        )}

        {claimed && (
          <div className="py-2.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            <span>{isRtl ? 'تم استلام الجائزة بنجاح ✨' : 'Bonus Claimed Today ✨'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
