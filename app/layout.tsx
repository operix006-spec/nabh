import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SoundProvider } from '@/context/SoundContext';
import { AuthProvider } from '@/context/AuthContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GlobalQuickNav } from '@/components/common/GlobalQuickNav';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'نَبِـه | Nabh - Cognitive Training & 50 Skills Evaluation Platform',
  description: 'Evaluate, train, and master 50 core cognitive skills across 7 neurological domains through scientifically validated interactive games.',
  keywords: ['cognitive training', 'neuroscience', 'brain games', 'nabh', 'تدريب إدراكي', 'الذكاء السائل', 'ألعاب الذاكرة', '50 مهارة ذهنية'],
  authors: [{ name: 'Nabh Cognitive Systems' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-background bg-apple-mesh text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <LanguageProvider>
            <SoundProvider>
              <AuthProvider>
                <FeedbackProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    {/* Universal Spotlight Quick-Nav (<= 3 Clicks Platform-Wide) */}
                    <GlobalQuickNav />
                  </div>
                </FeedbackProvider>
              </AuthProvider>
            </SoundProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
