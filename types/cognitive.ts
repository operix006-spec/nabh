export type CognitiveDomainId = 
  | 'memory'
  | 'attention'
  | 'speed'
  | 'flexibility'
  | 'spatial'
  | 'logic'
  | 'social';

export interface CognitiveDomain {
  id: CognitiveDomainId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  badgeBg: string;
  icon: string;
  skillsCount: number;
}

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'mastery';

export interface SkillExercise {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'drill' | 'puzzle' | 'reaction' | 'sequence';
  durationSeconds: number;
  instructionsAr: string;
  instructionsEn: string;
  targetMetric: string;
}

export interface SkillAssessmentCriteria {
  passingScore: number; // e.g. 70
  star1Threshold: number; // e.g. 70
  star2Threshold: number; // e.g. 85
  star3Threshold: number; // e.g. 95
  maxDurationSeconds: number;
}

export interface CognitiveSkill {
  id: string;
  number: number; // 1 to 50
  nameAr: string;
  nameEn: string;
  domain: CognitiveDomainId;
  descriptionAr: string;
  descriptionEn: string;
  realWorldBenefitAr: string;
  realWorldBenefitEn: string;
  brainAreaAr: string;
  brainAreaEn: string;
  scientificBasisAr: string;
  scientificBasisEn: string;
  difficulty: SkillDifficulty;
  level?: number; // 1 to 5 (Mastery Tier)
  prerequisites?: string[]; // Skill IDs that must be completed to unlock
  passingScore?: number; // 70% threshold
  targetGameId: string;
  miniGames?: string[]; // Associated game modes
  exercises?: SkillExercise[];
  assessment?: SkillAssessmentCriteria;
  estimatedMinutes: number;
  icon: string;
}

export interface SkillAttemptRecord {
  attemptNumber: number;
  score: number;
  stars: number;
  accuracyRate: number;
  meanReactionTimeMs: number;
  isPassed: boolean;
  timestamp: string;
}

export interface UserSkillProgress {
  skillId: string;
  isUnlocked: boolean;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  bestScore: number; // 0 - 100
  stars: number; // 0 - 3 (0: <70%, 1: 70-84%, 2: 85-94%, 3: 95-100%)
  passingScore: number; // Constant passing threshold (70%)
  attemptsCount: number;
  bestAccuracy: number;
  bestReactionTimeMs: number;
  unlockedAt?: string;
  completedAt?: string;
  lastAttemptAt?: string;
  history?: SkillAttemptRecord[];
}

export interface GameSessionTelemetry {
  reactionTimesMs: number[];
  meanReactionTimeMs: number;
  fastestReactionTimeMs: number;
  accuracyRate: number; // 0 - 100
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  highestStreak: number;
  difficultyLevelReached: number;
  cognitiveLoadRating?: number; // 1 - 5
  errorDecayRate?: number;
}

export interface GameSession {
  id: string;
  userId: string;
  skillId: string;
  gameId: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  score: number;
  starsEarned: number;
  xpEarned: number;
  telemetry: GameSessionTelemetry;
}

export interface UserSkillRating {
  skillId: string;
  ratingScore: number; // 0 - 1000 scale
  confidenceInterval: number;
  percentileRank: number; // 0 - 99.9%
  lastTrainedDate: string;
  gamesPlayedCount: number;
  masteryLevel: SkillDifficulty;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'learner' | 'parent' | 'educator' | 'admin';
  ageGroup: 'child' | 'teen' | 'young_adult' | 'adult' | 'senior';
  currentStreakDays: number;
  bestStreakDays: number;
  totalXp: number;
  level: number; // e.g. Level 12 Synaptic Pioneer
  overallCognitiveIndex: number; // 0 - 1000
  languagePreference: 'ar' | 'en';
  themePreference: 'light' | 'dark' | 'system';
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    soundVolume: number; // 0 - 100
    largeText: boolean;
  };
  joinedAt: string;
}

export interface CognitiveRadarData {
  domain: CognitiveDomainId;
  nameAr: string;
  nameEn: string;
  score: number; // 0 - 100
  userPercentile: number; // 0 - 100
  benchmarkScore: number; // peer average
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  streak: number;
  division: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  isCurrentUser?: boolean;
}

// AI Intelligence Types
export interface AIMistakeAnalysis {
  errorPattern: string;
  neuroReasonAr: string;
  neuroReasonEn: string;
  involvedBrainArea: string;
  actionableTipAr: string;
  actionableTipEn: string;
  cognitiveFatigueLevel: 'low' | 'moderate' | 'high';
}

export interface AIRoadmapRecommendation {
  nextSkillId: string;
  confidenceScore: number;
  rationaleAr: string;
  rationaleEn: string;
  estimatedGrowthDelta: number;
}

export interface AIEvaluationSummary {
  overallIndexDelta: number;
  primaryStrengthAr: string;
  primaryStrengthEn: string;
  bottleneckDomainAr: string;
  bottleneckDomainEn: string;
  encouragementAr: string;
  encouragementEn: string;
  suggestedWorkoutDurationMin: number;
}

// Admin Panel Types
export interface AdminSystemStats {
  totalLearners: number;
  totalTeachers: number;
  totalParents: number;
  totalGamesPlayed: number;
  meanAccuracyRate: number;
  meanReactionTimeMs: number;
  activeToday: number;
  systemHealth: 'optimal' | 'degraded' | 'maintenance';
}

export interface AdminGameConfig {
  gameId: string;
  nameEn: string;
  nameAr: string;
  domain: CognitiveDomainId;
  roundsCount: number;
  timeLimitSeconds: number;
  baseXp: number;
  difficultyScale: number;
  enabled: boolean;
}
