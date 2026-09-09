'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { CognitiveRadarChart } from '@/components/common/CognitiveRadarChart';
import { INITIAL_RADAR_DATA } from '@/lib/data/mock-user';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';

export const BrainRadarWidget: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Find lowest domain to recommend training
  const lowestDomain = [...INITIAL_RADAR_DATA].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="rounded-3xl border border-border/70 bg-card/85 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-primary/5 glow-card space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF]/15 text-[#6C63FF] shadow-sm">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-heading text-foreground">
              {isRtl ? 'رادار القدرات الإدراكية (CHC)' : 'Cognitive CHC Radar'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRtl ? 'توزيع القدرات العصبية عبر الـ 7 مجالات' : 'Cross-domain psychometric distribution'}
            </p>
          </div>
        </div>

        {/* Benchmark Toggle Button */}
        <button
          onClick={() => {
            playSound('pop');
            setShowBenchmark(!showBenchmark);
          }}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            showBenchmark
              ? 'bg-[#6C63FF]/15 border-[#6C63FF]/40 text-[#6C63FF]'
              : 'bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          {isRtl
            ? showBenchmark
              ? '✓ مقارنة مع متوسط الأقران'
              : '+ إظهار متوسط الأقران'
            : showBenchmark
            ? '✓ Peer Benchmark Active'
            : '+ Show Peer Benchmark'}
        </button>
      </div>

      {/* Radar Chart Visual */}
      <div className="flex flex-col lg:flex-row items-center justify-around gap-6">
        <div className="relative py-2 shrink-0">
          <CognitiveRadarChart
            data={INITIAL_RADAR_DATA}
            size={340}
            showBenchmark={showBenchmark}
          />
        </div>

        {/* Domain Metrics Grid & Focus Suggestion */}
        <div className="space-y-4 w-full max-w-sm">
          <div className="p-4 rounded-2xl bg-accent/40 border border-border/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">
                {isRtl ? 'أقوى مجال معرفي لديك:' : 'Strongest Domain:'}
              </span>
              <span className="font-black text-emerald-500 font-mono">
                {isRtl ? 'المنطق (89%)' : 'Logic (89%)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">
                {isRtl ? 'المجال الواعد للتدريب:' : 'Priority Focus Area:'}
              </span>
              <span className="font-black text-amber-500 font-mono">
                {isRtl ? `${lowestDomain.nameAr} (${lowestDomain.score}%)` : `${lowestDomain.nameEn} (${lowestDomain.score}%)`}
              </span>
            </div>
          </div>

          <Link
            href="/games/cube-rotation"
            onClick={() => playSound('fanfare')}
            className="block"
          >
            <Button
              className="w-full rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg gap-2 text-xs h-11"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isRtl
                  ? `تدريب مجال ${lowestDomain.nameAr} الآن`
                  : `Boost ${lowestDomain.nameEn} Domain Now`}
              </span>
              {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
