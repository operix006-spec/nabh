'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { COGNITIVE_SKILLS_50, COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Zap,
  Brain,
  Gamepad2,
  Map,
  Compass,
  GraduationCap,
  Users,
  Shield,
  FileText,
  Trophy,
  Activity,
  Flame,
  Settings,
  Bell,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Command,
  CornerDownLeft,
  BookOpen,
} from 'lucide-react';

interface QuickNavItem {
  id: string;
  category: 'core' | 'games' | 'portals' | 'skills' | 'system';
  titleAr: string;
  titleEn: string;
  href: string;
  icon: any;
  badge?: string;
  shortcut?: string;
}

export const GlobalQuickNav: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { user, loginAsDemo } = useAuth();
  const router = useRouter();
  const isRtl = language === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. ALL 27 PAGES + 12 GAMES DESTINATIONS CATALOG
  const navCatalog: QuickNavItem[] = [
    // Core Learning
    { id: 'dash', category: 'core', titleAr: 'لوحة التحكم الرئيسية', titleEn: 'Main Dashboard', href: '/dashboard', icon: Brain, shortcut: 'D' },
    { id: 'games', category: 'core', titleAr: 'صالة الألعاب الذهنية الـ 12', titleEn: '12 Games Arcade Hub', href: '/games', icon: Gamepad2, badge: '12 Games', shortcut: 'G' },
    { id: 'roadmap', category: 'core', titleAr: 'شجرة ومسار الـ 50 مهارة', titleEn: '50-Skill Roadmap Tree', href: '/roadmap', icon: Map, badge: 'Khan Mastery', shortcut: 'R' },
    { id: 'skills', category: 'core', titleAr: 'موسوعة المهارات الـ 50', titleEn: '50 Skills Catalog', href: '/skills', icon: BookOpen, badge: '50 Skills', shortcut: 'S' },
    { id: 'assessment', category: 'core', titleAr: 'اختبار التقييم المعياري الشامل', titleEn: 'Psychometric Assessment Battery', href: '/assessment', icon: Compass, badge: 'NCI Cert' },
    { id: 'reports', category: 'core', titleAr: 'التقارير الإدراكية والسريرية', titleEn: 'Clinical CHC Reports', href: '/reports', icon: FileText, badge: 'AI Report' },
    { id: 'progress', category: 'core', titleAr: 'تحليلات النمو وسرعة التطور', titleEn: 'Progress & Velocity Curves', href: '/progress', icon: Activity },
    { id: 'achievements', category: 'core', titleAr: 'الأوسمة وخزانة الإنجازات', titleEn: 'Achievements & Trophy Cabinet', href: '/achievements', icon: Trophy },

    // Role Portals
    { id: 'teacher', category: 'portals', titleAr: 'بوابة المعلم والشعب الصفية', titleEn: 'Teacher & Cohorts Console', href: '/teacher', icon: GraduationCap, badge: 'Educators' },
    { id: 'parents', category: 'portals', titleAr: 'بوابة ولي الأمر الإشرافية', titleEn: 'Parental Supervision Hub', href: '/parents', icon: Users, badge: 'Parents' },
    { id: 'admin', category: 'portals', titleAr: 'لوحة الإدارة الشاملة (14 ميزة)', titleEn: 'Admin Control Center', href: '/admin', icon: Shield, badge: 'Admin' },

    // 12 Games Direct Shortcuts
    { id: 'g_stroop', category: 'games', titleAr: 'صراع ستروب (كبح الاندفاع)', titleEn: 'Stroop Clash (Inhibition)', href: '/games/stroop-clash', icon: Zap },
    { id: 'g_memory', category: 'games', titleAr: 'مصفوفة الذاكرة (السعة المكانية)', titleEn: 'Memory Matrix (Spatial Span)', href: '/games/memory-matrix', icon: Brain },
    { id: 'g_speed', category: 'games', titleAr: 'نبض السرعة (زمن الرجع البصري)', titleEn: 'Speed Reflex (Reaction Time)', href: '/games/speed-reflex', icon: Zap },
    { id: 'g_matrix', category: 'games', titleAr: 'إكمال المصفوفات (الاستدلال المنطقي)', titleEn: 'Matrix Pattern (Logic)', href: '/games/matrix-pattern', icon: Compass },
    { id: 'g_sorting', category: 'games', titleAr: 'فرز القواعد التنفيذية (ويسكونسن)', titleEn: 'Executive Sorting (Wisconsin)', href: '/games/executive-sorting', icon: Activity },
    { id: 'g_rotation', category: 'games', titleAr: 'تدوير المكعب الذهني ثلاثي الأبعاد', titleEn: '3D Cube Mental Rotation', href: '/games/cube-rotation', icon: Brain },
    { id: 'g_sound', category: 'games', titleAr: 'المطابقة الصوتية والتمييز الترددي', titleEn: 'Sound Frequency Matching', href: '/games/sound-matching', icon: Sparkles },
    { id: 'g_matching', category: 'games', titleAr: 'مطابقة الأزواج السريعة', titleEn: 'Matching Pairs Agility', href: '/games/matching-pairs', icon: Gamepad2 },
    { id: 'g_sequence', category: 'games', titleAr: 'تذكر التسلسل النمطي', titleEn: 'Sequence Recall Drill', href: '/games/sequence-recall', icon: Flame },
    { id: 'g_logic', category: 'games', titleAr: 'لغز الاستنتاج الاستنباطي', titleEn: 'Deductive Logic Puzzle', href: '/games/deductive-logic', icon: Brain },
    { id: 'g_visual', category: 'games', titleAr: 'التمييز البصري الخاطف', titleEn: 'Visual Discrimination', href: '/games/visual-recognition', icon: Compass },
    { id: 'g_drag', category: 'games', titleAr: 'السحب والإفلات الإدراكي', titleEn: 'Cognitive Drag & Drop', href: '/games/drag-and-drop', icon: Gamepad2 },

    // System & Preferences
    { id: 'profile', category: 'system', titleAr: 'الملف الشخصي والبيانات', titleEn: 'User Profile & Identity', href: '/profile', icon: Users },
    { id: 'settings', category: 'system', titleAr: 'الإعدادات والسمات البصرية', titleEn: 'Settings & Appearance', href: '/settings', icon: Settings },
    { id: 'notifications', category: 'system', titleAr: 'مركز الإشعارات والتنبيهات', titleEn: 'Notifications Center', href: '/notifications', icon: Bell },
    { id: 'pricing', category: 'system', titleAr: 'الباقات والاشتراكات', titleEn: 'Pricing Plans', href: '/pricing', icon: Sparkles },
    { id: 'support', category: 'system', titleAr: 'الدعم والمساعدة والأسئلة الشائعة', titleEn: 'Support & Knowledge Base', href: '/support', icon: BookOpen },
    { id: 'contact', category: 'system', titleAr: 'تواصل مع فريق نَبِـه', titleEn: 'Contact Us', href: '/contact', icon: Sparkles },
  ];

  // 2. KEYBOARD SHORTCUT LISTENER (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playSound('click');
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // 3. FILTER RESULTS (Fuzzy match pages + 50 skills)
  const filteredCatalog = navCatalog.filter((item) => {
    const term = query.toLowerCase().trim();
    if (!term) return true;
    return (
      item.titleAr.toLowerCase().includes(term) ||
      item.titleEn.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.href.toLowerCase().includes(term)
    );
  });

  // Also include matching skills if query matches
  const matchingSkills = query.trim()
    ? COGNITIVE_SKILLS_50.filter(
        (s) =>
          s.nameAr.toLowerCase().includes(query.toLowerCase()) ||
          s.nameEn.toLowerCase().includes(query.toLowerCase()) ||
          String(s.number) === query.trim() ||
          s.domain.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleNavigate = (href: string) => {
    playSound('fanfare');
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* FLOATING ACTION PILL (BOTTOM CORNER DOCK - ALWAYS ACCESSIBLE IN 1 CLICK) */}
      <aside aria-label="Quick Jump" className="fixed bottom-6 end-6 z-40">
        <button
          onClick={() => {
            playSound('pop');
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/90 dark:bg-card/95 border-2 border-primary/40 text-foreground text-xs font-bold shadow-2xl backdrop-blur-2xl hover:scale-105 hover:border-primary transition-all duration-200 glow-card group"
          title={isRtl ? 'البحث السريع (Ctrl+K)' : 'Quick Search (Cmd+K)'}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Search className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline font-heading">
            {isRtl ? 'التنقل السريع' : 'Quick Jump'}
          </span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-secondary text-[10px] font-mono border border-border/70 text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </aside>

      {/* APPLE SPOTLIGHT COMMAND PALETTE MODAL */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-4xl border-2 border-primary/25 bg-card/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-200"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/60">
              <Search className="h-5 w-5 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={
                  isRtl
                    ? 'اكتب للوصول فوراً لأي صفحة، مهارة من الـ 50، أو لعبة (مثل: لوحة التحكم، ستروب، الذاكرة)...'
                    : 'Type to jump to any of 27 pages, 50 skills, or 12 games (e.g. Dashboard, Stroop, Memory)...'
                }
                className="w-full bg-transparent text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quick Filter Categories Ribbon */}
            <div className="flex items-center gap-2 px-6 py-2.5 bg-muted/40 border-b border-border/40 overflow-x-auto text-[11px] font-bold text-muted-foreground scrollbar-none">
              <span>{isRtl ? 'تصفية سريعة:' : 'Quick filters:'}</span>
              {[
                { labelAr: 'الكل', labelEn: 'All', q: '' },
                { labelAr: 'الألعاب الـ 12', labelEn: 'Games', q: 'game' },
                { labelAr: 'البوابات', labelEn: 'Portals', q: 'portals' },
                { labelAr: 'التقارير', labelEn: 'Reports', q: 'report' },
                { labelAr: 'المهارات الـ 50', labelEn: '50 Skills', q: 'skills' },
              ].map((f, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playSound('tick');
                    setQuery(f.q);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-card/80 hover:bg-primary/10 hover:text-primary transition-colors border border-border/50"
                >
                  {isRtl ? f.labelAr : f.labelEn}
                </button>
              ))}
            </div>

            {/* Scrollable Results Feed */}
            <div className="p-3 overflow-y-auto space-y-1 divide-y divide-border/20 scrollbar-thin flex-1">
              {/* If search matches 50 skills */}
              {matchingSkills.length > 0 && (
                <div className="pb-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                    <Brain className="h-3.5 w-3.5" />
                    <span>{isRtl ? 'المهارات المعرفية المطابقة' : 'Matching Cognitive Skills'}</span>
                  </div>
                  {matchingSkills.map((sk) => (
                    <button
                      key={sk.id}
                      onClick={() => handleNavigate(`/skills/${sk.id}`)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-start text-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-xl bg-primary/15 text-primary font-mono font-bold flex items-center justify-center text-[11px]">
                          #{sk.number}
                        </span>
                        <div>
                          <strong className="text-foreground group-hover:text-primary block">
                            {isRtl ? sk.nameAr : sk.nameEn}
                          </strong>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {sk.domain} • Tier {Math.ceil(sk.number / 10)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {isRtl ? 'عرض المهارة' : 'View Skill'}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {/* General Pages & Games */}
              <div>
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  {isRtl ? 'الوجهات والصفحات (وصول بضغطة واحدة)' : 'Pages & Features (1-Click Direct Jump)'}
                </div>
                {filteredCatalog.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-accent/60 transition-all text-start text-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <strong className="text-foreground block text-sm group-hover:text-primary">
                            {isRtl ? item.titleAr : item.titleEn}
                          </strong>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {item.href}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {item.badge}
                          </Badge>
                        )}
                        <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredCatalog.length === 0 && matchingSkills.length === 0 && (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Brain className="h-8 w-8 mx-auto text-muted-foreground/40 animate-pulse" />
                  <p className="text-xs">{isRtl ? 'لا توجد وجهة مطابقة لبحثك' : 'No matching page or skill found'}</p>
                </div>
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-6 py-3 bg-muted/30 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <div className="flex items-center gap-4">
                <span>[ESC] {isRtl ? 'للإغلاق' : 'to close'}</span>
                <span>[ENTER] {isRtl ? 'للانتقال' : 'to jump'}</span>
              </div>
              <span className="text-primary font-bold">Nabh OS v2.4</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
