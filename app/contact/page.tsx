'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Brain,
  MessageSquare,
  Building,
  GraduationCap,
} from 'lucide-react';

export default function ContactPage() {
  const { language } = useLanguage();
  const { playSound } = useSound();
  const isRtl = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSending(true);
    playSound('click');

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      playSound('fanfare');
    }, 800);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
          <MessageSquare className="h-4 w-4" />
          <span>{isRtl ? 'تواصل مع فريق نَبِه' : 'Get In Touch'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-foreground mb-6">
          {isRtl ? 'نحن هنا للإجابة على استفساراتك' : 'We’d Love to Hear From You'}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {isRtl
            ? 'سواء كنت متعلماً، معلماً، باحثاً في علم الأعصاب أو ممثلاً لمؤسسة تعليمية، فريقنا جاهز لخدمتك.'
            : 'Whether you are a learner, teacher, neuroscience researcher, or institutional partner, our team is at your service.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 backdrop-blur-xl shadow-lg space-y-6">
            <h3 className="text-xl font-bold font-heading text-foreground">
              {isRtl ? 'معلومات التواصل المباشر' : 'Direct Channels'}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-muted-foreground block">{isRtl ? 'البريد الإلكتروني' : 'Email'}</span>
                  <a href="mailto:support@nabh.ai" className="font-bold text-foreground hover:text-primary transition-colors">
                    support@nabh.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-muted-foreground block">{isRtl ? 'الهاتف الموحد' : 'Phone'}</span>
                  <span className="font-bold text-foreground font-mono">+966 11 800 NABH</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-muted-foreground block">{isRtl ? 'المقر الإقليمي' : 'Headquarters'}</span>
                  <span className="font-medium text-foreground">
                    {isRtl ? 'مجمع الابتكار الرقمي، الرياض، المملكة العربية السعودية' : 'Digital Innovation Hub, Riyadh, KSA'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-muted-foreground block">{isRtl ? 'متوسط سرعة الاستجابة' : 'Response SLA'}</span>
                  <span className="font-medium text-foreground">
                    {isRtl ? 'خلال أقل من 12 ساعة طوال أيام الأسبوع' : 'Under 12 hours, 7 days a week'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-8 sm:p-12 backdrop-blur-2xl shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black font-heading text-foreground">
                  {isRtl ? 'تم استلام رسالتك بنجاح!' : 'Message Received Successfully!'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {isRtl
                    ? 'شكراً لتواصلك معنا. قام نظام التذاكر بتحويل استفسارك إلى الفريق المختص، وسنتواصل معك خلال ساعات قليلة.'
                    : 'Thank you for reaching out. Our cognitive operations team has received your inquiry and will reply shortly.'}
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="rounded-2xl font-bold btn-3d btn-3d-primary mt-4"
                >
                  {isRtl ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {isRtl ? 'الاسم الكامل' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isRtl ? 'د. ناصر السعيد' : 'Nasser Al-Saeed'}
                      className="w-full h-12 rounded-2xl border border-input bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@institution.edu"
                      className="w-full h-12 rounded-2xl border border-input bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {isRtl ? 'القسم المختص بالاستفسار' : 'Department'}
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-input bg-background/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="general">{isRtl ? 'استفسار عام ودعم المتعلمين' : 'General & Learner Support'}</option>
                    <option value="schools">{isRtl ? 'المدارس والاشتراكات التعليمية' : 'Schools & Cohort Licensing'}</option>
                    <option value="clinical">{isRtl ? 'الشراكات السريرية والبحثية' : 'Clinical & Neuro-Research'}</option>
                    <option value="press">{isRtl ? 'الإعلام والعلاقات العامة' : 'Press & Media Inquiries'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    {isRtl ? 'نص الرسالة أو الاستفسار' : 'Message'}
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isRtl ? 'اكتب استفسارك هنا بكل وضوح...' : 'How can we assist you today?'}
                    className="w-full rounded-2xl border border-input bg-background/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  size="lg"
                  className="w-full h-12 rounded-2xl font-bold btn-3d btn-3d-primary shadow-xl gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSending ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرسالة' : 'Submit Message')}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
