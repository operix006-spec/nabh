'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { validateForgotPassword } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateForgotPassword({ email }, language);
    if (!validation.success) {
      setError(validation.errors?.email || 'Invalid email');
      playSound('error');
      return;
    }

    setIsLoading(true);
    playSound('click');

    const result = await forgotPassword(email);
    setIsLoading(false);

    if (result.success) {
      playSound('success');
      setIsSent(true);
    } else {
      playSound('error');
      setError(result.error || (isRtl ? 'تعذر إرسال الرابط. تحقق من البريد وحاول ثانية.' : 'Failed to send reset link.'));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6C63FF]/30 group-hover:scale-105 transition-transform">
              <Brain className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isRtl ? 'استعادة كلمة المرور' : 'Reset Password'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لإعادة الضبط' : 'Enter your registered email to receive a secure recovery link'}
          </p>
        </div>

        <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl space-y-6">
          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                {isRtl ? 'تم إرسال رابط الاستعادة بنجاح!' : 'Reset link sent successfully!'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRtl
                  ? `أرسلنا رسالة إلى ${email} تحتوي على تعليمات إعادة تعيين كلمة المرور. يرجى مراجعة صندوق الوارد والبريد غير الهام (Spam).`
                  : `We sent instructions to ${email}. Please check your inbox and spam folder.`}
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" className="rounded-2xl text-xs font-bold w-full h-11">
                    {isRtl ? 'العودة لتسجيل الدخول' : 'Return to Login'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'البريد الإلكتروني المسجل' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 px-4 rounded-2xl bg-secondary/30 border border-border/70 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute top-3.5 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg shadow-primary/25 text-sm gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isRtl ? 'جاري الإرسال...' : 'Sending link...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isRtl ? 'إرسال رابط استعادة المرور' : 'Send Reset Link'}</span>
                    {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-border/50 text-center">
            <Link
              href="/login"
              className="text-xs font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              {isRtl ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
              <span>{isRtl ? 'الرجوع إلى صفحة تسجيل الدخول' : 'Back to Login'}</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
