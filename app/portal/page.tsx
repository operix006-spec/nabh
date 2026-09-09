'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Stethoscope,
  PlusCircle,
  Download,
  Brain,
  Zap,
  Target,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  grade: string;
  nci: number;
  completedWorkouts: number;
  streak: number;
  strongestDomainAr: string;
  strongestDomainEn: string;
  needsFocusAr: string;
  needsFocusEn: string;
}

const STUDENTS_SAMPLE: StudentRosterItem[] = [
  {
    id: '1',
    name: 'سارة المنصور',
    grade: 'الصف الثامن (أ)',
    nci: 824,
    completedWorkouts: 42,
    streak: 14,
    strongestDomainAr: 'الذاكرة المكانية (92%)',
    strongestDomainEn: 'Visuospatial (92%)',
    needsFocusAr: 'المرونة الإدراكية',
    needsFocusEn: 'Cognitive Shifting',
  },
  {
    id: '2',
    name: 'عبدالله السعدون',
    grade: 'الصف الثامن (أ)',
    nci: 760,
    completedWorkouts: 28,
    streak: 6,
    strongestDomainAr: 'سرعة الاستجابة (89%)',
    strongestDomainEn: 'Speed (89%)',
    needsFocusAr: 'كبح التشتت وستروب',
    needsFocusEn: 'Inhibitory Control',
  },
  {
    id: '3',
    name: 'نوف القحطاني',
    grade: 'الصف الثامن (أ)',
    nci: 885,
    completedWorkouts: 54,
    streak: 22,
    strongestDomainAr: 'الاستدلال المنطقي (95%)',
    strongestDomainEn: 'Logic (95%)',
    needsFocusAr: 'السرعة المعجمية',
    needsFocusEn: 'Verbal Fluency',
  },
];

export default function PortalPage() {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const [roleView, setRoleView] = useState<'educator' | 'parent' | 'clinician'>('educator');
  const [assignedAlert, setAssignedAlert] = useState(false);

  const handleAssignExercise = () => {
    playSound('success');
    setAssignedAlert(true);
    setTimeout(() => setAssignedAlert(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. PORTAL HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div className="space-y-1">
          <Badge variant="outline" className="px-3 py-0.5 text-xs font-bold text-primary border-primary/30">
            Professional & Family Supervision Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {t('navPortal')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'ar'
              ? 'بوابة المعلمين وأولياء الأمور والمختصين لمتابعة الأداء الإدراكي وتعيين البروتوكولات التدريبية'
              : 'Empowering educators, parents, and clinicians with deep cognitive telemetry and targeted assignments'}
          </p>
        </div>

        {/* Role View Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary border border-border/60">
          <button
            onClick={() => { playSound('click'); setRoleView('educator'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleView === 'educator' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{t('portalEducator')}</span>
          </button>

          <button
            onClick={() => { playSound('click'); setRoleView('parent'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleView === 'parent' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>{t('portalParent')}</span>
          </button>

          <button
            onClick={() => { playSound('click'); setRoleView('clinician'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              roleView === 'clinician' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5" />
            <span>{t('portalClinician')}</span>
          </button>
        </div>
      </div>

      {/* Assignment Success Alert */}
      {assignedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>
            {language === 'ar'
              ? 'تم إرسال التكليف التدريبي بنجاح إلى جميع طلاب الفصل (3 تمارين مصفوفات وذاكرة)!'
              : 'Workout regiment successfully assigned to the cohort!'}
          </span>
        </div>
      )}

      {/* 2. COHORT SUMMARY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <Card className="p-6 rounded-3xl border border-border/70 space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">
            {language === 'ar' ? 'متوسط مؤشر الفصل (NCI)' : 'Cohort Mean NCI'}
          </span>
          <div className="text-3xl font-black font-mono text-primary">823</div>
          <span className="text-xs text-emerald-600 font-bold block">
            +5.4% {language === 'ar' ? 'مقارنة بالشهر الماضي' : 'vs last month'}
          </span>
        </Card>

        <Card className="p-6 rounded-3xl border border-border/70 space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">
            {language === 'ar' ? 'الجلسات المكتملة' : 'Completed Sessions'}
          </span>
          <div className="text-3xl font-black font-mono">1,248</div>
          <span className="text-xs text-muted-foreground block">
            {language === 'ar' ? '28 طالباً نشطاً' : '28 active learners'}
          </span>
        </Card>

        <Card className="p-6 rounded-3xl border border-border/70 space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">
            {language === 'ar' ? 'معدل الدقة الإجمالي' : 'Cohort Accuracy'}
          </span>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">92.4%</div>
          <span className="text-xs text-muted-foreground block">
            {language === 'ar' ? 'ضمن النطاق القياسي المتميز' : 'High clinical tier'}
          </span>
        </Card>

        <Card className="p-6 rounded-3xl border-2 border-primary/30 bg-primary/5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary block">
              {language === 'ar' ? 'إجراء جماعي' : 'Batch Action'}
            </span>
            <h4 className="text-sm font-bold text-foreground">
              {language === 'ar' ? 'تعيين تدريب أسبوعي' : 'Assign Regiment'}
            </h4>
          </div>
          <Button
            size="sm"
            variant="default"
            onClick={handleAssignExercise}
            className="rounded-xl font-bold gap-1.5 mt-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{language === 'ar' ? 'إرسال تكليف' : 'Assign Workout'}</span>
          </Button>
        </Card>

      </div>

      {/* 3. ROSTER TABLE WITH COGNITIVE FLAGS */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading">{language === 'ar' ? 'سجل الطلاب والتحليل الفردي' : 'Learner Roster & Neuro-Insights'}</h3>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'متابعة فردية لكل طالب مع تشخيص نقاط القوة والاحتياج التدريبي' : 'Individual progress profiles with automated clinical flag detection'}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => { playSound('click'); window.print(); }}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{language === 'ar' ? 'تصدير التقرير' : 'Export PDF'}</span>
          </Button>
        </div>

        <div className="space-y-3">
          {STUDENTS_SAMPLE.map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center font-bold text-xs text-primary border border-border">
                  {student.name.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{student.name}</h4>
                  <span className="text-xs text-muted-foreground">{student.grade}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block">{t('cognitiveIndex')}</span>
                  <span className="text-base font-black font-mono text-primary">NCI {student.nci}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block">{language === 'ar' ? 'نقاط القوة' : 'Strength'}</span>
                  <Badge variant="success" className="text-xs">
                    {language === 'ar' ? student.strongestDomainAr : student.strongestDomainEn}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold block">{language === 'ar' ? 'بحاجة لتركيز' : 'Focus Needed'}</span>
                  <Badge variant="amber" className="text-xs">
                    {language === 'ar' ? student.needsFocusAr : student.needsFocusEn}
                  </Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold"
              >
                {language === 'ar' ? 'عرض التقرير العصبي' : 'Clinical View'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
