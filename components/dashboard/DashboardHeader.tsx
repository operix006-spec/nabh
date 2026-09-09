'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { COGNITIVE_SKILLS_50, COGNITIVE_DOMAINS } from '@/lib/data/cognitive-skills';
import {
  Search,
  Sparkles,
  X,
  Play,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter skills based on live query and selected domain
  const searchResults = searchQuery.trim()
    ? COGNITIVE_SKILLS_50.filter((s) => {
        const matchesQuery =
          s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.domain.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDomain = selectedDomain === 'all' || s.domain === selectedDomain;
        return matchesQuery && matchesDomain;
      }).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full my-6 sm:my-8 space-y-3">
      {/* Spacious Spotlight Command Search Bar */}
      <div ref={searchRef} className="relative w-full">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder={
              isRtl
                ? 'ابحث بالذكاء الاصطناعي عن أي مهارة، لعبة، أو تمرين عصبي...'
                : 'Search 50 skills, psychometric games, or CHC domains...'
            }
            className="w-full h-14 sm:h-16 rounded-3xl border border-border/80 bg-card/90 px-5 pl-12 pr-20 rtl:pl-20 rtl:pr-12 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/5 backdrop-blur-2xl focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/40 transition-all placeholder:text-muted-foreground/60"
          />
          <Search className="absolute top-4 sm:top-5 left-4 sm:left-5 rtl:left-auto rtl:right-4 sm:rtl:right-5 h-5 sm:h-6 w-5 sm:w-6 text-muted-foreground pointer-events-none" />

          {/* Quick Clear or Keyboard Shortcut Pill */}
          <div className="absolute top-3.5 sm:top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold text-muted-foreground bg-accent/70 border border-border/60 rounded-xl shadow-xs">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            )}
          </div>
        </div>

        {/* Instant Search Results Dropdown */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-16 sm:top-20 left-0 right-0 z-50 rounded-3xl border border-border/80 bg-card/98 p-3 shadow-2xl backdrop-blur-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-border/40">
              <span>{isRtl ? 'النتائج المطابقة في الدليل الإدراكي' : 'Matching Cognitive Drills'}</span>
              <span className="font-mono">{searchResults.length} {isRtl ? 'نتائج' : 'results'}</span>
            </div>

            {searchResults.map((skill) => (
              <Link
                key={skill.id}
                href={`/games/${skill.targetGameId}`}
                onClick={() => {
                  playSound('click');
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-accent/70 transition-colors text-xs group"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#6C63FF]/15 text-[#6C63FF] font-mono font-bold text-xs">
                    #{skill.number}
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-foreground block truncate group-hover:text-[#6C63FF] transition-colors text-sm">
                      {isRtl ? skill.nameAr : skill.nameEn}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {skill.domain} • {skill.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[#6C63FF] font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{isRtl ? 'ابدأ التمرين' : 'Play Now'}</span>
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filter Pills with Generous Spacing */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => {
            playSound('pop');
            setSelectedDomain('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            selectedDomain === 'all'
              ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/25'
              : 'bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
        >
          {isRtl ? 'كافة المجالات' : 'All Domains'}
        </button>

        {COGNITIVE_DOMAINS.map((dom) => (
          <button
            key={dom.id}
            onClick={() => {
              playSound('pop');
              setSelectedDomain(dom.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedDomain === dom.id
                ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/25'
                : 'bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {isRtl ? dom.nameAr : dom.nameEn}
          </button>
        ))}
      </div>
    </div>
  );
};
