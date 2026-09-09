'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useSound } from '@/context/SoundContext';
import { Sparkles, CheckCircle2, Flame, Award, Bell, Info } from 'lucide-react';

interface FeedbackItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'success' | 'xp' | 'streak' | 'info' | 'error' | 'warning';
  durationMs?: number;
}

interface FeedbackContextType {
  notify: (item: Omit<FeedbackItem, 'id'>) => void;
  celebrate: (title: string, subtitle?: string) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playSound } = useSound();
  const [toasts, setToasts] = useState<FeedbackItem[]>([]);

  const notify = useCallback(
    ({ title, subtitle, type = 'info', durationMs = 3500 }: Omit<FeedbackItem, 'id'>) => {
      const id = `${Date.now()}_${Math.random()}`;

      if (type === 'success') playSound('success');
      else if (type === 'xp') playSound('levelUp');
      else if (type === 'streak') playSound('fanfare');
      else if (type === 'error') playSound('wrong');
      else if (type === 'warning') playSound('pop');
      else playSound('pop');

      setToasts((prev) => [...prev, { id, title, subtitle, type, durationMs }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, durationMs);
    },
    [playSound]
  );

  const celebrate = useCallback(
    (title: string, subtitle?: string) => {
      playSound('fanfare');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6C63FF', '#8B5CF6', '#00E5A8', '#EC4899', '#F59E0B'],
        });
      } catch {
        // safe fallback
      }
      notify({ title, subtitle, type: 'streak', durationMs: 4000 });
    },
    [playSound, notify]
  );

  return (
    <FeedbackContext.Provider value={{ notify, celebrate }}>
      {children}

      {/* Floating Glass Toast Notification Stack (Top Center) */}
      <aside aria-label="Notifications" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-2xl border border-border/80 bg-card/95 backdrop-blur-2xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 w-full"
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${
                t.type === 'streak'
                  ? 'bg-amber-500 shadow-amber-500/30 animate-bounce'
                  : t.type === 'xp'
                  ? 'bg-emerald-500 shadow-emerald-500/30'
                  : t.type === 'success'
                  ? 'bg-[#00E5A8] text-slate-900 shadow-[#00E5A8]/30'
                  : t.type === 'error'
                  ? 'bg-rose-500 shadow-rose-500/30'
                  : t.type === 'warning'
                  ? 'bg-amber-500 shadow-amber-500/30'
                  : 'bg-primary shadow-primary/30'
              }`}
            >
              {t.type === 'streak' ? (
                <Flame className="h-5 w-5 fill-white" />
              ) : t.type === 'xp' ? (
                <Sparkles className="h-5 w-5" />
              ) : t.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
              ) : t.type === 'error' ? (
                <Bell className="h-5 w-5" />
              ) : (
                <Info className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground block truncate">{t.title}</span>
              {t.subtitle && (
                <span className="text-[11px] text-muted-foreground block truncate">{t.subtitle}</span>
              )}
            </div>
          </div>
        ))}
      </aside>
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
