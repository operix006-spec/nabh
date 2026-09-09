'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Compass, Home, LayoutDashboard, Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { NeuroBrainMascot } from '@/components/common/NeuroIllustrations';

export default function NotFound() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="relative max-w-lg w-full rounded-4xl border border-border/60 bg-card/80 p-8 sm:p-12 text-center backdrop-blur-2xl shadow-2xl">
        {/* Soft Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl pointer-events-none" />

        {/* Mascot */}
        <div className="mb-4 animate-float flex justify-center">
          <NeuroBrainMascot expression="curious" size={120} />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-extrabold mb-4">
          <Brain className="h-4 w-4" />
          <span>404 - {isRtl ? 'الصفحة غير موجودة' : 'Neural Pathway Missing'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight mb-3">
          {isRtl ? 'المسار العصبي غير موجود' : 'Signal Lost in Transit'}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
          {isRtl
            ? 'يبدو أن هذه الصفحة قد تحركت أو أن الرابط المطلوب غير متصل بشبكة نَبِه الإدراكية. دعنا نرشدك إلى نقطة البداية.'
            : "The cognitive node you requested doesn't seem to exist or has been restructured. Let's redirect your focus back to active training."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto" onClick={() => playSound('click')}>
            <Button size="lg" className="w-full rounded-2xl font-bold gap-2 btn-3d btn-3d-primary shadow-lg">
              <LayoutDashboard className="h-4 w-4" />
              <span>{isRtl ? 'لوحة التدريب' : 'Dashboard'}</span>
              {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto" onClick={() => playSound('click')}>
            <Button variant="outline" size="lg" className="w-full rounded-2xl font-bold gap-2 border-border/60">
              <Home className="h-4 w-4" />
              <span>{isRtl ? 'الرئيسية' : 'Homepage'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
