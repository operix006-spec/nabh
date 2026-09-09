'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_RADAR_DATA } from '@/lib/data/mock-user';
import { CognitiveRadarChart } from '@/components/common/CognitiveRadarChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  Target,
  Clock,
  Sparkles,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. ANALYTICS HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <Badge variant="outline" className="px-3 py-0.5 text-xs font-bold text-primary border-primary/30">
            Neuro-Telemetry Core
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {t('analyticsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('analyticsSubtitle')}
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary border border-border/60">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === '7d' ? (language === 'ar' ? '7 أيام' : '7 Days') : range === '30d' ? (language === 'ar' ? '30 يوماً' : '30 Days') : (language === 'ar' ? 'الكل' : 'All Time')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN 7-AXIS RADAR CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Radar Visual Card */}
        <Card className="lg:col-span-7 p-6 sm:p-10 rounded-4xl border-2 border-border/70 flex flex-col items-center justify-center bg-card/90 backdrop-blur-xl min-h-[500px]">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold font-heading">{t('domainBreakdown')}</h3>
            </div>
            <Badge variant="success" className="text-xs font-mono font-bold">
              Peer Cohort: +14%
            </Badge>
          </div>

          <CognitiveRadarChart data={INITIAL_RADAR_DATA} size={380} showBenchmark={true} />
        </Card>

        {/* Key Cognitive Metrics Column */}
        <div className="lg:col-span-5 space-y-4">
          
          <Card className="p-6 rounded-3xl border border-border/70 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">
              {t('cognitiveIndex')} (NCI)
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black font-mono text-primary">
                {user?.overallCognitiveIndex || 824}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+38 {language === 'ar' ? 'نقطة هذا الشهر' : 'pts this month'}</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {language === 'ar'
                ? 'أداؤك يتفوق على 88% من الأقران في نفس الشريحة العمرية وفقاً لنظرية CHC للذكاء السائل.'
                : 'Performance ranks above 88% of peer cohort based on the Cattell-Horn-Carroll model.'}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 rounded-3xl border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>{t('meanReactionTime')}</span>
              </div>
              <div className="text-2xl font-black font-mono">312 ms</div>
              <span className="text-[10px] text-emerald-600 font-bold block">
                {language === 'ar' ? 'أسرع بـ 18ms' : '18ms faster'}
              </span>
            </Card>

            <Card className="p-5 rounded-3xl border border-border/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <Target className="h-4 w-4 text-emerald-500" />
                <span>{t('accuracyRate')}</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                94.8%
              </div>
              <span className="text-[10px] text-muted-foreground block">
                {language === 'ar' ? 'استقرار ممتاز' : 'High precision'}
              </span>
            </Card>
          </div>

          <Card className="p-5 rounded-3xl border border-border/70 space-y-2">
            <span className="text-xs font-bold text-foreground block">
              {language === 'ar' ? 'أبرز نقاط القوة العصبية:' : 'Top Neuro-Faculties:'}
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="purple" className="text-xs font-bold">
                {language === 'ar' ? 'الذاكرة البصرية المكانية (92%)' : 'Visuospatial Memory (92%)'}
              </Badge>
              <Badge variant="cyan" className="text-xs font-bold">
                {language === 'ar' ? 'الاستدلال الاستقرائي (90%)' : 'Inductive Reasoning (90%)'}
              </Badge>
              <Badge variant="amber" className="text-xs font-bold">
                {language === 'ar' ? 'كبح التداخل (85%)' : 'Inhibitory Control (85%)'}
              </Badge>
            </div>
          </Card>

        </div>

      </div>

      {/* 3. DETAILED DOMAIN BREAKDOWN TABLE */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-6">
        <h3 className="text-xl font-bold font-heading">{language === 'ar' ? 'تفصيل الأداء عبر المجالات السبعة' : 'Seven Cognitive Domains Analysis'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_RADAR_DATA.map((domain) => {
            const name = language === 'ar' ? domain.nameAr : domain.nameEn;
            const diff = domain.score - domain.benchmarkScore;

            return (
              <div key={domain.domain} className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{name}</span>
                  <span className="text-base font-black font-mono" style={{ color: domain.color }}>
                    {domain.score}%
                  </span>
                </div>
                <Progress value={domain.score} className="h-2" indicatorClassName="bg-primary" />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{language === 'ar' ? `المتوسط: ${domain.benchmarkScore}%` : `Peer: ${domain.benchmarkScore}%`}</span>
                  <span className={`font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {diff >= 0 ? `+${diff}%` : `${diff}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}
