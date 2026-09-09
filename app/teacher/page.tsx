'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  GraduationCap,
  Users,
  Send,
  Download,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Target,
  Flame,
  Award,
  Zap,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { NeuroBrainMascot } from '@/components/common/NeuroIllustrations';

export default function TeacherDashboardPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const { notify } = useFeedback();
  const isRtl = language === 'ar';

  const [selectedCohort, setSelectedCohort] = useState('cohort_5a');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignedTargetGame, setAssignedTargetGame] = useState('stroop-clash');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStruggleOnly, setFilterStruggleOnly] = useState(false);

  const cohorts = [
    { id: 'cohort_5a', nameAr: 'الصف الخامس (أ)', nameEn: 'Grade 5 (A)', studentsCount: 24, avgNci: 762, completionRate: 84 },
    { id: 'cohort_5b', nameAr: 'الصف الخامس (ب)', nameEn: 'Grade 5 (B)', studentsCount: 22, avgNci: 718, completionRate: 76 },
    { id: 'cohort_6a', nameAr: 'الصف السادس (أ)', nameEn: 'Grade 6 (A)', studentsCount: 26, avgNci: 785, completionRate: 91 },
  ];

  const students = [
    {
      id: 'st_1',
      nameAr: 'عبدالله السعدي',
      nameEn: 'Abdullah Al-Saadi',
      avatarColor: 'from-blue-500 to-indigo-600',
      initials: 'AS',
      nci: 840,
      completion: 100,
      streak: 7,
      status: 'Mastery',
      struggle: null,
      primaryStrength: 'Processing Speed (Gs)',
    },
    {
      id: 'st_2',
      nameAr: 'ريم القحطاني',
      nameEn: 'Reem Al-Qahtani',
      avatarColor: 'from-pink-500 to-rose-600',
      initials: 'RQ',
      nci: 790,
      completion: 92,
      streak: 5,
      status: 'Proficient',
      struggle: null,
      primaryStrength: 'Spatial Span (Gv)',
    },
    {
      id: 'st_3',
      nameAr: 'عمر باوزير',
      nameEn: 'Omar Bawazir',
      avatarColor: 'from-amber-500 to-orange-600',
      initials: 'OB',
      nci: 645,
      completion: 58,
      streak: 2,
      status: 'Needs Support',
      struggle: 'Inhibitory Control & Stroop Lapse',
      primaryStrength: 'Visual Discrimination',
    },
    {
      id: 'st_4',
      nameAr: 'هند الدوسري',
      nameEn: 'Hind Al-Dossary',
      avatarColor: 'from-emerald-500 to-teal-600',
      initials: 'HD',
      nci: 775,
      completion: 88,
      streak: 6,
      status: 'Proficient',
      struggle: null,
      primaryStrength: 'Inductive Logic (Gf)',
    },
    {
      id: 'st_5',
      nameAr: 'يوسف الشهري',
      nameEn: 'Yousef Al-Shehri',
      avatarColor: 'from-purple-500 to-indigo-600',
      initials: 'YS',
      nci: 620,
      completion: 42,
      streak: 1,
      status: 'Needs Support',
      struggle: 'Working Memory Load Decay',
      primaryStrength: 'Reflex Pacing',
    },
  ];

  const handleAssign = () => {
    playSound('fanfare');
    setAssignSuccess(true);
    setTimeout(() => {
      setAssignSuccess(false);
      setAssignmentModalOpen(false);
    }, 1200);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStruggleOnly ? Boolean(s.struggle) : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. HERO BANNER: APPLE GLASS × DUOLINGO MASCOT WELCOME */}
      <div className="relative overflow-hidden rounded-4xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card/80 to-purple-500/10 p-6 sm:p-10 backdrop-blur-2xl shadow-xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-start max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <GraduationCap className="h-4 w-4" />
              <span>{isRtl ? 'لوحة تحكم المعلم والشُّعَب الإدراكية' : 'Educator & Classroom Cohorts Console'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-heading text-foreground tracking-tight">
              {isRtl ? 'إدارة نضج المهارات والتحديات الإدراكية' : 'Classroom Neuro-Performance & Mastery'}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isRtl
                ? 'متابعة نضج المهارات المعرفية للطلاب وفق معايير CHC، وتعيين الواجبات التكيفية وكشف صعوبات التعلم مبكراً.'
                : 'Track student executive growth via CHC psychometrics, dispatch tailored drills, and detect cognitive bottlenecks before they impact learning.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <Button
                onClick={() => {
                  playSound('click');
                  setAssignmentModalOpen(true);
                }}
                size="lg"
                className="rounded-2xl font-bold btn-3d btn-3d-primary gap-2 shadow-lg px-6"
              >
                <Send className="h-4 w-4" />
                <span>{isRtl ? 'تعيين تمرين جديد للصف' : 'Dispatch Class Assignment'}</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  playSound('pop');
                  notify({
                    title: isRtl ? 'تم تصدير كشف درجات الطلاب بصيغة CSV' : 'Student Gradebook exported as CSV',
                    subtitle: isRtl ? 'ملف التقرير الأكاديمي جاهز للتحميل' : 'Academic report ready for download',
                    type: 'success',
                  });
                }}
                size="lg"
                className="rounded-2xl font-bold border-border/80 gap-2 px-5"
              >
                <Download className="h-4 w-4" />
                <span>{isRtl ? 'تصدير كشف CSV' : 'Export Gradebook'}</span>
              </Button>
            </div>
          </div>

          {/* Duolingo-grade Mascot with Studious Glasses */}
          <div className="shrink-0 flex flex-col items-center">
            <NeuroBrainMascot expression="studious" size={150} className="animate-float" />
            <span className="mt-2 text-[11px] font-bold text-primary px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {isRtl ? 'المساعد التربوي الذكي جاهز' : 'AI Pedagogical Assistant Active'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS (Apple Specular Glass Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-md space-y-2 glow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>{isRtl ? 'متوسط مؤشر الصف (NCI)' : 'Cohort Mean NCI'}</span>
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-black font-mono text-primary">755 <span className="text-xs text-emerald-500 font-normal">/ 1000</span></div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>+38 {isRtl ? 'نقطة هذا الشهر' : 'pts this month'}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-md space-y-2 glow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>{isRtl ? 'نسبة الإنجاز الجماعي' : 'Mastery Completion'}</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-500">84%</div>
          <div className="w-full khan-mastery-bar">
            <div className="khan-mastery-fill" style={{ width: '84%' }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-md space-y-2 glow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>{isRtl ? 'الطلاب النشطون اليوم' : 'Active Learners Today'}</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black font-mono text-foreground">22 / 24</div>
          <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
            <Flame className="h-3 w-3 text-amber-500" />
            <span>92% {isRtl ? 'نسبة الحضور اليومي' : 'Daily Engagement'}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-md space-y-2 glow-card">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>{isRtl ? 'تنبيهات صعوبات التعلم' : 'Intervention Alerts'}</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-500">2 <span className="text-xs text-muted-foreground font-normal">{isRtl ? 'طلاب' : 'students'}</span></div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {isRtl ? 'بحاجة لتدريبات كبح وذاكرة' : 'Inhibitory & Memory load support'}
          </div>
        </div>
      </div>

      {/* 3. COHORT SELECTOR RIBBON */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isRtl ? 'اختر الشُّعبة الدراسية' : 'Select Active Cohort'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cohorts.map((c) => {
            const isSelected = selectedCohort === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  playSound('pop');
                  setSelectedCohort(c.id);
                }}
                className={`p-5 rounded-3xl border transition-all text-start flex items-center justify-between ${
                  isSelected
                    ? 'border-primary/60 bg-primary/10 shadow-lg ring-2 ring-primary/30 scale-[1.01]'
                    : 'border-border/60 bg-card/70 hover:bg-accent/40 hover:border-border'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold ${
                    isSelected ? 'bg-primary text-white shadow-md' : 'bg-secondary text-primary'
                  }`}>
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {isRtl ? c.nameAr : c.nameEn}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {c.studentsCount} {isRtl ? 'طالب' : 'Learners'}
                    </span>
                  </div>
                </div>

                <div className="text-end font-mono">
                  <span className="text-sm font-black text-primary block">NCI {c.avgNci}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">{c.completionRate}% {isRtl ? 'إنجاز' : 'Pass'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. STUDENT ROSTER & MASTERY PROGRESS (Khan Academy Rigor) */}
      <div className="rounded-3xl border border-border/80 bg-card/85 p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black font-heading text-foreground">
              {isRtl ? 'سجل الطلاب والتقدم الإدراكي المعياري' : 'Student Cognitive Performance Roster'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isRtl ? 'مقاييس إتقان المهارات وسلاسل التمرين والتنبيهات السريرية' : 'Mastery levels, streak consistency, and early intervention tags'}
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'بحث باسم الطالب...' : 'Search student...'}
                className="w-full h-10 ps-9 pe-3 rounded-2xl bg-secondary/50 border border-border/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button
              variant={filterStruggleOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                playSound('click');
                setFilterStruggleOnly(!filterStruggleOnly);
              }}
              className="rounded-2xl text-xs font-bold h-10 gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{isRtl ? 'التنبيهات فقط' : 'Struggles Only'}</span>
            </Button>
          </div>
        </div>

        {/* Student Cards Grid / Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground">
                <th className="pb-3 text-start">{isRtl ? 'الطالب' : 'Learner'}</th>
                <th className="pb-3 text-center">{isRtl ? 'مؤشر NCI' : 'NCI Index'}</th>
                <th className="pb-3 text-center">{isRtl ? 'نسبة الإنجاز (Khan Mastery)' : 'Mastery Progress'}</th>
                <th className="pb-3 text-center">{isRtl ? 'السلسلة اليومية' : 'Streak'}</th>
                <th className="pb-3 text-end">{isRtl ? 'التشخيص والمتابعة' : 'Diagnostic Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-accent/30 transition-colors">
                  {/* Learner Avatar & Name */}
                  <td className="py-4 font-bold text-foreground">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${st.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20 shrink-0`}>
                        {st.initials}
                      </div>
                      <div>
                        <span className="text-sm font-bold block">{isRtl ? st.nameAr : st.nameEn}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {isRtl ? 'نقطة القوة:' : 'Strength:'} {st.primaryStrength}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* NCI Index */}
                  <td className="py-4 text-center font-mono">
                    <span className="text-sm font-black text-primary px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20">
                      {st.nci}
                    </span>
                  </td>

                  {/* Khan Mastery Bar */}
                  <td className="py-4 text-center">
                    <div className="max-w-[140px] mx-auto space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>{st.completion}%</span>
                        <span className="font-bold text-foreground">{st.status}</span>
                      </div>
                      <div className="khan-mastery-bar">
                        <div
                          className="khan-mastery-fill"
                          style={{ width: `${st.completion}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Streak Flame */}
                  <td className="py-4 text-center font-mono font-bold">
                    <span className="inline-flex items-center gap-1 text-amber-500">
                      <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span>{st.streak}x</span>
                    </span>
                  </td>

                  {/* Diagnostic / Struggle */}
                  <td className="py-4 text-end">
                    {st.struggle ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-500/20">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{st.struggle}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{isRtl ? 'إتقان ممتاز' : 'Optimal Flow'}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ASSIGNMENT MODAL (Apple Sheet Glassmorphism) */}
      {assignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-4xl border-2 border-primary/20 bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-black font-heading text-foreground">
                  {isRtl ? 'تعيين تدريب إدراكي للشعبة' : 'Dispatch Class Assignment'}
                </h3>
              </div>
              <button
                onClick={() => setAssignmentModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {assignSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h4 className="text-lg font-black text-foreground">
                  {isRtl ? 'تم إرسال التحدي بنجاح لجميع طلاب الشعبة!' : 'Assignment Dispatched to All Learners!'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isRtl ? 'سيظهر التحدي كأولوية في لوحة تحكم الطلاب مع مضاعف XP.' : 'Drill pinned to top of student dashboards with 1.5x XP reward multiplier.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {isRtl ? 'اللعبة والمهارة المعرفية المستهدفة' : 'Target Cognitive Drill'}
                  </label>
                  <select
                    value={assignedTargetGame}
                    onChange={(e) => setAssignedTargetGame(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-input bg-background px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
                  >
                    <option value="stroop-clash">{isRtl ? 'صراع ستروب (كبح الاندفاع والتركيز الانتقائي)' : 'Stroop Clash (Inhibitory Control)'}</option>
                    <option value="memory-matrix">{isRtl ? 'مصفوفة الذاكرة (الذاكرة البصرية المكانية)' : 'Memory Matrix (Spatial Working Memory)'}</option>
                    <option value="speed-reflex">{isRtl ? 'نبض السرعة (زمن الرجع وسرعة المعالجة)' : 'Speed Reflex (Reaction Chronometry)'}</option>
                    <option value="matrix-pattern">{isRtl ? 'إكمال المصفوفات (الاستدلال المنطقي والاستقرائي)' : 'Matrix Pattern (Inductive Logic)'}</option>
                    <option value="cube-rotation">{isRtl ? 'تدوير المجسمات ثلاثية الأبعاد (المهارات الفراغية)' : 'Cube Mental Rotation (Spatial Manipulation)'}</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/50 text-xs space-y-1">
                  <span className="font-bold text-foreground block">
                    {isRtl ? 'المكافأة المخصصة عند الإنجاز:' : 'Target Reward:'}
                  </span>
                  <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    +150 XP • Gold Star Badge
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setAssignmentModalOpen(false)}
                    className="rounded-2xl flex-1 font-bold text-xs h-11"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button
                    onClick={handleAssign}
                    className="rounded-2xl flex-1 font-bold btn-3d btn-3d-primary text-xs h-11"
                  >
                    {isRtl ? 'إرسال التحدي فوراً' : 'Send to Cohort'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
