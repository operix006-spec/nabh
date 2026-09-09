'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { validateRegistration, RegisterFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NabhLogo } from '@/components/common/NabhLogo';
import {
  Brain,
  Lock,
  Mail,
  User,
  AtSign,
  Globe,
  Calendar,
  GraduationCap,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Users,
  Award,
} from 'lucide-react';

const COUNTRIES_LIST = [
  { code: 'SA', nameAr: 'المملكة العربية السعودية', nameEn: 'Saudi Arabia' },
  { code: 'AE', nameAr: 'الإمارات العربية المتحدة', nameEn: 'United Arab Emirates' },
  { code: 'KW', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { code: 'QA', nameAr: 'قطر', nameEn: 'Qatar' },
  { code: 'BH', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { code: 'OM', nameAr: 'عُمان', nameEn: 'Oman' },
  { code: 'EG', nameAr: 'مصر', nameEn: 'Egypt' },
  { code: 'JO', nameAr: 'الأردن', nameEn: 'Jordan' },
  { code: 'US', nameAr: 'الولايات المتحدة', nameEn: 'United States' },
  { code: 'GB', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
  { code: 'OTHER', nameAr: 'دولة أخرى', nameEn: 'Other Country' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, loginWithApple, isLoading } = useAuth();
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'المملكة العربية السعودية',
    language: 'ar',
    dateOfBirth: '',
    role: 'student',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute password strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateRegistration(formData, language);
    if (!validation.success) {
      setErrors(validation.errors || {});
      playSound('error');
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    playSound('click');

    const result = await register(validation.data!);
    setIsSubmitting(false);

    if (result.success) {
      playSound('success');
      router.push('/dashboard');
    } else {
      playSound('error');
      setSubmitError(
        result.error ||
          (isRtl
            ? 'تعذر إتمام التسجيل. قد يكون البريد الإلكتروني أو اسم المستخدم مستخدماً مسبقاً.'
            : 'Registration failed. Email or username may already be in use.')
      );
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center group mb-2">
            <NabhLogo size="lg" showText={false} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isRtl ? 'إنشاء حساب جديد في نَبِـه' : 'Create Your Nabh Account'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl
              ? 'انضم لأكثر من 50,000 متعلم واستكشف خريطتك العصبية التفاعلية'
              : 'Join over 50,000 learners and unlock your cognitive roadmap'}
          </p>
        </div>

        {/* Main Registration Card */}
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
              <span>{isRtl ? 'تسجيل بواسطة Google' : 'Sign up with Google'}</span>
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
              <span>{isRtl ? 'تسجيل بواسطة Apple' : 'Sign up with Apple'}</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/60 w-full" />
            <span className="bg-card px-3 text-[11px] font-bold text-muted-foreground uppercase font-mono tracking-wider shrink-0">
              {isRtl ? 'أو إكمال البيانات بالكامل' : 'Or fill registration details'}
            </span>
            <div className="border-t border-border/60 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection (Student / Parent / Teacher) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">
                {isRtl ? 'اختر صفتك في المنصة (الدور):' : 'Select Your Primary Role:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', labelAr: 'طالب / متعلم', labelEn: 'Student', icon: GraduationCap, descAr: 'تدريب الألعاب والمهارات' },
                  { id: 'parent', labelAr: 'ولي أمر', labelEn: 'Parent', icon: Users, descAr: 'متابعة الأبناء' },
                  { id: 'teacher', labelAr: 'معلم / مدرب', labelEn: 'Teacher', icon: Award, descAr: 'إدارة الفصول والتقييم' },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleChange('role', r.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20 ring-2 ring-primary/30'
                          : 'border-border/70 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-xs font-bold">{isRtl ? r.labelAr : r.labelEn}</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:block">
                        {isRtl ? r.descAr : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.role && <span className="text-[11px] text-destructive font-medium">{errors.role}</span>}
            </div>

            {/* Row 1: Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder={isRtl ? 'سارة التميمي' : 'Sara Al-Tamimi'}
                    className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      errors.fullName ? 'border-destructive' : 'border-border/70'
                    }`}
                  />
                  <User className="h-4 w-4 text-muted-foreground absolute top-3.5 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
                </div>
                {errors.fullName && <span className="text-[11px] text-destructive font-medium">{errors.fullName}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'اسم المستخدم (User ID)' : 'Username'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    placeholder="sara_tamimi"
                    className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      errors.username ? 'border-destructive' : 'border-border/70'
                    }`}
                  />
                  <AtSign className="h-4 w-4 text-muted-foreground absolute top-3.5 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
                </div>
                {errors.username && <span className="text-[11px] text-destructive font-medium">{errors.username}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">
                {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="sara@example.com"
                  className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                    errors.email ? 'border-destructive' : 'border-border/70'
                  }`}
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute top-3.5 left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
              </div>
              {errors.email && <span className="text-[11px] text-destructive font-medium">{errors.email}</span>}
            </div>

            {/* Row 2: Country, Language & Date of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'الدولة' : 'Country'}
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full h-11 px-3 rounded-2xl bg-secondary/30 border border-border/70 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.nameAr} className="bg-card text-foreground">
                      {isRtl ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
                {errors.country && <span className="text-[11px] text-destructive font-medium">{errors.country}</span>}
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'لغة الواجهة' : 'Language'}
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value as 'ar' | 'en')}
                  className="w-full h-11 px-3 rounded-2xl bg-secondary/30 border border-border/70 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                >
                  <option value="ar" className="bg-card text-foreground">العربية (Arabic)</option>
                  <option value="en" className="bg-card text-foreground">English</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'تاريخ الميلاد' : 'Date of Birth'}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className={`w-full h-11 px-3 rounded-2xl bg-secondary/30 border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      errors.dateOfBirth ? 'border-destructive' : 'border-border/70'
                    }`}
                  />
                </div>
                {errors.dateOfBirth && <span className="text-[11px] text-destructive font-medium">{errors.dateOfBirth}</span>}
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="pt-1 space-y-1">
                    <div className="flex gap-1 h-1.5 w-full">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-all ${
                            strength >= step
                              ? strength === 4
                                ? 'bg-emerald-500'
                                : strength >= 2
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                              : 'bg-border/60'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold block">
                      {strength <= 1 && (isRtl ? 'كلمة مرور ضعيفة' : 'Weak password')}
                      {strength === 2 && (isRtl ? 'كلمة مرور متوسطة' : 'Fair password')}
                      {strength === 3 && (isRtl ? 'كلمة مرور جيدة' : 'Good password')}
                      {strength === 4 && (isRtl ? 'كلمة مرور ممتازة وقوية' : 'Strong password')}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  {isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className={`w-full h-11 px-4 rounded-2xl bg-secondary/30 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      errors.confirmPassword ? 'border-destructive' : 'border-border/70'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-3.5 left-4 rtl:left-auto rtl:right-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-[11px] text-destructive font-medium">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Terms & Privacy */}
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              {isRtl ? 'بالنقر على "إنشاء الحساب"، أنت توافق على ' : 'By clicking "Create Account", you agree to our '}
              <Link href="/terms" className="text-primary underline font-medium">
                {isRtl ? 'شروط الاستخدام' : 'Terms of Service'}
              </Link>{' '}
              {isRtl ? 'و' : 'and'}{' '}
              <Link href="/privacy" className="text-primary underline font-medium">
                {isRtl ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy'}
              </Link>.
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-12 rounded-2xl font-bold btn-3d btn-3d-primary shadow-lg shadow-primary/25 text-sm gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isRtl ? 'جاري إنشاء الحساب وتخصيص الخريطة...' : 'Creating your account...'}</span>
                </>
              ) : (
                <>
                  <span>{isRtl ? 'إنشاء حساب جديد والبدء مجاناً' : 'Create Free Account'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer Login Link */}
        <p className="text-center text-xs text-muted-foreground">
          {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link
            href="/login"
            onClick={() => playSound('click')}
            className="font-bold text-primary hover:underline ml-1 rtl:mr-1"
          >
            {isRtl ? 'سجل دخولك من هنا' : 'Sign in here'}
          </Link>
        </p>

      </div>
    </div>
  );
}
