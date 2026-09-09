'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import { CheckCircle2, ArrowRight, ArrowLeft, Layers, Sparkles } from 'lucide-react';

interface CompletedSkillsSectionProps {
  completedCount: number;
  totalSkills: number;
}

export const CompletedSkillsSection: React.FC<CompletedSkillsSectionProps> = ({
  completedCount,
  totalSkills,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  // Domain breakdown ratios
  const domainBreakdown = [
    { id: 'memory', nameAr: 'الذاكرة', nameEn: 'Memory', completed: 3, total: 8, color: 'bg-blue-500' },
    { id: 'attention', nameAr: 'الانتباه', nameEn: 'Attention', completed: 2, total: 7, color: 'bg-rose-500' },
    { id: 'speed', nameAr: 'السرعة', nameEn: 'Speed', completed: 3, total: 7, color: 'bg-amber-500' },
    { id: 'flexibility', nameAr: 'المرونة', nameEn: 'Flexibility', completed: 2, total: 7, color: 'bg-emerald-500' },
    { id: 'spatial', nameAr: 'المكاني', nameEn: 'Spatial', completed: 1, total: 7, color: 'bg-violet-500' },
    { id: 'logic', nameAr: 'المنطق', nameEn: 'Logic', completed: 2, total: 7, color: 'bg-cyan-500' },
    { id: 'social', nameAr: 'اللغوي', nameEn: 'Language', completed: 1, total: 7, color: 'bg-pink-500' },
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg space-y-6 mb-10 glow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-heading text-foreground">
                {isRtl ? 'المهارات المتقنة' : 'Completed Cognitive Skills'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-xs">
                {completedCount} / {totalSkills}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRtl
                ? 'توزيع الإنجاز عبر المجالات الإدراكية السبعة'
                : 'Mastery distribution across all 7 cognitive neurological domains'}
            </p>
          </div>
        </div>

        <Link
          href="/roadmap"
          onClick={() => playSound('click')}
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>{isRtl ? 'فتح شجرة المسار الكاملة' : 'View Full Roadmap Tree'}</span>
          {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>

      {/* Domain Breakdown Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {domainBreakdown.map((dom) => {
          const percentage = Math.round((dom.completed / dom.total) * 100);
          return (
            <div
              key={dom.id}
              className="p-3.5 rounded-2xl border border-border/60 bg-accent/20 hover:bg-accent/40 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground truncate">
                  {isRtl ? dom.nameAr : dom.nameEn}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {dom.completed}/{dom.total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className={`h-full ${dom.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
