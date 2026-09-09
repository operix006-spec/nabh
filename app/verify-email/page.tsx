'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, MailCheck, Send, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = () => {
    playSound('click');
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendSuccess(true);
      playSound('success');
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6C63FF]/30 mx-auto">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {isRtl ? 'تأكيد البريد الإلكتروني' : 'Verify Your Email'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isRtl ? 'خطوة واحدة تفصلك عن تفعيل حسابك بالكامل في منصة نَبِـه' : 'One step away from activating your full Nabh cognitive journey'}
          </p>
        </div>

        <Card className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto animate-bounce">
            <MailCheck className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-foreground">
              {isRtl ? 'تحقق من صندوق بريدك الإلكتروني' : 'Check your inbox'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isRtl
                ? 'أرسلنا لك رسالة تأكيد تتضمن رابط التفعيل السريع. يرجى النقر على الرابط لتأكيد هويتك وحماية بياناتك العصبية.'
                : 'We sent an activation link to your email. Click the link to verify your identity and protect your cognitive data.'}
            </p>
          </div>

          {resendSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isRtl ? 'تمت إعادة إرسال رسالة التفعيل بنجاح!' : 'Verification link re-sent!'}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="w-full h-11 rounded-2xl font-bold text-xs gap-2 border-border/70 hover:bg-secondary/40"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {resending
                  ? isRtl ? 'جاري الإرسال...' : 'Sending...'
                  : isRtl ? 'لم تصلك الرسالة؟ إعادة الإرسال' : "Didn't receive email? Resend"}
              </span>
            </Button>

            <Link href="/login">
              <Button className="w-full h-11 rounded-2xl font-bold btn-3d btn-3d-primary shadow-sm text-xs gap-2">
                <span>{isRtl ? 'الانتقال لتسجيل الدخول' : 'Go to Login'}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
