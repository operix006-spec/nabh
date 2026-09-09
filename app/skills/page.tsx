'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_DOMAINS, COGNITIVE_SKILLS_50 } from '@/lib/data/cognitive-skills';
import { LearningEngine, PASSING_SCORE } from '@/lib/engine/learning-engine';
import { CognitiveDomainId, SkillDifficulty, UserSkillProgress } from '@/types/cognitive';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Search,
  SlidersHorizontal,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Filter,
  Lock,
  Unlock,
  Star,
} from 'lucide-react';

export default function SkillsDirectoryPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<CognitiveDomainId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SkillDifficulty | 'all'>('all');
  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then(setProgressMap);
  }, [user]);

  const filteredSkills = useMemo(() => {
    return COGNITIVE_SKILLS_50.filter((skill) => {
      // Domain filter
      if (selectedDomain !== 'all' && skill.domain !== selectedDomain) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'all' && skill.difficulty !== selectedDifficulty) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          skill.nameAr.toLowerCase().includes(q) || skill.nameEn.toLowerCase().includes(q);
        const matchDesc =
          skill.descriptionAr.toLowerCase().includes(q) ||
          skill.descriptionEn.toLowerCase().includes(q);
        const matchBrain =
          skill.brainAreaAr.toLowerCase().includes(q) ||
          skill.brainAreaEn.toLowerCase().includes(q);
        return matchName || matchDesc || matchBrain;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, selectedDifficulty]);

  const difficultyLabels: Record<SkillDifficulty, { ar: string; en: string }> = {
    beginner: { ar: 'مبتدئ', en: 'Beginner' },
    intermediate: { ar: 'متوسط', en: 'Intermediate' },
    advanced: { ar: 'متقدم', en: 'Advanced' },
    mastery: { ar: 'احتراف', en: 'Mastery' },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. DIRECTORY HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="outline" className="px-4 py-1 text-xs font-bold text-primary border-primary/30">
          50 Cognitive Skills Battery
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight">
          {t('allSkillsTitle')}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t('allSkillsSubtitle')}
        </p>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="space-y-4">
        
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full h-14 pl-12 pr-4 rtl:pl-4 rtl:pr-12 rounded-2xl border-2 border-border/70 bg-card text-foreground font-medium text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            variant={selectedDomain === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              playSound('click');
              setSelectedDomain('all');
            }}
            className="rounded-xl font-bold text-xs"
          >
            {t('allDomains')} (50)
          </Button>

          {COGNITIVE_DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            const name = language === 'ar' ? domain.nameAr : domain.nameEn;
            return (
              <Button
                key={domain.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  playSound('click');
                  setSelectedDomain(domain.id);
                }}
                className="rounded-xl font-bold text-xs"
              >
                {name} ({domain.skillsCount})
              </Button>
            );
          })}
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>{t('filterByDifficulty')}:</span>
          </span>
          {(['all', 'beginner', 'intermediate', 'advanced', 'mastery'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                playSound('click');
                setSelectedDifficulty(diff);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-secondary text-primary font-extrabold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {diff === 'all'
                ? (language === 'ar' ? 'الكل' : 'All')
                : difficultyLabels[diff][language]}
            </button>
          ))}
        </div>

      </div>

      {/* 3. SKILLS GRID (ALL 50 SKILLS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => {
          const name = language === 'ar' ? skill.nameAr : skill.nameEn;
          const desc = language === 'ar' ? skill.descriptionAr : skill.descriptionEn;
          const brain = language === 'ar' ? skill.brainAreaAr : skill.brainAreaEn;
          const isUnlocked = progressMap[skill.id]?.isUnlocked ?? (skill.number === 1);
          const stars = progressMap[skill.id]?.stars || 0;
          const bestScore = progressMap[skill.id]?.bestScore || 0;

          return (
            <Card
              key={skill.id}
              className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between group ${
                isUnlocked
                  ? 'border-border/70 hover:border-primary/50 hover:-translate-y-1 hover:shadow-card'
                  : 'border-border/40 opacity-80 bg-accent/10'
              }`}
            >
              <div>
                {/* Header: Skill Number & Difficulty Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-black text-xs text-primary">
                      #{skill.number}
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Unlock className="h-3 w-3" />
                        <span>{isRtl ? 'مفتوحة' : 'Unlocked'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Lock className="h-3 w-3" />
                        <span>{isRtl ? 'مغلقة' : 'Locked'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Stars */}
                    {isUnlocked && stars > 0 && (
                      <div className="flex items-center gap-0.5 mr-1">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {difficultyLabels[skill.difficulty][language]}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors mb-2">
                  {name}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                  {desc}
                </p>

                {/* Neural Correlate Tag */}
                <div className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-[11px] text-muted-foreground mb-4">
                  <span className="font-bold text-foreground/80 block text-[10px]">
                    {language === 'ar' ? 'المسار العصبي:' : 'Neural Hub:'}
                  </span>
                  <span className="line-clamp-1">{brain}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                {isUnlocked ? (
                  <div className="flex items-center gap-2">
                    <Link href={`/games/${skill.targetGameId}`} className="flex-1" onClick={() => playSound('click')}>
                      <Button size="sm" variant="default" className="w-full rounded-xl font-bold gap-1.5 text-xs btn-3d btn-3d-primary">
                        <Play className="h-3.5 w-3.5" />
                        <span>{bestScore > 0 ? (isRtl ? `تمرن (${bestScore}%)` : `Train (${bestScore}%)`) : t('playGame')}</span>
                      </Button>
                    </Link>

                    <Link href={`/skills/${skill.id}`}>
                      <Button size="sm" variant="outline" className="rounded-xl font-bold text-xs" title={t('viewDetails')}>
                        <BookOpen className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground bg-accent/40 p-2 rounded-xl border border-border/40">
                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                      <Lock className="h-3.5 w-3.5" />
                      <span>{isRtl ? `يلزم إنهاء #${skill.number - 1} بنسبة 70%` : `Requires #${skill.number - 1} >= 70%`}</span>
                    </span>
                    <Link href={`/skills/${skill.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px] font-bold">
                        {isRtl ? 'التفاصيل' : 'Details'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
          <h4 className="text-lg font-bold text-foreground">
            {language === 'ar' ? 'لم يتم العثور على مهارات مطابقة' : 'No matching cognitive skills found'}
          </h4>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'جرب البحث بكلمات أخرى أو أزل فلاتر التصفية' : 'Try adjusting your search terms or clearing filters'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
              setSelectedDifficulty('all');
            }}
          >
            {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </Button>
        </div>
      )}

    </div>
  );
}
