'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Activity,
  Calendar as CalendarIcon,
  Award,
  Zap,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function ProgressPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const domainVelocities = [
    { nameAr: 'الذاكرة العاملة', nameEn: 'Working Memory', score: 84, delta: '+12%', color: 'bg-blue-500' },
    { nameAr: 'كبح الاندفاع والتركيز', nameEn: 'Inhibitory Control', score: 91, delta: '+18%', color: 'bg-rose-500' },
    { nameAr: 'سرعة المعالجة', nameEn: 'Processing Speed', score: 79, delta: '+9%', color: 'bg-amber-500' },
    { nameAr: 'المرونة التنفيذية', nameEn: 'Executive Flexibility', score: 82, delta: '+14%', color: 'bg-emerald-500' },
    { nameAr: 'الإدراك البصري المكاني', nameEn: 'Visuospatial Cognition', score: 76, delta: '+7%', color: 'bg-violet-500' },
    { nameAr: 'الاستدلال المنطقي', nameEn: 'Fluid Reasoning', score: 88, delta: '+15%', color: 'bg-indigo-500' },
    { nameAr: 'الطلاقة اللفظية', nameEn: 'Verbal Fluency', score: 75, delta: '+6%', color: 'bg-pink-500' },
  ];

  // 28-day training heatmap data (intensity 0 to 4)
  const heatmapDays = [
    3, 4, 2, 4, 3, 0, 2,
    4, 4, 3, 2, 4, 1, 3,
    4, 3, 4, 4, 2, 0, 3,
    4, 4, 3, 4, 4, 4, 3,
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <TrendingUp className="h-4 w-4" />
            <span>{isRtl ? 'المنحنى العصبي التراكمي' : 'Longitudinal Neuro-Velocity'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {isRtl ? 'سجل التطور والنمو الإدراكي' : 'Cognitive Growth Analytics'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isRtl
              ? 'تتبع تطور شبكاتك العصبية عبر الزمن ومقارنتها بالمنحنيات المعيارية لفئتك العمرية'
              : 'Monitor synaptic acceleration across all domains with normative benchmark percentiles'}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="inline-flex p-1.5 rounded-2xl bg-accent/60 border border-border/50">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                playSound('click');
                setTimeRange(r);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-background shadow-md text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === '7d' ? (isRtl ? '7 أيام' : '7 Days') : r === '30d' ? (isRtl ? '30 يوماً' : '30 Days') : (isRtl ? '90 يوماً' : '90 Days')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground">{isRtl ? 'معدل تسارع NCI' : 'NCI Velocity'}</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-3xl font-black font-mono text-primary">+84 pts</span>
          <span className="text-[11px] text-emerald-500 font-bold block mt-1">
            {isRtl ? '↑ أعلى من 92% من الأقران' : '↑ Faster than 92% of peers'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground">{isRtl ? 'زمن الاستجابة المتوسط' : 'Mean Reaction Time'}</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-3xl font-black font-mono text-foreground">294 ms</span>
          <span className="text-[11px] text-emerald-500 font-bold block mt-1">
            {isRtl ? '↓ تحسن بمقدار 46ms' : '↓ Improved by 46ms'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground">{isRtl ? 'دقة الإجابات الإجمالية' : 'Overall Precision'}</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-3xl font-black font-mono text-foreground">94.2%</span>
          <span className="text-[11px] text-emerald-500 font-bold block mt-1">
            {isRtl ? '↑ +5.8% هذا الشهر' : '↑ +5.8% this month'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground">{isRtl ? 'إجمالي دقائق التدريب' : 'Total Practice Minutes'}</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <span className="text-3xl font-black font-mono text-foreground">420 min</span>
          <span className="text-[11px] text-muted-foreground font-bold block mt-1">
            {isRtl ? '42 جلسة مكتملة' : '42 completed sessions'}
          </span>
        </div>
      </div>

      {/* Domain Velocity Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-heading text-foreground">
              {isRtl ? 'معدل النمو عبر المجالات السبعة' : 'Domain Growth Velocity'}
            </h3>
            <span className="text-xs font-mono text-primary font-bold">CHC Model</span>
          </div>

          <div className="space-y-4">
            {domainVelocities.map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-foreground">{isRtl ? d.nameAr : d.nameEn}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-emerald-500 font-bold">{d.delta}</span>
                    <span className="text-muted-foreground">{d.score}/100</span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-700`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 28-Day Consistency Heatmap */}
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading text-foreground">
                {isRtl ? 'خريطة الالتزام اليومي' : 'Consistency Heatmap'}
              </h3>
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              {isRtl ? 'التدريب المنتظم يضاعف معدل ترسيخ الوصلات العصبية بـ 3 أضعاف.' : 'Daily training triples synaptic consolidation rate.'}
            </p>

            <div className="grid grid-cols-7 gap-2 p-3 rounded-2xl bg-accent/30 border border-border/40">
              {heatmapDays.map((val, idx) => {
                const colors = [
                  'bg-muted/40 border-border/40',
                  'bg-emerald-500/30 border-emerald-500/40',
                  'bg-emerald-500/50 border-emerald-500/60',
                  'bg-emerald-500/80 border-emerald-500',
                  'bg-emerald-500 border-emerald-400 shadow-sm',
                ];
                return (
                  <div
                    key={idx}
                    title={`Day ${idx + 1}: ${val} sessions`}
                    className={`aspect-square rounded-lg border transition-transform hover:scale-125 cursor-pointer ${colors[val]}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>{isRtl ? 'الأقل التزاماً' : 'Less'}</span>
            <div className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-muted/40" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/30" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/60" />
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            </div>
            <span>{isRtl ? 'الأكثر نشاطاً' : 'More'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
