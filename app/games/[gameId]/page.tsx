'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameEngineWrapper } from '@/components/games/GameEngineWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import {
  Brain,
  Zap,
  Target,
  Cpu,
  Shuffle,
  Box,
  Book,
  Layers,
  Sparkles,
  Eye,
  Music,
  RotateCw,
  Scale,
} from 'lucide-react';

const GAME_SWITCHER_LIST = [
  { id: 'drag-and-drop', nameAr: 'السحب والإفلات', nameEn: 'Drag & Drop', icon: Layers },
  { id: 'memory-game', nameAr: 'الذاكرة المكانية', nameEn: 'Memory Game', icon: Brain },
  { id: 'matching', nameAr: 'المطابقة والاقتران', nameEn: 'Matching', icon: Sparkles },
  { id: 'sorting', nameAr: 'التصنيف التنفيذي', nameEn: 'Sorting', icon: Shuffle },
  { id: 'visual-recognition', nameAr: 'التمييز البصري', nameEn: 'Visual Recognition', icon: Eye },
  { id: 'pattern-recognition', nameAr: 'إدراك الأنماط', nameEn: 'Pattern Recognition', icon: Cpu },
  { id: 'shape-puzzle', nameAr: 'ألغاز الأشكال', nameEn: 'Shape Puzzle', icon: Box },
  { id: 'color-matching', nameAr: 'مطابقة الألوان ستروب', nameEn: 'Color Matching', icon: Target },
  { id: 'sound-matching', nameAr: 'مطابقة الترددات الصوتية', nameEn: 'Sound Matching', icon: Music },
  { id: 'reaction-game', nameAr: 'سرعة رد الفعل', nameEn: 'Reaction Game', icon: Zap },
  { id: 'sequence-game', nameAr: 'تسلسل الذاكرة', nameEn: 'Sequence Game', icon: RotateCw },
  { id: 'logic-puzzle', nameAr: 'الاستدلال المنطقي', nameEn: 'Logic Puzzle', icon: Scale },
  { id: 'task-switcher', nameAr: 'التبديل التنفيذي', nameEn: 'Task Switcher', icon: Shuffle },
  { id: 'word-loom', nameAr: 'الطلاقة اللفظية', nameEn: 'Word Loom', icon: Book },
];

export default function GameArenaPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { playSound } = useSound();

  const gameId = (params?.gameId as string) || 'memory-game';

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Quick 12-Game Switcher Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground pl-1">
            {language === 'ar' ? 'محركات الألعاب الـ 14 المعتمدة:' : '14 Core Cognitive Game Engines:'}
          </span>
          <span className="text-[11px] font-mono text-primary font-bold">
            Live Interactive Simulator
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GAME_SWITCHER_LIST.map((item) => {
            const isActive =
              item.id === gameId ||
              (item.id === 'memory-game' && gameId === 'memory-matrix') ||
              (item.id === 'pattern-recognition' && gameId === 'matrix-pattern') ||
              (item.id === 'shape-puzzle' && gameId === 'cube-rotation') ||
              (item.id === 'color-matching' && gameId === 'stroop-clash') ||
              (item.id === 'reaction-game' && gameId === 'speed-reflex');
            const Icon = item.icon;
            const label = language === 'ar' ? item.nameAr : item.nameEn;

            return (
              <button
                key={item.id}
                onClick={() => {
                  playSound('click');
                  router.push(`/games/${item.id}`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Universal Game Engine */}
      <GameEngineWrapper gameId={gameId} />
    </div>
  );
}
