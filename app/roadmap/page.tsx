'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_SKILLS_50, COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import { LearningEngine, getEnrichedSkill } from '@/lib/engine/learning-engine';
import { CognitiveSkill, UserSkillProgress } from '@/types/cognitive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Map,
  Lock,
  Unlock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Brain,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { NeuroBrainMascot } from '@/components/common/NeuroIllustrations';

export default function SkillRoadmapPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});
  const [selectedSkill, setSelectedSkill] = useState<CognitiveSkill | null>(null);
  const [activeTier, setActiveTier] = useState<number>(1);

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then(setProgressMap);
  }, [user]);

  const tiers = [
    { level: 1, titleAr: 'المستوى 1: المعالجة الحسية والانتباه', titleEn: 'Tier 1: Sensory & Attentional Core', range: [1, 10] },
    { level: 2, titleAr: 'المستوى 2: السرعة والتحكم المثبط', titleEn: 'Tier 2: Speed & Inhibitory Control', range: [11, 20] },
    { level: 3, titleAr: 'المستوى 3: الذاكرة العاملة والمرونة', titleEn: 'Tier 3: Working Memory & Flexibility', range: [21, 30] },
    { level: 4, titleAr: 'المستوى 4: التفكير التحليلي والمكاني', titleEn: 'Tier 4: Analytical & Spatial Reasoning', range: [31, 40] },
    { level: 5, titleAr: 'المستوى 5: قمة المهارات التنفيذية', titleEn: 'Tier 5: Peak Executive Mastery', range: [41, 50] },
  ];

  const currentTierSkills = COGNITIVE_SKILLS_50.filter((s) => {
    const tier = tiers.find((t) => t.level === activeTier);
    if (!tier) return true;
    return s.number >= tier.range[0] && s.number <= tier.range[1];
  });

  const handleNodeClick = (skill: CognitiveSkill) => {
    const prog = progressMap[skill.id];
    if (prog?.isUnlocked) {
      playSound('pop');
    } else {
      playSound('wrong');
    }
    setSelectedSkill(skill);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with Mascot */}
      <div className="relative overflow-hidden rounded-4xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-purple-500/10 p-6 sm:p-10 backdrop-blur-2xl shadow-xl mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
              <Map className="h-4 w-4" />
              <span>{isRtl ? 'خريطة التعلم والتطور الإدراكي' : 'Cognitive Skill Roadmap & Mastery Tree'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight">
              {isRtl ? 'شجرة الـ 50 مهارة المتسلسلة (Khan Mastery)' : 'The 50-Skill Progression Tree (Khan Mastery)'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isRtl
                ? 'تفتح كل مهارة تلو الأخرى عند إحراز 70% وما فوق في المتطلبات السابقة، لتحقيق أقصى درجات المرونة العصبية التراكمية.'
                : 'Skills unlock sequentially upon achieving 70%+ in prerequisite drills, building deep structural neuroplasticity.'}
            </p>
          </div>

          <div className="shrink-0 animate-float">
            <NeuroBrainMascot expression="curious" size={130} />
          </div>
        </div>
      </div>

      {/* Tier Selector Ribbon (Apple Segmented Glass Pills) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {tiers.map((t) => {
          const isActive = activeTier === t.level;
          return (
            <button
              key={t.level}
              onClick={() => {
                playSound('click');
                setActiveTier(t.level);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? 'bg-primary text-white shadow-lg ring-2 ring-primary/40 scale-[1.03] btn-3d btn-3d-primary'
                  : 'bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              {isRtl ? t.titleAr : t.titleEn}
            </button>
          );
        })}
      </div>

      {/* Skills Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
        {currentTierSkills.map((skill) => {
          const prog = progressMap[skill.id];
          const isUnlocked = prog?.isUnlocked ?? (skill.number === 1);
          const isCompleted = prog?.status === 'completed';
          const stars = prog?.stars || 0;
          const score = prog?.bestScore || 0;

          return (
            <div
              key={skill.id}
              onClick={() => handleNodeClick(skill)}
              className={`relative rounded-3xl border p-5 cursor-pointer backdrop-blur-xl transition-all duration-300 flex flex-col justify-between glow-card ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-500/5 shadow-md hover:border-emerald-500'
                  : isUnlocked
                  ? 'border-primary/40 bg-card/90 shadow-md hover:border-primary'
                  : 'border-border/40 bg-muted/30 opacity-75 grayscale-[40%]'
              }`}
            >
              {/* Header Badge: Number & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-black text-muted-foreground">
                  #{String(skill.number).padStart(2, '0')}
                </span>
                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isUnlocked ? (
                    <Unlock className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Title & Domain */}
              <div className="my-2">
                <h4 className="font-bold text-sm text-foreground line-clamp-2">
                  {isRtl ? skill.nameAr : skill.nameEn}
                </h4>
                <span className="text-[10px] text-muted-foreground block mt-1">
                  {skill.domain}
                </span>
              </div>

              {/* Stars & Score Status */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`h-3.5 w-3.5 ${
                        starIdx <= stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted/60'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono font-bold text-foreground">
                  {score > 0 ? `${score}%` : (isUnlocked ? (isRtl ? 'جاهز' : 'Ready') : (isRtl ? 'مغلق' : 'Locked'))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Skill Inspector Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl text-muted-foreground hover:text-foreground bg-accent/50"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                <Brain className="h-3.5 w-3.5" />
                <span>Skill #{selectedSkill.number}</span>
              </div>
              <h3 className="text-2xl font-black font-heading text-foreground">
                {isRtl ? selectedSkill.nameAr : selectedSkill.nameEn}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                {isRtl ? selectedSkill.descriptionAr : selectedSkill.descriptionEn}
              </p>
            </div>

            {/* Neuro Benefit */}
            <div className="p-4 rounded-2xl bg-accent/50 border border-border/50 text-xs space-y-2">
              <div>
                <strong className="text-foreground block">{isRtl ? 'الأثر الواقعي في الحياة:' : 'Real-World Impact:'}</strong>
                <span className="text-muted-foreground">{isRtl ? selectedSkill.realWorldBenefitAr : selectedSkill.realWorldBenefitEn}</span>
              </div>
              <div>
                <strong className="text-foreground block">{isRtl ? 'المنطقة العصبية في الدماغ:' : 'Neural Hub:'}</strong>
                <span className="text-primary font-mono">{isRtl ? selectedSkill.brainAreaAr : selectedSkill.brainAreaEn}</span>
              </div>
            </div>

            {/* Unlock Status Alert */}
            {progressMap[selectedSkill.id]?.isUnlocked ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <Unlock className="h-4 w-4" />
                  <span>{isRtl ? 'هذه المهارة مفتوحة للتدريب الآن' : 'This skill is unlocked and ready'}</span>
                </div>
                <span>Best: {progressMap[selectedSkill.id]?.bestScore || 0}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {isRtl
                    ? `مغلقة: يلزم إنهاء المهارة #${selectedSkill.number - 1} بنسبة 70% على الأقل.`
                    : `Locked: Complete Skill #${selectedSkill.number - 1} with at least 70% to unlock.`}
                </span>
              </div>
            )}

            {/* Launch / Practice CTA */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedSkill(null)}
                className="rounded-2xl flex-1 font-bold"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </Button>
              {progressMap[selectedSkill.id]?.isUnlocked && (
                <Link
                  href={`/games/${selectedSkill.targetGameId}`}
                  className="flex-1"
                  onClick={() => playSound('click')}
                >
                  <Button className="w-full rounded-2xl font-bold btn-3d btn-3d-primary gap-2">
                    <Play className="h-4 w-4 fill-white" />
                    <span>{isRtl ? 'بدء اللعب والتحدي' : 'Launch Game'}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
