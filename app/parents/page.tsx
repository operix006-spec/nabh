'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  Clock,
  Award,
  Brain,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { NeuroBrainMascot } from '@/components/common/NeuroIllustrations';

export default function ParentsDashboardPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [activeChildId, setActiveChildId] = useState('child_1');
  const [screenTimeLimit, setScreenTimeLimit] = useState(25); // minutes per day
  const [focusLocked, setFocusLocked] = useState(true);

  const children = [
    {
      id: 'child_1',
      nameAr: 'زياد (11 سنة)',
      nameEn: 'Zaid (Age 11)',
      gradeAr: 'الصف الخامس الابتدائي',
      gradeEn: 'Grade 5',
      nci: 745,
      streak: 6,
      todayMinutes: 18,
      primaryStrengthAr: 'سرعة المعالجة البصرية',
      primaryStrengthEn: 'Visual Processing Speed',
      targetFocusAr: 'التحكم وتصفية المشتتات',
      targetFocusEn: 'Inhibitory Distraction Control',
    },
    {
      id: 'child_2',
      nameAr: 'سارة (14 سنة)',
      nameEn: 'Sarah (Age 14)',
      gradeAr: 'الصف الثاني المتوسط',
      gradeEn: 'Grade 8',
      nci: 810,
      streak: 12,
      todayMinutes: 24,
      primaryStrengthAr: 'الذاكرة المكانية والاستدلال',
      primaryStrengthEn: 'Spatial Memory & Logic',
      targetFocusAr: 'المرونة التنفيذية',
      targetFocusEn: 'Executive Flexibility',
    },
  ];

  const currentChild = children.find((c) => c.id === activeChildId) || children[0];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Mascot */}
      <div className="relative overflow-hidden rounded-4xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-card/80 to-purple-500/10 p-6 sm:p-10 backdrop-blur-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 shadow-sm">
              <Shield className="h-4 w-4" />
              <span>{isRtl ? 'بوابة ولي الأمر الإشرافية' : 'Parental Supervision Hub'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight">
              {isRtl ? 'لوحة متابعة تطور الأبناء ونموهم المعرفي' : 'Child Cognitive Milestones & Growth'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isRtl
                ? 'مراقبة زمن الشاشة، ضبط التحديات العصبية، واستعراض تقارير النمو الذهني'
                : 'Govern screen-time limits, assign cognitive drills, and review developmental progress'}
            </p>
          </div>

          <div className="shrink-0 animate-float">
            <NeuroBrainMascot expression="celebrating" size={130} />
          </div>
        </div>

        {/* Child Switcher Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card/80 border border-border/60 w-fit mt-6">
          {children.map((child) => {
            const isSelected = child.id === activeChildId;
            return (
              <button
                key={child.id}
                onClick={() => {
                  playSound('pop');
                  setActiveChildId(child.id);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary shadow-md text-white font-black scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
                <span>{isRtl ? child.nameAr : child.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'مؤشر NCI للطفل' : 'Cognitive Index'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-primary">{currentChild.nci}</span>
            <span className="text-xs text-muted-foreground font-bold">/ 1000</span>
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block mt-1">
            {isRtl ? 'أعلى من 85% من أقران الصف' : 'Top 15% in cohort'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'وقت التدريب اليوم' : "Today's Screen Time"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-foreground">{currentChild.todayMinutes}</span>
            <span className="text-xs text-muted-foreground font-bold">/ {screenTimeLimit} min</span>
          </div>
          <span className="text-[11px] text-primary font-bold block mt-1">
            {isRtl ? 'ضمن الحدود الآمنة' : 'Within healthy threshold'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'سلسلة الالتزام' : 'Active Streak'}
          </span>
          <span className="text-3xl font-black font-mono text-amber-500">
            {currentChild.streak} {isRtl ? 'أيام' : 'Days'}
          </span>
          <span className="text-[11px] text-amber-600 font-bold block mt-1">
            {isRtl ? 'حماس متواصل ومستقر' : 'Steady habit formation'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'المرحلة الدراسية' : 'Class Grade'}
          </span>
          <span className="text-lg font-black font-heading text-foreground block truncate">
            {isRtl ? currentChild.gradeAr : currentChild.gradeEn}
          </span>
          <span className="text-[11px] text-muted-foreground font-bold block mt-2">
            {isRtl ? 'المدرسة الرقمية النموذجية' : 'Accredited Curriculum'}
          </span>
        </div>
      </div>

      {/* Screen-Time Governor & Parental Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Screen-Time Slider Card */}
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {isRtl ? 'حاكم وقت التدريب اليومي' : 'Daily Screen Time Governor'}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {isRtl ? 'إغلاق الألعاب تلقائياً عند استنفاذ الحد' : 'Automatically lock games once limit is reached'}
                </span>
              </div>
            </div>
            <span className="text-2xl font-black font-mono text-primary">
              {screenTimeLimit} {isRtl ? 'دقيقة' : 'min'}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={screenTimeLimit}
              onChange={(e) => {
                playSound('pop');
                setScreenTimeLimit(Number(e.target.value));
              }}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{isRtl ? '10 دقائق (خفيف)' : '10m (Light)'}</span>
              <span>{isRtl ? '30 دقيقة (موصى به)' : '30m (Recommended)'}</span>
              <span>{isRtl ? '60 دقيقة (مكثف)' : '60m (Intensive)'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Lock className="h-4 w-4 text-primary" />
              <span>{isRtl ? 'قفل الوضع الآمن (لا يمكن للطفل التعديل)' : 'Child-Proof Parental PIN Lock'}</span>
            </div>
            <span className="text-xs font-bold text-emerald-500 font-mono">ACTIVE</span>
          </div>
        </div>

        {/* Pediatrician Neuro-Guidance */}
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-foreground">
                {isRtl ? 'إرشادات الأخصائي السريري للطفل' : 'Pediatrician Guidance'}
              </h3>
              <span className="text-xs text-muted-foreground">
                {isRtl ? 'نصائح لتعزيز الذاكرة والتركيز في المنزل' : 'Home environment tips for executive functioning'}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed pt-2">
            <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/30">
              <strong className="text-foreground block mb-1">
                {isRtl ? 'نقاط القوة المكتشفة:' : 'Primary Cognitive Strength:'}
              </strong>
              <span>{isRtl ? currentChild.primaryStrengthAr : currentChild.primaryStrengthEn}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-accent/30 border border-border/30">
              <strong className="text-foreground block mb-1">
                {isRtl ? 'مجال التحفيز المطلوب هذا الأسبوع:' : 'Growth Area This Week:'}
              </strong>
              <span>{isRtl ? currentChild.targetFocusAr : currentChild.targetFocusEn}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/reports" onClick={() => playSound('click')}>
              <Button size="sm" variant="outline" className="w-full rounded-xl font-bold border-border/80">
                {isRtl ? 'عرض التقرير السريري الكامل للطفل' : 'View Full Clinical Report'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
