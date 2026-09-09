'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameSessionTelemetry } from '@/types/cognitive';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Zap,
  Target,
  Flame,
  Clock,
  Sparkles,
  RotateCcw,
  LayoutDashboard,
  ArrowRight,
  ArrowLeft,
  Brain,
  Star,
  Download,
  FileText,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { CognitiveAIEngine } from '@/lib/engine/ai-engine';
import { NeuroBrainMascot } from '@/components/common/NeuroIllustrations';

interface PostGameResultsModalProps {
  score: number;
  xpEarned: number;
  telemetry: GameSessionTelemetry;
  skillName: string;
  onRestart: () => void;
  onNext?: () => void;
}

export const PostGameResultsModal: React.FC<PostGameResultsModalProps> = ({
  score,
  xpEarned,
  telemetry,
  skillName,
  onRestart,
  onNext,
}) => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const [copied, setCopied] = useState(false);

  // Compute stars: 1 (>= 70%), 2 (>= 85%), 3 (>= 95%)
  const normalizedScore = score > 100 ? Math.min(100, Math.round(score / 10)) : score;
  const starsEarned = normalizedScore >= 95 ? 3 : normalizedScore >= 85 ? 2 : normalizedScore >= 70 ? 1 : 0;
  const isPassed = normalizedScore >= 70;

  useEffect(() => {
    playSound(isPassed ? 'fanfare' : 'levelUp');

    try {
      confetti({
        particleCount: isPassed ? 100 : 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#F59E0B', '#EC4899'],
      });
    } catch {
      // safe fallback
    }
  }, [isPassed, playSound]);

  const handleExportReport = () => {
    playSound('pop');
    const reportData = {
      title: `Nabh Cognitive Evaluation Report: ${skillName}`,
      date: new Date().toISOString(),
      score: normalizedScore,
      stars: starsEarned,
      isPassed,
      xpEarned,
      telemetry: {
        accuracyRate: `${Math.round(telemetry.accuracyRate)}%`,
        meanReactionTime: `${Math.round(telemetry.meanReactionTimeMs)} ms`,
        fastestReactionTime: `${Math.round(telemetry.fastestReactionTimeMs)} ms`,
        highestStreak: `${telemetry.highestStreak}x`,
        difficultyReached: telemetry.difficultyLevelReached,
      },
      clinicalDiagnosis: isPassed
        ? 'Executive control parameters within optimal neuro-cognitive norm (CHC model).'
        : 'Sub-threshold executive latency detected; additional stimulus priming recommended.',
      databaseSyncStatus: 'Persisted to Supabase (game_sessions & user_skill_progress)',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nabh-report-${Date.now()}.json`;
    a.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isRtl = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-lg p-6 sm:p-8 rounded-4xl border-2 border-primary/20 shadow-2xl bg-card/95 backdrop-blur-2xl max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header Ribbon */}
        {/* Header Ribbon with Celebratory Mascot */}
        <div className="text-center space-y-2 relative">
          <div className="flex justify-center -mt-2 mb-1 animate-float">
            <NeuroBrainMascot expression="celebrating" size={110} />
          </div>

          {/* Stars Reward Row */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {[1, 2, 3].map((starNum) => (
              <Star
                key={starNum}
                className={`h-8 w-8 transition-all duration-300 ${
                  starNum <= starsEarned
                    ? 'fill-amber-400 text-amber-400 filter drop-shadow-md scale-110 animate-bounce'
                    : 'text-muted-foreground/25'
                }`}
                style={{ animationDelay: `${starNum * 150}ms` }}
              />
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isPassed ? (isRtl ? 'تم الاجتياز بنجاح!' : 'Skill Passed!') : (isRtl ? 'محاولة تدريبية جيدة' : 'Practice Workout')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {skillName}
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground block">
            {isRtl ? 'تم الحفظ والمزامنة السحابية مع Supabase' : 'Saved & Synchronized with Supabase'}
          </span>
        </div>

        {/* Big Score Dial */}
        <div className="my-5 rounded-3xl bg-gradient-to-b from-primary/10 to-primary/5 p-5 border border-primary/15 text-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            {isRtl ? 'النتيجة الإجمالية' : 'Total Score'}
          </span>
          <div className="text-5xl font-black text-primary font-mono my-1 tracking-tight">
            {score}
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>+{xpEarned} XP Earned • Streak Bonus Applied</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-start">
          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mb-1">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{t('meanReactionTime')}</span>
            </div>
            <div className="text-lg font-bold font-mono">
              {Math.round(telemetry.meanReactionTimeMs)} ms
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mb-1">
              <Target className="h-4 w-4 text-emerald-500" />
              <span>{t('accuracyRate')}</span>
            </div>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {Math.round(telemetry.accuracyRate)}%
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mb-1">
              <Flame className="h-4 w-4 text-rose-500" />
              <span>{t('streak')}</span>
            </div>
            <div className="text-lg font-bold font-mono text-rose-500">
              {telemetry.highestStreak}x Combo
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mb-1">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>{t('fastestReaction')}</span>
            </div>
            <div className="text-lg font-bold font-mono">
              {Math.round(telemetry.fastestReactionTimeMs)} ms
            </div>
          </div>
        </div>

        {/* AI Neuro Feedback & Dynamic Difficulty Adjustment (DDA) */}
        {(() => {
          const aiEncouragement = CognitiveAIEngine.generateEncouragement(telemetry.highestStreak, normalizedScore);
          const aiMistake = CognitiveAIEngine.analyzeMistakes(telemetry);
          const aiDda = CognitiveAIEngine.computeDynamicDifficulty(telemetry.highestStreak, telemetry.accuracyRate, telemetry.meanReactionTimeMs);
          const mistakeExplanation = CognitiveAIEngine.explainMistake(
            telemetry.fastestReactionTimeMs < 290 ? 'impulsive_error' : telemetry.meanReactionTimeMs > 750 ? 'working_memory_decay' : 'set_shifting_perseveration'
          );

          return (
            <div className="space-y-3 mb-5 text-start">
              {/* 1. AI Encouragement Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-primary/15 via-purple-500/10 to-card border border-primary/25 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>{isRtl ? aiEncouragement.headlineAr : aiEncouragement.headlineEn}</span>
                  </span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-mono">
                    AI Feedback
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {isRtl ? aiEncouragement.bodyAr : aiEncouragement.bodyEn}
                </p>
                <div className="pt-1 text-[11px] text-primary/90 font-medium flex items-center gap-1.5">
                  <Brain className="h-3.5 w-3.5 shrink-0" />
                  <span>{isRtl ? aiEncouragement.neuroFactAr : aiEncouragement.neuroFactEn}</span>
                </div>
              </div>

              {/* 2. DDA (Dynamic Difficulty Adjustment) Real-Time Notification */}
              <div className="p-3.5 rounded-2xl bg-secondary/60 border border-border/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="font-bold text-foreground block">
                      {isRtl ? `تكييف الصعوبة الذاتي: المستوى ${aiDda.currentLevel}` : `Adaptive DDA: Level ${aiDda.currentLevel}`}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isRtl ? aiDda.adaptationReasonAr : aiDda.adaptationReasonEn}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                  {aiDda.recommendedSpeedMultiplier}x Speed
                </Badge>
              </div>

              {/* 3. AI Mistake Analysis & Neurological Explanation (Expandable) */}
              <div className="p-4 rounded-2xl bg-accent/30 border border-border/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>{isRtl ? 'تحليل وتفسير الأخطاء بالذكاء الاصطناعي:' : 'AI Mistake Explanation:'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {mistakeExplanation.involvedBrainArea}
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {isRtl ? mistakeExplanation.neuroExplanationAr : mistakeExplanation.neuroExplanationEn}
                </p>
                <div className="p-2.5 rounded-xl bg-card border border-border/50 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>{isRtl ? mistakeExplanation.immediateCorrectionTipAr : mistakeExplanation.immediateCorrectionTipEn}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Action Buttons & Report Export */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <Button
              variant="default"
              size="lg"
              onClick={onRestart}
              className="w-full sm:flex-1 font-bold gap-2 rounded-2xl btn-3d btn-3d-primary text-xs"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{t('restartGame')}</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleExportReport}
              className="w-full sm:flex-1 font-bold gap-2 rounded-2xl border-border/80 text-xs"
            >
              <Download className="h-4 w-4" />
              <span>{copied ? (isRtl ? 'تم التصدير!' : 'Exported!') : (isRtl ? 'تصدير التقرير JSON' : 'Export Report')}</span>
            </Button>
          </div>

          <div className="flex gap-2">
            {onNext && (
              <Button
                variant="gradient"
                onClick={onNext}
                className="flex-1 font-bold gap-2 rounded-2xl text-xs h-11"
              >
                <span>{t('nextGame')}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            )}

            <Link href="/dashboard" className="flex-1">
              <Button
                variant="ghost"
                className="w-full font-bold gap-2 rounded-2xl border border-border/60 text-xs h-11"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{t('navDashboard')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
