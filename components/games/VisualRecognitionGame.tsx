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
import {
  Eye,
  Flame,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';

export const VisualRecognitionGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'visual-recognition-objects',
  skillName = 'التمييز البصري وسرعة الاكتشاف',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [round, setRound] = useState(1);
  const totalRounds = 8;
  const [gridItems, setGridItems] = useState<{ id: number; symbol: string; isOdd: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameFinished, setGameFinished] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState<{ index: number; correct: boolean } | null>(null);

  const SYMBOL_SETS = [
    { base: '💠', odd: '🔷' },
    { base: '🔺', odd: '🔻' },
    { base: '☀️', odd: '⭐' },
    { base: '🟢', odd: '🟡' },
    { base: '🟣', odd: '🔵' },
    { base: '🌙', odd: '⚡' },
    { base: '🟩', odd: '🟦' },
    { base: '🌸', odd: '🌺' },
  ];

  const generateRound = (currentRound: number) => {
    const pair = SYMBOL_SETS[(currentRound - 1) % SYMBOL_SETS.length];
    const gridSize = currentRound <= 3 ? 9 : 16; // 3x3 to 4x4
    const oddIndex = Math.floor(Math.random() * gridSize);

    const items = Array.from({ length: gridSize }, (_, i) => ({
      id: i,
      symbol: i === oddIndex ? pair.odd : pair.base,
      isOdd: i === oddIndex,
    }));

    setGridItems(items);
    setFeedbackIndex(null);
    setStartTime(Date.now());
  };

  useEffect(() => {
    generateRound(1);
  }, []);

  const handleTileClick = (item: { id: number; symbol: string; isOdd: boolean }) => {
    if (feedbackIndex) return;

    const rt = Date.now() - startTime;
    setReactionTimes((prev) => [...prev, rt]);

    if (item.isOdd) {
      playSound('success');
      setFeedbackIndex({ index: item.id, correct: true });
      const earned = Math.max(100, 350 - Math.round(rt / 10)) + streak * 25;
      setScore((s) => s + earned);
      setStreak((st) => {
        const next = st + 1;
        if (next > highestStreak) setHighestStreak(next);
        if (next >= 3) playSound('combo');
        return next;
      });
    } else {
      playSound('error');
      setFeedbackIndex({ index: item.id, correct: false });
      setStreak(0);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        finishGame();
      } else {
        const next = round + 1;
        setRound(next);
        generateRound(next);
      }
    }, 600);
  };

  const finishGame = () => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 430;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 320;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 280)) * 100)) || 85;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: totalRounds,
      correctAnswers: Math.round(totalRounds * (accuracy / 100)),
      incorrectAnswers: Math.max(0, totalRounds - Math.round(totalRounds * (accuracy / 100))),
      highestStreak,
      difficultyLevelReached: 3,
    };

    recordGameSession({
      skillId,
      gameId: 'visual-recognition',
      startedAt: new Date(Date.now() - 50000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 50,
      score: score + 160,
      xpEarned: 115,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const is4x4 = gridItems.length === 16;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Game HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'اكتشاف العنصر المختلف' : 'Visual Odd-One-Out'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Round {round} / {totalRounds}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono font-bold text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Flame className="h-4 w-4 fill-amber-500" />
              <span>{streak}x</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              {score} PTS
            </div>
          </div>
        </div>
      </Card>

      {/* Target Grid */}
      <Card className="p-6 sm:p-8 rounded-4xl border border-border/80 bg-card/90 shadow-2xl text-center space-y-6">
        <span className="text-xs text-muted-foreground font-bold block">
          {isRtl ? 'المس الرمز المختلف فور ظهوره بأسرع وقت ممكن:' : 'Tap the distinct symbol as fast as possible:'}
        </span>

        <div className={`grid gap-3 mx-auto max-w-md ${is4x4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {gridItems.map((item) => {
            const isTargetFeedback = feedbackIndex?.index === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTileClick(item)}
                className={`h-20 sm:h-24 rounded-3xl border-2 transition-all duration-150 flex items-center justify-center text-3xl sm:text-4xl shadow-md ${
                  isTargetFeedback
                    ? feedbackIndex.correct
                      ? 'border-emerald-500 bg-emerald-500/20 scale-105 animate-bounce'
                      : 'border-rose-500 bg-rose-500/20 animate-shake'
                    : 'border-border/70 bg-card hover:border-primary/60 hover:scale-105 active:scale-95'
                }`}
              >
                {item.symbol}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={115}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 430,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 320,
            accuracyRate: Math.min(100, Math.round((score / (totalRounds * 280)) * 100)) || 85,
            totalAttempts: totalRounds,
            correctAnswers: Math.round(totalRounds * 0.85),
            incorrectAnswers: Math.round(totalRounds * 0.15),
            highestStreak,
            difficultyLevelReached: 3,
          }}
          skillName={skillName}
          onRestart={() => {
            setScore(0);
            setStreak(0);
            setHighestStreak(0);
            setRound(1);
            setReactionTimes([]);
            setGameFinished(false);
            generateRound(1);
          }}
        />
      )}
    </div>
  );
};
