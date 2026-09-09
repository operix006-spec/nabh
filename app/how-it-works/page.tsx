'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Sliders,
  TrendingUp,
  Unlock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  // Interactive Simulator State
  const [simulatedReactionTime, setSimulatedReactionTime] = useState<number>(320);
  const [simulatedAccuracy, setSimulatedAccuracy] = useState<number>(94);

  // Calculate dynamic adaptive difficulty from simulated parameters
  const calculatedDifficulty =
    simulatedAccuracy >= 90 && simulatedReactionTime < 350
      ? { level: 'Level 5: Master', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30', descAr: 'استجابة فائقة! المحرك يرفع سرعة المثيرات ويزيد كثافة المشتتات.', descEn: 'High cognitive flow! The engine increases stimulus velocity & distractor density.' }
      : simulatedAccuracy >= 75
      ? { level: 'Level 3: Optimal', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', descAr: 'أداء متوازن! المحرك يثبت الحمل الإدراكي في منطقة التدفق الذهني المثالية.', descEn: 'Optimal zone! Dynamic difficulty maintains steady flow without cognitive fatigue.' }
      : { level: 'Level 1: Calibration', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', descAr: 'إرهاق أو تردد مؤقت! المحرك يبسط الخطوات لتعزيز الثقة والدقة.', descEn: 'Calibrating! The engine gently slows pacing to rebuild precision and reduce error decay.' };

  const steps = [
    {
      num: '01',
      icon: Target,
      color: 'from-blue-500 to-indigo-600',
      titleAr: '1. التقييم المعياري المبدئي (Baseline Assessment)',
      titleEn: '1. Diagnostic Baseline Assessment',
      descAr: 'يبدأ كل متعلم باختبار قياسي سريع في 4 محاور لقياس زمن الرجع، المدى البصري، وكبح الاندفاع وتحديد مؤشر NCI الأولي.',
      descEn: 'Every learner begins with a 4-stage diagnostic calibrating reaction latency, spatial span, and inhibitory control to compute baseline NCI.',
    },
    {
      num: '02',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      titleAr: '2. التمرين اليومي الذكي (3 ألعاب في 10 دقائق)',
      titleEn: '2. Smart Daily Workout (3 Games in 10 Min)',
      descAr: 'يقوم الذكاء الاصطناعي باختيار 3 ألعاب يومياً تركز على المهارات التي أظهرت التحليلات حاجتك لتعزيزها.',
      descEn: 'Our AI engine curates a targeted 3-game daily regiment addressing your specific neural growth opportunities.',
    },
    {
      num: '03',
      icon: Sliders,
      color: 'from-emerald-500 to-teal-600',
      titleAr: '3. التعديل التكيفي اللحظي للصعوبة (DDA)',
      titleEn: '3. Dynamic Difficulty Adjustment (DDA)',
      descAr: 'يحلل المحرك كل نقرة بالميللي ثانية؛ فإذا ارتفعت دقة إجاباتك تزداد السرعة فورياً، وإذا تعثرت يتم ضبط الحمل الإدراكي.',
      descEn: 'The game engine senses millisecond shifts in performance—accelerating pace upon success, or adjusting stimulus pacing to avoid frustration.',
    },
    {
      num: '04',
      icon: Unlock,
      color: 'from-purple-500 to-pink-600',
      titleAr: '4. فتح المهارات والارتقاء في الشجرة (Progression)',
      titleEn: '4. Sequential Skill Unlocking & Mastery',
      descAr: 'الوصول لدرجة 70% وما فوق يمنحك 1 إلى 3 نجوم ويفتح المهارات المتقدمة اللاحقة في شجرة الـ 50 مهارة.',
      descEn: 'Scoring 70%+ awards 1 to 3 golden stars and cascades unlock permissions to subsequent advanced cognitive skills.',
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
          <Activity className="h-4 w-4" />
          <span>{isRtl ? 'الهندسة المعرفية التكيفية' : 'Adaptive Cognitive Engineering'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-foreground mb-6">
          {isRtl ? 'كيف تعمل منصة نَبِـه لتطوير عقلك؟' : 'How Nabh Supercharges Your Cognitive Abilities'}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {isRtl
            ? 'دورة متكاملة مغلقة تجمع بين القياس العصبي، التدريب اللعبي اليومي، والذكاء الاصطناعي التكيفي لتحقيق أعلى درجات المرونة الذهنية.'
            : 'A continuous closed-loop cycle combining neural chronometry, daily gamified micro-drills, and adaptive AI for peak neuroplastic gains.'}
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${s.color} text-white shadow-md`}>
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-3xl font-black font-mono text-muted-foreground/30">
                  {s.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground font-heading mb-3">
                {isRtl ? s.titleAr : s.titleEn}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isRtl ? s.descAr : s.descEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive AI Difficulty Simulator */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/80 p-8 sm:p-12 mb-24 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Sliders className="h-4 w-4" />
            <span>{isRtl ? 'محاكي الخوارزمية التكيفية المباشر' : 'Live Adaptive Engine Simulator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-foreground">
            {isRtl ? 'جرب كيف تتكيف ألعاب نَبِه مع استجابتك' : 'Experience How the Engine Adapts in Real-Time'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {isRtl
              ? 'حرك مؤشرات السرعة والدقة لتشاهد كيف يقوم الذكاء الاصطناعي بتعديل الصعوبة فورياً أثناء اللعب:'
              : 'Adjust the sliders to see how your simulated speed and accuracy dynamically retune game difficulty:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Controls */}
          <div className="space-y-6 bg-accent/40 p-6 rounded-2xl border border-border/50">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>{isRtl ? 'متوسط سرعة الاستجابة:' : 'Reaction Speed:'}</span>
                <span className="font-mono text-primary">{simulatedReactionTime} ms</span>
              </div>
              <input
                type="range"
                min="180"
                max="800"
                step="10"
                value={simulatedReactionTime}
                onChange={(e) => {
                  playSound('pop');
                  setSimulatedReactionTime(Number(e.target.value));
                }}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{isRtl ? 'سريع جداً (180ms)' : 'Ultra Fast (180ms)'}</span>
                <span>{isRtl ? 'متأنٍ (800ms)' : 'Deliberate (800ms)'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>{isRtl ? 'نسبة دقة الإجابات:' : 'Accuracy Rate:'}</span>
                <span className="font-mono text-emerald-500">{simulatedAccuracy}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={simulatedAccuracy}
                onChange={(e) => {
                  playSound('pop');
                  setSimulatedAccuracy(Number(e.target.value));
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{isRtl ? 'تشتت (40%)' : 'Distracted (40%)'}</span>
                <span>{isRtl ? 'مثالي (100%)' : 'Flawless (100%)'}</span>
              </div>
            </div>
          </div>

          {/* Engine Output Card */}
          <div className="rounded-3xl border border-border/60 bg-background/80 p-6 sm:p-8 text-center space-y-4 shadow-xl">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {isRtl ? 'استجابة المحرك العصبي الآن' : 'Engine Calibration State'}
            </span>
            <div className={`inline-block px-4 py-2 rounded-2xl border font-black text-sm sm:text-base font-mono ${calculatedDifficulty.color}`}>
              {calculatedDifficulty.level}
            </div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {isRtl ? calculatedDifficulty.descAr : calculatedDifficulty.descEn}
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>{isRtl ? 'تكيّف ديناميكي بمعدل 60 تحديث في الثانية' : 'Real-time 60Hz telemetry monitoring'}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/dashboard" onClick={() => playSound('fanfare')}>
            <Button size="lg" className="rounded-2xl font-bold btn-3d btn-3d-primary shadow-xl px-8 gap-2">
              <Brain className="h-5 w-5" />
              <span>{isRtl ? 'ابدأ تجربة التدريب التكيفي الآن' : 'Start Adaptive Training Now'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
