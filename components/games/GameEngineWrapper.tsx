'use client';

import React from 'react';
import { MemoryMatrixGame } from '@/components/games/MemoryMatrixGame';
import { StroopClashGame } from '@/components/games/StroopClashGame';
import { SpeedReflexGame } from '@/components/games/SpeedReflexGame';
import { MatrixPatternGame } from '@/components/games/MatrixPatternGame';
import { TaskSwitcherGame } from '@/components/games/TaskSwitcherGame';
import { CubeMentalRotationGame } from '@/components/games/CubeMentalRotationGame';
import { WordLoomGame } from '@/components/games/WordLoomGame';
import { DragAndDropGame } from '@/components/games/DragAndDropGame';
import { MatchingPairsGame } from '@/components/games/MatchingPairsGame';
import { ExecutiveSortingGame } from '@/components/games/ExecutiveSortingGame';
import { VisualRecognitionGame } from '@/components/games/VisualRecognitionGame';
import { SoundMatchingGame } from '@/components/games/SoundMatchingGame';
import { SequenceRecallGame } from '@/components/games/SequenceRecallGame';
import { DeductiveLogicGame } from '@/components/games/DeductiveLogicGame';
import { COGNITIVE_SKILLS_50 } from '@/lib/data/cognitive-skills';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Brain, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

interface GameEngineWrapperProps {
  gameId: string;
  skillId?: string;
}

export const GameEngineWrapper: React.FC<GameEngineWrapperProps> = ({ gameId, skillId }) => {
  const { language, t } = useLanguage();

  // Lookup corresponding skill
  const skill = COGNITIVE_SKILLS_50.find((s) => s.id === skillId || s.targetGameId === gameId) || COGNITIVE_SKILLS_50[0];
  const skillName = language === 'ar' ? skill.nameAr : skill.nameEn;

  const renderGame = () => {
    switch (gameId) {
      case 'drag-and-drop':
        return <DragAndDropGame skillId={skill.id} skillName={skillName} />;
      case 'memory-game':
      case 'memory-matrix':
        return <MemoryMatrixGame skillId={skill.id} skillName={skillName} />;
      case 'matching':
        return <MatchingPairsGame skillId={skill.id} skillName={skillName} />;
      case 'sorting':
        return <ExecutiveSortingGame skillId={skill.id} skillName={skillName} />;
      case 'visual-recognition':
        return <VisualRecognitionGame skillId={skill.id} skillName={skillName} />;
      case 'pattern-recognition':
      case 'matrix-pattern':
        return <MatrixPatternGame skillId={skill.id} skillName={skillName} />;
      case 'shape-puzzle':
      case 'cube-rotation':
        return <CubeMentalRotationGame skillId={skill.id} skillName={skillName} />;
      case 'color-matching':
      case 'stroop-clash':
        return <StroopClashGame skillId={skill.id} skillName={skillName} />;
      case 'sound-matching':
        return <SoundMatchingGame skillId={skill.id} skillName={skillName} />;
      case 'reaction-game':
      case 'speed-reflex':
        return <SpeedReflexGame skillId={skill.id} skillName={skillName} />;
      case 'sequence-game':
      case 'dual-n-back':
        return <SequenceRecallGame skillId={skill.id} skillName={skillName} />;
      case 'logic-puzzle':
        return <DeductiveLogicGame skillId={skill.id} skillName={skillName} />;
      case 'task-switcher':
        return <TaskSwitcherGame skillId={skill.id} skillName={skillName} />;
      case 'word-loom':
        return <WordLoomGame skillId={skill.id} skillName={skillName} />;
      default:
        return <MemoryMatrixGame skillId={skill.id} skillName={skillName} />;
    }
  };

  const isRtl = language === 'ar';

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Skill Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Link href="/skills">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 text-xs text-muted-foreground">
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{t('allSkillsTitle')}</span>
            </Button>
          </Link>
          <span className="text-border">/</span>
          <Badge variant="outline" className="px-3 py-1 text-xs font-bold text-primary border-primary/30">
            #{skill.number} {skillName}
          </Badge>
        </div>

        <Link href={`/skills/${skill.id}`}>
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 font-bold">
            <Brain className="h-3.5 w-3.5 text-indigo-500" />
            <span>{t('viewDetails')}</span>
          </Button>
        </Link>
      </div>

      {/* Render Active Game Engine */}
      {renderGame()}
    </div>
  );
};
