'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Shield, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border/60 bg-card/80 p-8 sm:p-12 backdrop-blur-2xl shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center pb-6 border-b border-border/40">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs mb-4">
            <Shield className="h-4 w-4" />
            <span>COPPA, FERPA & GDPR Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {isRtl ? 'سياسة الخصوصية وأمان البيانات' : 'Privacy & Data Protection Policy'}
          </h1>
          <p className="text-xs text-muted-foreground mt-2">
            {isRtl ? 'آخر تحديث: سبتمبر 2026' : 'Last Updated: September 2026'}
          </p>
        </div>

        {/* Section 1: Overview */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>{isRtl ? '1. التزامنا الأخلاقي بحماية عقلك وبياناتك' : '1. Our Foundational Privacy Pledge'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'تعتبر منصة نَبِـه (Nabh) خصوصية المتعلمين—لا سيما الأطفال والطلاب—حقاً إنسانياً غير قابل للتفاوض. نحن لا نبيع بياناتك الإدراكية أو الشخصية لأي طرف ثالث ولا نستخدمها لأي غرض إعلاني أو تجاري إطلاقاً.'
              : 'At Nabh, the privacy of our learners—especially children and students—is a non-negotiable principle. We never sell, lease, or monetize your cognitive telemetry or personal identity for commercial or advertising purposes.'}
          </p>
        </div>

        {/* Section 2: Data Collected */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-indigo-500" />
            <span>{isRtl ? '2. نوعية البيانات التي نقوم بمعالجتها' : '2. Information We Collect & Process'}</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{isRtl ? 'بيانات الأداء الإدراكي: ' : 'Cognitive Telemetry: '}</strong>
                {isRtl
                  ? 'أزمنة الرجع بالميللي ثانية، نسب الدقة، سلاسل الإجابات ومستويات الصعوبة المحققة أثناء الألعاب.'
                  : 'Reaction chronometry (ms), accuracy rates, response latency, and difficulty levels achieved during interactive tasks.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>{isRtl ? 'بيانات الحساب الأساسية: ' : 'Account Profile: '}</strong>
                {isRtl
                  ? 'الاسم، البريد الإلكتروني، الفئة العمرية (لتحديد المنحنيات المعيارية المقارنة)، وتفضيلات اللغة والسمة.'
                  : 'Display name, encrypted email, age bracket (strictly for normative peer cohort comparisons), and UI preferences.'}
              </span>
            </li>
          </ul>
        </div>

        {/* Section 3: Children's Safety */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <span>{isRtl ? '3. حماية خصوصية الأطفال (COPPA)' : "3. Children's Online Privacy (COPPA Compliance)"}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'بالنسبة للمتعلمين دون سن 13 عاماً، تتطلب المنصة موافقة صريحة من ولي الأمر أو المؤسسة التعليمية (عبر بوابة الولي أو المعلم). يحق لأولياء الأمور في أي وقت مراجعة أو تصدير أو حذف السجلات الإدراكية الخاصة بأبنائهم بضغطة زر.'
              : 'For learners under the age of 13, parental or educational institution consent is strictly mandatory. Parents retain unconditional rights to review, export, or erase their child’s cognitive metrics at any time.'}
          </p>
        </div>

        {/* Section 4: Data Rights */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <span>{isRtl ? '4. حقوقك في حذف وتصدير البيانات' : '4. Your Right to Portability & Deletion'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isRtl
              ? 'يحق لك في أي وقت تنزيل نسخة كاملة من بياناتك وسجلاتك النفسية بصيغة JSON أو CSV من لوحة الإعدادات، أو طلب الإلغاء والحذف الشامل لجميع سجلاتك من خوادمنا بصورة نهائية.'
              : 'Under GDPR and applicable digital protection laws, you may download a complete archive of your telemetry records via Settings, or trigger permanent deletion of your profile.'}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
          <p>
            {isRtl ? 'لأي استفسارات قانونية أو ممارسة لحقوق الخصوصية: ' : 'For privacy inquiries or data requests, contact: '}
            <a href="mailto:privacy@nabh.ai" className="text-primary font-bold hover:underline">
              privacy@nabh.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
