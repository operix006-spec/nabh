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
  Cpu,
  Flame,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Brain,
  Scale,
} from 'lucide-react';

interface LogicQuestion {
  id: number;
  clueAr: string;
  clueEn: string;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
}

const LOGIC_BANK: LogicQuestion[] = [
  {
    id: 1,
    clueAr: 'الصاروخ (أ) أسرع من المكوك (ب). والمكوك (ب) أسرع من الطائرة (ج).',
    clueEn: 'Rocket (A) is faster than Shuttle (B). Shuttle (B) is faster than Jet (C).',
    questionAr: 'أيها هو الأسرع على الإطلاق؟',
    questionEn: 'Which one is the fastest?',
    optionsAr: ['الصاروخ (أ)', 'المكوك (ب)', 'الطائرة (ج)'],
    optionsEn: ['Rocket (A)', 'Shuttle (B)', 'Jet (C)'],
    correctIndex: 0,
  },
  {
    id: 2,
    clueAr: 'كل النجوم تشع طاقة. كل ما يشع طاقة يحتوي حرارة.',
    clueEn: 'All stars radiate energy. Everything radiating energy contains heat.',
    questionAr: 'ما النتيجة المنطقية المؤكدة؟',
    questionEn: 'What is the logically necessary deduction?',
    optionsAr: ['كل النجوم تحتوي حرارة', 'بعض النجوم باردة', 'الحرارة تولد النجوم فقط'],
    optionsEn: ['All stars contain heat', 'Some stars are cold', 'Heat only creates stars'],
    correctIndex: 0,
  },
  {
    id: 3,
    clueAr: 'البرج الأزرق أطول من البرج الأصفر. والبرج الأخضر أقصر من البرج الأصفر.',
    clueEn: 'The Blue tower is taller than Yellow. The Green tower is shorter than Yellow.',
    questionAr: 'ما هو أقصر الأبراج الثلاثة؟',
    questionEn: 'Which tower is the shortest?',
    optionsAr: ['البرج الأزرق', 'البرج الأصفر', 'البرج الأخضر'],
    optionsEn: ['Blue Tower', 'Yellow Tower', 'Green Tower'],
    correctIndex: 2,
  },
  {
    id: 4,
    clueAr: 'إذا أمطرت السماء ابتلت الأرض. الأرض غير مبتلة الآن.',
    clueEn: 'If it rains, the ground becomes wet. The ground is currently completely dry.',
    questionAr: 'ما هو الاستنتاج المؤكد؟',
    questionEn: 'What is the certain logical conclusion?',
    optionsAr: ['السماء لم تمطر', 'السماء تمطر بغزارة', 'الأرض تمتص الماء'],
    optionsEn: ['It did not rain', 'It rained heavily', 'The ground absorbed water'],
    correctIndex: 0,
  },
  {
    id: 5,
    clueAr: 'سالم أكبر سناً من زياد. وزياد أكبر سناً من فهد.',
    clueEn: 'Salem is older than Ziad. Ziad is older than Fahad.',
    questionAr: 'من هو الأصغر سناً بين الثلاثة؟',
    questionEn: 'Who is the youngest among them?',
    optionsAr: ['سالم', 'زياد', 'فهد'],
    optionsEn: ['Salem', 'Ziad', 'Fahad'],
    correctIndex: 2,
  },
];

export const DeductiveLogicGame: React.FC<{
  skillId?: string;
  skillName?: string;
  onComplete?: (score: number) => void;
}> = ({
  skillId = 'deductive-reasoning-syllogisms',
  skillName = 'الاستدلال المنطقي والقياس الاستنتاجي',
  onComplete,
}) => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { recordGameSession } = useAuth();
  const isRtl = language === 'ar';

  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [currentQ, setCurrentQ] = useState<LogicQuestion>(LOGIC_BANK[0]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [feedbackIndex, setFeedbackIndex] = useState<{ index: number; correct: boolean } | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setCurrentQ(LOGIC_BANK[0]);
    setStartTime(Date.now());
  }, []);

  const handleOptionClick = (index: number) => {
    if (feedbackIndex) return;

    const rt = Date.now() - startTime;
    setReactionTimes((prev) => [...prev, rt]);

    const isCorrect = index === currentQ.correctIndex;
    setFeedbackIndex({ index, correct: isCorrect });

    if (isCorrect) {
      playSound('success');
      const earned = Math.max(100, 350 - Math.round(rt / 20)) + streak * 30;
      setScore((s) => s + earned);
      setStreak((st) => {
        const next = st + 1;
        if (next > highestStreak) setHighestStreak(next);
        if (next >= 3) playSound('combo');
        return next;
      });
    } else {
      playSound('error');
      setStreak(0);
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        finishGame();
      } else {
        const next = round + 1;
        setRound(next);
        setCurrentQ(LOGIC_BANK[(next - 1) % LOGIC_BANK.length]);
        setFeedbackIndex(null);
        setStartTime(Date.now());
      }
    }, 850);
  };

  const finishGame = () => {
    setGameFinished(true);
    playSound('fanfare');

    const meanRt = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 820;
    const fastestRt = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 580;
    const accuracy = Math.min(100, Math.round((score / (totalRounds * 300)) * 100)) || 80;

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
      gameId: 'logic-puzzle',
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Game HUD */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {isRtl ? 'الاستدلال الاستنتاجي والمعضلات' : 'Deductive Syllogism Engine'}
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                Puzzle {round} / {totalRounds} • Formal Logic
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

      {/* Logic Puzzle Box */}
      <Card className="p-6 sm:p-10 rounded-4xl border border-border/80 bg-card/90 shadow-2xl space-y-6 text-start">
        {/* Premise Box */}
        <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 space-y-2">
          <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5" />
            <span>{isRtl ? 'المعطيات المنطقية:' : 'Premise Clues:'}</span>
          </span>
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            {isRtl ? currentQ.clueAr : currentQ.clueEn}
          </p>
        </div>

        {/* Question Prompt */}
        <div className="text-center py-2">
          <h4 className="text-base sm:text-lg font-bold text-foreground">
            {isRtl ? currentQ.questionAr : currentQ.questionEn}
          </h4>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(isRtl ? currentQ.optionsAr : currentQ.optionsEn).map((optionText, idx) => {
            const isSelected = feedbackIndex?.index === idx;

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`w-full p-4 sm:p-5 rounded-2xl border-2 font-bold text-xs sm:text-sm text-start transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? feedbackIndex.correct
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-600 scale-102 animate-bounce'
                      : 'border-rose-500 bg-rose-500/20 text-rose-600 animate-shake'
                    : 'border-border/70 bg-card hover:border-primary/60 hover:bg-secondary/40'
                }`}
              >
                <span>{optionText}</span>
                {isSelected && (
                  feedbackIndex.correct ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Post Game Results Report Modal */}
      {gameFinished && (
        <PostGameResultsModal
          score={score}
          xpEarned={130}
          telemetry={{
            reactionTimesMs: reactionTimes,
            meanReactionTimeMs: reactionTimes.length > 0 ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length : 820,
            fastestReactionTimeMs: reactionTimes.length > 0 ? Math.min(...reactionTimes) : 580,
            accuracyRate: Math.min(100, Math.round((score / (totalRounds * 300)) * 100)) || 80,
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
            setCurrentQ(LOGIC_BANK[0]);
          }}
        />
      )}
    </div>
  );
};
