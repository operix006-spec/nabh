'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gamepad2,
  Search,
  Sparkles,
  Play,
  Flame,
  Trophy,
  Brain,
  Zap,
  Target,
  Shuffle,
  Grid3X3,
  Box,
  Volume2,
  ListOrdered,
  Puzzle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function GamesHubPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const games = [
    {
      id: 'drag-and-drop',
      nameAr: 'السحب والإفلات الإدراكي',
      nameEn: 'Drag & Drop Classifier',
      domain: 'flexibility',
      domainNameAr: 'المرونة والتنظيم',
      domainNameEn: 'Flexibility & Categorization',
      descAr: 'تصنيف المثيرات الإدراكية بالسحب والإفلات الفوري نحو السلال العصبية المستهدفة.',
      descEn: 'Sort cognitive stimuli in real-time by dragging and dropping into target neural bins.',
      icon: Shuffle,
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      color: 'from-emerald-500 to-teal-600',
      bestScore: 880,
    },
    {
      id: 'memory-game',
      nameAr: 'مصفوفة الذاكرة المكانية',
      nameEn: 'Spatial Memory Matrix',
      domain: 'memory',
      domainNameAr: 'الذاكرة والاسترجاع',
      domainNameEn: 'Memory & Retention',
      descAr: 'تذكر مواقع المربعات المضيئة على رقعة تتسع تدريجياً لاختبار المدى البصري المكاني.',
      descEn: 'Recall positions of illuminated grid tiles as complexity and spatial grid expand.',
      icon: Grid3X3,
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      color: 'from-blue-500 to-indigo-600',
      bestScore: 840,
    },
    {
      id: 'matching',
      nameAr: 'مطابقة الأزواج البصرية',
      nameEn: 'Visual Pairs Matching',
      domain: 'memory',
      domainNameAr: 'الذاكرة البصرية',
      domainNameEn: 'Visual Memory',
      descAr: 'تقليب البطاقات واكتشاف الأزواج المتطابقة لتعزيز الاسترجاع التلقائي والتركيز.',
      descEn: 'Flip cards and match associative cognitive pairs under sequential moves constraint.',
      icon: Sparkles,
      difficultyAr: 'مبتدئ',
      difficultyEn: 'Beginner',
      color: 'from-purple-500 to-indigo-600',
      bestScore: 890,
    },
    {
      id: 'sorting',
      nameAr: 'التصنيف التنفيذي والقواعد',
      nameEn: 'Executive Rule Sorting',
      domain: 'flexibility',
      domainNameAr: 'المرونة التنفيذية',
      domainNameEn: 'Executive Flexibility',
      descAr: 'اختبار ويسكونسن: تصنيف البطاقات وفق قواعد متغيرة غير معلنة (اللون، الشكل، العدد).',
      descEn: 'Wisconsin set-shifting: sort stimuli under dynamically altering hidden rules.',
      icon: Shuffle,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-teal-500 to-emerald-600',
      bestScore: 820,
    },
    {
      id: 'visual-recognition',
      nameAr: 'التمييز البصري السريع',
      nameEn: 'Visual Odd-One-Out',
      domain: 'speed',
      domainNameAr: 'سرعة الملاحظة',
      domainNameEn: 'Visual Processing',
      descAr: 'اكتشاف الرمز المنفرد بين مصفوفة من المشتتات البصرية المعقدة بأقل زمن رد فعل.',
      descEn: 'Locate the unique target stimulus amidst dense distractors with sub-second latency.',
      icon: Target,
      difficultyAr: 'مبتدئ',
      difficultyEn: 'Beginner',
      color: 'from-amber-500 to-orange-600',
      bestScore: 920,
    },
    {
      id: 'pattern-recognition',
      nameAr: 'إدراك الأنماط والمصفوفات',
      nameEn: 'Matrix Pattern Completion',
      domain: 'logic',
      domainNameAr: 'الاستدلال السائل',
      domainNameEn: 'Fluid Reasoning',
      descAr: 'استنتاج الرمز المتمم للمصفوفة الهندسية 3x3 بناءً على قواعد التحول والتناظر.',
      descEn: 'Induce inductive transformation rules across progressive geometric matrices.',
      icon: Puzzle,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-indigo-500 to-purple-600',
      bestScore: 860,
    },
    {
      id: 'shape-puzzle',
      nameAr: 'ألغاز الأشكال ثلاثية الأبعاد',
      nameEn: 'Shape 3D Mental Rotation',
      domain: 'spatial',
      domainNameAr: 'الإدراك المكاني',
      domainNameEn: 'Spatial Cognition',
      descAr: 'تدوير الأشكال الفراغية ذهنياً ومقارنتها لاكتشاف التطابق والانعكاس المرآتي.',
      descEn: 'Mentally rotate 3D structures to differentiate exact matches from mirror reflections.',
      icon: Box,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-violet-500 to-fuchsia-600',
      bestScore: 790,
    },
    {
      id: 'color-matching',
      nameAr: 'مطابقة الألوان وصراع ستروب',
      nameEn: 'Stroop Color Clash',
      domain: 'attention',
      domainNameAr: 'كبح الاندفاع',
      domainNameEn: 'Inhibitory Control',
      descAr: 'تحدي ستروب: مطابقة حبر الكلمة مع لونها الحقيقي والتغلب على التداخل الدلالي.',
      descEn: 'Inhibit automatic verbal reading to match chromatic font color accurately.',
      icon: Target,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-rose-500 to-red-600',
      bestScore: 910,
    },
    {
      id: 'sound-matching',
      nameAr: 'مطابقة الترددات الصوتية',
      nameEn: 'Acoustic Sound Matching',
      domain: 'attention',
      domainNameAr: 'الإدراك السمعي',
      domainNameEn: 'Auditory Cognition',
      descAr: 'الاستماع للنغمة المرجعية ومطابقتها بالتردد الصحيح باستخدام موالف Web Audio.',
      descEn: 'Listen to reference acoustic probe and match identical harmonic frequency.',
      icon: Volume2,
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      color: 'from-cyan-500 to-blue-600',
      bestScore: 850,
    },
    {
      id: 'reaction-game',
      nameAr: 'نبض سرعة الاستجابة',
      nameEn: 'Speed Reflex Chronometry',
      domain: 'speed',
      domainNameAr: 'سرعة المعالجة',
      domainNameEn: 'Processing Speed',
      descAr: 'اختبار زمن الرجع الحركي البصري بالميللي ثانية مع قياس الثبات العصبي.',
      descEn: 'Visual motor reaction chronometry calibrated with random trigger delays.',
      icon: Zap,
      difficultyAr: 'مبتدئ',
      difficultyEn: 'Beginner',
      color: 'from-amber-500 to-yellow-600',
      bestScore: 780,
    },
    {
      id: 'sequence-game',
      nameAr: 'تسلسل الذاكرة المتتابعة',
      nameEn: 'Sequence Recall Memory',
      domain: 'memory',
      domainNameAr: 'الذاكرة المتسلسلة',
      domainNameEn: 'Sequential Span',
      descAr: 'إعادة عزف تسلسل الومضات والنغمات المتسعة تدريجياً لاختبار المدى التنفيذي.',
      descEn: 'Replay auditory-visual sequences of expanding span length (Simon-style task).',
      icon: ListOrdered,
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      color: 'from-pink-500 to-rose-600',
      bestScore: 870,
    },
    {
      id: 'logic-puzzle',
      nameAr: 'معضلات الاستدلال المنطقي',
      nameEn: 'Deductive Logic Puzzle',
      domain: 'logic',
      domainNameAr: 'المنطق والاستنتاج',
      domainNameEn: 'Deductive Logic',
      descAr: 'حل الألغاز المنطقية المعتمدة على القياس والاستنتاج الرياضي الصارم.',
      descEn: 'Solve multi-premise formal syllogisms and relational deductive constraints.',
      icon: Puzzle,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-indigo-600 to-violet-700',
      bestScore: 890,
    },
    {
      id: 'task-switcher',
      nameAr: 'التبديل التنفيذي بين المهام',
      nameEn: 'Executive Task Switcher',
      domain: 'flexibility',
      domainNameAr: 'المرونة التنفيذية',
      domainNameEn: 'Executive Flexibility',
      descAr: 'التبديل الفوري بين قواعد الألوان والأشكال لقياس تكلفة التحول المعرفي وكبح الجمود الذهني.',
      descEn: 'Dynamically switch between color and shape categorization rules to assess cognitive flexibility.',
      icon: Shuffle,
      difficultyAr: 'متقدم',
      difficultyEn: 'Advanced',
      color: 'from-fuchsia-500 to-purple-600',
      bestScore: 875,
    },
    {
      id: 'word-loom',
      nameAr: 'الطلاقة اللفظية وسرعة المعجم',
      nameEn: 'Word Loom Phonemic Fluency',
      domain: 'logic',
      domainNameAr: 'الطلاقة اللغوية والمعجم',
      domainNameEn: 'Verbal Fluency',
      descAr: 'استدعاء أكبر عدد من الكلمات الصحيحة التي تبدأ بالحرف الهدف ضمن الوقت المحدد لاختبار المخزن الدلالي.',
      descEn: 'Rapid phonemic lexical retrieval under tight time constraints to challenge semantic memory access.',
      icon: Brain,
      difficultyAr: 'متوسط',
      difficultyEn: 'Intermediate',
      color: 'from-emerald-500 to-cyan-600',
      bestScore: 895,
    },
  ];

  const domains = [
    { id: 'all', nameAr: 'جميع الألعاب', nameEn: 'All Games' },
    { id: 'memory', nameAr: 'الذاكرة', nameEn: 'Memory' },
    { id: 'attention', nameAr: 'الانتباه', nameEn: 'Attention' },
    { id: 'speed', nameAr: 'السرعة', nameEn: 'Speed' },
    { id: 'logic', nameAr: 'المنطق', nameEn: 'Logic' },
    { id: 'spatial', nameAr: 'المكاني', nameEn: 'Spatial' },
    { id: 'flexibility', nameAr: 'المرونة', nameEn: 'Flexibility' },
  ];

  const filteredGames = games.filter((g) => {
    const matchesDomain = selectedDomain === 'all' || g.domain === selectedDomain;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      g.nameAr.toLowerCase().includes(query) ||
      g.nameEn.toLowerCase().includes(query) ||
      g.descAr.toLowerCase().includes(query) ||
      g.descEn.toLowerCase().includes(query);
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Gamepad2 className="h-4 w-4" />
            <span>{isRtl ? 'ساحة الألعاب العصبية التفاعلية' : 'Interactive Game Arena Hub'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
            {isRtl ? 'مكتبة الألعاب المعرفية' : 'Cognitive Games Library'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isRtl
              ? 'ألعاب علمية متخصصة تقيس وتدرب عقلك بالملي ثانية وتمنحك نقاط خبرة ونجوماً معيارية'
              : 'Interactive neuropsychological games measuring latency and granting verified mastery stars'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'ابحث عن لعبة أو مهارة...' : 'Search games or mechanics...'}
            className="w-full h-12 rounded-2xl border border-border/80 bg-card/90 px-4 pl-10 rtl:pl-4 rtl:pr-10 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 backdrop-blur-xl transition-all"
          />
          <Search className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {domains.map((d) => {
          const isActive = selectedDomain === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                playSound('pop');
                setSelectedDomain(d.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/60'
              }`}
            >
              {isRtl ? d.nameAr : d.nameEn}
            </button>
          );
        })}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between glow-card"
            >
              <div>
                {/* Header: Icon & Domain */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${game.color} text-white shadow-md`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <Badge variant="outline" className="text-xs font-bold rounded-xl border-border/80">
                    {isRtl ? game.domainNameAr : game.domainNameEn}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                  {isRtl ? game.nameAr : game.nameEn}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {isRtl ? game.descAr : game.descEn}
                </p>

                {/* Badges / Metrics */}
                <div className="flex items-center justify-between text-xs py-3 border-y border-border/40 mb-6 font-medium">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{isRtl ? game.difficultyAr : game.difficultyEn}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-primary">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span>Best: {game.bestScore}</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <Link href={`/games/${game.id}`} onClick={() => playSound('click')}>
                <Button size="lg" className="w-full rounded-2xl font-bold btn-3d btn-3d-primary shadow-md gap-2">
                  <Play className="h-4 w-4 fill-white" />
                  <span>{isRtl ? 'العب وتدرب الآن' : 'Launch Game Arena'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
