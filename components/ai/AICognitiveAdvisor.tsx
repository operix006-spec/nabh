'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import {
  CognitiveAIEngine,
  AIDifficultyAdjustment,
  AIPersonalizedPathMilestone,
  AIPredictedWeakness,
  AIMistakeExplanation,
  AIEncouragement,
} from '@/lib/engine/ai-engine';
import { ALL_50_ENRICHED_SKILLS, LearningEngine } from '@/lib/engine/learning-engine';
import { UserSkillProgress, AIRoadmapRecommendation, AIMistakeAnalysis, AIEvaluationSummary } from '@/types/cognitive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Compass,
  AlertTriangle,
  Flame,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Activity,
  Lightbulb,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Sliders,
  Play,
  HeartHandshake,
} from 'lucide-react';

interface AICognitiveAdvisorProps {
  initialTab?: 'recommend' | 'mistakes' | 'path' | 'predict' | 'report' | 'dda';
  compact?: boolean;
}

export const AICognitiveAdvisor: React.FC<AICognitiveAdvisorProps> = ({
  initialTab = 'recommend',
  compact = false,
}) => {
  const { language } = useLanguage();
  const { user, sessions } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState<'recommend' | 'mistakes' | 'path' | 'predict' | 'report' | 'dda'>(initialTab);
  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});
  
  // AI State
  const [recommendation, setRecommendation] = useState<AIRoadmapRecommendation | null>(null);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<AIMistakeAnalysis | null>(null);
  const [mistakeExplanation, setMistakeExplanation] = useState<AIMistakeExplanation | null>(null);
  const [selectedErrorType, setSelectedErrorType] = useState<
    'impulsive_error' | 'working_memory_decay' | 'set_shifting_perseveration' | 'distractor_capture' | 'auditory_lapse'
  >('impulsive_error');
  const [personalizedPath, setPersonalizedPath] = useState<AIPersonalizedPathMilestone[]>([]);
  const [pathGoal, setPathGoal] = useState<'memory' | 'speed' | 'attention' | 'logic'>('memory');
  const [predictedWeaknesses, setPredictedWeaknesses] = useState<AIPredictedWeakness[]>([]);
  const [aiReport, setAiReport] = useState<AIEvaluationSummary | null>(null);
  const [ddaState, setDdaState] = useState<AIDifficultyAdjustment | null>(null);
  const [encouragement, setEncouragement] = useState<AIEncouragement | null>(null);

  // DDA Interactive Simulator State
  const [simStreak, setSimStreak] = useState(4);
  const [simAccuracy, setSimAccuracy] = useState(92);
  const [simRt, setSimRt] = useState(380);

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then((pm) => {
      setProgressMap(pm);

      // Latest session telemetry if available
      const latestSession = sessions[0];
      const rec = CognitiveAIEngine.recommendNextExercise(pm, latestSession?.telemetry);
      setRecommendation(rec);

      const path = CognitiveAIEngine.generatePersonalizedPath(pathGoal, pm);
      setPersonalizedPath(path);

      const weak = CognitiveAIEngine.predictWeakSkills(pm);
      setPredictedWeaknesses(weak);

      const rep = CognitiveAIEngine.generateEvaluationReport(pm, sessions.length || 18);
      setAiReport(rep);

      const dda = CognitiveAIEngine.computeDynamicDifficulty(simStreak, simAccuracy, simRt);
      setDdaState(dda);

      const enc = CognitiveAIEngine.generateEncouragement(simStreak, simAccuracy);
      setEncouragement(enc);

      if (latestSession) {
        const ma = CognitiveAIEngine.analyzeMistakes(latestSession.telemetry);
        setMistakeAnalysis(ma);
      } else {
        const sampleTelemetry = {
          accuracyRate: 68,
          meanReactionTimeMs: 780,
          fastestReactionTimeMs: 270,
          highestStreak: 2,
          incorrectAnswers: 3,
          difficultyLevelReached: 2,
        };
        setMistakeAnalysis(CognitiveAIEngine.analyzeMistakes(sampleTelemetry));
      }

      setMistakeExplanation(CognitiveAIEngine.explainMistake(selectedErrorType));
    });
  }, [user, sessions, pathGoal, simStreak, simAccuracy, simRt, selectedErrorType]);

  const recommendedSkill = recommendation
    ? ALL_50_ENRICHED_SKILLS.find((s) => s.id === recommendation.nextSkillId) || ALL_50_ENRICHED_SKILLS[0]
    : ALL_50_ENRICHED_SKILLS[0];

  return (
    <Card className="rounded-3xl border border-primary/20 bg-card/85 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-heading text-foreground">
                {isRtl ? 'المستشار الإدراكي الذكي (Nabh AI)' : 'Nabh Cognitive AI Advisor'}
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                v2.4 Neural
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {isRtl
                ? 'خوارزميات التكيف والتشخيص العصبي المعتمدة على معايير CHC'
                : 'Adaptive learning & neuro-predictive psychometrics based on CHC taxonomy'}
            </p>
          </div>
        </div>

        {/* Quick Encouragement pill */}
        {encouragement && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{isRtl ? encouragement.headlineAr : encouragement.headlineEn}</span>
          </div>
        )}
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'recommend', labelAr: 'التمرين التالي الموصى به', labelEn: 'Next Recommendation', icon: Target },
          { id: 'mistakes', labelAr: 'تحليل وتفسير الأخطاء', labelEn: 'Mistake Analysis', icon: ShieldAlert },
          { id: 'path', labelAr: 'المسار التعليمي المخصص', labelEn: 'Personalized Path', icon: Compass },
          { id: 'predict', labelAr: 'التنبؤ بنقاط الضعف', labelEn: 'Predict Weak Skills', icon: Activity },
          { id: 'dda', labelAr: 'التكيف الذاتي للصعوبة (DDA)', labelEn: 'Adaptive DDA', icon: Sliders },
          { id: 'report', labelAr: 'التقرير السريري الذكي', labelEn: 'AI Clinical Report', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('tick');
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.02]'
                  : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RECOMMEND NEXT EXERCISE */}
      {activeTab === 'recommend' && recommendation && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {isRtl ? `درجة الثقة الخوارزمية: ${Math.round(recommendation.confidenceScore * 100)}%` : `AI Confidence: ${Math.round(recommendation.confidenceScore * 100)}%`}
                  </span>
                </div>

                <h4 className="text-2xl font-black font-heading text-foreground">
                  #{recommendedSkill.number} - {isRtl ? recommendedSkill.nameAr : recommendedSkill.nameEn}
                </h4>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isRtl ? recommendation.rationaleAr : recommendation.rationaleEn}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Badge variant="outline" className="text-xs py-1 px-3 rounded-xl border-primary/30 font-mono">
                    {recommendedSkill.domain.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 font-mono">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +{recommendation.estimatedGrowthDelta}% {isRtl ? 'نمو إدراكي متوقع' : 'Estimated Growth'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                <Link
                  href={`/games/${recommendedSkill.targetGameId}`}
                  onClick={() => playSound('fanfare')}
                  className="w-full"
                >
                  <Button size="lg" className="w-full md:w-auto font-bold rounded-2xl btn-3d btn-3d-primary gap-2 px-8 py-6 text-sm">
                    <Play className="h-5 w-5 fill-white" />
                    <span>{isRtl ? 'بدء التمرين الموصى به الآن' : 'Start Recommended Workout'}</span>
                    {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </Link>

                <Link
                  href={`/skills/${recommendedSkill.id}`}
                  onClick={() => playSound('click')}
                  className="text-xs text-muted-foreground hover:text-primary underline font-medium"
                >
                  {isRtl ? 'عرض خريطة المهارة ومتطلباتها' : 'View Skill Details & Prerequisites'}
                </Link>
              </div>
            </div>
          </div>

          {/* Neuro Affirmation snippet */}
          {encouragement && (
            <div className="p-4 rounded-2xl bg-accent/40 border border-border/60 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <strong className="text-foreground block">{isRtl ? encouragement.bodyAr : encouragement.bodyEn}</strong>
                <p className="text-muted-foreground">{isRtl ? encouragement.neuroFactAr : encouragement.neuroFactEn}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ANALYZE & EXPLAIN MISTAKES */}
      {activeTab === 'mistakes' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Recent Session Mistake Pattern Diagnostic */}
          {mistakeAnalysis && (
            <div className="p-6 rounded-3xl bg-secondary/40 border border-border/70 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                  <h4 className="font-bold text-sm text-foreground">
                    {isRtl ? 'تشخيص نمط الأخطاء في آخر جلسة تمرين' : 'Latest Session Error Pattern'}
                  </h4>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {mistakeAnalysis.errorPattern}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl ? mistakeAnalysis.neuroReasonAr : mistakeAnalysis.neuroReasonEn}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-card border border-border/50">
                  <span className="text-muted-foreground block text-[10px]">
                    {isRtl ? 'المنطقة الدماغية المسؤولة:' : 'Engaged Brain Region:'}
                  </span>
                  <strong className="text-primary">{mistakeAnalysis.involvedBrainArea}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/50">
                  <span className="text-muted-foreground block text-[10px]">
                    {isRtl ? 'نصيحة التصحيح الفوري:' : 'Correction Directive:'}
                  </span>
                  <strong className="text-emerald-500">
                    {isRtl ? mistakeAnalysis.actionableTipAr : mistakeAnalysis.actionableTipEn}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Mistake Explainer Simulator */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span>{isRtl ? 'مستكشف التفسير العصبي للأخطاء (Neuro-Pedagogical Engine)' : 'Neuro-Pedagogical Mistake Explainer'}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'impulsive_error', labelAr: 'الاندفاع الحركي السريع', labelEn: 'Impulsive Tap' },
                { id: 'working_memory_decay', labelAr: 'تلاشي الذاكرة المؤقتة', labelEn: 'Memory Decay' },
                { id: 'set_shifting_perseveration', labelAr: 'المثابرة وتكرار القاعدة القديمة', labelEn: 'Rule Perseveration' },
                { id: 'distractor_capture', labelAr: 'التشتت بالمثيرات الجانبية', labelEn: 'Distractor Capture' },
                { id: 'auditory_lapse', labelAr: 'انحراف التمييز السمعي', labelEn: 'Auditory Jitter' },
              ].map((err) => (
                <button
                  key={err.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedErrorType(err.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedErrorType === err.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {isRtl ? err.labelAr : err.labelEn}
                </button>
              ))}
            </div>

            {mistakeExplanation && (
              <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-sm text-foreground">
                    {isRtl ? mistakeExplanation.titleAr : mistakeExplanation.titleEn}
                  </h5>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {mistakeExplanation.involvedBrainArea}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {isRtl ? mistakeExplanation.neuroExplanationAr : mistakeExplanation.neuroExplanationEn}
                </p>
                <div className="p-3 rounded-2xl bg-card border border-border/50 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    {isRtl ? mistakeExplanation.immediateCorrectionTipAr : mistakeExplanation.immediateCorrectionTipEn}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PERSONALIZED LEARNING PATH */}
      {activeTab === 'path' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-foreground">
                {isRtl ? 'المسار الإدراكي المصمم خصيصاً لك' : 'Tailored Trajectory Milestones'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isRtl ? 'تخطيط تسلسلي لتحقيق أقصى درجات النضج المعرفي' : 'Sequential progression calibrated for maximal neuroplasticity'}
              </p>
            </div>

            {/* Goal Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl">
              {(['memory', 'speed', 'attention', 'logic'] as const).map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    playSound('click');
                    setPathGoal(goal);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                    pathGoal === goal
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedPath.map((step) => (
              <div
                key={step.skillId}
                className="p-5 rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="h-6 w-6 rounded-full bg-primary/15 text-primary font-mono font-bold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono capitalize">
                      {step.domain}
                    </Badge>
                  </div>

                  <h5 className="font-bold text-sm text-foreground">
                    {isRtl ? step.skillNameAr : step.skillNameEn}
                  </h5>

                  <p className="text-xs text-muted-foreground">
                    {isRtl ? step.priorityReasonAr : step.priorityReasonEn}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-mono">
                    ~{step.estimatedDaysToMaster} {isRtl ? 'أيام للإتقان' : 'days target'}
                  </span>
                  <Link href={`/skills/${step.skillId}`} onClick={() => playSound('click')}>
                    <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 text-primary">
                      <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
                      {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PREDICT WEAK SKILLS */}
      {activeTab === 'predict' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              <span>{isRtl ? 'التنبؤ المبكر بنقاط الضعف والعقبات الإدراكية' : 'AI Bottleneck Early Warning'}</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {isRtl
                ? 'يكشف الذكاء الاصطناعي العقبات المستقبلية في المستويات المتقدمة قبل أن تصل إليها'
                : 'Forecasts latent performance bottlenecks in advanced tiers based on foundational indicators'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictedWeaknesses.map((w, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-foreground">
                    {isRtl ? w.skillNameAr : w.skillNameEn}
                  </h5>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {w.vulnerabilityScore}% {isRtl ? 'احتمال التعثر' : 'Vulnerability'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">
                      {isRtl ? 'التفسير العصبي التنبئي:' : 'Predictive Rationale:'}
                    </span>
                    <p className="text-foreground/90 leading-relaxed">
                      {isRtl ? w.neuroRationaleAr : w.neuroRationaleEn}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-card border border-border/50">
                    <span className="text-muted-foreground block text-[10px] mb-0.5">
                      {isRtl ? 'استراتيجية الوقاية الاستباقية:' : 'Proactive Prevention Strategy:'}
                    </span>
                    <strong className="text-emerald-500">
                      {isRtl ? w.preventionStrategyAr : w.preventionStrategyEn}
                    </strong>
                  </div>
                </div>

                <Link href={`/skills/${w.skillId}`} onClick={() => playSound('click')}>
                  <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10">
                    {isRtl ? 'تحصين هذه المهارة الآن' : 'Fortify Skill Pre-emptively'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ADAPTIVE LEARNING & DDA (DIFFICULTY ADJUSTMENT) */}
      {activeTab === 'dda' && ddaState && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span>{isRtl ? 'محاكي التكيف الديناميكي للصعوبة (Dynamic Difficulty Adjustment)' : 'Real-time DDA Calibration'}</span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {isRtl
                ? 'يقوم المحرك بتعديل سرعة المثيرات وكثافة المشتتات آنياً لضمان بقاء المتعلم في حالة التدفق (Flow State)'
                : 'Engine dynamically modulates speed pacing, distractor noise, and time limits to maintain optimal flow'}
            </p>
          </div>

          {/* Interactive DDA Simulator Sliders */}
          <div className="p-6 rounded-3xl bg-secondary/40 border border-border/70 space-y-4">
            <span className="text-xs font-bold text-foreground block">
              {isRtl ? 'اختبر رد فعل خوارزمية DDA بتغيير المقاييس الحية:' : 'Simulate live cognitive telemetry inputs:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isRtl ? 'السلسلة المتتالية' : 'Streak'}</span>
                  <span className="text-primary font-bold">{simStreak}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simStreak}
                  onChange={(e) => setSimStreak(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isRtl ? 'نسبة الدقة' : 'Accuracy'}</span>
                  <span className="text-emerald-500 font-bold">{simAccuracy}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={simAccuracy}
                  onChange={(e) => setSimAccuracy(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isRtl ? 'زمن الرجع' : 'Reaction Time'}</span>
                  <span className="text-amber-500 font-bold">{simRt} ms</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="20"
                  value={simRt}
                  onChange={(e) => setSimRt(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* DDA Output Gauge */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-card border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px] mb-1">{isRtl ? 'المستوى المتكيف' : 'DDA Level'}</span>
              <strong className="text-2xl font-black text-primary">Lvl {ddaState.currentLevel}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px] mb-1">{isRtl ? 'مضاعف السرعة' : 'Speed Rate'}</span>
              <strong className="text-2xl font-black text-emerald-500">{ddaState.recommendedSpeedMultiplier}x</strong>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px] mb-1">{isRtl ? 'كثافة المشتتات' : 'Distractors'}</span>
              <strong className="text-2xl font-black capitalize text-amber-500">{ddaState.distractorDensity}</strong>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px] mb-1">{isRtl ? 'معدل الوقت' : 'Time Modifier'}</span>
              <strong className="text-2xl font-black text-indigo-500">
                {ddaState.timeLimitModifierSec >= 0 ? `+${ddaState.timeLimitModifierSec}s` : `${ddaState.timeLimitModifierSec}s`}
              </strong>
            </div>
          </div>

          {/* Reason explanation */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-foreground/90">
            <strong className="text-primary block mb-1">{isRtl ? 'سبب التكيف الخوارزمي:' : 'Algorithmic Adaptation Rationale:'}</strong>
            <p className="leading-relaxed">
              {isRtl ? ddaState.adaptationReasonAr : ddaState.adaptationReasonEn}
            </p>
          </div>
        </div>
      )}

      {/* TAB 6: AI CLINICAL REPORT */}
      {activeTab === 'report' && aiReport && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>{isRtl ? 'التقرير السريري الإدراكي المولد بالذكاء الاصطناعي' : 'AI Psychometric Clinical Evaluation'}</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                {isRtl ? 'تحليل تلقائي متوافق مع تصنيف CHC القياسي' : 'Automated synthesis aligned with CHC neuropsychological framework'}
              </p>
            </div>

            <Link href="/reports" onClick={() => playSound('click')}>
              <Button size="sm" className="font-bold rounded-2xl btn-3d btn-3d-primary text-xs gap-1.5">
                <span>{isRtl ? 'عرض التقرير السريري الكامل' : 'Open Full Official Report'}</span>
                {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                {isRtl ? 'أبرز نقاط القوة الإدراكية' : 'Primary Cognitive Strength'}
              </span>
              <strong className="text-sm text-foreground block">
                {isRtl ? aiReport.primaryStrengthAr : aiReport.primaryStrengthEn}
              </strong>
              <p className="text-muted-foreground text-[11px]">
                {isRtl ? 'أظهرت الاختبارات سرعة معالجة عالية وثباتاً فائقاً في دقة التمييز.' : 'Consistently operates within the top demographic percentile for rapid visual sorting.'}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-600 block">
                {isRtl ? 'المجال ذو الأولوية للتطوير' : 'Target Growth Bottleneck'}
              </span>
              <strong className="text-sm text-foreground block">
                {isRtl ? aiReport.bottleneckDomainAr : aiReport.bottleneckDomainEn}
              </strong>
              <p className="text-muted-foreground text-[11px]">
                {isRtl ? 'ينصح بزيادة تدريبات كبح الاندفاع وتخفيف التسرع تحت الضغط.' : 'Inhibitory control workouts recommended to reduce premature error spikes.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border/70 text-xs space-y-2">
            <span className="text-muted-foreground block text-[10px]">
              {isRtl ? 'الملاحظة التشجيعية السريرية:' : 'Clinical Encouragement & Prognosis:'}
            </span>
            <p className="text-foreground leading-relaxed">
              {isRtl ? aiReport.encouragementAr : aiReport.encouragementEn}
            </p>
            <div className="pt-2 flex items-center gap-4 text-muted-foreground font-mono text-[11px]">
              <span>⏱️ {isRtl ? 'المدة اليومية المقترحة:' : 'Target Daily Workout:'} {aiReport.suggestedWorkoutDurationMin} {isRtl ? 'دقائق' : 'mins'}</span>
              <span>📈 {isRtl ? 'معدل تطور المؤشر:' : 'Index Velocity:'} +{aiReport.overallIndexDelta} pts</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
