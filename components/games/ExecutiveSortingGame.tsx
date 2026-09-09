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
  Shuffle,
  Flame,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

type SortRule = 'color' | 'shape' | 'number';

interface CardItem {
  color: 'red' | 'blue' | 'green';
  shape: 'circle' | 'triangle' | 'square';
  number: 1 | 2 | 3;
}

const TARGET_BINS: CardItem[] = [
  { color: 'red', shape: 'circle', number: 1 },
  { color: 'blue', shape: 'triangle', number: 2 },
  { color: 'green', shape: 'square', number: 3 },
];

export const ExecutiveSortingGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'cognitive-flexibility-set-shifting',
  skillName = 'التصنيف التنفيذي وتحول القواعد',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [activeRule, setActiveRule] = useState<SortRule>('color');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [currentCard, setCurrentCard] = useState<CardItem>({ color: 'red', shape: 'triangle', number: 2 });
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());

  const generateCard = (): CardItem => {
    const colors: ('red' | 'blue' | 'green')[] = ['red', 'blue', 'green'];
    const shapes: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square'];
    const numbers: (1 | 2 | 3)[] = [1, 2, 3];
    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
    };
  };

  useEffect(() => {
    setCurrentCard(generateCard());
    setRoundStartTime(Date.now());
  }, []);

  const handleBinSelect = (bin: CardItem) => {
    if (feedback) return;

    const rt = Date.now() - roundStartTime;
    setReactionTimes((prev) => [...prev, rt]);

    let isCorrect = false;
    if (activeRule === 'color') isCorrect = currentCard.color === bin.color;
    else if (activeRule === 'shape') isCorrect = currentCard.shape === bin.shape;
    else if (activeRule === 'number') isCorrect = currentCard.number === bin.number;

    if (isCorrect) {
      playSound('success');
      setFeedback('correct');
      const earned = Math.max(100, 300 - Math.round(rt / 15)) + streak * 25;
      setScore((s) => s + earned);
      setStreak((st) => {
        const next = st + 1;
        if (next > highestStreak) setHighestStreak(next);
        if (next >= 3) playSound('combo');
        return next;
      });

      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);

      // Shift sorting rule every 4 consecutive correct answers!
      if (nextConsecutive >= 4) {
        const rules: SortRule[] = ['color', 'shape', 'number'];
        const otherRules = rules.filter((r) => r !== activeRule);
        const newRule = otherRules[Math.floor(Math.random() * otherRules.length)];
        setActiveRule(newRule);
        setConsecutiveCorrect(0);
        playSound('pop');
      }
    } else {
      playSound('error');
      setFeedback('wrong');
      setStreak(0);
      setConsecutiveCorrect(0);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        finishGame();
      } else {
        setRound((r) => r + 1);
        setCurrentCard(generateCard());
        setFeedback(null);
        setRoundStartTime(Date.now());
      }
    }, 700);
  };

  const finishGame = () => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 580;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 410;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 250)) * 100)) || 80;

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
      gameId: 'sorting',
      startedAt: new Date(Date.now() - 60000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 60,
      score: score + 180,
      xpEarned: 125,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  const renderShapeGlyphs = (item: CardItem) => {
    const colorClasses = {
      red: 'text-rose-500 fill-rose-500',
      blue: 'text-blue-500 fill-blue-500',
      green: 'text-emerald-500 fill-emerald-500',
    }[item.color];

    return (
      <div className="flex items-center justify-center gap-2">
        {[...Array(item.number)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {item.shape === 'circle' && (
              <div className={`h-8 w-8 rounded-full ${item.color === 'red' ? 'bg-rose-500' : item.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-md`} />
            )}
            {item.shape === 'triangle' && (
              <div className={`w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] ${item.color === 'red' ? 'border-b-rose-500' : item.color === 'blue' ? 'border-b-blue-500' : 'border-b-emerald-500'} filter drop-shadow-md`} />
            )}
            {item.shape === 'square' && (
              <div className={`h-8 w-8 rounded-xl ${item.color === 'red' ? 'bg-rose-500' : item.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-md`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* HUD Header */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Shuffle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'اختبار ويسكونسن للتصنيف التنفيذي' : 'Executive Rule Sorting'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Round {round} / {totalRounds} • Rule shifts dynamically!
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

      {/* Target Reference Bins */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {TARGET_BINS.map((bin, index) => (
          <button
            key={index}
            onClick={() => handleBinSelect(bin)}
            className="h-32 sm:h-36 rounded-3xl border-2 border-border/70 bg-card/90 hover:border-primary hover:scale-102 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-3 shadow-md"
          >
            <span className="text-[10px] font-bold text-muted-foreground font-mono">
              Bin #{index + 1}
            </span>
            {renderShapeGlyphs(bin)}
          </button>
        ))}
      </div>

      {/* Active Stimulus Card */}
      <Card
        className={`p-8 sm:p-10 rounded-4xl border-2 text-center transition-all duration-300 shadow-2xl ${
          feedback === 'correct'
            ? 'border-emerald-500 bg-emerald-500/15 animate-bounce'
            : feedback === 'wrong'
            ? 'border-rose-500 bg-rose-500/15 animate-shake'
            : 'border-primary/40 bg-card'
        }`}
      >
        <span className="text-xs text-muted-foreground font-bold block mb-4">
          {isRtl ? 'اختر السلة المتطابقة مع القاعدة المخفية الحالية:' : 'Match the card to the current hidden sorting rule:'}
        </span>
        <div className="py-6 flex items-center justify-center">
          {renderShapeGlyphs(currentCard)}
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">
          {isRtl ? 'استنتج القاعدة (اللون، الشكل، أو العدد) من التغذية الراجعة' : 'Deduce the rule (Color, Shape, or Count) via trial & feedback'}
        </span>
      </Card>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={125}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 580,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 410,
            accuracyRate: Math.min(100, Math.round((score / (totalRounds * 250)) * 100)) || 80,
            totalAttempts: totalRounds,
            correctAnswers: Math.round(totalRounds * 0.8),
            incorrectAnswers: Math.round(totalRounds * 0.2),
            highestStreak,
            difficultyLevelReached: 3,
          }}
          skillName={skillName}
          onRestart={() => {
            setScore(0);
            setStreak(0);
            setHighestStreak(0);
            setRound(1);
            setGameFinished(false);
            setReactionTimes([]);
            setCurrentCard(generateCard());
          }}
        />
      )}
    </div>
  );
};
