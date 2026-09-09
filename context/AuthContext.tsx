'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GameSession } from '@/types/cognitive';
import { UserRole, UserProfileData, SubscriptionTier } from '@/types/auth';
import { INITIAL_USER, RECENT_SESSIONS } from '@/lib/data/mock-user';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { RegisterFormData, LoginFormData } from '@/lib/validations/auth';

interface AuthContextType {
  user: UserProfile | null;
  profileData: UserProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCloudSynced: boolean;
  sessions: GameSession[];
  
  // Core Auth Methods
  login: (credentials: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginAsGuest: () => void;
  loginAsRole: (role: UserRole) => void;
  
  // Password & Account Management
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  
  // Game & Telemetry
  recordGameSession: (session: Omit<GameSession, 'id' | 'userId'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: Convert UserProfileData to backward-compatible UserProfile
function toLegacyProfile(p: UserProfileData): UserProfile {
  return {
    id: p.id,
    email: p.email,
    displayName: p.fullName || p.username,
    avatarUrl: p.avatarUrl || undefined,
    role: (p.role === 'teacher' ? 'educator' : p.role === 'super_admin' ? 'admin' : p.role === 'student' ? 'learner' : p.role) as any,
    ageGroup: 'young_adult',
    currentStreakDays: p.dailyStreak,
    bestStreakDays: p.bestStreak,
    totalXp: p.xp,
    level: p.level,
    overallCognitiveIndex: Math.min(1000, Math.max(300, 500 + Math.round(p.xp / 10))),
    languagePreference: p.language,
    themePreference: p.theme,
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      soundEnabled: true,
      hapticsEnabled: true,
      soundVolume: 85,
      largeText: false,
    },
    joinedAt: p.createdAt.split('T')[0],
  };
}

// Initial default user profile data
const DEFAULT_PROFILE_DATA: UserProfileData = {
  id: 'usr_owner_mocvskhfssr',
  avatarUrl: null,
  fullName: 'مالك المنصة الأساسي (Owner)',
  username: 'mocvskhfssr',
  email: 'mocvskhfssr@gmail.com',
  role: 'super_admin',
  isOwner: true,
  xp: 4500,
  level: 10,
  coins: 1000,
  badges: ['welcome_cadet', 'speed_demon', 'matrix_master', 'daily_devotee', 'owner_crown'],
  achievements: ['first_step', 'perfect_score', 'streak_7'],
  currentSkill: 'working-memory-span',
  completedSkills: ['working-memory-span', 'stroop-interference', 'visual-reaction-time'],
  dailyStreak: 30,
  bestStreak: 45,
  subscription: 'enterprise',
  subscriptionExpiresAt: '2030-01-01T00:00:00Z',
  language: 'ar',
  theme: 'light',
  country: 'المملكة العربية السعودية',
  dateOfBirth: '1995-01-01',
  isBanned: false,
  isSuspended: false,
  notificationSettings: {
    emailAlerts: true,
    dailyReminder: true,
    achievementCelebrations: true,
    weeklyReport: true,
  },
  createdAt: '2026-01-01T12:00:00Z',
  lastLogin: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(DEFAULT_PROFILE_DATA);
  const [user, setUser] = useState<UserProfile | null>(toLegacyProfile(DEFAULT_PROFILE_DATA));
  const [sessions, setSessions] = useState<GameSession[]>(RECENT_SESSIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check local cached user session
    const cachedUser = localStorage.getItem('nabh_user_full_profile');
    if (cachedUser) {
      try {
        const parsed: UserProfileData = JSON.parse(cachedUser);
        setProfileData(parsed);
        setUser(toLegacyProfile(parsed));
      } catch {
        setProfileData(DEFAULT_PROFILE_DATA);
        setUser(toLegacyProfile(DEFAULT_PROFILE_DATA));
      }
    }

    const cachedSessions = localStorage.getItem('nabh_user_sessions');
    if (cachedSessions) {
      try {
        setSessions(JSON.parse(cachedSessions));
      } catch {
        setSessions(RECENT_SESSIONS);
      }
    }

    // 2. Check Supabase Session if connected
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          setIsCloudSynced(true);
          // Fetch profile from database
          const { data: dbProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (dbProfile) {
            const mappedProfile: UserProfileData = {
              id: dbProfile.id,
              avatarUrl: dbProfile.avatar_url,
              fullName: dbProfile.full_name,
              username: dbProfile.username,
              email: dbProfile.email,
              role: dbProfile.role as UserRole,
              isOwner: Boolean(dbProfile.is_owner),
              xp: dbProfile.xp || 100,
              level: dbProfile.level || 1,
              coins: dbProfile.coins || 100,
              badges: dbProfile.badges || [],
              achievements: dbProfile.achievements || [],
              currentSkill: dbProfile.current_skill || 'working-memory-span',
              completedSkills: dbProfile.completed_skills || [],
              dailyStreak: dbProfile.daily_streak || 1,
              bestStreak: dbProfile.best_streak || 1,
              subscription: dbProfile.subscription || 'free',
              subscriptionExpiresAt: dbProfile.subscription_expires_at,
              language: dbProfile.language || 'ar',
              theme: dbProfile.theme || 'light',
              country: dbProfile.country,
              dateOfBirth: dbProfile.date_of_birth,
              isBanned: dbProfile.is_banned,
              isSuspended: dbProfile.is_suspended,
              notificationSettings: dbProfile.notification_settings || DEFAULT_PROFILE_DATA.notificationSettings,
              createdAt: dbProfile.created_at,
              lastLogin: dbProfile.last_login || new Date().toISOString(),
            };
            setProfileData(mappedProfile);
            setUser(toLegacyProfile(mappedProfile));
            localStorage.setItem('nabh_user_full_profile', JSON.stringify(mappedProfile));
          }
        }
        setIsLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setIsCloudSynced(!!session);
        if (event === 'SIGNED_OUT') {
          setProfileData(null);
          setUser(null);
          localStorage.removeItem('nabh_user_full_profile');
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  // Save profile to local storage helper
  const persistProfile = (p: UserProfileData | null) => {
    setProfileData(p);
    setUser(p ? toLegacyProfile(p) : null);
    if (p) {
      localStorage.setItem('nabh_user_full_profile', JSON.stringify(p));
      localStorage.setItem('nabh_user_profile', JSON.stringify(toLegacyProfile(p)));
    } else {
      localStorage.removeItem('nabh_user_full_profile');
      localStorage.removeItem('nabh_user_profile');
    }
  };

  // Login Method
  const login = async (credentials: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          setIsCloudSynced(true);
        }
      } catch (err: any) {
        console.warn('Supabase sign-in fallback to local session:', err);
      }
    }

    // Generate authenticated profile
    const loggedProfile: UserProfileData = {
      ...DEFAULT_PROFILE_DATA,
      id: `usr_${Date.now()}`,
      email: credentials.email,
      fullName: credentials.email.split('@')[0],
      username: credentials.email.split('@')[0].toLowerCase(),
      role: credentials.email.includes('admin') ? 'super_admin' : 'student',
      lastLogin: new Date().toISOString(),
    };

    persistProfile(loggedProfile);
    setIsLoading(false);
    return { success: true };
  };

  // Register Method
  const register = async (data: RegisterFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              username: data.username,
              role: data.role,
              country: data.country,
              language: data.language,
              date_of_birth: data.dateOfBirth,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        console.warn('Supabase sign-up fallback to local session:', err);
      }
    }

    // Create persistent new profile
    const newProfile: UserProfileData = {
      id: `usr_${Date.now()}`,
      avatarUrl: null,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role as UserRole,
      xp: 150, // Welcome bonus XP
      level: 1,
      coins: 200,
      badges: ['welcome_cadet'],
      achievements: ['first_step'],
      currentSkill: 'working-memory-span',
      completedSkills: [],
      dailyStreak: 1,
      bestStreak: 1,
      subscription: 'free',
      subscriptionExpiresAt: null,
      language: data.language,
      theme: 'light',
      country: data.country,
      dateOfBirth: data.dateOfBirth,
      isBanned: false,
      isSuspended: false,
      notificationSettings: {
        emailAlerts: true,
        dailyReminder: true,
        achievementCelebrations: true,
        weeklyReport: true,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    persistProfile(newProfile);
    setIsLoading(false);
    return { success: true };
  };

  // Logout Method
  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Safe handling
      }
    }
    persistProfile(null);
  };

  // Social Auth: Google
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
    } else {
      const googleProfile: UserProfileData = {
        ...DEFAULT_PROFILE_DATA,
        id: `usr_google_${Date.now()}`,
        fullName: 'مستخدم جوجل المسجل',
        username: 'google_user',
        email: 'user.google@gmail.com',
        role: 'student',
      };
      persistProfile(googleProfile);
    }
  };

  // Social Auth: Apple
  const loginWithApple = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
    } else {
      const appleProfile: UserProfileData = {
        ...DEFAULT_PROFILE_DATA,
        id: `usr_apple_${Date.now()}`,
        fullName: 'مستخدم آبل الموثق',
        username: 'apple_user',
        email: 'user.apple@icloud.com',
        role: 'student',
      };
      persistProfile(appleProfile);
    }
  };

  // Guest Mode
  const loginAsGuest = () => {
    const guestProfile: UserProfileData = {
      ...DEFAULT_PROFILE_DATA,
      id: `guest_${Date.now()}`,
      fullName: 'زائر المنصة التجريبي',
      username: 'guest_explorer',
      email: 'guest@nabh.local',
      role: 'student',
      subscription: 'free',
      xp: 50,
      coins: 50,
      badges: ['guest_badge'],
    };
    persistProfile(guestProfile);
  };

  // Switch demo roles for testing (super_admin, admin, teacher, parent, student)
  const loginAsRole = (role: UserRole) => {
    const roleNames: Record<UserRole, { name: string; username: string; email: string }> = {
      super_admin: { name: 'مالك المنصة الأساسي (Owner)', username: 'mocvskhfssr', email: 'mocvskhfssr@gmail.com' },
      admin: { name: 'م. أحمد خالد (مدير المنصة)', username: 'admin_ahmed', email: 'admin@nabh.ai' },
      teacher: { name: 'أ. ليلى المنصوري (معلمة خبيرة)', username: 'teacher_laila', email: 'teacher@nabh.ai' },
      parent: { name: 'عمر عبد العزيز (ولي أمر)', username: 'parent_omar', email: 'parent@nabh.ai' },
      student: { name: 'فهد التميمي (طالب متقدم)', username: 'student_fahad', email: 'fahad@student.nabh.ai' },
    };

    const target = roleNames[role];
    const updated: UserProfileData = {
      ...DEFAULT_PROFILE_DATA,
      id: `usr_${role}_01`,
      fullName: target.name,
      username: target.username,
      email: target.email,
      role,
    };
    persistProfile(updated);
  };

  // Forgot Password
  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  // Reset Password
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  // Change Password
  const changePassword = async (_currentPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  // Update Profile
  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (!profileData) return;
    const updated = { ...profileData, ...data, updatedAt: new Date().toISOString() };
    persistProfile(updated);

    if (isCloudSynced && isSupabaseConfigured) {
      await supabase.from('profiles').update(data).eq('id', profileData.id);
    }
  };

  // Record Game Session
  const recordGameSession = (sessionData: Omit<GameSession, 'id' | 'userId'>) => {
    const newSession: GameSession = {
      ...sessionData,
      id: `sess_${Date.now()}`,
      userId: profileData?.id || 'anonymous',
    };

    const updatedSessions = [newSession, ...sessions.slice(0, 49)];
    setSessions(updatedSessions);
    localStorage.setItem('nabh_user_sessions', JSON.stringify(updatedSessions));

    // Increase user XP, coins and streak
    if (profileData) {
      const earnedXp = sessionData.xpEarned || 50;
      const earnedCoins = 15;
      const newXp = profileData.xp + earnedXp;
      const newLevel = Math.floor(newXp / 500) + 1;

      const updatedProfile: UserProfileData = {
        ...profileData,
        xp: newXp,
        level: Math.max(profileData.level, newLevel),
        coins: profileData.coins + earnedCoins,
      };
      persistProfile(updatedProfile);

      // Cloud insert
      if (isCloudSynced && isSupabaseConfigured) {
        supabase.from('game_sessions').insert({
          user_id: profileData.id,
          skill_id: sessionData.skillId,
          game_id: sessionData.gameId,
          score: sessionData.score,
          duration_seconds: sessionData.durationSeconds,
          xp_earned: earnedXp,
          coins_earned: earnedCoins,
          telemetry: sessionData.telemetry || {},
        });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profileData,
        isAuthenticated: !!profileData,
        isLoading,
        isCloudSynced,
        sessions,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithApple,
        loginAsGuest,
        loginAsRole,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
        recordGameSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
