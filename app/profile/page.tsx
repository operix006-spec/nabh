'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  User,
  Sparkles,
  Flame,
  Trophy,
  Brain,
  Shield,
  Settings,
  FileText,
  Clock,
  Target,
  Edit3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export default function ProfilePage() {
  const { language } = useLanguage();
  const { user, updateProfile } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || 'Active Learner');
  const [selectedAvatarBg, setSelectedAvatarBg] = useState('from-indigo-500 to-purple-600');

  const avatarGradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-teal-500',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];

  const handleSave = () => {
    playSound('correct');
    updateProfile({ displayName });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Profile Card Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-8 sm:p-12 backdrop-blur-2xl shadow-xl mb-10">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-start">
          {/* Avatar Bubble */}
          <div className="relative group">
            <div
              className={`h-28 w-28 rounded-3xl bg-gradient-to-tr ${selectedAvatarBg} p-1 shadow-2xl flex items-center justify-center text-white text-3xl font-black font-mono`}
            >
              <div className="h-full w-full rounded-[22px] bg-background/20 backdrop-blur-sm flex items-center justify-center">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => {
                playSound('pop');
                setIsEditing(!isEditing);
              }}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-white shadow-md hover:scale-110 transition-transform"
              title="Change avatar"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-foreground">
                {displayName}
              </h1>
              <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                {user?.role === 'educator' ? (isRtl ? 'معلم' : 'Teacher') : (isRtl ? 'متعلم' : 'Learner')}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              {user?.email || 'learner@nabh.ai'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <Flame className="h-4 w-4" />
                <span>{user?.currentStreakDays || 7} {isRtl ? 'أيام متتالية' : 'Day Streak'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-bold">
                <Sparkles className="h-4 w-4" />
                <span>{user?.totalXp || 1420} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                <Brain className="h-4 w-4" />
                <span>NCI {user?.overallCognitiveIndex || 742}</span>
              </div>
            </div>
          </div>

          {/* Settings & Reports shortcuts */}
          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
            <Link href="/reports" className="w-full" onClick={() => playSound('click')}>
              <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-border/70 gap-2">
                <FileText className="h-4 w-4" />
                <span>{isRtl ? 'التقرير السريري' : 'Report'}</span>
              </Button>
            </Link>
            <Link href="/settings" className="w-full" onClick={() => playSound('click')}>
              <Button variant="outline" size="sm" className="w-full rounded-xl font-bold border-border/70 gap-2">
                <Settings className="h-4 w-4" />
                <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Editing drawer */}
        {isEditing && (
          <div className="mt-8 pt-6 border-t border-border/60 space-y-4">
            <h4 className="text-sm font-bold text-foreground">
              {isRtl ? 'تعديل البيانات واختيار لون الهوية:' : 'Edit Profile & Theme Palette:'}
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-11 rounded-2xl border border-input bg-background/60 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex items-center gap-2">
                {avatarGradients.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playSound('pop');
                      setSelectedAvatarBg(g);
                    }}
                    className={`h-8 w-8 rounded-xl bg-gradient-to-tr ${g} transition-transform ${
                      selectedAvatarBg === g ? 'scale-125 ring-2 ring-foreground' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
              <Button size="sm" onClick={handleSave} className="rounded-xl font-bold btn-3d btn-3d-primary">
                {isRtl ? 'حفظ التعديلات' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card text-center sm:text-start">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'إجمالي الألعاب المنجزة' : 'Total Games Played'}
          </span>
          <span className="text-3xl font-black font-mono text-foreground">124</span>
          <span className="text-[11px] text-emerald-500 font-bold block mt-1">
            {isRtl ? '96% نسبة إكمال التدريب' : '96% completion rate'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card text-center sm:text-start">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'دقائق التدريب التراكمية' : 'Total Practice Time'}
          </span>
          <span className="text-3xl font-black font-mono text-foreground">420 min</span>
          <span className="text-[11px] text-primary font-bold block mt-1">
            {isRtl ? '10 دقائق متوسط يومي' : '10 mins daily average'}
          </span>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-xl shadow-md glow-card text-center sm:text-start">
          <span className="text-xs font-bold text-muted-foreground block mb-1">
            {isRtl ? 'المهارات المفتوحة' : 'Skills Mastered'}
          </span>
          <span className="text-3xl font-black font-mono text-foreground">14 / 50</span>
          <span className="text-[11px] text-amber-500 font-bold block mt-1">
            {isRtl ? '36 مهارة متبقية للإتقان' : '36 skills to master'}
          </span>
        </div>
      </div>
    </div>
  );
}
