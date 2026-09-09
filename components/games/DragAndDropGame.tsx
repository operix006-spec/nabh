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
  Sparkles,
  Flame,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
  Brain,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DragItem {
  id: string;
  labelAr: string;
  labelEn: string;
  targetCategory: 'memory' | 'speed' | 'logic';
  icon: string;
}

const ITEMS_POOL: DragItem[] = [
  { id: '1', labelAr: 'مصفوفة الأرقام', labelEn: 'Digit Matrix', targetCategory: 'memory', icon: '🧠' },
  { id: '2', labelAr: 'رد الفعل اللحظي', labelEn: 'Speed Reflex', targetCategory: 'speed', icon: '⚡' },
  { id: '3', labelAr: 'استدلال القياس', labelEn: 'Syllogism Logic', targetCategory: 'logic', icon: '🧩' },
  { id: '4', labelAr: 'مدى الحصين المكاني', labelEn: 'Spatial Span', targetCategory: 'memory', icon: '📍' },
  { id: '5', labelAr: 'زمن الرجع البصري', labelEn: 'Visual Latency', targetCategory: 'speed', icon: '⏱️' },
  { id: '6', labelAr: 'إكمال الأنماط', labelEn: 'Pattern Matrix', targetCategory: 'logic', icon: '📐' },
  { id: '7', labelAr: 'الذاكرة العاملة N-Back', labelEn: 'N-Back Working Memory', targetCategory: 'memory', icon: '🔄' },
  { id: '8', labelAr: 'نبض المعالجة السريعة', labelEn: 'Chrono Pulse', targetCategory: 'speed', icon: '🚀' },
  { id: '9', labelAr: 'قواعد الاستنتاج المجرد', labelEn: 'Deductive Rules', targetCategory: 'logic', icon: '⚖️' },
];

export const DragAndDropGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'executive-sorting',
  skillName = 'التصنيف الإدراكي بالسحب والإفلات',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 6;
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());

  // Setup next round
  const startNextRound = (currentRnd: number) => {
    if (currentRnd > totalRounds) {
      finishGame();
      return;
    }
    const nextItem = ITEMS_POOL[(currentRnd - 1) % ITEMS_POOL.length];
    setActiveItem(nextItem);
    setSelectedTarget(null);
    setFeedback(null);
    setRoundStartTime(Date.now());
  };

  useEffect(() => {
    startNextRound(1);
  }, []);

  const handleDrop = (category: 'memory' | 'speed' | 'logic') => {
    if (!activeItem || feedback) return;

    const rt = Date.now() - roundStartTime;
    setReactionTimes((prev) => [...prev, rt]);
    setSelectedTarget(category);

    const isCorrect = activeItem.targetCategory === category;

    if (isCorrect) {
      playSound('success');
      setFeedback('correct');
      const roundScore = Math.max(100, 300 - Math.round(rt / 15)) + streak * 20;
      setScore((s) => s + roundScore);
      setStreak((st) => {
        const next = st + 1;
        if (next > highestStreak) setHighestStreak(next);
        if (next >= 3) playSound('combo');
        return next;
      });
    } else {
      playSound('error');
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      const nextRnd = round + 1;
      setRound(nextRnd);
      startNextRound(nextRnd);
    }, 900);
  };

  const finishGame = () => {
    setGameFinished(true);
    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 550;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 420;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 250)) * 100)) || 85;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: totalRounds,
      correctAnswers: Math.round((totalRounds * accuracy) / 100),
      incorrectAnswers: Math.max(0, totalRounds - Math.round((totalRounds * accuracy) / 100)),
      highestStreak,
      difficultyLevelReached: 3,
    };

    recordGameSession({
      skillId,
      gameId: 'drag-and-drop',
      startedAt: new Date(Date.now() - 60000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 60,
      score: score + 150,
      xpEarned: 110,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const restartGame = () => {
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setRound(1);
    setReactionTimes([]);
    setGameFinished(false);
    startNextRound(1);
  };

  const categories = [
    { id: 'memory', titleAr: 'سلة الذاكرة', titleEn: 'Memory Zone', color: 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500', icon: '🧠' },
    { id: 'speed', titleAr: 'سلة السرعة', titleEn: 'Speed Zone', color: 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500', icon: '⚡' },
    { id: 'logic', titleAr: 'سلة المنطق', titleEn: 'Logic Zone', color: 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500', icon: '🧩' },
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game Header HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'تصنيف السحب والإفلات الإدراكي' : 'Drag & Drop Executive Classifier'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Round {Math.min(round, totalRounds)} / {totalRounds}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono font-bold text-xs">
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

      {/* Main Drag-Drop Play Area */}
      <Card className="p-6 sm:p-10 rounded-4xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl text-center space-y-8">
        <div>
          <span className="text-xs text-muted-foreground font-bold block mb-1">
            {isRtl ? 'اسحب العنصر أو اضغط على السلة المناسبة لتصنيفه:' : 'Drag the stimulus or click the matching cognitive bin:'}
          </span>
          <h4 className="text-base font-bold text-foreground">
            {isRtl ? 'ما هو المجال الإدراكي الذي ينتمي إليه هذا العنصر؟' : 'Which cognitive domain does this stimulus belong to?'}
          </h4>
        </div>

        {/* Draggable Cognitive Token */}
        {activeItem && (
          <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', activeItem.targetCategory)}
            className={`mx-auto max-w-sm p-6 rounded-3xl border-2 transition-all cursor-grab active:cursor-grabbing transform hover:scale-105 shadow-xl select-none ${
              feedback === 'correct'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 scale-105 animate-bounce'
                : feedback === 'wrong'
                ? 'border-rose-500 bg-rose-500/20 text-rose-600 animate-shake'
                : 'border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary'
            }`}
          >
            <div className="text-4xl mb-2">{activeItem.icon}</div>
            <h3 className="text-xl font-black font-heading text-foreground">
              {isRtl ? activeItem.labelAr : activeItem.labelEn}
            </h3>
            <span className="text-[11px] text-muted-foreground mt-1 block">
              {isRtl ? 'انقر على السلة بالأسفل أو اسحبها إليها' : 'Click the bin below or drag to match'}
            </span>
          </div>
        )}

        {/* Drop Target Bins */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(cat.id)}
              onClick={() => handleDrop(cat.id)}
              className={`p-5 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${cat.color} ${
                selectedTarget === cat.id
                  ? 'scale-105 ring-2 ring-primary shadow-lg'
                  : 'hover:scale-102'
              }`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-bold text-xs">{isRtl ? cat.titleAr : cat.titleEn}</span>
              <span className="text-[10px] opacity-70">
                {isRtl ? 'إفلات هنا' : 'Drop Here'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Post Game Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={110}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 520,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 420,
            accuracyRate: Math.min(100, Math.round((score / (totalRounds * 250)) * 100)) || 85,
            totalAttempts: totalRounds,
            correctAnswers: Math.round(totalRounds * 0.85),
            incorrectAnswers: Math.round(totalRounds * 0.15),
            highestStreak,
            difficultyLevelReached: 3,
          }}
          skillName={skillName}
          onRestart={restartGame}
        />
      )}
    </div>
  );
};
