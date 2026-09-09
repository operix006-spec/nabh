'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { LayoutDashboard, Gamepad2, Zap, Map, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const navItems = [
    { href: '/dashboard', labelAr: 'الرئيسية', labelEn: 'Home', icon: LayoutDashboard },
    { href: '/games', labelAr: 'الألعاب', labelEn: 'Games', icon: Gamepad2 },
    { href: '/games/speed-reflex', labelAr: 'تمرين سريع', labelEn: 'Quick Drill', icon: Zap, isSpecial: true },
    { href: '/roadmap', labelAr: 'الخريطة', labelEn: 'Roadmap', icon: Map },
    { href: '/profile', labelAr: 'حسابي', labelEn: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pointer-events-none">
      <nav
        aria-label="Mobile Bottom Navigation"
        className="pointer-events-auto mx-auto max-w-md rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl px-3 py-2 shadow-2xl shadow-primary/10 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => playSound('fanfare')}
                className="relative -top-5 flex flex-col items-center group"
                title={isRtl ? item.labelAr : item.labelEn}
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-xl shadow-[#6C63FF]/40 ring-4 ring-background group-hover:scale-105 active:scale-95 transition-all">
                  <Zap className="h-6 w-6 fill-white" />
                </div>
                <span className="text-[10px] font-bold text-[#6C63FF] mt-1 font-mono">
                  {isRtl ? item.labelAr : item.labelEn}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playSound('click')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl text-[10px] font-bold transition-colors ${
                isActive
                  ? 'text-[#6C63FF]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span>{isRtl ? item.labelAr : item.labelEn}</span>
              {isActive && (
                <span className="h-1 w-3 rounded-full bg-[#6C63FF] -mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
