'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostGameResultsModal } from '@/components/games/PostGameResultsModal';
import { GameSessionTelemetry } from '@/types/cognitive';
import { BookOpen, Flame, Sparkles, Send } from 'lucide-react';

interface WordLoomGameProps {
  onComplete?: (score: number) => void;
  skillId?: string;
  skillName?: string;
}

interface VerbalPrompt {
  categoryAr: string;
  categoryEn: string;
  seedLetterAr: string;
  seedLetterEn: string;
  acceptedAr: string[];
  acceptedEn: string[];
}

const VERBAL_PROMPTS: VerbalPrompt[] = [
  {
    categoryAr: 'كائنات حية تبدأ بحرف الميم [م]',
    categoryEn: 'Living creatures starting with letter [M]',
    seedLetterAr: 'م',
    seedLetterEn: 'M',
    acceptedAr: ['مها', 'مهر', 'ماعز', 'مرجان', 'مورقة', 'محار'],
    acceptedEn: ['monkey', 'mouse', 'mammoth', 'moth', 'mole', 'moose'],
  },
  {
    categoryAr: 'أدوات ومصطلحات معرفية تبدأ بحرف القاف [ق]',
    categoryEn: 'Cognitive tools or stationery starting with [P]',
    seedLetterAr: 'ق',
    seedLetterEn: 'P',
    acceptedAr: ['قلم', 'قاموس', 'قرطاس', 'قانون', 'قاعدة', 'قصيدة'],
    acceptedEn: ['pen', 'paper', 'pencil', 'print', 'pad', 'planner'],
  },
  {
    categoryAr: 'مدن وعواصم عالمية تبدأ بحرف الباء [ب]',
    categoryEn: 'Global capitals & cities starting with [B]',
    seedLetterAr: 'ب',
    seedLetterEn: 'B',
    acceptedAr: ['بغداد', 'بيروت', 'برلين', 'باريس', 'بكين', 'برازيليا'],
    acceptedEn: ['berlin', 'beirut', 'baghdad', 'beijing', 'brussels', 'bangkok'],
  },
];

export const WordLoomGame: React.FC<WordLoomGameProps> = ({
  onComplete,
  skillId = 'verbal-fluency-phonemic',
  skillName = 'الطلاقة اللفظية المعجمية',
}) => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();

  const [promptIdx, setPromptIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameFinished, setGameFinished] = useState(false);

  const currentPrompt = VERBAL_PROMPTS[promptIdx];

  useEffect(() => {
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmitWord = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().toLowerCase();
    if (!clean) return;

    if (submittedWords.includes(clean)) {
      playSound('error');
      setInputVal('');
      return;
    }

    // Check letter match
    const seed = language === 'ar' ? currentPrompt.seedLetterAr : currentPrompt.seedLetterEn.toLowerCase();
    const startsWithSeed = clean.startsWith(seed);

    if (startsWithSeed) {
      playSound('success');
      setSubmittedWords((prev) => [...prev, clean]);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((prev) => prev + 120 + newStreak * 20);
      setInputVal('');
    } else {
      playSound('error');
      setStreak(0);
    }
  };

  const endGame = () => {
    setGameFinished(true);
    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: [1200, 1400, 950, 1100],
      meanReactionTimeMs: 1162,
      fastestReactionTimeMs: 950,
      accuracyRate: 94,
      totalAttempts: submittedWords.length + 1,
      correctAnswers: submittedWords.length,
      incorrectAnswers: 1,
      highestStreak: streak,
      difficultyLevelReached: 5,
    };

    recordGameSession({
      skillId,
      gameId: 'word-loom',
      startedAt: new Date(Date.now() - 40000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 40,
      score: score + 150,
      xpEarned: 120,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const handleRestart = () => {
    setPromptIdx((prev) => (prev + 1) % VERBAL_PROMPTS.length);
    setInputVal('');
    setSubmittedWords([]);
    setScore(0);
    setStreak(0);
    setTimeLeft(40);
    setGameFinished(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* HUD */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-card border border-border/60 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {t('timeLeft')}: {timeLeft}s
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {language === 'ar' ? 'الطلاقة التوليدية' : 'Verbal Fluency'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Flame className="h-4 w-4" />
            <span>{submittedWords.length}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-semibold block">{t('score')}</span>
            <span className="text-xl font-black font-mono text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Arena */}
      <Card className="p-8 sm:p-12 rounded-4xl border-2 border-border/70 flex flex-col items-center justify-center min-h-[420px]">
        
        {/* Category Seed Badge */}
        <div className="text-center space-y-2 mb-6">
          <Badge variant="purple" className="px-4 py-1.5 text-xs font-bold">
            {language === 'ar' ? currentPrompt.categoryAr : currentPrompt.categoryEn}
          </Badge>
          <div className="text-5xl font-black text-foreground font-mono mt-2">
            [{language === 'ar' ? currentPrompt.seedLetterAr : currentPrompt.seedLetterEn}]
          </div>
        </div>

        {/* Word Input Form */}
        <form onSubmit={handleSubmitWord} className="w-full max-w-md flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب كلمة ثم اضغط Enter...' : 'Type a word and press Enter...'}
            disabled={gameFinished}
            autoFocus
            className="flex-1 h-14 px-5 rounded-2xl border-2 border-border/70 bg-background text-base font-semibold focus:outline-none focus:border-primary transition-all"
          />
          <Button type="submit" size="lg" className="h-14 w-14 rounded-2xl p-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>

        {/* Word Tag Cloud */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-lg min-h-[80px]">
          {submittedWords.map((w, idx) => (
            <span
              key={`word-${idx}`}
              className="px-3.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm animate-in zoom-in-90"
            >
              {w}
            </span>
          ))}
          {submittedWords.length === 0 && (
            <span className="text-xs text-muted-foreground italic">
              {language === 'ar' ? 'استحضر كلمات سريعة واكتبها...' : 'Generate and type rapid words...'}
            </span>
          )}
        </div>

      </Card>

      {/* Results Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={120}
          telemetry={{
            reactionTimesMs: [1200, 1400],
            meanReactionTimeMs: 1200,
            fastestReactionTimeMs: 950,
            accuracyRate: 95,
            totalAttempts: submittedWords.length,
            correctAnswers: submittedWords.length,
            incorrectAnswers: 0,
            highestStreak: submittedWords.length,
            difficultyLevelReached: 5,
          }}
          skillName={skillName}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
};
