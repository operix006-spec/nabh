'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_SKILLS_50 } from '@/lib/data/cognitive-skills';
import { LearningEngine, getEnrichedSkill } from '@/lib/engine/learning-engine';
import { UserSkillProgress } from '@/types/cognitive';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TodayFocusHero } from '@/components/dashboard/TodayFocusHero';
import { XpLevelBar } from '@/components/dashboard/XpLevelBar';
import { LearningJourneyWidget } from '@/components/dashboard/LearningJourneyWidget';
import { BrainRadarWidget } from '@/components/dashboard/BrainRadarWidget';
import { CompletedSkillsSection } from '@/components/dashboard/CompletedSkillsSection';
import { SynapticActivityHeatmap } from '@/components/dashboard/SynapticActivityHeatmap';
import { DailyGoalsCard } from '@/components/dashboard/DailyGoalsCard';
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar';
import { MiniLeaderboard } from '@/components/dashboard/MiniLeaderboard';
import { AchievementsPreview } from '@/components/dashboard/AchievementsPreview';
import { AICognitiveAdvisor } from '@/components/ai/AICognitiveAdvisor';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Brain,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { language } = useLanguage();
  const { user, sessions } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});
  const [metrics, setMetrics] = useState({
    completedCount: 14,
    unlockedCount: 18,
    totalSkills: 50,
    totalStars: 38,
    maxPossibleStars: 150,
    averageScore: 82,
    progressPercentage: 28,
    currentActiveSkill: getEnrichedSkill(COGNITIVE_SKILLS_50[0]),
  });

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then((pm) => {
      setProgressMap(pm);
      const calculated = LearningEngine.calculateMetrics(pm);
      setMetrics(calculated);
    });
  }, [user]);

  // Recommended skills for adaptive growth
  const recommendedSkills = [
    COGNITIVE_SKILLS_50[0], // Active Working Memory
    COGNITIVE_SKILLS_50[8], // Selective Attention
    COGNITIVE_SKILLS_50[16], // Reaction Time
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors pb-20 lg:pb-10">
      {/* 1. COLLAPSIBLE ACCORDION SIDEBAR WITH QUICK WORKOUT */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* MAIN DASHBOARD CANVAS (FULL WIDTH ON PHONES AND COMPUTERS) */}
      <main className="flex-1 w-full min-w-0 px-3 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-8 sm:space-y-12">
        {/* 2. SPOTLIGHT COMMAND SEARCH & DOMAIN FILTERS */}
        <DashboardHeader />

        {/* 3. XP SYSTEM & LEVEL MILESTONE TRACK WITH REWARD CHEST */}
        <XpLevelBar />

        {/* 4. TODAY FOCUS HERO: WHAT'S NEXT, PROGRESS & REWARDS */}
        <TodayFocusHero
          currentSkill={metrics.currentActiveSkill}
          completedCount={metrics.completedCount}
          totalSkills={metrics.totalSkills}
          progressPercentage={metrics.progressPercentage}
          totalStars={metrics.totalStars}
          maxStars={metrics.maxPossibleStars}
        />

        {/* 5. INTERACTIVE LEARNING JOURNEY NODE MAP (DUOLINGO/CANDY CRUSH STYLE) */}
        <LearningJourneyWidget />

        {/* 6. COGNITIVE RADAR & CHC DOMAIN BENCHMARK CHART */}
        <BrainRadarWidget />

        {/* 7. COMPLETED SKILLS 7-DOMAIN BREAKDOWN */}
        <CompletedSkillsSection
          completedCount={metrics.completedCount}
          totalSkills={metrics.totalSkills}
        />

        {/* 8. 30-DAY SYNAPTIC ACTIVITY & STREAK HEATMAP */}
        <SynapticActivityHeatmap
          isRtl={isRtl}
          currentStreak={user?.currentStreakDays || 14}
          totalXpThisMonth={4850}
        />

        {/* 9. QUAD WIDGET GRID: DAILY GOALS, LEADERBOARD, BADGES & CALENDAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DailyGoalsCard />
          <MiniLeaderboard />
          <AchievementsPreview />
          <ActivityCalendar />
        </div>

        {/* 10. AI COGNITIVE ADVISOR SUITE (9 AI CAPABILITIES) */}
        <AICognitiveAdvisor />

        {/* 11. RECOMMENDED SKILLS CAROUSEL/GRID */}
        <section aria-label="Recommended Drills" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black font-heading text-foreground">
                {isRtl ? 'تمارين موصى بها لليوم' : 'Recommended Daily Drills'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isRtl ? 'مختارة استناداً إلى نقاط الضعف ونموذج CHC' : 'Curated based on weak skill predictions & CHC benchmarks'}
              </p>
            </div>
            <Link
              href="/skills"
              onClick={() => playSound('click')}
              className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1"
            >
              <span>{isRtl ? 'عرض كافة الـ 50 مهارة' : 'Explore All 50 Skills'}</span>
              {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedSkills.map((sk) => (
              <div
                key={sk.id}
                className="rounded-3xl border border-border/70 bg-card/80 p-6 backdrop-blur-2xl shadow-xl shadow-primary/5 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 glow-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-[#6C63FF]">#{sk.number}</span>
                    <Badge variant="outline" className="text-[10px] rounded-xl font-mono">{sk.domain}</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">
                    {isRtl ? sk.nameAr : sk.nameEn}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {isRtl ? sk.descriptionAr : sk.descriptionEn}
                  </p>
                </div>

                <Link href={`/games/${sk.targetGameId}`} onClick={() => playSound('fanfare')}>
                  <Button size="sm" className="w-full rounded-2xl font-bold btn-3d btn-3d-primary gap-1.5 text-xs h-10 shadow-md">
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>{isRtl ? 'ابدأ التمرين' : 'Practice Drill'}</span>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 12. RECENT TELEMETRY ACTIVITY LOG */}
        <section aria-label="Recent Activities" className="rounded-3xl border border-border/70 bg-card/85 p-6 sm:p-8 backdrop-blur-2xl shadow-xl shadow-primary/5 space-y-4 glow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6C63FF]/15 text-[#6C63FF] font-bold shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-heading text-foreground">
                  {isRtl ? 'سجل الجلسات والقياسات الأخيرة' : 'Recent Telemetry Activity'}
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {sessions.length} {isRtl ? 'جلسات مسجلة سحابياً' : 'Sessions Logged to Engine'}
                </span>
              </div>
            </div>
            <Link href="/analytics" onClick={() => playSound('click')} className="text-xs font-bold text-[#6C63FF] hover:underline">
              {isRtl ? 'عرض التحليل التفصيلي' : 'View Detailed Analytics'}
            </Link>
          </div>

          <div className="divide-y divide-border/40 pt-2">
            {sessions.slice(0, 4).map((sess) => (
              <div
                key={sess.id}
                className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs hover:bg-accent/20 px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-[#6C63FF] font-mono font-bold text-xs shadow-sm">
                    🎮
                  </div>
                  <div>
                    <strong className="text-foreground block font-bold text-xs">{sess.gameId.replace('-', ' ').toUpperCase()}</strong>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(sess.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono font-bold">
                  <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    {sess.telemetry.accuracyRate}% {isRtl ? 'دقة' : 'Acc'}
                  </span>
                  <span className="text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-lg">
                    {sess.telemetry.meanReactionTimeMs}ms RT
                  </span>
                  <span className="text-amber-500 font-black">+{sess.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 13. MOBILE BOTTOM NAVIGATION WITH FLOATING QUICK ACTION */}
      <MobileBottomNav />
    </div>
  );
}
