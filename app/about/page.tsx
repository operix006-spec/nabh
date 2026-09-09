'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Sparkles,
  Shield,
  Award,
  Microscope,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

function BookOpenIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const pillars = [
    {
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      titleAr: 'المرونة العصبية التكيفية (Neuroplasticity)',
      titleEn: 'Adaptive Neuroplasticity',
      descAr: 'تصميم التمارين لتحفيز تكوين الوصلات العصبية الجديدة في قشرة الفص الجبهي والحصين عبر التحدي المتدرج.',
      descEn: 'Engineered exercises systematically induce synaptic sprouting and hippocampal neurogenesis through calibrated challenge.',
    },
    {
      icon: Microscope,
      color: 'from-purple-500 to-pink-600',
      titleAr: 'الدقة السيكومترية والسريرية',
      titleEn: 'Psychometric & Clinical Precision',
      descAr: 'الاعتماد على نموذج Cattell-Horn-Carroll (CHC) ومقاييس زمن الرجع بالميللي ثانية لقياس القدرات المعرفية الحقيقية.',
      descEn: 'Anchored in the Cattell-Horn-Carroll (CHC) intelligence taxonomy with sub-millisecond reaction chronometry.',
    },
    {
      icon: Sparkles,
      color: 'from-amber-500 to-orange-600',
      titleAr: 'التدفق اللعبي والمحفزات السلوكية',
      titleEn: 'Gamified Flow & Intrinsic Drive',
      descAr: 'دمج عناصر التصميم اللعبي المتطور (XP، سلاسل الحماس، شارات الماستري) لتثبيت عادة التدريب الذهني اليومي.',
      descEn: 'Seamless game mechanics (XP, streaks, mastery badges) transform repetitive cognitive drills into joyous daily flow.',
    },
    {
      icon: Shield,
      color: 'from-emerald-500 to-teal-600',
      titleAr: 'أمان البيانات والأخلاقيات الرقمية',
      titleEn: 'Data Privacy & Clinical Ethics',
      descAr: 'امتثال صارم لمعايير COPPA و FERPA و GDPR لحماية خصوصية القياسات الإدراكية للأطفال والبالغين.',
      descEn: 'Strict adherence to COPPA, FERPA, and GDPR standards, ensuring cognitive telemetry is safeguarded and encrypted.',
    },
  ];

  const advisors = [
    {
      nameAr: 'د. سارة المنصوري',
      nameEn: 'Dr. Sarah Al-Mansouri',
      roleAr: 'أستاذة علم الأعصاب الإدراكي، جامعة أكسفورد',
      roleEn: 'Prof. of Cognitive Neuroscience, Oxford Univ.',
      bioAr: 'باحثة متخصصة في الذاكرة العاملة والتحكم المثبط لدى اليافعين.',
      bioEn: 'Pioneering researcher in adolescent working memory and inhibitory control networks.',
    },
    {
      nameAr: 'د. طارق الحكيم',
      nameEn: 'Dr. Tarek Al-Hakim',
      roleAr: 'استشاري القياس النفسي والذكاء السائل',
      roleEn: 'Psychometrics & Fluid Intelligence Consultant',
      bioAr: 'مؤلف نماذج التقييم التكيفي المحوسب ونظريات الاستجابة للمفردة (IRT).',
      bioEn: 'Specialist in computerized adaptive testing (CAT) and Item Response Theory.',
    },
    {
      nameAr: 'د. ليلى قدري',
      nameEn: 'Dr. Layla Qadri',
      roleAr: 'رئيسة قسم التربية الخاصة والتطوير المعرفي',
      roleEn: 'Head of Special Education & Neurodevelopment',
      bioAr: 'خبيرة في تصميم برامج التدخل الإدراكي لفرط الحركة وتشتت الانتباه (ADHD).',
      bioEn: 'Expert in cognitive interventions for ADHD, executive dysfunction, and gifted learning.',
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
          <BookOpenIcon className="h-4 w-4" />
          <span>{isRtl ? 'رسالتنا العلمية والإنسانية' : 'Our Scientific & Human Mission'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-foreground mb-6 leading-tight">
          {isRtl ? 'تمكين العقل البشري بأحدث علوم الأعصاب والذكاء التكيفي' : 'Empowering Human Cognition Through Science & Adaptive Intelligence'}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {isRtl
            ? 'تأسست منصة نَبِـه (Nabh) بهدف سد الفجوة بين الأبحاث الأكاديمية في علم النفس الإدراكي والواقع المعاش للمتعلمين، عبر تحويل 50 مهارة عقلية معقدة إلى تجارب تفاعلية ممتعة ومقاسة علمياً.'
            : 'Nabh was founded to bridge the gap between clinical neuroscience labs and daily life, translating 50 complex executive and cognitive capacities into joyful, scientifically validated interactive experiences.'}
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            {isRtl ? 'الركائز الأربع التي بنيت عليها نَبِه' : 'The Four Foundational Pillars of Nabh'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isRtl ? 'معايير صارمة في العلم، التكنولوجيا، والتصميم اللعبي' : 'Rigorous standards in neuroscience, technology, and game dynamics'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${p.color} text-white shadow-md`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-heading">
                      {isRtl ? p.titleAr : p.titleEn}
                    </h3>
                    <span className="text-xs font-mono text-primary font-bold">Pillar 0{idx + 1}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isRtl ? p.descAr : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Framework Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-tr from-primary/10 via-purple-500/5 to-background p-8 sm:p-12 mb-24 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
              <Award className="h-3.5 w-3.5" />
              <span>Cattell-Horn-Carroll (CHC) Framework</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-heading text-foreground">
              {isRtl ? 'نموذج CHC للقدرات الإدراكية البشرية' : 'Grounding in the CHC Cognitive Taxonomy'}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl
                ? 'يعتمد تصنيف الـ 50 مهارة في نَبِه على نموذج Cattell-Horn-Carroll، وهو الإطار الأكثر اعتماداً ومصداقية في القياس النفسي عالمياً. يغطي النموذج الذكاء السائل (Gf)، سرعة المعالجة (Gs)، الذاكرة قصيرة المدى (Gsm)، والمعالجة البصرية المكانية (Gv).'
                : 'Our 50-skill taxonomy directly maps to the Cattell-Horn-Carroll (CHC) model, the most empirically supported psychometric framework in history. We measure and stimulate Fluid Reasoning (Gf), Processing Speed (Gs), Short-Term Working Memory (Gsm), and Visual Processing (Gv).'}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col justify-center">
            <Link href="/skills" onClick={() => playSound('click')}>
              <Button size="lg" className="w-full rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg gap-2">
                <span>{isRtl ? 'استكشف الـ 50 مهارة' : 'Explore All 50 Skills'}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
            <Link href="/assessment" onClick={() => playSound('click')}>
              <Button variant="outline" size="lg" className="w-full rounded-2xl font-bold border-border/60">
                {isRtl ? 'ابدأ التقييم الشامل' : 'Start Diagnostic Assessment'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Advisory Board */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            {isRtl ? 'الهيئة الاستشارية العلمية' : 'Scientific Advisory Board'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {isRtl ? 'خبراء في طب الأعصاب، علم النفس المعرفي، والقياس التربوي' : 'World-class neuroscientists and psychometricians guiding our pedagogical engines'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advisors.map((adv, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl shadow-md text-center hover:shadow-xl transition-all"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary font-bold text-2xl mb-4 border border-primary/20 shadow-inner">
                {adv.nameEn.split(' ')[1]?.slice(0, 2) || 'Dr'}
              </div>
              <h4 className="font-bold text-base text-foreground font-heading">
                {isRtl ? adv.nameAr : adv.nameEn}
              </h4>
              <p className="text-xs text-primary font-medium mt-1 mb-3">
                {isRtl ? adv.roleAr : adv.roleEn}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl ? adv.bioAr : adv.bioEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
