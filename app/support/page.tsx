'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  Search,
  Book,
  Zap,
  Brain,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function SupportPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const categories = [
    { id: 'all', labelAr: 'جميع الموضوعات', labelEn: 'All Topics', icon: Book },
    { id: 'start', labelAr: 'البداية والتقييم', labelEn: 'Getting Started', icon: Brain },
    { id: 'scoring', labelAr: 'النقاط ومؤشر NCI', labelEn: 'NCI & Scoring', icon: Zap },
    { id: 'billing', labelAr: 'الاشتراكات والحساب', labelEn: 'Billing & Accounts', icon: CreditCard },
    { id: 'privacy', labelAr: 'الأمان والخصوصية', labelEn: 'Privacy & Data', icon: ShieldCheck },
  ];

  const faqs = [
    {
      cat: 'start',
      qAr: 'كيف أبدأ أول تدريب إدراكي على منصة نَبِه؟',
      qEn: 'How do I start my first cognitive training session?',
      aAr: 'توجه إلى لوحة التدريب (Dashboard) واضغط على زر "بدء التدريب اليومي". سيقوم النظام بتشغيل 3 ألعاب منتقاة مخصصة لك في غضون 10 دقائق.',
      aEn: 'Head to your Dashboard and click "Start Daily Workout". The engine will automatically launch 3 curated cognitive games taking roughly 10 minutes.',
    },
    {
      cat: 'scoring',
      qAr: 'ما هو مؤشر نَبِـه الإدراكي (NCI) وكيف يُحسب؟',
      qEn: 'What is the Nabh Cognitive Index (NCI) and how is it scored?',
      aAr: 'مؤشر NCI هو مقياس مركب يتراوح بين 0 و 1000 نقطة، يعتمد على دقة الإجابات وسرعة زمن الرجع بالميللي ثانية ونسبة الانخفاض في الأخطاء مقارنة بالفئة العمرية.',
      aEn: 'The NCI is a standardized composite metric (0 - 1000) synthesized from your reaction latency (ms), precision rate, and error decay benchmarks.',
    },
    {
      cat: 'scoring',
      qAr: 'لماذا لم تفتح المهارة التالية بعد إنهائي اللعبة؟',
      qEn: 'Why did the next skill remain locked after finishing?',
      aAr: 'تتبع منصة نَبِه قاعدة صارمة للتقدم المعرفي: يجب تحقيق نسبة نجاح 70% على الأقل في المهارة السابقة لفتح المهارة التالية والحصول على النجوم.',
      aEn: 'Nabh enforces sequential mastery: the next skill unlocks only when all prerequisite skills achieve a passing score of at least 70% (1 Star).',
    },
    {
      cat: 'billing',
      qAr: 'كيف يمكنني الترقية لحساب العائلة وربط أطفالي؟',
      qEn: 'How can I upgrade to Family and link my children?',
      aAr: 'من صفحة الأسعار اختر باقة العائلة، ثم توجه إلى "بوابة الولي" (Parents Portal) لإضافة أسماء أطفالك وتحديد أوقات الشاشة والتمارين الإلزامية.',
      aEn: 'Select the Family plan from Pricing, then navigate to Parents Portal where you can create independent learner profiles and set screen-time controls.',
    },
    {
      cat: 'privacy',
      qAr: 'هل بيانات القياس العصبي للأطفال آمنة ومحمية؟',
      qEn: 'Is my child’s cognitive telemetry safe and private?',
      aAr: 'نعم، نحن نطبق تشفيراً كاملاً من طرف إلى طرف ومتوافقون كلياً مع معايير COPPA و FERPA الصارمة ولا نشارك البيانات مع أي أطراف إعلانية إطلاقاً.',
      aEn: 'Yes, we enforce AES-256 encryption and full compliance with COPPA & FERPA. We never sell, monetize, or share biometric or cognitive telemetry.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.cat === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      f.qAr.toLowerCase().includes(query) ||
      f.qEn.toLowerCase().includes(query) ||
      f.aAr.toLowerCase().includes(query) ||
      f.aEn.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
          <HelpCircle className="h-4 w-4" />
          <span>{isRtl ? 'مركز المساعدة وقاعدة المعرفة' : 'Help Center & Knowledge Base'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-foreground mb-6">
          {isRtl ? 'كيف يمكننا مساعدتك اليوم؟' : 'How Can We Assist You Today?'}
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isRtl
                ? 'ابحث عن حل (مثل: فتح المهارات، مؤشر NCI، أوقات الشاشة)...'
                : 'Search questions, skills unlocking, NCI formula...'
            }
            className="w-full h-14 rounded-3xl border border-border/80 bg-card/90 px-6 pl-12 rtl:pl-6 rtl:pr-12 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 backdrop-blur-xl transition-all"
          />
          <Search className="absolute top-4.5 left-4 rtl:left-auto rtl:right-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playSound('click');
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{isRtl ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* FAQs List */}
      <div className="space-y-4 mb-16">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-sm transition-all"
              >
                <button
                  onClick={() => {
                    playSound('pop');
                    setExpandedFaq(isExpanded ? null : idx);
                  }}
                  className="w-full p-6 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                >
                  <span>{isRtl ? faq.qAr : faq.qEn}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-6 pb-6 pt-1 border-t border-border/30 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isRtl ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {isRtl ? 'لم نجد نتائج مطابقة لبحثك.' : 'No matching answers found for your query.'}
          </div>
        )}
      </div>

      {/* Still Need Help Box */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-tr from-primary/10 via-purple-500/5 to-background p-8 text-center backdrop-blur-xl shadow-lg">
        <div className="max-w-md mx-auto space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-black font-heading text-foreground">
            {isRtl ? 'لم تجد الإجابة التي تبحث عنها؟' : 'Still Have Questions?'}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isRtl
              ? 'فريق الدعم الفني والتربوي لدينا متواجد على مدار الساعة لمساعدتك في أي استفسار.'
              : 'Our cognitive coaching and technical operations team is available around the clock.'}
          </p>
          <div className="pt-2">
            <Link href="/contact" onClick={() => playSound('click')}>
              <Button size="lg" className="rounded-2xl font-bold btn-3d btn-3d-primary shadow-md">
                {isRtl ? 'تواصل مع الدعم الفني' : 'Contact Support Directly'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
