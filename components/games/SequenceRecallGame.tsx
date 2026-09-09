'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostGameResultsModal } from '@/components/games/PostGameResultsModal';
import { GameSessionTelemetry } from '@/types/cognitive';
import {
  RotateCw,
  Flame,
  RotateCcw,
  Sparkles,
  Play,
  Brain,
  CheckCircle2,
} from 'lucide-react';

const PADS = [
  { id: 0, color: 'bg-rose-500', activeColor: 'bg-rose-400 ring-4 ring-rose-300 shadow-rose-500/50', freq: 261.63, label: 'A' },
  { id: 1, color: 'bg-blue-500', activeColor: 'bg-blue-400 ring-4 ring-blue-300 shadow-blue-500/50', freq: 329.63, label: 'B' },
  { id: 2, color: 'bg-amber-500', activeColor: 'bg-amber-400 ring-4 ring-amber-300 shadow-amber-500/50', freq: 392.00, label: 'C' },
  { id: 3, color: 'bg-emerald-500', activeColor: 'bg-emerald-400 ring-4 ring-emerald-300 shadow-emerald-500/50', freq: 523.25, label: 'D' },
];

export const SequenceRecallGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'sequential-working-memory-span',
  skillName = 'تسلسل الذاكرة المتتابعة',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState<number>(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const maxLevel = 6;
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPadTone = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Safe fallback
    }
  };

  const playSequence = (seq: number[]) => {
    setIsShowingSequence(true);
    setPlayerStep(0);

    seq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        playPadTone(PADS[padId].freq);
        setTimeout(() => setActivePad(null), 350);

        if (index === seq.length - 1) {
          setTimeout(() => {
            setIsShowingSequence(false);
            setStepStartTime(Date.now());
          }, 450);
        }
      }, index * 600 + 400);
    });
  };

  const startNextLevel = (lvl: number, currentSeq: number[]) => {
    const nextItem = Math.floor(Math.random() * 4);
    const newSeq = [...currentSeq, nextItem];
    setSequence(newSeq);
    setLevel(lvl);
    playSequence(newSeq);
  };

  useEffect(() => {
    // Start with 3-step sequence
    const initial = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
    ];
    setSequence(initial);
    setLevel(1);
    playSequence(initial);
  }, []);

  const handlePadClick = (padId: number) => {
    if (isShowingSequence || gameFinished) return;

    const rt = Date.now() - stepStartTime;
    setStepStartTime(Date.now());
    setReactionTimes((prev) => [...prev, rt]);

    // Animate pad press
    setActivePad(padId);
    playPadTone(PADS[padId].freq);
    setTimeout(() => setActivePad(null), 250);

    // Verify step
    if (padId === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      // Successfully finished current sequence!
      if (nextStep === sequence.length) {
        playSound('success');
        const earned = sequence.length * 75 + streak * 20;
        setScore((s) => s + earned);
        setStreak((st) => {
          const next = st + 1;
          if (next > highestStreak) setHighestStreak(next);
          if (next >= 3) playSound('combo');
          return next;
        });

        if (level >= maxLevel) {
          setTimeout(() => finishGame(), 700);
        } else {
          setTimeout(() => {
            startNextLevel(level + 1, sequence);
          }, 900);
        }
      }
    } else {
      // Sequence Broken
      playSound('error');
      setStreak(0);
      setTimeout(() => {
        // Replay current sequence
        playSequence(sequence);
      }, 800);
    }
  };

  const finishGame = () => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 460;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 340;
    const accuracy = Math.min(100, Math.round((level / maxLevel) * 100)) || 85;

    const telemetry: GameSessionTelemetry = {
      reactionTimesMs: reactionTimes,
      meanReactionTimeMs: meanRt,
      fastestReactionTimeMs: fastestRt,
      accuracyRate: accuracy,
      totalAttempts: reactionTimes.length,
      correctAnswers: sequence.length * maxLevel,
      incorrectAnswers: Math.max(0, reactionTimes.length - sequence.length),
      highestStreak,
      difficultyLevelReached: level,
    };

    recordGameSession({
      skillId,
      gameId: 'sequence-game',
      startedAt: new Date(Date.now() - 70000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 70,
      score: score + 220,
      xpEarned: 135,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Game HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <RotateCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'تسلسل الذاكرة المتتابعة' : 'Sequential Simon Memory'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Span Length: {sequence.length} • Level {level} / {maxLevel}
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

      {/* 2x2 Simon Memory Arena */}
      <Card className="p-8 sm:p-10 rounded-4xl border border-border/80 bg-card/90 shadow-2xl text-center space-y-6">
        <div>
          <span className="text-xs text-muted-foreground font-bold block mb-1">
            {isShowingSequence
              ? (isRtl ? 'انتبه وركّز في تسلسل الومضات والنغمات...' : 'Watch and listen to the sequence...')
              : (isRtl ? `دورك الآن: أعد النقر على نفس التسلسل (${playerStep}/${sequence.length})` : `Your turn: Replay the sequence (${playerStep}/${sequence.length})`)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;

            return (
              <button
                key={pad.id}
                disabled={isShowingSequence}
                onClick={() => handlePadClick(pad.id)}
                className={`h-32 sm:h-36 rounded-3xl transition-all duration-200 transform shadow-xl flex items-center justify-center font-black text-2xl text-white ${
                  isActive
                    ? `${pad.activeColor} scale-105 filter brightness-125`
                    : `${pad.color} opacity-80 hover:opacity-100 hover:scale-102 active:scale-95`
                }`}
              >
                {pad.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={135}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 460,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 340,
            accuracyRate: Math.min(100, Math.round((level / maxLevel) * 100)),
            totalAttempts: reactionTimes.length,
            correctAnswers: sequence.length * maxLevel,
            incorrectAnswers: 0,
            highestStreak,
            difficultyLevelReached: level,
          }}
          skillName={skillName}
          onRestart={() => {
            setScore(0);
            setStreak(0);
            setHighestStreak(0);
            setLevel(1);
            setReactionTimes([]);
            setGameFinished(false);
            const initial = [
              Math.floor(Math.random() * 4),
              Math.floor(Math.random() * 4),
              Math.floor(Math.random() * 4),
            ];
            setSequence(initial);
            playSequence(initial);
          }}
        />
      )}
    </div>
  );
};
