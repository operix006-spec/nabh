'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Gamepad2,
  Layers,
  Map,
  ClipboardCheck,
  BarChart3,
  FileText,
  Trophy,
  Users,
  GraduationCap,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Brain,
  Sparkles,
  Zap,
  Flame,
  Award,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { user } = useAuth();
  const isRtl = language === 'ar';

  // Collapsible category state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    learning: true,
    analytics: true,
    community: false,
  });

  const toggleGroup = (key: string) => {
    playSound('pop');
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: 'learning',
      groupAr: 'التعلم والتدريب الأساسي',
      groupEn: 'Core Training',
      icon: Brain,
      items: [
        { href: '/dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard },
        { href: '/games', labelAr: 'ساحة الألعاب (12)', labelEn: 'Games Arena (12)', icon: Gamepad2, badge: '12' },
        { href: '/skills', labelAr: 'دليل الـ 50 مهارة', labelEn: '50 Skills Catalog', icon: Layers, badge: '50' },
        { href: '/roadmap', labelAr: 'خريطة التعلم', labelEn: 'Skill Roadmap', icon: Map },
      ],
    },
    {
      key: 'analytics',
      groupAr: 'التحليلات والمقاييس',
      groupEn: 'Cognitive Analytics',
      icon: BarChart3,
      items: [
        { href: '/assessment', labelAr: 'التقييم الشامل', labelEn: 'Diagnostic Battery', icon: ClipboardCheck },
        { href: '/analytics', labelAr: 'التحليلات العصبية', labelEn: 'Neuro-Analytics', icon: BarChart3 },
        { href: '/progress', labelAr: 'سرعة النمو', labelEn: 'Progress Velocity', icon: Sparkles },
        { href: '/reports', labelAr: 'التقرير السريري', labelEn: 'Clinical Report', icon: FileText },
      ],
    },
    {
      key: 'community',
      groupAr: 'البوابات والمسؤولين',
      groupEn: 'Portals & Admin',
      icon: Users,
      items: [
        { href: '/leaderboard', labelAr: 'لوحة الصدارة', labelEn: 'Leaderboard', icon: Trophy },
        { href: '/achievements', labelAr: 'الأوسمة والجوائز', labelEn: 'Achievements', icon: Award },
        { href: '/parents', labelAr: 'بوابة الولي', labelEn: 'Parent Portal', icon: Users },
        { href: '/teacher', labelAr: 'بوابة المعلم', labelEn: 'Teacher Hub', icon: GraduationCap },
        { href: '/admin', labelAr: 'لوحة الإدارة', labelEn: 'Master Admin', icon: ShieldAlert },
      ],
    },
  ];

  return (
    <aside
      aria-label="Sidebar Navigation"
      className={`sticky top-20 z-40 hidden lg:flex flex-col justify-between h-[calc(100vh-5rem)] transition-all duration-300 border-e border-border/60 bg-card/75 backdrop-blur-2xl p-3 sm:p-4 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-4 overflow-y-auto no-scrollbar pr-0.5">
        {/* Collapse toggle & header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00E5A8] animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-mono">
                {isRtl ? 'الملاحة السريعة' : 'Cognitive Navigation'}
              </span>
            </div>
          )}
          <button
            onClick={() => {
              playSound('pop');
              setCollapsed(!collapsed);
            }}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/60 mx-auto transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Quick Workout Button */}
        {!collapsed && (
          <Link
            href="/games/speed-reflex"
            onClick={() => playSound('fanfare')}
            className="group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white shadow-lg shadow-[#6C63FF]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20">
                <Zap className="h-4 w-4 fill-white" />
              </div>
              <div className="text-start">
                <div className="text-xs font-bold leading-none">
                  {isRtl ? 'تدريب سريع ⚡' : 'Quick Drill ⚡'}
                </div>
                <span className="text-[10px] text-white/80 leading-none">
                  {isRtl ? '2 دقيقة • رد الفعل' : '2 min • Speed Focus'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black bg-white/25 px-1.5 py-0.5 rounded-md">
              +50 XP
            </span>
          </Link>
        )}

        {/* Grouped Accordion Navigation */}
        <div className="space-y-3">
          {sections.map((section) => {
            const isOpen = openGroups[section.key] ?? true;
            return (
              <div key={section.key} className="space-y-1">
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(section.key)}
                    className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground/80 hover:text-foreground uppercase tracking-wider px-2 py-1 rounded-lg transition-colors"
                  >
                    <span>{isRtl ? section.groupAr : section.groupEn}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-0' : isRtl ? 'rotate-90' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-px w-8 mx-auto bg-border/40 my-2" />
                )}

                {(isOpen || collapsed) && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => playSound('click')}
                          className={`relative flex items-center gap-3 p-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                            isActive
                              ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30 font-black'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                          } ${collapsed ? 'justify-center' : ''}`}
                          title={isRtl ? item.labelAr : item.labelEn}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-muted-foreground'
                            }`}
                          />
                          {!collapsed && (
                            <div className="flex items-center justify-between flex-1 truncate">
                              <span className="truncate">
                                {isRtl ? item.labelAr : item.labelEn}
                              </span>
                              {item.badge && (
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                    isActive
                                      ? 'bg-white/25 text-white'
                                      : 'bg-primary/10 text-primary'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Profile & Settings Card */}
      <div className="pt-3 border-t border-border/50 space-y-2">
        {!collapsed && user ? (
          <Link
            href="/profile"
            onClick={() => playSound('click')}
            className="flex items-center gap-2.5 p-2 rounded-2xl bg-accent/40 border border-border/50 hover:bg-accent hover:border-border transition-all"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white font-bold text-xs shrink-0 shadow-sm">
              {user.displayName.slice(0, 2).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00E5A8] border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0 text-start">
              <div className="text-xs font-bold text-foreground truncate">
                {user.displayName}
              </div>
              <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                <span className="text-[#6C63FF] font-bold">Lvl {user.level || 8}</span>
                <span>•</span>
                <span className="text-amber-500 font-bold">🔥 {user.currentStreakDays}d</span>
              </div>
            </div>
          </Link>
        ) : null}

        <Link
          href="/settings"
          onClick={() => playSound('click')}
          className={`flex items-center gap-3 p-2.5 rounded-2xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
          title={isRtl ? 'الإعدادات والمظهر' : 'Settings'}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{isRtl ? 'الإعدادات والمظهر' : 'Preferences'}</span>}
        </Link>
      </div>
    </aside>
  );
};
