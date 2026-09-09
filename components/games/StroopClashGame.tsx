'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostGameResultsModal } from '@/components/games/PostGameResultsModal';
import { GameSessionTelemetry } from '@/types/cognitive';
import { Target, Flame, Check, X, Clock, HelpCircle, RotateCcw } from 'lucide-react';

interface StroopClashGameProps {
  onComplete?: (score: number) => void;
  skillId?: string;
  skillName?: string;
}

const COLOR_DICTIONARY = [
  { nameAr: 'أحمر', nameEn: 'RED', hex: '#EF4444' },
  { nameAr: 'أزرق', nameEn: 'BLUE', hex: '#3B82F6' },
  { nameAr: 'أخضر', nameEn: 'GREEN', hex: '#10B981' },
  { nameAr: 'أصفر', nameEn: 'YELLOW', hex: '#F59E0B' },
  { nameAr: 'بنفسجي', nameEn: 'PURPLE', hex: '#8B5CF6' },
];

export const StroopClashGame: React.FC<StroopClashGameProps> = ({
  onComplete,
  skillId = 'stroop-interference',
  skillName = 'مقاومة تداخل ستروب',
}) => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 15;

  const [wordItem, setWordItem] = useState(COLOR_DICTIONARY[0]);
  const [inkColor, setInkColor] = useState(COLOR_DICTIONARY[1]);
  const [isMatch, setIsMatch] = useState(false);

  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateTrial = useCallback(() => {
    const matchProb = Math.random() < 0.45; // 45% matching trials
    const wordIdx = Math.floor(Math.random() * COLOR_DICTIONARY.length);
    const word = COLOR_DICTIONARY[wordIdx];

    let ink = word;
    if (!matchProb) {
      // Pick different color
      let inkIdx = Math.floor(Math.random() * COLOR_DICTIONARY.length);
      while (inkIdx === wordIdx) {
        inkIdx = Math.floor(Math.random() * COLOR_DICTIONARY.length);
      }
      ink = COLOR_DICTIONARY[inkIdx];
    }

    setWordItem(word);
    setInkColor(ink);
    setIsMatch(matchProb);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    generateTrial();
  }, [generateTrial]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameFinished) return;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleAnswer(true);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleAnswer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleAnswer = (userSaidMatch: boolean) => {
    if (gameFinished) return;

    const latency = Date.now() - startTime;
    setReactionTimes((prev) => [...prev, latency]);

    const isCorrect = userSaidMatch === isMatch;

    if (isCorrect) {
      playSound('click');
      setCorrectCount((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      // Higher score for faster latency (<500ms gets full bonus)
      const speedBonus = Math.max(0, Math.round((1000 - latency) / 10));
      setScore((prev) => prev + 80 + speedBonus + newStreak * 15);
      setLastFeedback('correct');
    } else {
      playSound('error');
      setStreak(0);
      setLastFeedback('wrong');
    }

    setTimeout(() => {
      setLastFeedback(null);
      if (round >= totalRounds) {
        endGame();
      } else {
        setRound((prev) => prev + 1);
        generateTrial();
      }
    }, 280);
  };

  const endGame = () => {
    setGameFinished(true);
    const meanRt = reactionTimes.length > 0 
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
      : 480;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 340;
    const accuracy = Math.round((correctCount / totalRounds) * 100);

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: totalRounds,
      correctAnswers: correctCount,
      incorrectAnswers: totalRounds - correctCount,
      highestStreak,
      difficultyLevelReached: 5,
    };

    recordGameSession({
      skillId,
      gameId: 'stroop-clash',
      startedAt: new Date(Date.now() - 45000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 45,
      score,
      xpEarned: 110,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setRound(1);
    setCorrectCount(0);
    setReactionTimes([]);
    setGameFinished(false);
    generateTrial();
  };

  const currentWordText = language === 'ar' ? wordItem.nameAr : wordItem.nameEn;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Game HUD */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-card border border-border/60 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {t('round')} {round} / {totalRounds}
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {language === 'ar' ? 'اختبار تضارب الألوان' : 'Color Conflict Test'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Flame className="h-4 w-4" />
            <span>{streak}x</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-semibold block">{t('score')}</span>
            <span className="text-xl font-black font-mono text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <Card className="p-8 sm:p-12 rounded-4xl border-2 border-border/70 flex flex-col items-center justify-center min-h-[420px] relative">
        
        {/* Core Prompt */}
        <p className="text-sm sm:text-base font-bold text-muted-foreground mb-8 text-center max-w-md">
          {language === 'ar'
            ? 'هل يتطابق معنى الكلمة المكتوبة مع لون الحبر الظاهر به؟'
            : 'Does the written word match the chromatic ink color it is painted with?'}
        </p>

        {/* Big Stimulus Word */}
        <div 
          className={`text-6xl sm:text-7xl font-black tracking-wider transition-transform duration-150 select-none py-6 px-8 rounded-3xl ${
            lastFeedback === 'correct' ? 'scale-110' : lastFeedback === 'wrong' ? 'animate-wiggle' : 'scale-100'
          }`}
          style={{ color: inkColor.hex }}
        >
          {currentWordText}
        </div>

        {/* Feedback Flash */}
        <div className="h-6 mt-4">
          {lastFeedback === 'correct' && (
            <Badge variant="success" className="px-3 py-0.5 text-xs font-bold">
              ✓ {language === 'ar' ? 'إجابة سريعة ودقيقة!' : 'Fast & Accurate!'}
            </Badge>
          )}
          {lastFeedback === 'wrong' && (
            <Badge variant="destructive" className="px-3 py-0.5 text-xs font-bold">
              ✕ {language === 'ar' ? 'تداخل ستروب!' : 'Stroop Conflict!'}
            </Badge>
          )}
        </div>

        {/* Choice Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(false)}
            className="h-16 rounded-2xl border-2 border-rose-500/30 hover:border-rose-500 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-base sm:text-lg gap-2"
          >
            <X className="h-6 w-6" />
            <span>{language === 'ar' ? 'غير متطابق (لا)' : 'NO / Mismatch'}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleAnswer(true)}
            className="h-16 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-base sm:text-lg gap-2"
          >
            <Check className="h-6 w-6" />
            <span>{language === 'ar' ? 'متطابق (نعم)' : 'YES / Match'}</span>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground mt-6 text-center">
          {language === 'ar'
            ? '💡 نصيحة: يمكنك استخدام الأسهم على لوحة المفاتيح (سهم يمين = نعم، سهم يسار = لا)'
            : '💡 Keyboard Shortcut: Left Arrow for No, Right Arrow for Yes'}
        </p>
      </Card>

      {/* Results Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={110}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 460,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 320,
            accuracyRate: Math.round((correctCount / totalRounds) * 100),
            totalAttempts: totalRounds,
            correctAnswers: correctCount,
            incorrectAnswers: totalRounds - correctCount,
            highestStreak,
            difficultyLevelReached: 5,
          }}
          skillName={skillName}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
};
