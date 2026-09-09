'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { validateResetPassword } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateResetPassword({ password, confirmPassword }, language);
    if (!validation.success) {
      setErrors(validation.errors || {});
      playSound('error');
      return;
    }

    setIsLoading(true);
    playSound('click');

    const result = await resetPassword(password);
    setIsLoading(false);

    if (result.success) {
      playSound('success');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } else {
      playSound('error');
      setSubmitError(result.error || (isRtl ? 'حدث خطأ أثناء تحديث كلمة المرور' : 'Failed to update password'));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6C63FF]/30 mx-auto">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isRtl ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'أدخل كلمة مرور قوية لتأمين حسابك الإدراكي' : 'Enter a strong password to secure your cognitive profile'}
          </p>
        </div>

        <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-base text-foreground">
                {isRtl ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isRtl ? 'جاري تحويلك إلى صفحة تسجيل الدخول...' : 'Redirecting to login...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-2xl bg-secondary/30 border border-border/70 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3.5 left-4 rtl:left-auto rtl:right-4 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[11px] text-destructive font-medium">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-2xl bg-secondary/30 border border-border/70 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                {errors.confirmPassword && (
                  <span className="text-[11px] text-destructive font-medium">{errors.confirmPassword}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg shadow-primary/25 text-sm gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{isRtl ? 'جاري الحفظ...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{isRtl ? 'حفظ كلمة المرور والدخول' : 'Save New Password'}</span>
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
