'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_SKILLS_50 } from '@/lib/data/cognitive-skills';
import { Button } from '@/components/ui/button';
import {
  Brain,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Map,
  Compass,
} from 'lucide-react';

export const LearningJourneyWidget: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  // Sample progression nodes along the first 7 skills
  const journeyNodes = [
    { skill: COGNITIVE_SKILLS_50[0], status: 'completed', stars: 3, score: 94 },
    { skill: COGNITIVE_SKILLS_50[1], status: 'completed', stars: 3, score: 90 },
    { skill: COGNITIVE_SKILLS_50[2], status: 'completed', stars: 2, score: 86 },
    { skill: COGNITIVE_SKILLS_50[3], status: 'active', stars: 0, score: 0 },
    { skill: COGNITIVE_SKILLS_50[4], status: 'locked', stars: 0, score: 0 },
    { skill: COGNITIVE_SKILLS_50[5], status: 'locked', stars: 0, score: 0 },
    { skill: COGNITIVE_SKILLS_50[6], status: 'locked', stars: 0, score: 0 },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/85 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-primary/5 glow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF]/15 text-[#6C63FF] shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-foreground">
              {isRtl ? 'مسار الرحلة الإدراكية (المستوى الأول)' : 'Cognitive Synaptic Journey (Tier 1)'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRtl ? 'افتح العقد العصبية المتعاقبة بحسب معيار الـ 70%' : 'Unlock sequential neural nodes with the 70% CHC threshold'}
            </p>
          </div>
        </div>

        <Link
          href="/roadmap"
          onClick={() => playSound('click')}
          className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>{isRtl ? 'عرض خريطة الـ 50 مهارة كاملة' : 'Explore Full 50-Node Map'}</span>
          {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>

      {/* Horizontal Synaptic Nodes Track */}
      <div className="relative py-4 overflow-x-auto no-scrollbar">
        {/* Connecting Synaptic Filament Line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-border/60 z-0" />

        <div className="relative z-10 flex items-center justify-between min-w-[650px] px-4 gap-4">
          {journeyNodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLocked = node.status === 'locked';

            return (
              <div key={node.skill.id} className="flex flex-col items-center text-center group">
                {/* Node Circle */}
                {isActive ? (
                  <Link
                    href={`/games/${node.skill.targetGameId}`}
                    onClick={() => playSound('fanfare')}
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-xl shadow-[#6C63FF]/30 ring-4 ring-[#6C63FF]/20 hover:scale-110 active:scale-95 transition-all duration-300"
                    title={isRtl ? node.skill.nameAr : node.skill.nameEn}
                  >
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A8] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00E5A8] border-2 border-card"></span>
                    </span>
                    <Play className="h-6 w-6 fill-white" />
                  </Link>
                ) : isCompleted ? (
                  <Link
                    href={`/skills/${node.skill.id}`}
                    onClick={() => playSound('click')}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E5A8]/15 border-2 border-[#00E5A8] text-[#00E5A8] hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-[#00E5A8]/10"
                    title={isRtl ? node.skill.nameAr : node.skill.nameEn}
                  >
                    <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
                  </Link>
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 border border-border text-muted-foreground opacity-60 cursor-not-allowed"
                    title={isRtl ? 'مغلقة حتى إكمال المهارات السابقة' : 'Locked until prerequisites met'}
                  >
                    <Lock className="h-5 w-5" />
                  </div>
                )}

                {/* Node Info & Stars */}
                <div className="mt-2.5 space-y-0.5 max-w-[90px]">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground block">
                    #{node.skill.number}
                  </span>
                  <span className="text-xs font-bold text-foreground block truncate">
                    {isRtl ? node.skill.nameAr : node.skill.nameEn}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] text-amber-500 font-mono font-bold block">
                      {'⭐'.repeat(node.stars)}
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] font-bold text-[#6C63FF] px-2 py-0.2 rounded-full bg-[#6C63FF]/10 block">
                      {isRtl ? 'المهارة النشطة' : 'Active'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
