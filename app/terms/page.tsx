'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FileCheck, AlertTriangle, Scale, Award, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 sm:p-12 backdrop-blur-2xl shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center pb-6 border-b border-border/40">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs mb-4">
            <Scale className="h-4 w-4" />
            <span>Platform License & Usage Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {isRtl ? 'شروط وأحكام الاستخدام' : 'Terms of Service'}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            {isRtl ? 'سارية المفعول اعتباراً من سبتمبر 2026' : 'Effective as of September 2026'}
          </p>
        </div>

        {/* Section 1: Educational Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{isRtl ? 'تنويه طبي وإدراكي هام' : 'Important Cognitive & Medical Disclaimer'}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isRtl
              ? 'منصة نَبِـه (Nabh) هي منصة تدريب وتعليم إدراكي وليست جهازاً أو تشخيصاً طبياً. التقارير الصادرة ومؤشر NCI مصممة لأغراض التحفيز والقياس التربوي، ولا تغني عن استشارة أطباء الأعصاب أو الأخصائيين النفسيين المعتمدين.'
              : 'Nabh is a cognitive enhancement and educational development platform, not a medical diagnostic device. Performance telemetry and NCI metrics are intended for learning and self-improvement and do not substitute for formal clinical psychiatric evaluation.'}
          </p>
        </div>

        {/* Section 2: Platform License */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            <span>{isRtl ? '1. ترخيص الاستخدام والملكية الفكرية' : '1. Intellectual Property & License'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'جميع الألعاب، النماذج الرياضية، محركات القياس التكيفي، والرموز والتصاميم البصرية هي حقوق ملكية فكرية حصرية لشركة نَبِه. يُمنح المستخدم ترخيصاً شخصياً غير قابل للتحويل للاستفادة من المحتوى التعليمي.'
              : 'All game engines, cognitive algorithms, visual designs, and sound synthesis routines are proprietary intellectual property of Nabh. Users receive a non-exclusive, revocable personal educational license.'}
          </p>
        </div>

        {/* Section 3: Fair Play */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-500" />
            <span>{isRtl ? '2. النزاهة واللعب العادل في الألعاب والتصنيف' : '2. Fair Play & Competitive Integrity'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'يُحظر استخدام أي برمجيات آلية (Bots) أو تعديل إشارات زمن الرجع أو التلاعب بنقاط المتصدرين. يحتفظ مسؤولو المنصة بالحق في إعادة تعيين أو تعليق الحسابات المخالفة لمعايير النزاهة.'
              : 'Automated macros, click scripts, and telemetry falsification are strictly prohibited. Platform administrators reserve the right to audit and invalidate unverified leaderboard submissions.'}
          </p>
        </div>

        {/* Section 4: Subscriptions */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-500" />
            <span>{isRtl ? '3. الاشتراكات، الإلغاء، واسترداد الأموال' : '3. Subscriptions & Cancellation'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'يتم تجديد الاشتراكات المدفوعة تلقائياً وفق الدورة المختارة (شهرية أو سنوية). يمكنك إيقاف التجديد في أي وقت قبل حلول تاريخ الاستحقاق التالي عبر إعدادات حسابك.'
              : 'Subscriptions renew automatically at the selected cadence (monthly or annually). You can disable auto-renew anytime prior to billing via your account settings without penalties.'}
          </p>
        </div>
      </div>
    </div>
  );
}
