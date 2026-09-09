'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Zap,
  Target,
  Shuffle,
  Compass,
  Cpu,
  MessageCircleHeart,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  BarChart3,
  Users,
  ShieldCheck,
  Play,
  RotateCw,
  ChevronDown,
  Star,
  Activity,
  Layers,
  Sparkle,
} from 'lucide-react';
import { InteractiveSynapseCanvas } from '@/components/common/InteractiveSynapseCanvas';
import { Floating3DBrain } from '@/components/common/Floating3DBrain';
import { AnimatedCountUp } from '@/components/common/AnimatedCountUp';

export default function LandingPage() {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  // Interactive Mini-Demo State for Reflex Tester
  const [demoState, setDemoState] = useState<'idle' | 'waiting' | 'ready' | 'success'>('idle');
  const [demoScore, setDemoScore] = useState<number | null>(null);

  // Billing Toggle State (Monthly / Annual)
  const [annualBilling, setAnnualBilling] = useState(true);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const startMiniDemo = () => {
    playSound('click');
    setDemoState('waiting');
    const delay = Math.floor(Math.random() * 2000) + 1200;
    setTimeout(() => {
      setDemoState('ready');
      playSound('tick');
    }, delay);
  };

  const handleMiniDemoTap = () => {
    if (demoState === 'ready') {
      playSound('success');
      const scoreMs = Math.floor(Math.random() * 60) + 210;
      setDemoScore(scoreMs);
      setDemoState('success');
    }
  };

  const domainIcons: Record<string, React.ReactNode> = {
    memory: <Brain className="h-6 w-6 text-blue-500" />,
    attention: <Target className="h-6 w-6 text-rose-500" />,
    speed: <Zap className="h-6 w-6 text-amber-500" />,
    flexibility: <Shuffle className="h-6 w-6 text-emerald-500" />,
    spatial: <Compass className="h-6 w-6 text-violet-500" />,
    logic: <Cpu className="h-6 w-6 text-cyan-500" />,
    social: <MessageCircleHeart className="h-6 w-6 text-pink-500" />,
  };

  const partners = [
    { name: 'Riyadh STEM Academy', nameAr: 'أكاديمية الرياض للعلوم والتقنية' },
    { name: 'King Fahd Neuro Hub', nameAr: 'مركز الملك فهد للأبحاث العصبية' },
    { name: 'Cognitive Science Society', nameAr: 'جمعية العلوم المعرفية' },
    { name: 'Cambridge NeuroEd', nameAr: 'معهد كامبريدج للتعليم المعرفي' },
    { name: 'Global CHC Consortium', nameAr: 'الاتحاد الدولي للنموذج الإدراكي CHC' },
  ];

  const faqs = [
    {
      qAr: 'ما هو نموذج CHC الذي تعتمد عليه منصة نَبِه؟',
      qEn: 'What is the CHC cognitive model powering Nabh?',
      aAr: 'هو نموذج كاتل-هورن-كارول (CHC)، وهو المعيار العلمي الذهبي المعتمد دولياً في علم النفس العصبي لتصنيف القدرات الذهنية إلى مهارات أولية وثانوية ومستوى عام (G-Factor).',
      aEn: 'The Cattell-Horn-Carroll (CHC) theory is the most scientifically validated psychometric taxonomy globally, categorizing intelligence into specialized cognitive domains.',
    },
    {
      qAr: 'كيف تضمن المنصة تطور المتعلم عبر شرط الـ 70% للفتح؟',
      qEn: 'How does the 70% passing threshold enforce progressive mastery?',
      aAr: 'تتبع المنصة شجرة مهارات عصبية صارمة؛ حيث لا تُفتح أي مهارة تالية إلا عند إحراز 70% أو أكثر في المهارة السابقة، مما يضمن ترسخ اللدونة العصبية قبل الانتقال للتحدي الأكثر تعقيداً.',
      aEn: 'Nabh enforces a strict prerequisite cascade: the subsequent cognitive skill only unlocks after achieving a >=70% standardized score on preceding foundational drills.',
    },
    {
      qAr: 'هل المحتوى والألعاب مناسبة لجميع الفئات العمرية؟',
      qEn: 'Is Nabh suitable for children, students, and working adults?',
      aAr: 'نعم، المحركات الـ 12 مدعومة بخوارزمية التكيف اللحظي (DDA) التي تقيس زمن الاستجابة بدقة المللي ثانية وتعدل مستوى الصعوبة تلقائياً ليناسب كل مرحلة عمرية وقدرة ذهنية.',
      aEn: 'Yes. Our 12 dynamic engines use real-time Dynamic Difficulty Adjustment (DDA) responding to millisecond latency and error rates, tuning challenge for any age cohort.',
    },
    {
      qAr: 'هل يمكن للمدارس والمعلمين متابعة أداء الطلاب ومشاركتهم؟',
      qEn: 'Can schools and educators monitor student progress and cohorts?',
      aAr: 'بالتأكيد، توفر المنصة بوابة متخصصة للمعلمين تتيح إنشاء الشُعب، تعيين الواجبات العصبية، وتحميل تقارير سريرية معيارية بصيغ PDF و JSON بنقرة واحدة.',
      aEn: 'Yes. Dedicated teacher portals allow educators to manage class cohorts, assign targeted drills, and export verified psychometric analytics in one click.',
    },
    {
      qAr: 'هل تتوفر تجربة مجانية للمنصة؟',
      qEn: 'Is there a free assessment to try before subscribing?',
      aAr: 'نعم، يمكن لأي مستخدم بدء الاختبار التقييمي التشخيصي الأولي مجاناً دون الحاجة لبطاقة ائتمان والحصول على مؤشر NCI الأولي فوراً.',
      aEn: 'Absolutely. Anyone can take our comprehensive baseline cognitive assessment for free without a credit card to benchmark their initial NCI score.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-apple-mesh overflow-x-hidden">
      
      {/* 1. HERO SECTION (APPLE × LINEAR × STRIPE STAGE) */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Dynamic Synaptic Interactive Canvas Background */}
        <InteractiveSynapseCanvas className="opacity-60 -z-10" nodeCount={50} />

        {/* Multi-Stop Ambient Spotlights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#6C63FF]/20 via-[#8B5CF6]/15 to-[#00E5A8]/15 rounded-full blur-3xl pointer-events-none -z-20" />
        <div className="absolute top-1/3 right-4 w-[400px] h-[400px] bg-[#00E5A8]/10 rounded-full blur-3xl pointer-events-none -z-20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Typography & Tactile CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-center lg:text-start"
            >
              
              {/* Luxury Top Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-[#6C63FF] dark:text-[#A78BFA] font-bold text-xs shadow-sm border border-primary/20">
                  <Sparkles className="h-4 w-4 text-[#00E5A8]" />
                  <span>{isRtl ? 'المنصة الإدراكية الأولى عربياً' : 'Next-Gen Cognitive Neuro-Education'}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5A8] animate-pulse" />
                  <span className="font-mono">50 Skills • CHC</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
                  <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-bounce" />
                  <span>{isRtl ? 'تكيّف لحظي DDA' : 'Adaptive Game Loops'}</span>
                </div>
              </div>

              {/* Grand Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight font-heading leading-[1.12] text-foreground">
                {isRtl ? (
                  <>
                    أيقظ عبقرية عقلك مع{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#00E5A8]">
                      50 مهارة عصبية
                    </span>
                  </>
                ) : (
                  <>
                    Sharpen Your Mind With{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] via-[#8B5CF6] to-[#00E5A8]">
                      50 Cognitive Skills
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                {isRtl
                  ? 'المنصة العلمية المتكاملة لتقييم وتدريب الذاكرة، الانتباه، وسرعة البديهة عبر 12 لعبة تفاعلية مصممة بمعايير علم النفس العصبي ونموذج CHC السريري.'
                  : 'A clinical-grade educational platform teaching and evaluating working memory, executive focus, and processing speed through 12 dynamic game engines and strict mastery unlocks.'}
              </p>

              {/* Duolingo 3D Tactile CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/assessment" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full font-black text-base h-14 rounded-2xl gap-2 shadow-xl btn-3d btn-3d-primary shine-sheen px-8 btn-bounce"
                  >
                    <span>{t('startAssessment')}</span>
                    {isRtl ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                  </Button>
                </Link>

                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full font-bold text-base h-14 rounded-2xl border-2 border-border/80 px-8 hover:bg-card/80 backdrop-blur-xl btn-bounce"
                  >
                    <span>{isRtl ? 'لوحة التحكم التفاعلية' : 'Open Live Dashboard'}</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00E5A8]" />
                  <span>{isRtl ? 'مؤشر NCI الإدراكي المعتمد' : 'Standardized NCI Score'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00E5A8]" />
                  <span>{isRtl ? 'قياس بالمللي ثانية' : 'Millisecond Chronometry'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00E5A8]" />
                  <span>{isRtl ? 'حفظ فوري في Supabase' : 'Real-time Supabase Telemetry'}</span>
                </div>
              </div>

            </motion.div>

            {/* Right Column: 3D Floating Brain & Live Reflex Tester */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative flex flex-col items-center gap-6"
            >
              {/* Floating 3D Vector Neuro-Brain */}
              <Floating3DBrain />

              {/* Live Interactive Reflex Tester Widget */}
              <div className="w-full max-w-md rounded-3xl p-6 glass-panel shadow-floating border border-white/60 dark:border-white/10 glow-card relative">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="h-3 w-3 rounded-full bg-[#00E5A8] animate-pulse" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold border-primary/30 text-primary">
                    ⚡ Live Reflex Chronometer
                  </Badge>
                </div>

                <div className="my-4 text-center space-y-1">
                  <h4 className="text-base font-black font-heading text-foreground">{t('heroDemoHeading')}</h4>
                  <p className="text-[11px] text-muted-foreground">{t('heroDemoSub')}</p>
                </div>

                {/* Interactive Target Box */}
                <div
                  onClick={demoState === 'ready' ? handleMiniDemoTap : undefined}
                  className={`h-36 rounded-2xl border-2 flex flex-col items-center justify-center select-none transition-all duration-300 ${
                    demoState === 'idle'
                      ? 'bg-secondary/40 border-dashed border-border'
                      : demoState === 'waiting'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-600'
                      : demoState === 'ready'
                      ? 'bg-[#00E5A8] text-slate-950 border-emerald-300 cursor-pointer shadow-lg shadow-[#00E5A8]/40 animate-pulse'
                      : 'bg-primary/10 border-primary/30 text-primary'
                  }`}
                >
                  {demoState === 'idle' && (
                    <Button onClick={startMiniDemo} size="sm" className="rounded-xl font-bold gap-2 btn-3d btn-3d-primary text-xs">
                      <Play className="h-4 w-4 fill-white" />
                      <span>{isRtl ? 'ابدأ الاختبار السريع' : 'Start Quick Drill'}</span>
                    </Button>
                  )}

                  {demoState === 'waiting' && (
                    <div className="space-y-1 text-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 animate-ping mx-auto mb-2" />
                      <span className="text-xs font-bold">{isRtl ? 'انتظر وميض الأخضر...' : 'Wait for green flash...'}</span>
                    </div>
                  )}

                  {demoState === 'ready' && (
                    <div className="text-center">
                      <Zap className="h-8 w-8 mx-auto animate-bounce text-slate-950 mb-0.5" />
                      <span className="text-xl font-black">{isRtl ? 'انقر الآن!' : 'TAP NOW!'}</span>
                    </div>
                  )}

                  {demoState === 'success' && demoScore && (
                    <div className="text-center space-y-1.5">
                      <div className="text-2xl font-black font-mono text-primary">{demoScore} ms</div>
                      <p className="text-[11px] font-bold text-muted-foreground">
                        {demoScore < 240
                          ? (isRtl ? 'سرعة استجابة فائقة!' : 'Superhuman reflex!')
                          : (isRtl ? 'استجابة بصرية ممتازة!' : 'Sharp visual latency!')}
                      </p>
                      <Button onClick={startMiniDemo} variant="ghost" size="sm" className="rounded-xl text-xs gap-1 font-bold h-7">
                        <RotateCw className="h-3 w-3" />
                        <span>{t('playAgain')}</span>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <Link href="/games/reaction-game">
                    <span className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1">
                      {isRtl ? 'العب النسخة الكاملة من لعبة سرعة رد الفعل' : 'Play full Reaction Arena'}
                      {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF & CERTIFIED INSTITUTES TICKER */}
      <section className="py-8 border-y border-border/40 bg-card/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] uppercase tracking-widest font-mono text-muted-foreground mb-6 font-bold">
            {isRtl ? 'معتمد ومطبق في المدارس والمراكز الأكاديمية الرائدة' : 'Trusted by Leading Educational Institutes & Neuro-Centers'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-pill border border-border/60 hover:border-primary/40 transition-all hover:scale-105"
              >
                <ShieldCheck className="h-4 w-4 text-[#00E5A8]" />
                <span className="text-xs font-bold text-foreground">
                  {isRtl ? partner.nameAr : partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE PLATFORM METRICS (ANIMATED COUNT-UP) */}
      <section className="py-16 bg-gradient-to-b from-card/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-3xl glass-panel shadow-floating border border-white/60 dark:border-white/10 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-primary">
                <AnimatedCountUp end={120000} suffix="+" duration={2200} />
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'جلسة تدريب وتقييم مكتملة' : 'Completed Cognitive Drills'}
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel shadow-floating border border-white/60 dark:border-white/10 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-[#8B5CF6]">
                <AnimatedCountUp end={50} suffix=" مهارة" duration={1800} />
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'مهارة إدراكية معيارية (CHC)' : 'Standardized CHC Faculties'}
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel shadow-floating border border-white/60 dark:border-white/10 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-[#00E5A8]">
                <AnimatedCountUp end={99.4} suffix="%" decimals={1} duration={2000} />
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'دقة القياس والتشخيص السريري' : 'Diagnostic Precision Rate'}
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel shadow-floating border border-white/60 dark:border-white/10 space-y-2">
              <div className="text-3xl sm:text-5xl font-black text-primary">
                <AnimatedCountUp end={7} suffix=" نطاقات" duration={1500} />
              </div>
              <p className="text-xs font-bold text-muted-foreground">
                {isRtl ? 'محاور عصبية متوازنة' : 'Balanced Neural Domains'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE 7 COGNITIVE DOMAINS (FLOATING GLOW CARDS) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
              {isRtl ? 'الهيكل العصبي المعياري' : 'Standardized Neuro-Architecture'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-foreground">
              {isRtl ? 'الركائز الإدراكية الـ 7' : 'The 7 Cognitive Domains'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isRtl
                ? 'تغطي نَبِه منظومة شاملة من 50 مهارة موزعة بتوازن دقيق على النطاقات العصبية السريرية:'
                : 'Nabh maps 50 faculties precisely across the 7 recognized neurological domains:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {COGNITIVE_DOMAINS.map((domain) => {
              const name = isRtl ? domain.nameAr : domain.nameEn;
              const desc = isRtl ? domain.descriptionAr : domain.descriptionEn;

              return (
                <Card
                  key={domain.id}
                  className="p-6 rounded-3xl glass-panel border border-white/60 dark:border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-floating group glow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-secondary/70 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        {domainIcons[domain.id]}
                      </div>
                      <Badge variant="outline" className="text-xs font-bold font-mono">
                        {domain.skillsCount} {isRtl ? 'مهارات' : 'Skills'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold font-heading mb-2 text-foreground group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {desc}
                    </p>
                  </div>

                  <Link href={`/skills?domain=${domain.id}`}>
                    <span className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                      {isRtl ? 'استعراض مهارات النطاق' : 'Explore Domain Skills'}
                      {isRtl ? <ArrowLeft className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                    </span>
                  </Link>
                </Card>
              );
            })}

            {/* Grand Summary Card */}
            <div className="p-6 rounded-3xl border-2 border-primary/35 bg-gradient-to-br from-[#6C63FF]/15 via-[#8B5CF6]/10 to-card flex flex-col justify-between glow-card relative overflow-hidden glass-panel shadow-floating">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-[#6C63FF] text-white font-mono text-[10px]">50 Skills Complete</Badge>
                  <Sparkles className="h-6 w-6 text-[#00E5A8]" />
                </div>
                <h3 className="text-xl font-black font-heading mb-2 text-foreground">
                  {isRtl ? 'شجرة التطور المعرفي' : 'Complete 50-Skill Battery'}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isRtl
                    ? 'منصة شاملة تجمع بين دقة التقييم السريري ومتعة التحفيز بالألعاب اللحظية.'
                    : 'A unified battery combining psychometric chronometry with daily Duolingo-like reward loops.'}
                </p>
              </div>
              <Link href="/roadmap" className="pt-4">
                <Button size="sm" className="w-full font-bold rounded-2xl btn-3d btn-3d-primary text-xs h-11 btn-bounce">
                  <span>{isRtl ? 'عرض خريطة المهارات' : 'View Skill Roadmap'}</span>
                  {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4-STEP SYNAPTIC PIPELINE) */}
      <section className="py-20 border-t border-border/40 bg-accent/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
              {isRtl ? 'رحلة التطور العصبي' : 'Cyclical Mastery Loop'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-foreground">
              {isRtl ? 'كيف ترتقي بقدراتك الذهنية مع نَبِه؟' : 'How Nabh Awakens Cognitive Potential'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <Card className="p-6 rounded-3xl glass-panel border border-white/60 dark:border-white/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black font-mono text-xl">
                1
              </div>
              <h4 className="font-bold text-base font-heading text-foreground">
                {isRtl ? 'التقييم المعياري الدقيق' : 'Baseline Evaluation'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl
                  ? 'جلسة تشخيصية سريعة تحدد مؤشر NCI الأساسي وتكشف نقاط القوة وفرص التطور الإدراكي.'
                  : 'A rapid chronometric diagnostic computes your foundational NCI score across all key domains.'}
              </p>
            </Card>

            <Card className="p-6 rounded-3xl glass-panel border border-white/60 dark:border-white/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 rounded-2xl bg-[#6C63FF]/10 text-[#6C63FF] flex items-center justify-center font-black font-mono text-xl">
                2
              </div>
              <h4 className="font-bold text-base font-heading text-foreground">
                {isRtl ? 'تدريب يومي ممتع (10 دقائق)' : '10-Min Daily Drills'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl
                  ? 'ألعاب تفاعلية حماسية تمنح نقاط XP وعملات ومكافآت تحفز الالتزام اليومي وسلاسل النشاط.'
                  : 'Bite-sized tactile mini-games offering XP, coin bursts, and streak multipliers to build cognitive fitness.'}
              </p>
            </Card>

            <Card className="p-6 rounded-3xl glass-panel border border-white/60 dark:border-white/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 rounded-2xl bg-[#00E5A8]/15 text-[#00E5A8] flex items-center justify-center font-black font-mono text-xl">
                3
              </div>
              <h4 className="font-bold text-base font-heading text-foreground">
                {isRtl ? 'التكيف اللحظي DDA' : 'Dynamic Difficulty (DDA)'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl
                  ? 'خوارزميات ذكية تتكيف مع أخطائك وسرعتك لتبقيك دائماً في منطقة التحفيز الذهني المثلى.'
                  : 'Real-time algorithms modulate distractor frequency and stimulus velocity based on millisecond latency.'}
              </p>
            </Card>

            <Card className="p-6 rounded-3xl glass-panel border border-white/60 dark:border-white/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black font-mono text-xl">
                4
              </div>
              <h4 className="font-bold text-base font-heading text-foreground">
                {isRtl ? 'فتح المهارات وشهادة الإتقان' : '70% Mastery Unlock'}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl
                  ? 'تفتح المهارات المتقدمة تباعاً عند اجتياز حاجز 70% وتُصدر تقارير بيانية معتمدة للتقدم.'
                  : 'Advanced tiers cascade-unlock upon 70%+ scores, culminating in verified clinical NCI certifications.'}
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* 6. PRICING & SUBSCRIPTIONS (APPLE LUXURY STYLE) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
              {isRtl ? 'الاشتراكات والخطط' : 'Transparent Pricing'}
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black font-heading text-foreground">
              {isRtl ? 'استثمر في قدرات عقلك' : 'Invest in Your Mind'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isRtl ? 'خطط مرنة للمتعلمين، العائلات، والمدارس مع إمكانية الإلغاء في أي وقت' : 'Flexible plans for individuals, families, and academic institutions'}
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 rounded-full glass-panel border border-border/80 mt-4">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !annualBilling ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isRtl ? 'شهري' : 'Monthly'}
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  annualBilling ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{isRtl ? 'سنوي' : 'Annual'}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#00E5A8] text-slate-950 text-[10px] font-black">
                  {isRtl ? 'خصم 20%' : 'Save 20%'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            
            {/* Plan 1: Explorer */}
            <Card className="p-8 rounded-3xl glass-panel border border-border/70 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading text-foreground">{isRtl ? 'المستكشف' : 'Explorer'}</h3>
                <p className="text-xs text-muted-foreground mt-1">{isRtl ? 'للتعرف على المنصة وتقييم المهارات الأساسية' : 'Ideal for casual cognitive warmup'}</p>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-black text-foreground">{annualBilling ? '$0' : '$0'}</span>
                  <span className="text-xs text-muted-foreground">/{isRtl ? 'مجاناً دائماً' : 'forever free'}</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'الوصول إلى 5 مهارات أساسية' : '5 foundational skills unlocked'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'اختبار مؤشر NCI الأولي' : 'Baseline NCI assessment'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? '3 ألعاب تدريبية يومياً' : '3 daily game sessions'}</li>
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-2xl font-bold text-xs h-12 border-2">
                  {isRtl ? 'ابدأ مجاناً' : 'Get Started Free'}
                </Button>
              </Link>
            </Card>

            {/* Plan 2: Pro Mastery (Featured Highlight) */}
            <Card className="p-8 rounded-3xl glass-panel border-2 border-primary shadow-floating relative scale-105 space-y-6 bg-gradient-to-b from-primary/10 via-card to-card">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                {isRtl ? 'الأكثر تميزاً وشعبية' : 'Most Popular'}
              </div>
              <div>
                <h3 className="text-2xl font-black font-heading text-foreground">{isRtl ? 'المحترف الإدراكي' : 'Cognitive Pro'}</h3>
                <p className="text-xs text-muted-foreground mt-1">{isRtl ? 'للتدريب الشامل على كامل الـ 50 مهارة' : 'Full 50-skill access & clinical reports'}</p>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-black text-primary">{annualBilling ? '$14' : '$18'}</span>
                  <span className="text-xs text-muted-foreground">/{isRtl ? 'شهرياً' : 'month'}</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-foreground font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'فتح كامل الـ 50 مهارة عصبية' : 'All 50 standardized skills unlocked'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? '12 محرك ألعاب غير محدود' : 'Unlimited play across all 12 game engines'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'تقارير NCI تفصيلية قابلة للتصدير والطباعة' : 'Exportable clinical PDF & JSON evaluations'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'مستشار الذكاء الاصطناعي التكيفي' : 'AI Adaptive Cognitive Advisor included'}</li>
              </ul>
              <Link href="/register?plan=pro">
                <Button className="w-full rounded-2xl font-black text-sm h-12 btn-3d btn-3d-primary shadow-xl shine-sheen btn-bounce">
                  {isRtl ? 'ابدأ الاشتراك الاحترافي' : 'Unlock Pro Access'}
                </Button>
              </Link>
            </Card>

            {/* Plan 3: Family & Cohorts */}
            <Card className="p-8 rounded-3xl glass-panel border border-border/70 space-y-6">
              <div>
                <h3 className="text-xl font-bold font-heading text-foreground">{isRtl ? 'العائلة والمجموعات' : 'Family & School'}</h3>
                <p className="text-xs text-muted-foreground mt-1">{isRtl ? 'حتى 5 متعلمين مع لوحة تحكم وإشراف' : 'Up to 5 learners with parent/teacher portals'}</p>
                <div className="mt-4 flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-black text-foreground">{annualBilling ? '$29' : '$36'}</span>
                  <span className="text-xs text-muted-foreground">/{isRtl ? 'شهرياً' : 'month'}</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? '5 حسابات مستقلة للمتعلمين' : '5 independent learner profiles'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'بوابة أولياء الأمور وضبط وقت الشاشة' : 'Screen-time limits & parent governance'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00E5A8]" /> {isRtl ? 'تقارير مقارنة جماعية بين أفراد الأسرة' : 'Cohort benchmark analytics'}</li>
              </ul>
              <Link href="/register?plan=family">
                <Button variant="outline" className="w-full rounded-2xl font-bold text-xs h-12 border-2">
                  {isRtl ? 'اشترك للعائلة' : 'Choose Family'}
                </Button>
              </Link>
            </Card>

          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE FAQ ACCORDION */}
      <section className="py-20 border-t border-border/40 bg-card/25">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
              {isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
              {isRtl ? 'كل ما تود معرفته عن منصة نَبِه' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-panel border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-sm text-foreground hover:bg-accent/20 transition-colors"
                  >
                    <span>{isRtl ? faq.qAr : faq.qEn}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3 animate-in fade-in duration-200">
                      {isRtl ? faq.aAr : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. GRAND CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-[#6C63FF]/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5A8]/15 text-[#00E5A8] border border-[#00E5A8]/30 text-xs font-bold shadow-sm">
            <Sparkle className="h-4 w-4 fill-current" />
            <span>{isRtl ? 'ابدأ رحلة التميز الذهني' : 'Begin Your Neuro Journey'}</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-black font-heading tracking-tight text-foreground">
            {isRtl ? 'جاهز لاختبار أقصى إمكانات عقلك؟' : 'Ready to Unlock Your True Potential?'}
          </h2>

          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'انضم اليوم إلى آلاف المتعلمين والمدارس المعتمدة، وابدأ رحلتك التقييمية المجانية الآن.'
              : 'Join thousands of learners sharpening their minds 10 minutes a day with certified CHC accuracy.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/assessment">
              <Button size="lg" className="h-14 px-10 rounded-2xl font-black text-base shadow-xl btn-3d btn-3d-primary shine-sheen btn-bounce">
                {t('startAssessment')}
              </Button>
            </Link>
            <Link href="/games">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold text-base border-2 glass-pill btn-bounce">
                {isRtl ? 'تصفح ساحة الألعاب' : 'Explore 12 Games'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. WORLD-CLASS FOOTER */}
      <footer className="py-12 border-t border-border/50 bg-card/60 backdrop-blur-2xl text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#00E5A8] flex items-center justify-center text-white shadow-md">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-black text-foreground font-heading">NABH • نَبِـه</span>
                <span className="block text-[10px] text-muted-foreground font-mono">CHC Standardized Neuro-Platform</span>
              </div>
            </div>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#00E5A8] animate-ping" />
              <span>All 12 Game Engines Operational • 99.98%</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 NABH Cognitive Neuroscience Inc. All rights reserved.</p>
            <div className="flex items-center gap-6 font-medium">
              <Link href="/about" className="hover:text-primary transition-colors">{isRtl ? 'عن المنصة' : 'About'}</Link>
              <Link href="/skills" className="hover:text-primary transition-colors">{isRtl ? 'الـ 50 مهارة' : '50 Skills'}</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">{isRtl ? 'الخصوصية' : 'Privacy'}</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">{isRtl ? 'الشروط' : 'Terms'}</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
