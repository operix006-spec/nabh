'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Brain, Sparkles, Shield, Award, Map, Gamepad2, Layers } from 'lucide-react';
import { NabhLogo } from '@/components/common/NabhLogo';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  return (
    <footer className="w-full border-t border-border/40 bg-card/60 backdrop-blur-xl mt-24 py-16 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center" onClick={() => playSound('click')}>
              <NabhLogo size="lg" />
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
              {isRtl
                ? 'المنصة التعليمية الشاملة لقياس وتدريب 50 مهارة إدراكية وعصبية عبر ألعاب تفاعلية ونماذج علم الأعصاب السريري ونظريات الذكاء السائل.'
                : 'The leading educational neuro-platform designed to measure, stimulate, and evaluate 50 cognitive skills through interactive games grounded in neuropsychological science.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>50 Cognitive Skills</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-500" />
                <span>FERPA & COPPA Compliant</span>
              </div>
            </div>
          </div>

          {/* Column 1: Platform & Learning */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              {isRtl ? 'المنصة والتدريب' : 'Platform & Learning'}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'لوحة التدريب' : 'Dashboard'}
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'ساحة الألعاب (12)' : 'Games Arena (12)'}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'خريطة التعلم والتطور' : 'Skill Roadmap'}
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'دليل الـ 50 مهارة' : '50 Skills Directory'}
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'التقييم المعياري الشامل' : 'Diagnostic Assessment'}
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'الأوسمة والإنجازات' : 'Achievements'}
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'قائمة المتصدرين' : 'Global Leaderboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals & Science */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              {isRtl ? 'البوابات والعلوم' : 'Portals & Science'}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
              <li>
                <Link href="/parents" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'بوابة ولي الأمر' : 'Parents Portal'}
                </Link>
              </li>
              <li>
                <Link href="/teacher" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'بوابة المعلم والصفوف' : 'Teacher Hub'}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'لوحة تحكم المسؤول' : 'Admin Console'}
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'التقارير السريرية CHC' : 'Psychometric Reports'}
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'منحنى النمو والتسارع' : 'Progress Velocity'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'باقات الاشتراك والأسعار' : 'Subscription Plans'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              {isRtl ? 'عن نَبِه والدعم' : 'Company & Support'}
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'عن المنصة ورسالتنا' : 'About Our Mission'}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'كيف تعمل المنصة؟' : 'How It Works'}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'مركز المساعدة والدعم' : 'Help & Support'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'تواصل مع الفريق' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors" onClick={() => playSound('click')}>
                  {isRtl ? 'شروط الاستخدام' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 Nabh Cognitive OS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with scientific precision for human cognitive flourishing</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
