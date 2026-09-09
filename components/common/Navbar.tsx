'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Globe,
  Menu,
  X,
  Flame,
  Sparkles,
  UserCheck,
  Settings,
  Bell,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled, playSound } = useSound();
  const { user, logout, profileData } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strictly restrict Admin Panel visibility to mocvskhfssr@gmail.com only
  const isOwnerEmail = (profileData?.email || user?.email)?.toLowerCase() === 'mocvskhfssr@gmail.com';

  const toggleLanguage = () => {
    playSound('click');
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const navLinks = [
    { href: '/dashboard', label: t('navDashboard') },
    { href: '/games', label: language === 'ar' ? 'الألعاب' : 'Games', badge: '14' },
    { href: '/roadmap', label: language === 'ar' ? 'خريطة التعلم' : 'Roadmap' },
    { href: '/skills', label: t('navSkills'), badge: '50' },
    { href: '/assessment', label: t('navAssessment') },
    { href: '/pricing', label: language === 'ar' ? 'الأسعار' : 'Pricing' },
    { href: '/portal', label: t('navPortal') },
    ...(isOwnerEmail
      ? [{ href: '/admin', label: language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel', badge: 'OWNER' }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-2xl transition-colors">
      <div className="w-full flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8 lg:px-12">
        
        {/* Brand Logo with Generous Space */}
        <Link 
          href="/" 
          className="flex items-center gap-3.5 group shrink-0"
          onClick={() => playSound('click')}
        >
          <div className="relative flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] text-white shadow-lg shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform duration-300">
            <Brain className="h-6 sm:h-7 w-6 sm:w-7 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00E5A8] border-2 border-card"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-heading">
                {language === 'ar' ? 'نَبِـه' : 'Nabh'}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#6C63FF] px-2 py-0.5 rounded-full bg-[#6C63FF]/10 font-mono">
                Cognitive
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline font-medium tracking-wide">
              {language === 'ar' ? 'منصة التدريب العصبي' : 'Neuro-Training Platform'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Generous Spacing */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound('click')}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#6C63FF] bg-[#6C63FF]/10 font-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#6C63FF] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls with Generous Breathing Room */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* User Streak & NCI (Tablet/Desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4 animate-bounce text-amber-500" />
              <span className="text-xs font-bold font-mono">{user.currentStreakDays} {t('days')}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400/60" />
              <div className="flex items-center gap-1 text-xs font-bold text-[#6C63FF]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>NCI {user.overallCognitiveIndex}</span>
              </div>
            </div>
          )}

          {/* Sound Toggle (Tablet/Desktop) */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playSound('click');
            }}
            className="hidden sm:flex p-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-[#00E5A8]" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            className="p-2 sm:p-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
            title="Toggle Theme"
            aria-label="Theme Toggle"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="h-9 sm:h-10 px-3 rounded-xl border-border/60 text-xs font-bold gap-1.5"
          >
            <Globe className="h-3.5 w-3.5 text-[#6C63FF]" />
            <span className="text-[11px] font-mono">{t('switchLang')}</span>
          </Button>

          {/* User Profile / Login */}
          {user ? (
            <Link href="/profile" className="flex items-center gap-2 group" onClick={() => playSound('click')}>
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="h-full w-full rounded-[14px] bg-background flex items-center justify-center font-bold text-xs text-primary group-hover:bg-primary/10 transition-colors">
                  {(() => {
                    const parts = (user.displayName || 'نب').trim().split(/\s+/);
                    return parts.length >= 2 ? `${parts[0][0]} ${parts[1][0]}` : parts[0].slice(0, 2);
                  })()}
                </div>
              </div>
            </Link>
          ) : (
            <Link href="/login" onClick={() => playSound('click')}>
              <Button
                variant="default"
                size="sm"
                className="rounded-xl font-bold btn-3d btn-3d-primary shadow-sm h-9 px-3 text-xs"
              >
                <UserCheck className="h-3.5 w-3.5 ml-1 rtl:mr-1" />
                <span>{t('login')}</span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-border/50 bg-background/50 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/60 bg-background/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                playSound('click');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl font-bold text-sm ${
                pathname === link.href ? 'bg-[#6C63FF]/15 text-[#6C63FF]' : 'text-foreground hover:bg-accent'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && <Badge variant="default" className="text-[10px]">{link.badge}</Badge>}
            </Link>
          ))}

          {/* Quick Mobile Action Bar */}
          <div className="pt-3 border-t border-border/40 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playSound('click');
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-accent/40 text-xs font-bold"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-[#00E5A8]" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
              <span className="text-[10px]">{soundEnabled ? (language === 'ar' ? 'صوت مفعل' : 'Sound On') : (language === 'ar' ? 'صامت' : 'Muted')}</span>
            </button>

            <Link
              href="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-accent/40 text-xs font-bold"
            >
              <Bell className="h-4 w-4 text-[#6C63FF]" />
              <span className="text-[10px]">{language === 'ar' ? 'الإشعارات' : 'Alerts'}</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-accent/40 text-xs font-bold"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px]">{t('navSettings')}</span>
            </Link>
          </div>

          {user && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-destructive font-bold p-2 hover:underline"
              >
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
