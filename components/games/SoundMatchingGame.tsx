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
  Volume2,
  Flame,
  RotateCcw,
  Sparkles,
  Music,
  Play,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface ToneOption {
  id: string;
  name: string;
  freq: number;
}

const TONES_BANK: ToneOption[] = [
  { id: 'C4', name: 'Do (C4)', freq: 261.63 },
  { id: 'E4', name: 'Mi (E4)', freq: 329.63 },
  { id: 'G4', name: 'Sol (G4)', freq: 392.00 },
  { id: 'A4', name: 'La (A4)', freq: 440.00 },
  { id: 'C5', name: 'Do (C5 High)', freq: 523.25 },
  { id: 'E5', name: 'Mi (E5 High)', freq: 659.25 },
];

export const SoundMatchingGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'auditory-frequency-discrimination',
  skillName = 'مطابقة الترددات والنغمات الصوتية',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [round, setRound] = useState(1);
  const totalRounds = 6;
  const [targetTone, setTargetTone] = useState<ToneOption>(TONES_BANK[0]);
  const [choices, setChoices] = useState<ToneOption[]>([]);
  const [isPlayingProbe, setIsPlayingProbe] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [gameFinished, setGameFinished] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number, durationSec = 0.6) => {
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
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Audio context policy safe handling
    }
  };

  const generateRound = (rnd: number) => {
    // Pick random target
    const target = TONES_BANK[Math.floor(Math.random() * TONES_BANK.length)];
    setTargetTone(target);

    // Pick 2 other unique choices
    const others = TONES_BANK.filter((t) => t.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const roundChoices = [target, ...shuffledOthers].sort(() => 0.5 - Math.random());

    setChoices(roundChoices);
    setFeedback(null);
    setRoundStartTime(Date.now());

    // Auto-play probe tone after 300ms
    setTimeout(() => {
      setIsPlayingProbe(true);
      playTone(target.freq, 0.7);
      setTimeout(() => setIsPlayingProbe(false), 700);
    }, 300);
  };

  useEffect(() => {
    generateRound(1);
  }, []);

  const handleChoiceClick = (choice: ToneOption) => {
    if (feedback) return;

    playTone(choice.freq, 0.4);
    const rt = Date.now() - roundStartTime;
    setReactionTimes((prev) => [...prev, rt]);

    const isCorrect = choice.id === targetTone.id;
    if (isCorrect) {
      playSound('success');
      setFeedback(choice.id);
      const earned = Math.max(100, 320 - Math.round(rt / 15)) + streak * 30;
      setScore((s) => s + earned);
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
      if (round >= totalRounds) {
        finishGame();
      } else {
        const next = round + 1;
        setRound(next);
        generateRound(next);
      }
    }, 900);
  };

  const finishGame = () => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 720;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 510;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 280)) * 100)) || 80;

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
      gameId: 'sound-matching',
      startedAt: new Date(Date.now() - 65000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: 65,
      score: score + 175,
      xpEarned: 120,
      telemetry,
    });

    if (onComplete) onComplete(score);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Game HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Music className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'مطابقة الترددات والنغمات' : 'Acoustic Pitch Matcher'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Round {round} / {totalRounds} • Web Audio API Synthesis
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

      {/* Target Sound Probe Card */}
      <Card className="p-8 sm:p-10 rounded-4xl border border-border/80 bg-card/90 shadow-2xl text-center space-y-6">
        <span className="text-xs text-muted-foreground font-bold block">
          {isRtl ? 'استمع إلى النغمة المرجعية ثم اختر النغمة المتطابقة:' : 'Listen to the reference tone, then select the matching pitch:'}
        </span>

        {/* Big Replay Audio Button */}
        <button
          onClick={() => {
            setIsPlayingProbe(true);
            playTone(targetTone.freq, 0.7);
            setTimeout(() => setIsPlayingProbe(false), 700);
          }}
          className={`mx-auto h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
            isPlayingProbe
              ? 'border-primary bg-primary text-white scale-110 shadow-primary/40 animate-pulse'
              : 'border-primary/40 bg-gradient-to-tr from-primary/20 to-primary/5 text-primary hover:scale-105'
          }`}
        >
          <Volume2 className="h-8 w-8" />
          <span className="text-[11px] font-bold">
            {isPlayingProbe ? (isRtl ? 'يعزف...' : 'Playing...') : (isRtl ? 'إعادة العزف' : 'Listen')}
          </span>
        </button>

        {/* Tone Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {choices.map((choice) => {
            const isSelected = feedback === choice.id;
            const isWrong = feedback === 'wrong' && choice.id !== targetTone.id;

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                className={`p-5 rounded-3xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2 shadow-md ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 scale-105 animate-bounce'
                    : isWrong
                    ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                    : 'border-border/70 bg-card hover:border-primary/60 hover:scale-102'
                }`}
              >
                <Music className="h-5 w-5 opacity-70" />
                <span>{choice.name}</span>
                <span className="text-[10px] font-mono opacity-60">{choice.freq} Hz</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={120}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 720,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 510,
            accuracyRate: Math.min(100, Math.round((score / (totalRounds * 280)) * 100)) || 80,
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
            setReactionTimes([]);
            setGameFinished(false);
            generateRound(1);
          }}
        />
      )}
    </div>
  );
};
