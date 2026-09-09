export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'parent' | 'student';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise' | 'institution';

export interface UserNotificationSettings {
  emailAlerts: boolean;
  dailyReminder: boolean;
  achievementCelebrations: boolean;
  weeklyReport: boolean;
}

export interface UserProfileData {
  id: string; // UUID
  avatarUrl?: string | null;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  isOwner?: boolean; // Platform Owner authority
  xp: number;
  level: number;
  coins: number;
  badges: string[];
  achievements: string[];
  currentSkill: string;
  completedSkills: string[];
  dailyStreak: number;
  bestStreak: number;
  subscription: SubscriptionTier;
  subscriptionExpiresAt?: string | null;
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  country?: string;
  dateOfBirth?: string | null;
  isBanned?: boolean;
  isSuspended?: boolean;
  banReason?: string | null;
  suspendedUntil?: string | null;
  notificationSettings: UserNotificationSettings;
  createdAt: string;
  lastLogin: string;
}

export interface AuthSessionState {
  user: UserProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCloudSynced: boolean;
  rememberMe: boolean;
  error: string | null;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName?: string;
  action: string;
  targetUserId?: string;
  targetUserName?: string;
  targetResource: string;
  changes: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
