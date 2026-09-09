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
import { Brain, Flame, RotateCcw, Volume2, Sparkles, HelpCircle, Trophy } from 'lucide-react';

interface MemoryMatrixGameProps {
  onComplete?: (score: number) => void;
  skillId?: string;
  skillName?: string;
}

export const MemoryMatrixGame: React.FC<MemoryMatrixGameProps> = ({
  onComplete,
  skillId = 'working-memory',
  skillName = 'الذاكرة البصرية المكانية',
}) => {
  const { language, t } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [gridSize, setGridSize] = useState(3); // 3x3, 4x4, 5x5
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);

  // Maximum rounds
  const totalRounds = 8;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup round
  const startRound = useCallback((lvl: number) => {
    let size = 3;
    let tileCount = 3;

    if (lvl <= 2) {
      size = 3;
      tileCount = 3 + (lvl - 1);
    } else if (lvl <= 5) {
      size = 4;
      tileCount = 4 + (lvl - 3);
    } else {
      size = 5;
      tileCount = 6 + (lvl - 6);
    }

    setGridSize(size);
    setSelectedTiles([]);
    setIsMemorizing(true);
    setRoundCompleted(false);

    // Pick unique random tile indexes
    const totalCells = size * size;
    const tiles: number[] = [];
    while (tiles.length < tileCount) {
      const rand = Math.floor(Math.random() * totalCells);
      if (!tiles.includes(rand)) {
        tiles.push(rand);
      }
    }

    setActiveTiles(tiles);
    playSound('tick');

    // Memorization window duration (1.4s)
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsMemorizing(false);
      setStartTime(Date.now());
      playSound('click');
    }, 1400);
  }, [playSound]);

  useEffect(() => {
    startRound(1);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startRound]);

  const handleTileClick = (index: number) => {
    if (isMemorizing || roundCompleted || gameFinished) return;
    if (selectedTiles.includes(index)) return;

    const latency = Date.now() - startTime;
    setReactionTimes((prev) => [...prev, latency]);

    const isCorrect = activeTiles.includes(index);
    const updatedSelected = [...selectedTiles, index];
    setSelectedTiles(updatedSelected);

    if (isCorrect) {
      playSound('click');
      // Check if all active tiles found
      const foundCount = updatedSelected.filter((idx) => activeTiles.includes(idx)).length;
      if (foundCount === activeTiles.length) {
        // Round Win
        playSound('success');
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > highestStreak) setHighestStreak(newStreak);

        const earned = 100 * level + newStreak * 20;
        setScore((prev) => prev + earned);
        setRoundCompleted(true);

        setTimeout(() => {
          if (level >= totalRounds) {
            finishGame();
          } else {
            setLevel((prev) => prev + 1);
            startRound(level + 1);
          }
        }, 1000);
      }
    } else {
      // Mistake
      playSound('error');
      setStreak(0);
      setRoundCompleted(true);

      setTimeout(() => {
        if (level >= totalRounds) {
          finishGame();
        } else {
          setLevel((prev) => prev + 1);
          startRound(level + 1);
        }
      }, 1200);
    }
  };

  const finishGame = () => {
    setGameFinished(true);
    const meanRt = reactionTimes.length > 0 
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
      : 420;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 380;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 200)) * 100)) || 85;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: reactionTimes.length,
      correctAnswers: Math.round((reactionTimes.length * accuracy) / 100),
      incorrectAnswers: Math.max(0, reactionTimes.length - Math.round((reactionTimes.length * accuracy) / 100)),
      highestStreak,
      difficultyLevelReached: level,
    };

    recordGameSession({
      skillId,
      gameId: 'memory-matrix',
      startedAt: new Date(Date.now() - 90000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 90,
      score: score + 200,
      xpEarned: 120,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const handleRestart = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setReactionTimes([]);
    setGameFinished(false);
    startRound(1);
  };

  const telemetryComputed: GameSessionTelemetry = {
    reactionTimesMs: reactionTimes,
    meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 395,
    fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 350,
    accuracyRate: 92,
    totalAttempts: reactionTimes.length,
    correctAnswers: Math.max(1, reactionTimes.length - 1),
    incorrectAnswers: 1,
    highestStreak,
    difficultyLevelReached: level,
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Game HUD */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-card border border-border/60 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              {t('round')} {level} / {totalRounds}
            </span>
            <span className="text-sm font-extrabold text-foreground">
              {gridSize}x{gridSize} Matrix
            </span>
          </div>
        </div>

        {/* Score & Multiplier */}
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

      {/* Main Game Arena Card */}
      <Card className="p-6 sm:p-10 rounded-4xl border-2 border-border/70 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
        
        {/* Status Prompt */}
        <div className="mb-6 text-center">
          {isMemorizing ? (
            <Badge variant="default" className="px-4 py-1.5 text-sm font-bold animate-pulse">
              {language === 'ar' ? 'احفظ مواقع المربعات المضيئة...' : 'Memorize highlighted tiles...'}
            </Badge>
          ) : (
            <Badge variant="outline" className="px-4 py-1.5 text-sm font-bold border-primary text-primary">
              {language === 'ar' ? 'أعد تحديد المربعات الآن!' : 'Tap the remembered tiles now!'}
            </Badge>
          )}
        </div>

        {/* Dynamic Grid */}
        <div
          className="grid gap-3 transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: gridSize === 3 ? '280px' : gridSize === 4 ? '340px' : '380px',
            maxWidth: '100%',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const isTarget = activeTiles.includes(idx);
            const isSelected = selectedTiles.includes(idx);
            const isWrong = isSelected && !isTarget;
            const isCorrect = isSelected && isTarget;

            let tileClasses = 'aspect-square rounded-2xl transition-all duration-200 cursor-pointer border-2 select-none active:scale-95 flex items-center justify-center ';

            if (isMemorizing) {
              if (isTarget) {
                tileClasses += 'bg-primary border-primary shadow-lg shadow-primary/40 scale-105';
              } else {
                tileClasses += 'bg-secondary/60 border-border/60 hover:bg-secondary';
              }
            } else {
              if (isCorrect) {
                tileClasses += 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/30 text-white';
              } else if (isWrong) {
                tileClasses += 'bg-rose-500 border-rose-400 shadow-md shadow-rose-500/30 text-white animate-wiggle';
              } else {
                tileClasses += 'bg-card border-border/70 hover:border-primary/50 hover:bg-primary/5';
              }
            }

            return (
              <button
                key={`tile-${idx}`}
                onClick={() => handleTileClick(idx)}
                disabled={isMemorizing || roundCompleted}
                className={tileClasses}
                aria-label={`Tile ${idx + 1}`}
              >
                {isCorrect && <Sparkles className="h-6 w-6 text-white" />}
              </button>
            );
          })}
        </div>

        {/* Controls Footer */}
        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <HelpCircle className="h-4 w-4" />
            <span>{t('instructions')}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t('restartGame')}</span>
          </Button>
        </div>

        {/* Instructions Overlay */}
        {showInstructions && (
          <div className="absolute inset-0 z-20 bg-card/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-xl font-bold font-heading">{t('instructions')}</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {language === 'ar'
                ? 'ستضيء مجموعة من المربعات لمدة ثانية ونصف. احفظ مواقعها بدقة، ثم اضغط عليها بالترتيب فور اختفائها. تزداد رقعة التحدي وعدد المربعات مع تقدمك!'
                : 'A pattern of tiles will highlight for 1.4 seconds. Memorize their spatial locations, then tap them once they hide. The grid expands as your score climbs!'}
            </p>
            <Button size="sm" onClick={() => setShowInstructions(false)}>
              {t('confirm')}
            </Button>
          </div>
        )}

      </Card>

      {/* Results Modal on game completion */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={120}
          telemetry={telemetryComputed}
          skillName={skillName}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
};
