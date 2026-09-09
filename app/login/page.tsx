'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { validateLogin } from '@/lib/validations/auth';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NabhLogo } from '@/components/common/NabhLogo';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithApple, loginAsGuest, loginAsRole, isLoading } = useAuth();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate with Zod validation
    const validation = validateLogin({ email, password, rememberMe }, language);
    if (!validation.success) {
      setErrors(validation.errors || {});
      playSound('error');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    playSound('click');

    const result = await login({ email, password, rememberMe });
    setIsSubmitting(false);

    if (result.success) {
      playSound('success');
      router.push('/dashboard');
    } else {
      playSound('error');
      setSubmitError(
        result.error ||
          (isRtl
            ? 'فشل تسجيل الدخول. يرجى التحقق من صحة البريد الإلكتروني وكلمة المرور.'
            : 'Login failed. Please verify your credentials.')
      );
    }
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    playSound('click');
    loginAsRole(role);
    if (role === 'super_admin' || role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center group mb-2">
            <NabhLogo size="lg" showText={false} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isRtl ? 'تسجيل الدخول إلى نَبِـه' : 'Sign in to Nabh'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'المنصة العلمية لتقييم وتدريب 50 مهارة عصبية' : 'Cognitive evaluation & 50 skills mastery'}
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Submit Error Banner */}
          {submitError && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                playSound('click');
                loginWithGoogle();
                router.push('/dashboard');
              }}
              className="h-11 rounded-2xl border-border/70 hover:bg-secondary/30 text-xs font-bold gap-2"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                playSound('click');
                loginWithApple();
                router.push('/dashboard');
              }}
              className="h-11 rounded-2xl border-border/70 hover:bg-secondary/30 text-xs font-bold gap-2"
            >
              <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.03-.51 2.64-1.24" />
              </svg>
              <span>Apple</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/60 w-full" />
            <span className="bg-card px-3 text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider shrink-0">
              {isRtl ? 'أو عبر البريد الإلكتروني' : 'Or with email'}
            </span>
            <div className="border-t border-border/60 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                {isRtl ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRtl ? 'name@example.com أو username' : 'name@example.com'}
                  className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.email ? 'border-destructive' : 'border-border/70'
                  }`}
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute top-3.5 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
              </div>
              {errors.email && <span className="text-[11px] text-destructive font-medium">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  {isRtl ? 'كلمة المرور' : 'Password'}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={() => playSound('click')}
                >
                  {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.password ? 'border-destructive' : 'border-border/70'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 left-4 rtl:left-auto rtl:right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[11px] text-destructive font-medium">{errors.password}</span>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md text-primary focus:ring-primary border-border bg-secondary/50"
                />
                <span className="text-xs text-muted-foreground font-medium">
                  {isRtl ? 'تذكر تسجيل الدخول' : 'Remember me'}
                </span>
              </label>

              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  loginAsGuest();
                  router.push('/dashboard');
                }}
                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>{isRtl ? 'دخول سريع كزائر' : 'Guest Mode'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-11 rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg shadow-primary/25 text-sm gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isRtl ? 'جاري التحقق...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{isRtl ? 'تسجيل الدخول' : 'Sign In'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          </form>

          {/* Quick Role Switcher for Evaluators & Admins */}
          <div className="pt-2 border-t border-border/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground">
                {isRtl ? 'تسجيل سريع بحسب الدور (للتجربة الفورية):' : 'Instant Role Switch (Testing):'}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                5 Roles
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                onClick={() => handleRoleQuickLogin('super_admin')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-center transition-all"
              >
                🛡️ {isRtl ? 'مشرف عام' : 'Super Admin'}
              </button>
              <button
                onClick={() => handleRoleQuickLogin('admin')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-center transition-all"
              >
                ⚙️ {isRtl ? 'مدير المنصة' : 'Admin'}
              </button>
              <button
                onClick={() => handleRoleQuickLogin('teacher')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-center transition-all"
              >
                🎓 {isRtl ? 'معلم' : 'Teacher'}
              </button>
              <button
                onClick={() => handleRoleQuickLogin('parent')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-center transition-all"
              >
                👨‍👩‍👦 {isRtl ? 'ولي أمر' : 'Parent'}
              </button>
              <button
                onClick={() => handleRoleQuickLogin('student')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-center transition-all col-span-2 sm:col-span-1"
              >
                ⭐ {isRtl ? 'طالب' : 'Student'}
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Register Link */}
        <p className="text-center text-xs text-muted-foreground">
          {isRtl ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"}{' '}
          <Link
            href="/register"
            onClick={() => playSound('click')}
            className="font-bold text-primary hover:underline ml-1 rtl:mr-1"
          >
            {isRtl ? 'أنشئ حساباً مجانياً الآن' : 'Create a free account'}
          </Link>
        </p>

      </div>
    </div>
  );
}
