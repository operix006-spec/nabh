'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Brain,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  GraduationCap,
} from 'lucide-react';

export default function PricingPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [annualBilling, setAnnualBilling] = useState(true);

  const plans = [
    {
      id: 'free',
      nameAr: 'المستكشف المجاني',
      nameEn: 'Cognitive Explorer',
      descAr: 'مثالي للبدء والتعرف على أساسيات القياس الإدراكي',
      descEn: 'Perfect for exploring cognitive baselines and daily drills',
      priceMonthly: 0,
      priceAnnual: 0,
      popular: false,
      ctaAr: 'ابدأ مجاناً الآن',
      ctaEn: 'Start Free Today',
      href: '/register',
      featuresAr: [
        'الوصول للتمرين اليومي (3 ألعاب يومياً)',
        'فتح أول 5 مهارات إدراكية',
        'مؤشر NCI الأساسي',
        'دعم الوضعين الفاتح والداكن',
      ],
      featuresEn: [
        'Access to daily workout (3 games/day)',
        'Unlock first 5 foundational skills',
        'Basic Cognitive Index (NCI) scoring',
        'Dark and Light theme support',
      ],
    },
    {
      id: 'pro',
      nameAr: 'نَبِـه الاحترافي (Pro)',
      nameEn: 'Nabh Pro Learner',
      descAr: 'البرنامج الكامل لتطوير كافة قدراتك العقلية بلا قيود',
      descEn: 'Unrestricted access to unlock and master all cognitive domains',
      priceMonthly: 12,
      priceAnnual: 9.5, // per month billed annually
      popular: true,
      ctaAr: 'اشترك في النسخة الاحترافية',
      ctaEn: 'Upgrade to Pro',
      href: '/register?plan=pro',
      featuresAr: [
        'فتح جميع المهارات الـ 50 كاملة',
        'وصول غير محدود لجميع ساحات الألعاب الـ 12',
        'تحليلات الذكاء الاصطناعي وتفسير الأخطاء العصبية',
        'شهادة تقييم إدراكي رسمية موثقة وقابلة للطباعة',
        'مقارنات معيارية دقيقة مع فئتك العمرية',
        'تعديل الصعوبة التكيفي المتطور بدون إعلانات',
      ],
      featuresEn: [
        'Unlock all 50 cognitive skills without restrictions',
        'Unlimited play across all 12 game arenas',
        'AI mistake analysis & neural bottleneck explanations',
        'Official verified & printable diagnostic certificate',
        'Granular percentile benchmarks against your age group',
        'Advanced dynamic difficulty adaptation without ads',
      ],
    },
    {
      id: 'family',
      nameAr: 'العائلة والمدارس (Cohorts)',
      nameEn: 'Family & Cohorts',
      descAr: 'لأولياء الأمور والمعلمين لمتابعة حتى 5 طلاب',
      descEn: 'Designed for parents & teachers managing up to 5 learners',
      priceMonthly: 28,
      priceAnnual: 22,
      popular: false,
      ctaAr: 'اختر باقة العائلة',
      ctaEn: 'Choose Family / Cohort',
      href: '/register?plan=family',
      featuresAr: [
        'يشمل 5 حسابات متعلمين مستقلة مع حفظ التقدم',
        'لوحة تحكم خاصة لولي الأمر والمعلم',
        'تحديد أوقات الشاشة والتمارين الإلزامية',
        'تقارير أسبوعية تفصيلية تصدر بصيغة PDF',
        'توزيع المهام والتحديات الصفية بنقرة واحدة',
      ],
      featuresEn: [
        'Includes 5 independent learner profiles with saved progress',
        'Dedicated Parents Portal & Classroom Teacher Dashboard',
        'Screen-time governor & mandatory workout thresholds',
        'Weekly developmental neuro-reports in PDF',
        '1-Click classroom challenge & assignment distribution',
      ],
    },
  ];

  const faqs = [
    {
      qAr: 'هل يمكنني إلغاء اشتراكي في أي وقت؟',
      qEn: 'Can I cancel my subscription at any time?',
      aAr: 'نعم بكل تأكيد، يمكنك إلغاء التجديد التلقائي بنقرة واحدة من صفحة الإعدادات دون أي رسوم إضافية.',
      aEn: 'Yes absolutely! You can cancel automatic renewal with one click inside Settings without any cancellation fees.',
    },
    {
      qAr: 'هل التقييم الإدراكي والشهادة معتمدة علمياً؟',
      qEn: 'Is the cognitive certificate scientifically grounded?',
      aAr: 'نعم، يعتمد التقييم على إطار Cattell-Horn-Carroll ومقاييس زمن الرجع السريرية ومراجعة مجلس استشاري متخصص.',
      aEn: 'Yes, our diagnostic assessment is modeled on the Cattell-Horn-Carroll framework with precise reaction chronometry.',
    },
    {
      qAr: 'هل تتوفر خصومات للمدارس والمؤسسات الكبيرة؟',
      qEn: 'Are institutional discounts available for schools?',
      aAr: 'نعم، نوفر تراخيص مخصصة للمدارس والمراكز التعليمية تشمل تدريب المعلمين ولوحات تحكم جماعية.',
      aEn: 'Yes! We offer tailored institutional licenses for educational organizations, including custom teacher training.',
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
          <Sparkles className="h-4 w-4" />
          <span>{isRtl ? 'خطط مرنة تناسب طموحك العقلي' : 'Transparent & Flexible Pricing'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-foreground mb-6">
          {isRtl ? 'استثمر في ترقية قدراتك المعرفية' : 'Invest in Your Cognitive Longevity & Focus'}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {isRtl
            ? 'ابدأ مجاناً أو اختر النسخة الاحترافية للوصول غير المحدود إلى الـ 50 مهارة، ألعاب الذكاء، وتقارير التشخيص السريرية.'
            : 'Start free or upgrade to Pro for unrestricted access to all 50 skills, full game library, and clinical AI reports.'}
        </p>

        {/* Billing Cycle Toggle */}
        <div className="mt-10 inline-flex items-center gap-4 p-1.5 rounded-2xl bg-accent/60 border border-border/50">
          <button
            onClick={() => {
              playSound('click');
              setAnnualBilling(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              !annualBilling ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isRtl ? 'الدفع الشهري' : 'Monthly Billing'}
          </button>
          <button
            onClick={() => {
              playSound('click');
              setAnnualBilling(true);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              annualBilling ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{isRtl ? 'الدفع السنوي' : 'Annual Billing'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-400 text-slate-900 text-[10px] font-black">
              {isRtl ? 'وفر 20%' : 'Save 20%'}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
        {plans.map((p) => {
          const price = annualBilling ? p.priceAnnual : p.priceMonthly;
          return (
            <div
              key={p.id}
              className={`relative rounded-3xl border flex flex-col justify-between p-8 backdrop-blur-2xl transition-all duration-300 ${
                p.popular
                  ? 'border-primary bg-card shadow-2xl ring-2 ring-primary/30 scale-105 z-10'
                  : 'border-border/60 bg-card/60 shadow-lg hover:shadow-xl'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white text-xs font-black tracking-wide shadow-md">
                  {isRtl ? 'الخيار الأكثر شعبية' : 'Most Popular Choice'}
                </div>
              )}

              <div>
                <h3 className="text-xl font-black font-heading text-foreground mb-2">
                  {isRtl ? p.nameAr : p.nameEn}
                </h3>
                <p className="text-xs text-muted-foreground min-h-[36px] mb-6">
                  {isRtl ? p.descAr : p.descEn}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-foreground">
                    ${price}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {price === 0 ? '' : (isRtl ? '/شهرياً' : '/month')}
                  </span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3.5 text-xs text-foreground mb-8">
                  {(isRtl ? p.featuresAr : p.featuresEn).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={p.href} onClick={() => playSound('click')}>
                <Button
                  size="lg"
                  className={`w-full rounded-2xl font-bold btn-3d shadow-lg gap-2 ${
                    p.popular
                      ? 'btn-3d-primary bg-primary hover:bg-primary/90 text-white'
                      : 'bg-accent hover:bg-accent/80 text-foreground border border-border/60'
                  }`}
                >
                  <span>{isRtl ? p.ctaAr : p.ctaEn}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-muted text-foreground text-xs font-bold mb-3">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span>{isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            {isRtl ? 'كل ما تحتاج لمعرفته حول الاشتراكات' : 'Everything You Need to Know'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl shadow-sm"
            >
              <h4 className="font-bold text-sm text-foreground mb-2">
                {isRtl ? faq.qAr : faq.qEn}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl ? faq.aAr : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
