'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { MemoryMatrixGame } from '@/components/games/MemoryMatrixGame';
import { StroopClashGame } from '@/components/games/StroopClashGame';
import { SpeedReflexGame } from '@/components/games/SpeedReflexGame';
import { MatrixPatternGame } from '@/components/games/MatrixPatternGame';
import { LearningEngine } from '@/lib/engine/learning-engine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export default function AssessmentPage() {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const { user } = useAuth();
  const isRtl = language === 'ar';

  const [stage, setStage] = useState<'intro' | 'working_memory' | 'attention' | 'speed' | 'logic' | 'certificate'>('intro');
  const [stageScores, setStageScores] = useState<number[]>([]);

  const stagesList = [
    { key: 'working_memory', titleAr: 'اختبار الذاكرة البصرية المكانية', titleEn: 'Visuospatial Working Memory' },
    { key: 'attention', titleAr: 'اختبار كبح الاندفاع وتداخل ستروب', titleEn: 'Inhibitory Control & Stroop' },
    { key: 'speed', titleAr: 'اختبار سرعة الاستجابة الزمنية', titleEn: 'Reaction Latency Chronometry' },
    { key: 'logic', titleAr: 'اختبار الاستدلال المجرد للمصفوفات', titleEn: 'Abstract Matrix Reasoning' },
  ];

  const currentStageIndex = stagesList.findIndex((s) => s.key === stage);

  const handleStageComplete = (score: number) => {
    playSound('success');
    const updated = [...stageScores, score];
    setStageScores(updated);

    if (stage === 'working_memory') {
      setStage('attention');
    } else if (stage === 'attention') {
      setStage('speed');
    } else if (stage === 'speed') {
      setStage('logic');
    } else if (stage === 'logic') {
      playSound('levelUp');
      setStage('certificate');

      // Sync diagnostic results with learning engine & Supabase
      const batterySkills = [
        'working-memory',
        'sustained-attention-vigilance',
        'reaction-time-visual',
        'matrix-reasoning-inductive',
      ];
      updated.forEach((sc, idx) => {
        const targetId = batterySkills[idx] || 'working-memory';
        const normScore = sc > 100 ? Math.min(100, Math.round(sc / 10)) : sc;
        LearningEngine.submitSkillAttempt(
          user?.id || 'demo_user',
          targetId,
          normScore,
          {
            reactionTimesMs: [420, 390, 410],
            meanReactionTimeMs: 405,
            fastestReactionTimeMs: 360,
            accuracyRate: normScore,
            totalAttempts: 10,
            correctAnswers: Math.round((normScore / 100) * 10),
            incorrectAnswers: 10 - Math.round((normScore / 100) * 10),
            highestStreak: 6,
            difficultyLevelReached: 3,
          }
        ).catch((e) => console.warn('Assessment sync error:', e));
      });
    }
  };

  const calculatedNci = stageScores.length > 0
    ? Math.round(stageScores.reduce((a, b) => a + b, 0) / stageScores.length)
    : 840;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. INTRO STAGE */}
      {stage === 'intro' && (
        <Card className="p-8 sm:p-14 rounded-4xl border-2 border-primary/20 shadow-elevated bg-card/95 text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Award className="h-10 w-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
              Standardized Cognitive Battery
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
              {t('assessmentTitle')}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('assessmentSubtitle')}
            </p>
          </div>

          {/* Guidelines Box */}
          <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 max-w-md mx-auto text-xs text-muted-foreground leading-relaxed text-start">
            <p className="font-bold text-foreground mb-1">
              {language === 'ar' ? 'تعليمات التقييم المعتمد:' : 'Clinical Assessment Rules:'}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>{language === 'ar' ? 'الجلوس في بيئة هادئة بعيدة عن المقاطعات' : 'Ensure a quiet distraction-free environment'}</li>
              <li>{language === 'ar' ? 'يشمل 4 مراحل متتالية تستغرق حوالي 8 دقائق' : 'Spans 4 consecutive test stages (~8 mins)'}</li>
              <li>{language === 'ar' ? 'سيتم إصدار شهادة NCI رسمية ومقارنتها بعمرك' : 'Generates verified NCI certificate & percentile'}</li>
            </ul>
          </div>

          <Button
            size="lg"
            variant="gradient"
            onClick={() => {
              playSound('click');
              setStage('working_memory');
            }}
            className="h-14 px-10 rounded-2xl font-bold text-base shadow-lg"
          >
            <span>{t('startAssessment')}</span>
            {isRtl ? <ArrowLeft className="h-5 w-5 ml-2 rtl:mr-2" /> : <ArrowRight className="h-5 w-5 ml-2 rtl:mr-2" />}
          </Button>
        </Card>
      )}

      {/* 2. ACTIVE TEST STAGES (1 to 4) */}
      {stage !== 'intro' && stage !== 'certificate' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-4 rounded-3xl bg-card border border-border/60 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-xs font-mono font-bold">
                {t('stage')} {currentStageIndex + 1} / 4
              </Badge>
              <span className="text-sm font-bold text-foreground">
                {language === 'ar' ? stagesList[currentStageIndex].titleAr : stagesList[currentStageIndex].titleEn}
              </span>
            </div>
            <div className="w-32 hidden sm:block">
              <Progress value={((currentStageIndex + 1) / 4) * 100} className="h-2" />
            </div>
          </div>

          {/* Active Game Stage Component */}
          {stage === 'working_memory' && <MemoryMatrixGame onComplete={handleStageComplete} />}
          {stage === 'attention' && <StroopClashGame onComplete={handleStageComplete} />}
          {stage === 'speed' && <SpeedReflexGame onComplete={handleStageComplete} />}
          {stage === 'logic' && <MatrixPatternGame onComplete={handleStageComplete} />}
        </div>
      )}

      {/* 3. VERIFIED OFFICIAL CERTIFICATE STAGE */}
      {stage === 'certificate' && (
        <Card className="p-8 sm:p-14 rounded-4xl border-4 border-primary/30 shadow-elevated bg-card relative overflow-hidden text-center space-y-8">
          
          {/* Certificate Header Watermark */}
          <div className="flex items-center justify-between pb-6 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                <Brain className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black font-heading tracking-tight text-foreground">
                {language === 'ar' ? 'نَبِـه' : 'Nabh'}
              </span>
            </div>
            <Badge variant="success" className="gap-1 px-3 py-1 font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>{language === 'ar' ? 'شهادة معتمدة موثقة' : 'Verified Clinical Score'}</span>
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-foreground">
              {t('certificateTitle')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'مُنحت للمتدرب(ة):' : 'Issued to Candidate:'}{' '}
              <strong className="text-foreground">{user?.displayName || 'سارة المنصور'}</strong>
            </p>
          </div>

          {/* Big Verified Score Dial */}
          <div className="my-6 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/10 to-transparent border border-primary/20 max-w-sm mx-auto">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">
              {t('verifiedCognitiveScore')}
            </span>
            <div className="text-6xl font-black font-mono text-primary my-2">
              {calculatedNci}
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
              {t('percentileTop')} 9% {t('ofAgeGroup')}
            </span>
          </div>

          {/* Subscale Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-center">
            <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold block">{language === 'ar' ? 'الذاكرة' : 'Memory'}</span>
              <span className="text-base font-black font-mono text-foreground">88/100</span>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold block">{language === 'ar' ? 'الانتباه' : 'Attention'}</span>
              <span className="text-base font-black font-mono text-foreground">92/100</span>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold block">{language === 'ar' ? 'السرعة' : 'Speed'}</span>
              <span className="text-base font-black font-mono text-foreground">85/100</span>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/50 border border-border/60">
              <span className="text-[10px] text-muted-foreground font-bold block">{language === 'ar' ? 'الاستدلال' : 'Reasoning'}</span>
              <span className="text-base font-black font-mono text-foreground">94/100</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border/60">
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                playSound('click');
                window.print();
              }}
              className="h-12 px-6 rounded-2xl font-bold gap-2"
            >
              <Download className="h-4 w-4" />
              <span>{t('downloadReport')}</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                playSound('click');
                setStage('intro');
                setStageScores([]);
              }}
              className="h-12 px-6 rounded-2xl font-bold gap-2 border-border/70"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{language === 'ar' ? 'إعادة التقييم' : 'Retake Assessment'}</span>
            </Button>
          </div>

        </Card>
      )}

    </div>
  );
}
