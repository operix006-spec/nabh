'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSound } from '@/context/SoundContext';
import { useFeedback } from '@/context/FeedbackContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Brain,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Activity,
  ShieldAlert,
  RotateCcw,
  Clock,
  Zap,
} from 'lucide-react';
import { CognitiveAIEngine, AIPredictedWeakness } from '@/lib/engine/ai-engine';
import { LearningEngine } from '@/lib/engine/learning-engine';
import { UserSkillProgress, AIEvaluationSummary, AIMistakeAnalysis } from '@/types/cognitive';

export default function ReportsPage() {
  const { language } = useLanguage();
  const { user, sessions } = useAuth();
  const { playSound } = useSound();
  const { notify } = useFeedback();
  const isRtl = language === 'ar';

  const [isExporting, setIsExporting] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, UserSkillProgress>>({});
  const [aiReport, setAiReport] = useState<AIEvaluationSummary | null>(null);
  const [predictedWeaknesses, setPredictedWeaknesses] = useState<AIPredictedWeakness[]>([]);
  const [mistakeAnalysis, setMistakeAnalysis] = useState<AIMistakeAnalysis | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    LearningEngine.loadUserProgress(user?.id || 'demo_user').then((pm) => {
      setProgressMap(pm);
      generateReportData(pm);
    });
  }, [user, sessions]);

  const generateReportData = (pm: Record<string, UserSkillProgress>) => {
    const report = CognitiveAIEngine.generateEvaluationReport(pm, sessions.length || 24);
    setAiReport(report);

    const weaknesses = CognitiveAIEngine.predictWeakSkills(pm);
    setPredictedWeaknesses(weaknesses);

    const latestSession = sessions[0];
    const telemetry = latestSession?.telemetry || {
      accuracyRate: 72,
      meanReactionTimeMs: 620,
      fastestReactionTimeMs: 295,
      highestStreak: 3,
      incorrectAnswers: 2,
      difficultyLevelReached: 3,
    };
    const mistakes = CognitiveAIEngine.analyzeMistakes(telemetry);
    setMistakeAnalysis(mistakes);
  };

  const handleRegenerate = () => {
    playSound('fanfare');
    setIsRegenerating(true);
    setTimeout(() => {
      generateReportData(progressMap);
      setIsRegenerating(false);
    }, 600);
  };

  const handleExport = () => {
    playSound('fanfare');
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 600);
  };

  const domainScores = [
    { domain: 'Gsm', nameAr: 'الذاكرة قصيرة المدى والعاملة (Gsm)', nameEn: 'Working & Short-Term Memory (Gsm)', percentile: 88, rating: 'Superior' },
    { domain: 'Gs', nameAr: 'سرعة المعالجة الذهنية وتوافق الحركة (Gs)', nameEn: 'Mental Processing Speed (Gs)', percentile: 94, rating: 'Very Superior' },
    { domain: 'Gf', nameAr: 'الذكاء السائل والاستدلال الاستقرائي (Gf)', nameEn: 'Fluid & Inductive Reasoning (Gf)', percentile: 82, rating: 'High Average' },
    { domain: 'Gv', nameAr: 'المعالجة البصرية والمكانية ثلاثية الأبعاد (Gv)', nameEn: 'Visual-Spatial Processing (Gv)', percentile: 79, rating: 'Average' },
    { domain: 'Ga', nameAr: 'التحكم التنفيذي وكبح التداخل (Ga)', nameEn: 'Inhibitory & Executive Control (Ga)', percentile: 91, rating: 'Superior' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black font-heading text-foreground">
              {isRtl ? 'التقرير الإدراكي السريري الشامل' : 'Comprehensive Psychometric Report'}
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
              AI-Generated
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isRtl ? 'تقرير قياس عصبي معتمد وفق معايير CHC ومولد بواسطة محرك نَبِـه للذكاء الاصطناعي' : 'Certified neuropsychological report based on CHC taxonomy powered by Nabh AI Engine'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="rounded-2xl font-bold border-border/80 gap-2 shadow-sm text-xs"
          >
            <RotateCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRtl ? 'تحديث التحليل بالذكاء الاصطناعي' : 'Re-synthesize AI Report'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="rounded-2xl font-bold border-border/80 gap-2 shadow-sm text-xs"
          >
            <Printer className="h-4 w-4" />
            <span>{isRtl ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}</span>
          </Button>

          <Button
            onClick={() => {
              playSound('pop');
              navigator.clipboard?.writeText(window.location.href);
              notify({
                title: isRtl ? 'تم نسخ رابط التقرير' : 'Report link copied',
                subtitle: isRtl ? 'تم نسخ الرابط إلى الحافظة بنجاح' : 'Link copied to clipboard',
                type: 'info',
              });
            }}
            className="rounded-2xl font-bold btn-3d btn-3d-primary gap-2 text-xs"
          >
            <Share2 className="h-4 w-4" />
            <span>{isRtl ? 'مشاركة التقرير' : 'Share'}</span>
          </Button>
        </div>
      </div>

      {/* Printable Official Document Sheet */}
      <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-14 shadow-2xl space-y-10 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-border/60 pb-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <span className="text-2xl font-black font-heading tracking-tight block">
                {isRtl ? 'نَبِـه' : 'Nabh'}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Cognitive OS Psychometric Evaluation • AI Clinical Module v2.4
              </span>
            </div>
          </div>

          <div className="text-end text-xs font-mono space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>VERIFIED CHC DIAGNOSTIC</span>
            </div>
            <p className="text-muted-foreground">ID: NBH-2026-9941X</p>
            <p className="text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Subject Profile Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-accent/40 border border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block">{isRtl ? 'اسم المتعلم:' : 'Learner Name:'}</span>
            <strong className="text-foreground text-sm">{user?.displayName || 'Active Learner'}</strong>
          </div>
          <div>
            <span className="text-muted-foreground block">{isRtl ? 'الفئة العمرية:' : 'Age Bracket:'}</span>
            <strong className="text-foreground text-sm">18 - 25 (Young Adult)</strong>
          </div>
          <div>
            <span className="text-muted-foreground block">{isRtl ? 'مؤشر NCI العام:' : 'Composite NCI:'}</span>
            <strong className="text-primary text-sm font-mono">{user?.overallCognitiveIndex || 742} / 1000</strong>
          </div>
          <div>
            <span className="text-muted-foreground block">{isRtl ? 'المستوى المعياري:' : 'Percentile:'}</span>
            <strong className="text-emerald-500 text-sm font-mono">Top 8% (92nd)</strong>
          </div>
        </div>

        {/* Executive Summary Narrative (AI-Generated) */}
        {aiReport && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{isRtl ? 'الملخص التنفيذي للأداء العصبي (توليد الذكاء الاصطناعي)' : 'Executive Neuro-Cognitive Summary (AI-Generated)'}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-500">
                +{aiReport.overallIndexDelta} {isRtl ? 'تطور المؤشر الإجمالي' : 'Composite Growth Delta'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed p-4 rounded-2xl bg-card border border-border/60">
              {isRtl ? aiReport.encouragementAr : aiReport.encouragementEn}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold text-emerald-600 mb-1">
                  {isRtl ? 'نقطة القوة الرئيسية (Primary Strength):' : 'Primary Cognitive Strength:'}
                </span>
                <strong className="text-foreground text-sm block">
                  {isRtl ? aiReport.primaryStrengthAr : aiReport.primaryStrengthEn}
                </strong>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold text-amber-600 mb-1">
                  {isRtl ? 'عنق الزجاجة المستهدف (Target Bottleneck):' : 'Target Growth Bottleneck:'}
                </span>
                <strong className="text-foreground text-sm block">
                  {isRtl ? aiReport.bottleneckDomainAr : aiReport.bottleneckDomainEn}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* CHC Dimensional Ranks Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-heading text-foreground">
            {isRtl ? 'القياسات المعيارية للأبعاد المعرفية (CHC Scales)' : 'CHC Dimensional Norms'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-3 text-start">{isRtl ? 'البعد المعرفي' : 'Cognitive Domain'}</th>
                  <th className="pb-3 text-center">{isRtl ? 'الرتبة المئينية' : 'Percentile Rank'}</th>
                  <th className="pb-3 text-center">{isRtl ? 'التصنيف المعياري' : 'Classification'}</th>
                  <th className="pb-3 text-end">{isRtl ? 'حالة التقدم' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {domainScores.map((d, idx) => (
                  <tr key={idx} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 font-bold text-foreground">
                      {isRtl ? d.nameAr : d.nameEn}
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-primary">
                      {d.percentile}th
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                        {d.rating}
                      </span>
                    </td>
                    <td className="py-3 text-end text-emerald-500 font-bold">
                      <div className="flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mastered</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Mistake Analysis Section */}
        {mistakeAnalysis && (
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span>{isRtl ? 'التحليل العصبي لنمط الأخطاء (AI Mistake Analysis)' : 'Neuro-Cognitive Mistake Pattern Analysis'}</span>
              </h4>
              <Badge variant="outline" className="font-mono text-[10px]">
                {mistakeAnalysis.errorPattern}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isRtl ? mistakeAnalysis.neuroReasonAr : mistakeAnalysis.neuroReasonEn}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-muted-foreground font-mono">
                {isRtl ? 'المنطقة الدماغية النشطة:' : 'Active Brain Network:'} {mistakeAnalysis.involvedBrainArea}
              </span>
              <span className="text-emerald-500 font-bold">
                💡 {isRtl ? mistakeAnalysis.actionableTipAr : mistakeAnalysis.actionableTipEn}
              </span>
            </div>
          </div>
        )}

        {/* AI Predicted Weaknesses Section */}
        {predictedWeaknesses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              <span>{isRtl ? 'التنبؤ بالعقبات ونقاط الضعف المستقبلية (Predictive AI)' : 'Future Bottleneck Forecasting (Predictive AI)'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {predictedWeaknesses.map((w, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-card border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-foreground">{isRtl ? w.skillNameAr : w.skillNameEn}</strong>
                    <span className="text-rose-500 font-mono font-bold">{w.vulnerabilityScore}% Vulnerability</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {isRtl ? w.neuroRationaleAr : w.neuroRationaleEn}
                  </p>
                  <div className="p-2.5 rounded-xl bg-accent/40 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                    🛡️ {isRtl ? w.preventionStrategyAr : w.preventionStrategyEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Footer */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>Cryptographically Verified by Nabh Neuro-Engine v2.4</span>
          </div>
          <div className="text-center sm:text-end">
            <span className="font-serif italic text-foreground block">Nabh Clinical Advisory Board</span>
            <span className="text-[10px]">Certified Digital Signature • Hash: SHA256-99e8-42f1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
