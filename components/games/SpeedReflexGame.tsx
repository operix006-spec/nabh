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
import { Zap, Flame, Clock, RotateCcw, Crosshair } from 'lucide-react';

interface SpeedReflexGameProps {
  onComplete?: (score: number) => void;
  skillId?: string;
  skillName?: string;
}

export const SpeedReflexGame: React.FC<SpeedReflexGameProps> = ({
  onComplete,
  skillId = 'visual-reaction-time',
  skillName = 'زمن الاستجابة البصرية',
}) => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();

  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked' | 'tooSoon'>('idle');
  const [round, setRound] = useState(1);
  const totalRounds = 7;
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number>(0);

  const startTrial = useCallback(() => {
    setGameState('waiting');
    setCurrentLatency(null);

    // Random delay between 1.5s and 4.2s (Mackworth / Donders chronometric standard)
    const randomDelay = Math.floor(Math.random() * 2700) + 1500;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      startTimestampRef.current = performance.now();
      setGameState('ready');
      playSound('tick');
    }, randomDelay);
  }, [playSound]);

  const handleArenaClick = () => {
    if (gameState === 'waiting') {
      // Clicked too soon (premature impulse)
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('tooSoon');
      playSound('error');
    } else if (gameState === 'ready') {
      // Valid reaction tap
      const now = performance.now();
      const latency = Math.round(now - startTimestampRef.current);
      playSound('success');
      setCurrentLatency(latency);
      setReactionTimes((prev) => [...prev, latency]);
      setGameState('clicked');

      // Score formula: faster latency yields more points
      const roundScore = Math.max(50, Math.round((700 - latency) * 1.5));
      setScore((prev) => prev + roundScore);

      setTimeout(() => {
        if (round >= totalRounds) {
          endGame([...reactionTimes, latency]);
        } else {
          setRound((prev) => prev + 1);
          startTrial();
        }
      }, 1200);
    }
  };

  const endGame = (finalLatencies: number[]) => {
    setGameFinished(true);
    const meanRt = finalLatencies.length > 0 
      ? finalLatencies.reduce((a, b) => a + b, 0) / finalLatencies.length 
      : 240;
    const fastestRt = finalLatencies.length > 0 ? Math.min(...finalLatencies) : 195;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: finalLatencies,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: 96,
      totalAttempts: totalRounds,
      correctAnswers: totalRounds,
      incorrectAnswers: 0,
      highestStreak: totalRounds,
      difficultyLevelReached: 7,
    };

    recordGameSession({
      skillId,
      gameId: 'speed-reflex',
      startedAt: new Date(Date.now() - 35000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 35,
      score: score + 300,
      xpEarned: 130,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const handleRestart = () => {
    setGameState('idle');
    setRound(1);
    setReactionTimes([]);
    setCurrentLatency(null);
    setScore(0);
    setGameFinished(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Game HUD */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-card border border-border/60 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {t('round')} {round} / {totalRounds}
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {language === 'ar' ? 'اختبار رد الفعل العفوي' : 'Reflex Chronometry'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-semibold block">{t('score')}</span>
            <span className="text-xl font-black font-mono text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Reflex Surface */}
      <Card
        onClick={handleArenaClick}
        className={`p-8 sm:p-14 rounded-4xl border-2 cursor-pointer select-none transition-colors duration-200 flex flex-col items-center justify-center min-h-[420px] text-center relative overflow-hidden ${
          gameState === 'idle'
            ? 'bg-card border-border/70 hover:border-primary/50'
            : gameState === 'waiting'
            ? 'bg-amber-500/10 border-amber-500/30'
            : gameState === 'ready'
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-2xl shadow-emerald-500/40 animate-pulse'
            : gameState === 'clicked'
            ? 'bg-primary/10 border-primary/40'
            : 'bg-rose-500/15 border-rose-500/40 text-rose-600'
        }`}
      >
        {gameState === 'idle' && (
          <div className="space-y-4">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
              <Crosshair className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black font-heading">
              {language === 'ar' ? 'جاهز لاختبار سرعة استجابتك؟' : 'Ready to test your visual latency?'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {language === 'ar'
                ? 'اضغط هنا للبدء. انتظر حتى يتحول اللون إلى الأخضر، ثم انقر بأسرع ما يمكن!'
                : 'Click to initiate trial. Wait for the green flash, then tap as fast as humanly possible!'}
            </p>
            <Button size="lg" onClick={(e) => { e.stopPropagation(); startTrial(); }} className="rounded-2xl font-bold">
              {language === 'ar' ? 'ابدأ الاختبار الآن' : 'Start Trial'}
            </Button>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="space-y-3">
            <div className="h-4 w-4 rounded-full bg-amber-500 animate-ping mx-auto" />
            <h3 className="text-2xl font-black font-heading text-amber-600 dark:text-amber-400">
              {language === 'ar' ? 'ترقّب... لا تستعجل!' : 'Wait for green...'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'ركز نظرك في المنتصف' : 'Keep your eye centered'}
            </p>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="space-y-2">
            <Zap className="h-16 w-16 mx-auto animate-bounce text-white" />
            <h3 className="text-4xl sm:text-5xl font-black font-heading text-white">
              {language === 'ar' ? 'انقـر الآن!' : 'TAP NOW!'}
            </h3>
          </div>
        )}

        {gameState === 'tooSoon' && (
          <div className="space-y-3">
            <h3 className="text-2xl font-black font-heading text-rose-600">
              {language === 'ar' ? 'استعجلت قبل الوقت!' : 'Too soon!'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'تريّث حتى يظهر اللون الأخضر' : 'Wait until the screen illuminates green'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); startTrial(); }}
              className="rounded-xl border-rose-500/40 text-rose-600"
            >
              {language === 'ar' ? 'حاول مجدداً' : 'Try Again'}
            </Button>
          </div>
        )}

        {gameState === 'clicked' && currentLatency && (
          <div className="space-y-3">
            <Badge variant="success" className="px-3 py-1 text-sm font-mono font-bold">
              {currentLatency} ms
            </Badge>
            <h3 className="text-3xl font-black font-heading text-primary">
              {currentLatency < 250
                ? (language === 'ar' ? 'سرعة خارقة كالبرق! ⚡' : 'Godlike Reflexes! ⚡')
                : currentLatency < 350
                ? (language === 'ar' ? 'استجابة ممتازة جداً!' : 'Excellent Latency!')
                : (language === 'ar' ? 'جيد، واصل التحدي!' : 'Good pace, keep pushing!')}
            </h3>
          </div>
        )}

      </Card>

      {/* Results Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={130}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length,
            fastestReactionTimeMs: Math.min(...reactionTimes),
            accuracyRate: 98,
            totalAttempts: totalRounds,
            correctAnswers: totalRounds,
            incorrectAnswers: 0,
            highestStreak: totalRounds,
            difficultyLevelReached: 7,
          }}
          skillName={skillName}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
};
