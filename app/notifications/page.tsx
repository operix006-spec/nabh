'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Bell,
  CheckCheck,
  Flame,
  Trophy,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  timeAgoAr: string;
  timeAgoEn: string;
  type: 'workout' | 'achievement' | 'streak' | 'system';
  isRead: boolean;
  actionHref?: string;
  actionLabelAr?: string;
  actionLabelEn?: string;
}

export default function NotificationsPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      titleAr: 'تمرين اليوم جاهز للتنشيط العصبي!',
      titleEn: 'Your Daily Workout is Ready!',
      descAr: 'تم اختيار 3 ألعاب جديدة بناءً على مستواك في سرعة المعالجة والذاكرة.',
      descEn: '3 curated games selected based on your recent processing speed metrics.',
      timeAgoAr: 'منذ 20 دقيقة',
      timeAgoEn: '20 mins ago',
      type: 'workout',
      isRead: false,
      actionHref: '/dashboard',
      actionLabelAr: 'ابدأ التمرين',
      actionLabelEn: 'Start Workout',
    },
    {
      id: 'notif_2',
      titleAr: 'وسام جديد متاح للاستلام: سيد السرعة!',
      titleEn: 'New Trophy Unlocked: Speed Demon!',
      descAr: 'حققت زمناً قياسياً أقل من 250ms في ساحة السرعة. اضغط لاستلام 350 XP.',
      descEn: 'You clocked a sub-250ms reaction time. Tap to claim +350 XP.',
      timeAgoAr: 'منذ ساعتين',
      timeAgoEn: '2 hours ago',
      type: 'achievement',
      isRead: false,
      actionHref: '/achievements',
      actionLabelAr: 'استلم الجائزة',
      actionLabelEn: 'Claim Reward',
    },
    {
      id: 'notif_3',
      titleAr: 'سلسلة الحماس وصلت 7 أيام متتالية!',
      titleEn: '7-Day Streak Achieved!',
      descAr: 'أنت الآن ضمن أكثر 10% من المتعلمين التزاماً في مجتمع نَبِه.',
      descEn: 'You are now among the top 10% most consistent learners in Nabh.',
      timeAgoAr: 'أمس',
      timeAgoEn: 'Yesterday',
      type: 'streak',
      isRead: true,
      actionHref: '/dashboard',
      actionLabelAr: 'عرض اللوحة',
      actionLabelEn: 'View Dashboard',
    },
    {
      id: 'notif_4',
      titleAr: 'تحديث أمان: تشفير تقارير CHC',
      titleEn: 'Security Update: CHC Encryption',
      descAr: 'تم تفعيل التشفير المزدوج لسجلات القياس السريري الخاصة بحسابك.',
      descEn: 'End-to-end telemetry encryption has been renewed for your account.',
      timeAgoAr: 'منذ 3 أيام',
      timeAgoEn: '3 days ago',
      type: 'system',
      isRead: true,
      actionHref: '/settings',
      actionLabelAr: 'الإعدادات',
      actionLabelEn: 'Settings',
    },
  ]);

  const markAllRead = () => {
    playSound('correct');
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    playSound('pop');
    setNotifications([]);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'workout':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-primary" />;
      case 'streak':
        return <Flame className="h-5 w-5 text-rose-500" />;
      case 'system':
        return <Shield className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Bell className="h-4 w-4" />
            <span>{isRtl ? 'مركز الإشعارات والتنبيهات' : 'Notification Center'}</span>
          </div>
          <h1 className="text-3xl font-black font-heading text-foreground">
            {isRtl ? 'التنبيهات والأنشطة' : 'Activity & Alerts'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="rounded-xl text-xs font-bold border-border/80 gap-1.5"
          >
            <CheckCheck className="h-4 w-4 text-emerald-500" />
            <span>{isRtl ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive"
          >
            {isRtl ? 'مسح الكل' : 'Clear all'}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            playSound('pop');
            setFilter('all');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-primary text-white shadow-md'
              : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          {isRtl ? 'جميع التنبيهات' : 'All Notifications'} ({notifications.length})
        </button>
        <button
          onClick={() => {
            playSound('pop');
            setFilter('unread');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-primary text-white shadow-md'
              : 'bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground'
          }`}
        >
          {isRtl ? 'غير المقروءة' : 'Unread Only'} (
          {notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notifications List or Empty State */}
      {filteredNotifs.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl ${
                !n.isRead
                  ? 'border-primary/40 bg-card shadow-md ring-1 ring-primary/20'
                  : 'border-border/60 bg-card/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/60 border border-border/50">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-foreground">
                      {isRtl ? n.titleAr : n.titleEn}
                    </h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {isRtl ? n.descAr : n.descEn}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground/80 block mt-2">
                    {isRtl ? n.timeAgoAr : n.timeAgoEn}
                  </span>
                </div>
              </div>

              {n.actionHref && (
                <Link
                  href={n.actionHref}
                  onClick={() => playSound('click')}
                  className="shrink-0 w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="w-full sm:w-auto rounded-xl font-bold btn-3d btn-3d-primary gap-1 text-xs"
                  >
                    <span>{isRtl ? n.actionLabelAr : n.actionLabelEn}</span>
                    {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={isRtl ? 'لا توجد إشعارات حالياً' : 'All Caught Up!'}
          description={
            isRtl
              ? 'لقد اطلعت على جميع التنبيهات. استمر في التدريب لتحقيق أوسمة جديدة.'
              : 'You have read all notifications. Keep training to unlock new achievements and streak alerts.'
          }
          actionLabel={isRtl ? 'الذهاب للتدريب اليومي' : 'Go to Daily Workout'}
          actionHref="/dashboard"
          variant="indigo"
        />
      )}
    </div>
  );
}
