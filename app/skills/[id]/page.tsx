'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import {
  LearningEngine,
  getEnrichedSkill,
  ALL_50_ENRICHED_SKILLS,
  PASSING_SCORE,
  type EnrichedCognitiveSkill,
} from '@/lib/engine/learning-engine';
import { UserSkillProgress } from '@/types/cognitive';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Play,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  Activity,
  CheckCircle2,
  Lock,
  Unlock,
  Star,
  Zap,
  Target,
  Clock,
  Dumbbell,
  ShieldAlert,
  Gamepad2,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const skillId = (params?.id as string) || 'working-memory';
  const rawSkill = ALL_50_ENRICHED_SKILLS.find((s) => s.id === skillId) || ALL_50_ENRICHED_SKILLS[0];
  const skill: EnrichedCognitiveSkill = getEnrichedSkill(rawSkill);
  const domain = COGNITIVE_DOMAINS.find((d) => d.id === skill.domain) || COGNITIVE_DOMAINS[0];

  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then((pm) => {
      setProgressMap(pm);
      setLoading(false);
    });
  }, [user]);

  const progress: UserSkillProgress = progressMap[skill.id] || {
    skillId: skill.id,
    isUnlocked: skill.number === 1,
    status: skill.number === 1 ? 'available' : 'locked',
    bestScore: 0,
    stars: 0,
    passingScore: PASSING_SCORE,
    attemptsCount: 0,
    bestAccuracy: 0,
    bestReactionTimeMs: 0,
  };

  const isUnlocked = progress.isUnlocked;
  const isPassed = progress.status === 'completed' && progress.bestScore >= PASSING_SCORE;

  // Prerequisites information
  const prereqSkills = (skill.prerequisites || []).map((pid) => {
    const s = ALL_50_ENRICHED_SKILLS.find((item) => item.id === pid);
    const pProg = progressMap[pid];
    const isSatisfied = pProg && pProg.status === 'completed' && pProg.bestScore >= PASSING_SCORE;
    return {
      skill: s,
      isSatisfied: Boolean(isSatisfied),
      score: pProg?.bestScore || 0,
    };
  });

  const nextSkill = ALL_50_ENRICHED_SKILLS.find((s) => s.number === skill.number + 1);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/skills" className="hover:text-primary transition-colors">
          {t('allSkillsTitle')}
        </Link>
        <span>/</span>
        <span className="text-foreground font-bold">{isRtl ? domain.nameAr : domain.nameEn}</span>
        <span>/</span>
        <span className="text-primary font-bold">#{skill.number}</span>
      </div>

      {/* Hero Header Card */}
      <Card className="p-8 sm:p-10 rounded-4xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/50">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center font-mono font-black text-sm text-primary">
                #{skill.number}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {isRtl ? domain.nameAr : domain.nameEn}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {skill.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Level {skill.level} (Tier {skill.level})
              </span>
              {isUnlocked ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Unlock className="h-3 w-3" />
                  <span>{isRtl ? 'مفتوحة' : 'Unlocked'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Lock className="h-3 w-3" />
                  <span>{isRtl ? 'مغلقة' : 'Locked'}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground">
              {isRtl ? skill.nameAr : skill.nameEn}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {isRtl ? skill.descriptionAr : skill.descriptionEn}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            {isUnlocked ? (
              <Link href={`/games/${skill.targetGameId}`} onClick={() => playSound('click')}>
                <Button size="lg" className="h-14 px-8 rounded-2xl font-bold gap-2 btn-3d btn-3d-primary shadow-xl">
                  <Play className="h-5 w-5 fill-white" />
                  <span>{isRtl ? 'بدء التمرين والتقييم' : 'Launch Assessment'}</span>
                </Button>
              </Link>
            ) : (
              <Button disabled size="lg" className="h-14 px-8 rounded-2xl font-bold gap-2 opacity-60">
                <Lock className="h-5 w-5" />
                <span>{isRtl ? 'مغلقة حتى اجتياز المتطلب' : 'Prerequisite Required'}</span>
              </Button>
            )}

            {/* Stars Earned */}
            <div className="flex items-center gap-1 bg-accent/40 px-4 py-2 rounded-2xl border border-border/50">
              <span className="text-xs font-bold text-muted-foreground mr-1">
                {isRtl ? 'النجوم المكتسبة:' : 'Stars:'}
              </span>
              {[1, 2, 3].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={`h-5 w-5 ${
                    starIndex <= progress.stars
                      ? 'fill-amber-400 text-amber-400 filter drop-shadow-md'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Learning Engine Live Progress Tracking Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-accent/40 border border-border/50">
            <span className="text-[11px] text-muted-foreground font-bold block">{isRtl ? 'أفضل درجة' : 'Best Score'}</span>
            <span className="text-2xl font-black font-mono text-primary mt-0.5 block">
              {progress.bestScore}%
            </span>
            <span className="text-[10px] text-muted-foreground">Passing Score: {PASSING_SCORE}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border/50">
            <span className="text-[11px] text-muted-foreground font-bold block">{isRtl ? 'أفضل دقة' : 'Peak Accuracy'}</span>
            <span className="text-2xl font-black font-mono text-emerald-500 mt-0.5 block">
              {progress.bestAccuracy > 0 ? `${progress.bestAccuracy}%` : '—'}
            </span>
            <span className="text-[10px] text-muted-foreground">Error-free execution</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border/50">
            <span className="text-[11px] text-muted-foreground font-bold block">{isRtl ? 'سرعة الاستجابة' : 'Mean Reaction'}</span>
            <span className="text-2xl font-black font-mono text-amber-500 mt-0.5 block">
              {progress.bestReactionTimeMs > 0 ? `${Math.round(progress.bestReactionTimeMs)}ms` : '—'}
            </span>
            <span className="text-[10px] text-muted-foreground">Neural Chronometry</span>
          </div>

          <div className="p-4 rounded-2xl bg-accent/40 border border-border/50">
            <span className="text-[11px] text-muted-foreground font-bold block">{isRtl ? 'عدد المحاولات' : 'Total Attempts'}</span>
            <span className="text-2xl font-black font-mono text-purple-500 mt-0.5 block">
              {progress.attemptsCount}
            </span>
            <span className="text-[10px] text-muted-foreground">Logged in Supabase</span>
          </div>
        </div>
      </Card>

      {/* STRICT UNLOCK LOGIC & PREREQUISITES PANEL */}
      <Card className="p-6 sm:p-8 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <span>{isRtl ? 'قواعد فتح المهارة والمتطلبات السابقة' : 'Unlock Logic & Prerequisites'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 text-xs space-y-3">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
            <p className="text-foreground leading-relaxed">
              <strong>{isRtl ? 'القاعدة الصارمة للمنظومة:' : 'Strict Learning Engine Rule:'}</strong>{' '}
              {isRtl
                ? 'لا يمكن فتح أي مهارة تالية حتى تصل المهارة السابقة إلى نسبة النجاح المعتمدة (70% فما فوق).'
                : 'The next skill cannot unlock until the previous one reaches the passing score (70% or higher).'}
            </p>
          </div>

          {skill.number === 1 ? (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isRtl ? 'هذه هي المهارة التأسيسية الأولى وهي مفتوحة افتراضياً لجميع المتعلمين.' : 'This is Foundational Skill #1 and is unlocked by default for all learners.'}</span>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="font-bold text-muted-foreground block">
                {isRtl ? 'المتطلب السابق لفتح هذه المهارة:' : 'Prerequisite required to unlock:'}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {prereqSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border ${
                      item.isSatisfied
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {item.isSatisfied ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    <span>
                      #{item.skill?.number} {isRtl ? item.skill?.nameAr : item.skill?.nameEn} ({item.score}%)
                    </span>
                    <span className="font-mono text-[10px]">
                      {item.isSatisfied ? 'PASSED' : 'REQUIRED >= 70%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* EXERCISES & MINI GAMES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exercises List */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-border/70 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <Dumbbell className="h-5 w-5" />
            <span>{isRtl ? 'تمارين المهارة المقررة' : 'Assigned Skill Exercises'}</span>
          </div>

          <div className="space-y-3">
            {skill.exercises.map((ex) => (
              <div key={ex.id} className="p-4 rounded-2xl border border-border/50 bg-accent/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-foreground">{isRtl ? ex.titleAr : ex.titleEn}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    {ex.durationSeconds}s
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isRtl ? ex.instructionsAr : ex.instructionsEn}
                </p>
                <span className="inline-block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {ex.targetMetric}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mini Games Engine */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-border/70 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <Gamepad2 className="h-5 w-5" />
            <span>{isRtl ? 'محركات الألعاب التفاعلية' : 'Interactive Mini Games'}</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-border/50 bg-accent/20 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold text-foreground">
                  {skill.targetGameId.replace('-', ' ').toUpperCase()} Engine
                </strong>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  Active Link
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isRtl
                  ? 'يقيس هذا المحرك الدقة وزمن الرجع بالمللي ثانية ومقاومة التشتت المعرفي في بيئة تنافسية غنية.'
                  : 'Tests latency chronometry, inhibitory resistance, and fluid retention under adaptive pacing.'}
              </p>
              <Link href={`/games/${skill.targetGameId}`} onClick={() => playSound('click')}>
                <Button size="sm" variant="outline" className="w-full rounded-xl text-xs font-bold mt-2 gap-1.5">
                  <Play className="h-3.5 w-3.5" />
                  <span>{isRtl ? 'تشغيل اللعبة الآن' : 'Play Game Mode'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* ASSESSMENT & SCORING PROTOCOL */}
      <Card className="p-6 sm:p-8 rounded-3xl border border-border/70 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
          <Award className="h-5 w-5" />
          <span>{isRtl ? 'معايير التقييم وتوزيع النجوم' : 'Clinical Assessment & Star Scoring Formula'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>1 Star: 70% - 84%</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {isRtl ? 'اجتياز معتمد يفتح المهارة التالية فوراً.' : 'Passing competency, immediately unlocks next skill.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-amber-400" />
              <Star className="h-4 w-4 fill-amber-400" />
              <span>2 Stars: 85% - 94%</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {isRtl ? 'كفاءة متقدمة وتناسق عصبي متميز.' : 'Proficient cognitive agility with minimal errors.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-accent/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-amber-400" />
              <Star className="h-4 w-4 fill-amber-400" />
              <Star className="h-4 w-4 fill-amber-400" />
              <span>3 Stars: 95% - 100%</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              {isRtl ? 'إتقان فائق وسرعة رد فعل استثنائية.' : 'Full mastery benchmark with peak chronometry.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
