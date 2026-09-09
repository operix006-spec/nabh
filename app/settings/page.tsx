'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Eye,
  User,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Shield,
} from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { soundEnabled, setSoundEnabled, playSound } = useSound();
  const { user, loginAsDemo, logout } = useAuth();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    playSound('success');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. SETTINGS HEADER */}
      <div className="pb-6 border-b border-border/50 space-y-1">
        <Badge variant="outline" className="px-3 py-0.5 text-xs font-bold text-primary border-primary/30">
          Preferences & Neuro-Ergonomics
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
          {t('navSettings')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {language === 'ar'
            ? 'تخصيص الواجهة، اللغات، إمكانية الوصول، المؤثرات الصوتية الإجرائية'
            : 'Customize bilingual interface, auditory synthesizer, theme ergonomics and accessibility'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5" />
          <span>{language === 'ar' ? 'تم حفظ التفضيلات بنجاح!' : 'Preferences saved successfully!'}</span>
        </div>
      )}

      {/* 2. PROFILE SETTINGS */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold font-heading">{language === 'ar' ? 'الملف الشخصي والحساب' : 'Profile & Account'}</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
              {user?.displayName.slice(0, 2).toUpperCase() || 'SM'}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">{user?.displayName || 'سارة المنصور'}</h4>
              <span className="text-xs text-muted-foreground">{user?.email || 'sara@nabh.edu'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loginAsDemo('learner')}
              className="rounded-xl font-bold text-xs"
            >
              {language === 'ar' ? 'تبديل كطالب' : 'Learner Demo'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loginAsDemo('educator')}
              className="rounded-xl font-bold text-xs"
            >
              {language === 'ar' ? 'تبديل كمعلم' : 'Educator Demo'}
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. LANGUAGE & LOCALIZATION */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-bold font-heading">{language === 'ar' ? 'اللغة والاتجاه (RTL / LTR)' : 'Language & Bidirectionality'}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { playSound('click'); setLanguage('ar'); }}
            className={`p-4 rounded-2xl border-2 text-start transition-all ${
              language === 'ar'
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border/60 hover:bg-secondary/60'
            }`}
          >
            <span className="font-bold text-base block text-foreground">العربية (RTL)</span>
            <span className="text-xs text-muted-foreground">اللغة الأساسية والاتجاه من اليمين لليسار</span>
          </button>

          <button
            onClick={() => { playSound('click'); setLanguage('en'); }}
            className={`p-4 rounded-2xl border-2 text-start transition-all ${
              language === 'en'
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border/60 hover:bg-secondary/60'
            }`}
          >
            <span className="font-bold text-base block text-foreground">English (LTR)</span>
            <span className="text-xs text-muted-foreground">Left-to-Right international layout</span>
          </button>
        </div>
      </Card>

      {/* 4. THEME & ACCESSIBILITY */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-6">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-bold font-heading">{language === 'ar' ? 'المظهر وإمكانية الوصول' : 'Theme & Accessibility'}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => { playSound('click'); setTheme('light'); }}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              theme === 'light' ? 'border-primary bg-primary/10' : 'border-border/60 hover:bg-secondary'
            }`}
          >
            <Sun className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <span className="font-bold text-sm block">{language === 'ar' ? 'الوضع النهاري' : 'Light Theme'}</span>
          </button>

          <button
            onClick={() => { playSound('click'); setTheme('dark'); }}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border/60 hover:bg-secondary'
            }`}
          >
            <Moon className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
            <span className="font-bold text-sm block">{language === 'ar' ? 'الوضع الليلي' : 'Dark Theme'}</span>
          </button>

          <button
            onClick={() => { playSound('click'); setTheme('system'); }}
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              theme === 'system' ? 'border-primary bg-primary/10' : 'border-border/60 hover:bg-secondary'
            }`}
          >
            <Eye className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
            <span className="font-bold text-sm block">{language === 'ar' ? 'تلقائي النظام' : 'System Match'}</span>
          </button>
        </div>
      </Card>

      {/* 5. PROCEDURAL SOUND & AUDIO ACCESSIBILITY */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/70 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                {language === 'ar' ? 'المؤثرات الصوتية التفاعلية' : 'Interactive Web Audio Synthesizer'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'أصوات إجرائية خفيفة تعزز التركيز وردود الفعل' : 'Low-latency procedural tones for audio feedback'}
              </p>
            </div>
          </div>

          <Button
            variant={soundEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playSound('click');
            }}
            className="rounded-xl font-bold text-xs gap-1.5"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{soundEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'مكتوم' : 'Muted')}</span>
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          size="lg"
          variant="gradient"
          onClick={handleSave}
          className="h-12 px-8 rounded-2xl font-bold text-sm"
        >
          {language === 'ar' ? 'حفظ التفضيلات' : 'Save Changes'}
        </Button>
      </div>

    </div>
  );
}
