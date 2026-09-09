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
  Brain,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface CardItem {
  id: number;
  pairKey: string;
  icon: string;
  labelAr: string;
  labelEn: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = [
  { pairKey: 'hippocampus', icon: '🧠', labelAr: 'الحصين', labelEn: 'Hippocampus' },
  { pairKey: 'synapse', icon: '⚡', labelAr: 'المشبك العصبي', labelEn: 'Synapse' },
  { pairKey: 'neuron', icon: '✨', labelAr: 'الخلية العصبية', labelEn: 'Neuron' },
  { pairKey: 'cortex', icon: '🛡️', labelAr: 'القشرة الجبهية', labelEn: 'Prefrontal' },
  { pairKey: 'focus', icon: '🎯', labelAr: 'بؤرة التركيز', labelEn: 'Focus Beacon' },
  { pairKey: 'speed', icon: '⏱️', labelAr: 'زمن الرجع', labelEn: 'Chrono Speed' },
];

export const MatchingPairsGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'visuospatial-memory',
  skillName = 'مطابقة الأزواج البصرية المكانية',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastMoveTime, setLastMoveTime] = useState<number>(Date.now());

  const initDeck = () => {
    const deck: CardItem[] = [];
    let counter = 0;
    SYMBOLS.forEach((sym) => {
      // 2 cards per symbol
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: counter++,
          pairKey: sym.pairKey,
          icon: sym.icon,
          labelAr: sym.labelAr,
          labelEn: sym.labelEn,
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setGameFinished(false);
    setReactionTimes([]);
    setLastMoveTime(Date.now());
  };

  useEffect(() => {
    initDeck();
  }, []);

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    playSound('click');
    const now = Date.now();
    const rt = now - lastMoveTime;
    setLastMoveTime(now);
    setReactionTimes((prev) => [...prev, rt]);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [idx1, idx2] = newSelected;
      const card1 = newCards[idx1];
      const card2 = newCards[idx2];

      if (card1.pairKey === card2.pairKey) {
        // MATCH!
        playSound('success');
        card1.isMatched = true;
        card2.isMatched = true;
        setCards(newCards);
        setSelectedCards([]);

        setScore((s) => s + 150 + streak * 30);
        setStreak((st) => {
          const next = st + 1;
          if (next > highestStreak) setHighestStreak(next);
          if (next >= 3) playSound('combo');
          return next;
        });

        // Check if all matched
        if (newCards.every((c) => c.isMatched)) {
          setTimeout(() => finishGame(moves + 1), 600);
        }
      } else {
        // MISMATCH
        playSound('error');
        setStreak(0);
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          setCards([...newCards]);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const finishGame = (totalMoves: number) => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 650;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 480;
    const accuracy = Math.min(100, Math.round((SYMBOLS.length / totalMoves) * 100)) || 80;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: totalMoves,
      correctAnswers: SYMBOLS.length,
      incorrectAnswers: Math.max(0, totalMoves - SYMBOLS.length),
      highestStreak,
      difficultyLevelReached: 3,
    };

    recordGameSession({
      skillId,
      gameId: 'matching',
      startedAt: new Date(Date.now() - 75000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 75,
      score: score + 200,
      xpEarned: 130,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Game HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'مطابقة البطاقات الإدراكية' : 'Cognitive Pairs Match'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {isRtl ? `الحركات: ${moves}` : `Moves: ${moves}`} • {cards.filter((c) => c.isMatched).length / 2} / {SYMBOLS.length} Pairs
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

      {/* 4x3 Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => {
          const isFlipped = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`h-28 sm:h-32 rounded-3xl border-2 transition-all duration-300 transform perspective-1000 flex flex-col items-center justify-center p-2 select-none ${
                card.isMatched
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-600 scale-98 shadow-md'
                  : isFlipped
                  ? 'border-primary bg-card shadow-lg ring-2 ring-primary/20 scale-102'
                  : 'border-border/70 bg-gradient-to-br from-card to-accent/30 hover:border-primary/50 hover:scale-102'
              }`}
            >
              {isFlipped ? (
                <div className="text-center animate-in zoom-in-75 duration-200">
                  <span className="text-3xl sm:text-4xl block mb-1">{card.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-foreground line-clamp-1">
                    {isRtl ? card.labelAr : card.labelEn}
                  </span>
                </div>
              ) : (
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary/60">
                  <HelpCircle className="h-5 w-5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={130}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 620,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 450,
            accuracyRate: Math.min(100, Math.round((SYMBOLS.length / Math.max(1, moves)) * 100)),
            totalAttempts: moves,
            correctAnswers: SYMBOLS.length,
            incorrectAnswers: Math.max(0, moves - SYMBOLS.length),
            highestStreak,
            difficultyLevelReached: 3,
          }}
          skillName={skillName}
          onRestart={initDeck}
        />
      )}
    </div>
  );
};
