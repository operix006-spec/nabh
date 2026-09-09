import {
  CognitiveSkill,
  UserSkillProgress,
  GameSessionTelemetry,
  SkillExercise,
  SkillAssessmentCriteria,
  SkillAttemptRecord,
} from '@/types/cognitive';
import { COGNITIVE_SKILLS_50 } from '@/lib/data/cognitive-skills';
import { supabase } from '@/lib/supabase/client';

export const PASSING_SCORE = 70; // 70% threshold required to pass and unlock next skill
export const MAX_SCORE = 100;
export const TOTAL_SKILLS_COUNT = 50;
const STORAGE_KEY_PROGRESS = 'nabh_user_skill_progress';

// Helper to determine tier level (1 to 5) based on skill number
export function getSkillLevel(skillNumber: number): number {
  if (skillNumber <= 10) return 1; // Tier 1: Sensory & Foundational Focus
  if (skillNumber <= 20) return 2; // Tier 2: Attentional Agility & Processing Speed
  if (skillNumber <= 30) return 3; // Tier 3: Working Memory & Inhibitory Control
  if (skillNumber <= 40) return 4; // Tier 4: Analytical Logic & Spatial Operations
  return 5; // Tier 5: Executive Synthesis & Social-Emotional Mastery
}

// Generate sequential prerequisite chains: skill N strictly requires skill N-1
export function getSkillPrerequisites(skillNumber: number): string[] {
  if (skillNumber === 1) return []; // First foundational skill has no prerequisites
  const prevSkill = COGNITIVE_SKILLS_50.find((s) => s.number === skillNumber - 1);
  return prevSkill ? [prevSkill.id] : [];
}

// Tailored exercises generator for every cognitive skill
export function generateSkillExercises(skill: CognitiveSkill): SkillExercise[] {
  return [
    {
      id: `${skill.id}-drill-1`,
      titleAr: `تمرين الإحماء والتركيز: ${skill.nameAr}`,
      titleEn: `Warmup & Priming Drill: ${skill.nameEn}`,
      type: 'drill',
      durationSeconds: 60,
      instructionsAr: `قم بإنجاز تدريبات سريعة لتحفيز شبكة ${skill.brainAreaAr} وتهيئة الدماغ للمهارة.`,
      instructionsEn: `Complete rapid repetitions to stimulate the ${skill.brainAreaEn} neural hub.`,
      targetMetric: 'Accuracy >= 80% • Stimulus Velocity 1.0x',
    },
    {
      id: `${skill.id}-drill-2`,
      titleAr: `التحدي التكيفي المتقدم: ${skill.nameAr}`,
      titleEn: `Adaptive Executive Challenge: ${skill.nameEn}`,
      type: 'puzzle',
      durationSeconds: 120,
      instructionsAr: `حافظ على الدقة العالية مع تسارع وتيرة المثيرات وتشويش المشتتات المحيطة.`,
      instructionsEn: `Maintain high accuracy while cognitive load and distractor noise intensify.`,
      targetMetric: 'Passing Score >= 70% • Reaction Time < 450ms',
    },
  ];
}

// Standardized clinical assessment criteria for each skill
export function generateSkillAssessment(skill: CognitiveSkill): SkillAssessmentCriteria {
  return {
    passingScore: PASSING_SCORE, // 70% Passing threshold
    star1Threshold: 70,          // 1 Star: 70% - 84% (Passed)
    star2Threshold: 85,          // 2 Stars: 85% - 94% (Proficient)
    star3Threshold: 95,          // 3 Stars: 95% - 100% (Mastered)
    maxDurationSeconds: 180,
  };
}

// Complete fully-enriched skill definition
export interface EnrichedCognitiveSkill extends CognitiveSkill {
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mastery';
  level: number;
  prerequisites: string[];
  exercises: SkillExercise[];
  miniGames: string[];
  assessment: SkillAssessmentCriteria;
  passingScore: number;
  maxScore: number;
}

// Enrich a raw skill with all complete engine properties
export function getEnrichedSkill(skill: CognitiveSkill): EnrichedCognitiveSkill {
  const level = skill.level || getSkillLevel(skill.number);
  const prerequisites = skill.prerequisites && skill.prerequisites.length > 0 
    ? skill.prerequisites 
    : getSkillPrerequisites(skill.number);
  const exercises = skill.exercises && skill.exercises.length > 0
    ? skill.exercises
    : generateSkillExercises(skill);
  const assessment = skill.assessment || generateSkillAssessment(skill);
  const miniGames = skill.miniGames && skill.miniGames.length > 0
    ? skill.miniGames
    : [skill.targetGameId];

  return {
    ...skill,
    name: { ar: skill.nameAr, en: skill.nameEn },
    description: { ar: skill.descriptionAr, en: skill.descriptionEn },
    level,
    prerequisites,
    exercises,
    miniGames,
    assessment,
    passingScore: PASSING_SCORE,
    maxScore: MAX_SCORE,
  };
}

// All 50 fully-enriched skills cached
export const ALL_50_ENRICHED_SKILLS: EnrichedCognitiveSkill[] = COGNITIVE_SKILLS_50.map(getEnrichedSkill);

/**
 * ============================================================================
 * COMPLETE LEARNING ENGINE CLASS
 * Evaluates, unlocks, scores, tracks, and synchronizes all 50 skills in Supabase.
 * ============================================================================
 */
export class LearningEngine {
  /**
   * 1. RETRIEVE ALL 50 SKILLS
   */
  static getAllSkills(): EnrichedCognitiveSkill[] {
    return ALL_50_ENRICHED_SKILLS;
  }

  /**
   * 2. RETRIEVE SPECIFIC SKILL BY ID OR NUMBER
   */
  static getSkill(idOrNumber: string | number): EnrichedCognitiveSkill | undefined {
    if (typeof idOrNumber === 'number') {
      return ALL_50_ENRICHED_SKILLS.find((s) => s.number === idOrNumber);
    }
    return ALL_50_ENRICHED_SKILLS.find((s) => s.id === idOrNumber);
  }

  /**
   * 3. STAR CALCULATION LOGIC
   * 0 Stars: < 70% (Incomplete / Below Passing)
   * 1 Star:  70% - 84% (Passed / Minimum Competency)
   * 2 Stars: 85% - 94% (Proficient / High Fluency)
   * 3 Stars: 95% - 100% (Mastery / Peak Performance)
   */
  static calculateStars(score: number): number {
    if (score >= 95) return 3;
    if (score >= 85) return 2;
    if (score >= 70) return 1;
    return 0;
  }

  /**
   * 4. STRICT UNLOCK LOGIC:
   * Rule: Skill #1 is unlocked by default.
   * Rule: Any subsequent skill N CANNOT unlock until all its prerequisites
   * (specifically Skill N-1) reach the passing score (>= 70%).
   */
  static checkSkillUnlockEligibility(
    skillId: string,
    progressMap: Record<string, UserSkillProgress>
  ): boolean {
    const skill = ALL_50_ENRICHED_SKILLS.find((s) => s.id === skillId);
    if (!skill) return false;

    // Foundational skill #1 is always unlocked
    if (skill.number === 1) return true;

    // Prerequisite verification
    const prereqs = skill.prerequisites;
    if (!prereqs || prereqs.length === 0) return true;

    // All prerequisite skills must have status = 'completed' AND score >= 70
    return prereqs.every((prereqId) => {
      const p = progressMap[prereqId];
      return p && p.status === 'completed' && p.bestScore >= PASSING_SCORE;
    });
  }

  /**
   * 5. LOAD USER PROGRESS (FROM SUPABASE WITH OFFLINE LOCALSTORAGE FALLBACK)
   */
  static async loadUserProgress(userId: string): Promise<Record<string, UserSkillProgress>> {
    const progressMap: Record<string, UserSkillProgress> = {};

    // Step A: Attempt Supabase Remote Fetch
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_skill_progress')
          .select('*')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          data.forEach((row: any) => {
            progressMap[row.skill_id] = {
              skillId: row.skill_id,
              isUnlocked: Boolean(row.is_unlocked),
              status: row.status,
              bestScore: Number(row.best_score || 0),
              stars: Number(row.stars || 0),
              passingScore: Number(row.passing_score || PASSING_SCORE),
              attemptsCount: Number(row.attempts_count || 0),
              bestAccuracy: Number(row.best_accuracy || 0),
              bestReactionTimeMs: Number(row.best_reaction_time_ms || 0),
              unlockedAt: row.unlocked_at,
              completedAt: row.completed_at,
            };
          });

          // Ensure foundational skill #1 is unlocked
          const firstSkill = ALL_50_ENRICHED_SKILLS[0];
          if (firstSkill && (!progressMap[firstSkill.id] || !progressMap[firstSkill.id].isUnlocked)) {
            progressMap[firstSkill.id] = {
              skillId: firstSkill.id,
              isUnlocked: true,
              status: 'available',
              bestScore: 0,
              stars: 0,
              passingScore: PASSING_SCORE,
              attemptsCount: 0,
              bestAccuracy: 0,
              bestReactionTimeMs: 0,
              unlockedAt: new Date().toISOString(),
            };
          }

          // Cache in local storage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${userId}`, JSON.stringify(progressMap));
            } catch (e) {
              // Ignore storage quotas
            }
          }

          return progressMap;
        }
      } catch (err) {
        console.warn('Supabase query failed, attempting local cache fallback:', err);
      }
    }

    // Step B: LocalStorage Cache Fallback
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`${STORAGE_KEY_PROGRESS}_${userId}`);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        console.error('LocalStorage parsing error:', e);
      }
    }

    // Step C: Initialize Clean Default Progress (Skill 1 Unlocked, Skills 2..50 Locked)
    ALL_50_ENRICHED_SKILLS.forEach((skill) => {
      const isFirst = skill.number === 1;
      progressMap[skill.id] = {
        skillId: skill.id,
        isUnlocked: isFirst,
        status: isFirst ? 'available' : 'locked',
        bestScore: 0,
        stars: 0,
        passingScore: PASSING_SCORE,
        attemptsCount: 0,
        bestAccuracy: 0,
        bestReactionTimeMs: 0,
        unlockedAt: isFirst ? new Date().toISOString() : undefined,
      };
    });

    return progressMap;
  }

  /**
   * 6. SUBMIT SKILL ATTEMPT / ASSESSMENT:
   * - Evaluates performance against passing threshold (70%)
   * - Updates best score, stars, accuracy, and reaction times
   * - UNLOCKS NEXT SKILL only if this skill reaches passing score (>= 70%)
   * - Automatically stores and synchronizes state with Supabase and local storage
   */
  static async submitSkillAttempt(
    userId: string,
    skillId: string,
    score: number,
    telemetry: GameSessionTelemetry
  ): Promise<{
    progress: UserSkillProgress;
    newlyUnlockedSkillIds: string[];
    isPassed: boolean;
    starsEarned: number;
    allProgress: Record<string, UserSkillProgress>;
  }> {
    const allProgress = await this.loadUserProgress(userId);

    const existing = allProgress[skillId] || {
      skillId,
      isUnlocked: true,
      status: 'available',
      bestScore: 0,
      stars: 0,
      passingScore: PASSING_SCORE,
      attemptsCount: 0,
      bestAccuracy: 0,
      bestReactionTimeMs: 0,
    };

    const isPassed = score >= PASSING_SCORE;
    const starsEarned = this.calculateStars(score);
    const newBestScore = Math.max(existing.bestScore, score);
    const newStars = Math.max(existing.stars, starsEarned);
    const newStatus = isPassed ? 'completed' : 'in_progress';
    const nowIso = new Date().toISOString();

    const attemptRecord: SkillAttemptRecord = {
      attemptNumber: existing.attemptsCount + 1,
      score,
      stars: starsEarned,
      accuracyRate: telemetry.accuracyRate,
      meanReactionTimeMs: telemetry.meanReactionTimeMs,
      isPassed,
      timestamp: nowIso,
    };

    const updatedHistory = [...(existing.history || []), attemptRecord].slice(-20); // Keep last 20 attempts

    const updatedProgress: UserSkillProgress = {
      ...existing,
      bestScore: newBestScore,
      stars: newStars,
      status: newStatus,
      attemptsCount: existing.attemptsCount + 1,
      bestAccuracy: Math.max(existing.bestAccuracy, telemetry.accuracyRate),
      bestReactionTimeMs:
        existing.bestReactionTimeMs === 0
          ? telemetry.meanReactionTimeMs
          : Math.min(existing.bestReactionTimeMs, telemetry.meanReactionTimeMs),
      completedAt: isPassed ? (existing.completedAt || nowIso) : existing.completedAt,
      lastAttemptAt: nowIso,
      history: updatedHistory,
    };

    allProgress[skillId] = updatedProgress;

    // Evaluate cascading unlock eligibility:
    // If user passed this skill (>= 70%), check all subsequent skills whose prerequisites are now satisfied
    const newlyUnlockedSkillIds: string[] = [];
    if (isPassed) {
      ALL_50_ENRICHED_SKILLS.forEach((s) => {
        const currentProg = allProgress[s.id];
        if (!currentProg || !currentProg.isUnlocked) {
          if (this.checkSkillUnlockEligibility(s.id, allProgress)) {
            allProgress[s.id] = {
              ...(currentProg || {
                skillId: s.id,
                bestScore: 0,
                stars: 0,
                passingScore: PASSING_SCORE,
                attemptsCount: 0,
                bestAccuracy: 0,
                bestReactionTimeMs: 0,
              }),
              isUnlocked: true,
              status: 'available',
              unlockedAt: nowIso,
            };
            newlyUnlockedSkillIds.push(s.id);
          }
        }
      });
    }

    // Step 1: Persist to Local Storage Cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${userId}`, JSON.stringify(allProgress));
      } catch (err) {
        console.error('LocalStorage write failed:', err);
      }
    }

    // Step 2: Persist to Supabase Database
    if (supabase) {
      try {
        // Upsert current skill progress
        await supabase.from('user_skill_progress').upsert({
          user_id: userId,
          skill_id: skillId,
          is_unlocked: true,
          status: updatedProgress.status,
          best_score: updatedProgress.bestScore,
          stars: updatedProgress.stars,
          passing_score: PASSING_SCORE,
          attempts_count: updatedProgress.attemptsCount,
          best_accuracy: updatedProgress.bestAccuracy,
          best_reaction_time_ms: updatedProgress.bestReactionTimeMs,
          completed_at: updatedProgress.completedAt,
          updated_at: nowIso,
        });

        // Upsert newly unlocked skills
        for (const unlId of newlyUnlockedSkillIds) {
          await supabase.from('user_skill_progress').upsert({
            user_id: userId,
            skill_id: unlId,
            is_unlocked: true,
            status: 'available',
            unlocked_at: nowIso,
            updated_at: nowIso,
          });
        }

        // Record game session telemetry
        await supabase.from('game_sessions').insert({
          user_id: userId,
          skill_id: skillId,
          game_id: ALL_50_ENRICHED_SKILLS.find((s) => s.id === skillId)?.targetGameId || 'memory-matrix',
          score,
          stars_earned: starsEarned,
          xp_earned: isPassed ? 100 : 30,
          mean_reaction_time_ms: telemetry.meanReactionTimeMs,
          fastest_reaction_time_ms: telemetry.fastestReactionTimeMs,
          accuracy_rate: telemetry.accuracyRate,
          duration_seconds: 90,
          telemetry: telemetry as any,
          created_at: nowIso,
        });
      } catch (err) {
        console.warn('Supabase telemetry/progress sync failed (saved locally):', err);
      }
    }

    return {
      progress: updatedProgress,
      newlyUnlockedSkillIds,
      isPassed,
      starsEarned,
      allProgress,
    };
  }

  /**
   * 7. SEED ALL 50 SKILLS TO SUPABASE DATABASE
   * Creates or updates the full 50-skill definitions table in Supabase.
   */
  static async seedSkillsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!supabase) {
      return { success: false, count: 0, error: 'Supabase client not configured' };
    }

    try {
      const records = ALL_50_ENRICHED_SKILLS.map((skill) => ({
        id: skill.id,
        skill_number: skill.number,
        domain: skill.domain,
        name_ar: skill.nameAr,
        name_en: skill.nameEn,
        description_ar: skill.descriptionAr,
        description_en: skill.descriptionEn,
        real_world_benefit_ar: skill.realWorldBenefitAr,
        real_world_benefit_en: skill.realWorldBenefitEn,
        brain_area_ar: skill.brainAreaAr,
        brain_area_en: skill.brainAreaEn,
        difficulty: skill.difficulty,
        level: skill.level,
        prerequisites: skill.prerequisites,
        passing_score: skill.passingScore,
        target_game_id: skill.targetGameId,
        mini_games: skill.miniGames,
        exercises: skill.exercises as any,
        assessment_criteria: skill.assessment as any,
        estimated_minutes: skill.estimatedMinutes,
      }));

      const { error } = await supabase
        .from('cognitive_skills')
        .upsert(records, { onConflict: 'id' });

      if (error) throw error;
      return { success: true, count: records.length };
    } catch (err: any) {
      console.error('Failed to seed 50 skills to Supabase:', err);
      return { success: false, count: 0, error: err.message || 'Seeding error' };
    }
  }

  /**
   * 8. AGGREGATE SYSTEM METRICS FOR DASHBOARD & ROADMAP
   */
  static calculateMetrics(allProgress: Record<string, UserSkillProgress>) {
    let completedCount = 0;
    let totalStars = 0;
    let totalScoreSum = 0;
    let scoredSkillsCount = 0;
    let unlockedCount = 0;

    Object.values(allProgress).forEach((p) => {
      if (p.isUnlocked) unlockedCount++;
      if (p.status === 'completed' && p.bestScore >= PASSING_SCORE) completedCount++;
      totalStars += p.stars;
      if (p.bestScore > 0) {
        totalScoreSum += p.bestScore;
        scoredSkillsCount++;
      }
    });

    const averageScore = scoredSkillsCount > 0 ? Math.round(totalScoreSum / scoredSkillsCount) : 0;
    const progressPercentage = Math.round((completedCount / TOTAL_SKILLS_COUNT) * 100);

    // Identify current active skill (first unlocked skill that is not yet completed)
    const currentActiveSkill =
      ALL_50_ENRICHED_SKILLS.find(
        (s) => allProgress[s.id]?.isUnlocked && allProgress[s.id]?.status !== 'completed'
      ) || ALL_50_ENRICHED_SKILLS[0];

    return {
      completedCount,
      unlockedCount,
      totalSkills: TOTAL_SKILLS_COUNT,
      totalStars,
      maxPossibleStars: TOTAL_SKILLS_COUNT * 3, // 150 stars total
      averageScore,
      progressPercentage,
      currentActiveSkill,
    };
  }

  /**
   * 9. RESET USER PROGRESS (FOR TESTING & DEMOS)
   */
  static async resetUserProgress(userId: string): Promise<Record<string, UserSkillProgress>> {
    const freshMap: Record<string, UserSkillProgress> = {};

    ALL_50_ENRICHED_SKILLS.forEach((skill) => {
      const isFirst = skill.number === 1;
      freshMap[skill.id] = {
        skillId: skill.id,
        isUnlocked: isFirst,
        status: isFirst ? 'available' : 'locked',
        bestScore: 0,
        stars: 0,
        passingScore: PASSING_SCORE,
        attemptsCount: 0,
        bestAccuracy: 0,
        bestReactionTimeMs: 0,
        unlockedAt: isFirst ? new Date().toISOString() : undefined,
      };
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PROGRESS}_${userId}`, JSON.stringify(freshMap));
    }

    if (supabase) {
      try {
        await supabase.from('user_skill_progress').delete().eq('user_id', userId);
        const firstSkill = ALL_50_ENRICHED_SKILLS[0];
        await supabase.from('user_skill_progress').insert({
          user_id: userId,
          skill_id: firstSkill.id,
          is_unlocked: true,
          status: 'available',
          passing_score: PASSING_SCORE,
          unlocked_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase reset warning:', err);
      }
    }

    return freshMap;
  }
}
