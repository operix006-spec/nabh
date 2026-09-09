-- =============================================================================
-- NABH (نَبِه) - ENTERPRISE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Production-Ready for Next.js 15, PostgreSQL & Supabase Auth
-- Roles: Super Admin (Owner), Admin, Teacher, Parent, Student
-- Protection: First Registered Administrator becomes the untouchable Owner.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ENUMS & DOMAIN DEFINITIONS
-- =============================================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'teacher', 'parent', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise', 'institution');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cognitive_domain AS ENUM ('memory', 'attention', 'speed', 'flexibility', 'spatial', 'logic', 'social');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'mastery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. USER PROFILES TABLE (Linked with auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    is_owner BOOLEAN NOT NULL DEFAULT FALSE, -- Primary untouchable Super Admin / Owner flag
    xp INT NOT NULL DEFAULT 100,
    level INT NOT NULL DEFAULT 1,
    coins INT NOT NULL DEFAULT 150,
    badges JSONB NOT NULL DEFAULT '["welcome_cadet"]'::jsonb,
    achievements JSONB NOT NULL DEFAULT '["first_step"]'::jsonb,
    current_skill TEXT DEFAULT 'working-memory-span',
    completed_skills TEXT[] NOT NULL DEFAULT '{}',
    daily_streak INT NOT NULL DEFAULT 1,
    best_streak INT NOT NULL DEFAULT 1,
    subscription subscription_tier NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    language TEXT NOT NULL DEFAULT 'ar' CHECK (language IN ('ar', 'en')),
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    country TEXT DEFAULT 'Saudi Arabia',
    date_of_birth DATE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    ban_reason TEXT,
    suspended_until TIMESTAMPTZ,
    notification_settings JSONB NOT NULL DEFAULT '{
        "emailAlerts": true,
        "dailyReminder": true,
        "achievementCelebrations": true,
        "weeklyReport": true
    }'::jsonb,
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist even if public.profiles already existed before this migration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_owner BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INT NOT NULL DEFAULT 100;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INT NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS coins INT NOT NULL DEFAULT 150;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges JSONB NOT NULL DEFAULT '["welcome_cadet"]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB NOT NULL DEFAULT '["first_step"]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_skill TEXT DEFAULT 'working-memory-span';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS completed_skills TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_streak INT NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS best_streak INT NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription subscription_tier NOT NULL DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'ar';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT NOT NULL DEFAULT 'light';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_settings JSONB NOT NULL DEFAULT '{"emailAlerts": true, "dailyReminder": true, "achievementCelebrations": true, "weeklyReport": true}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Automatically promote mocvskhfssr@gmail.com to Owner / Super Admin if account exists
UPDATE public.profiles 
SET is_owner = TRUE, role = 'super_admin' 
WHERE lower(email) = 'mocvskhfssr@gmail.com';

-- Indexing for fast lookups & admin searches
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_owner ON public.profiles(is_owner);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- =============================================================================
-- 3. SECURITY FUNCTIONS FOR OWNER & ADMINS
-- =============================================================================

-- Helper function: Check if current auth user is the primary Owner (mocvskhfssr@gmail.com)
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (is_owner = TRUE OR lower(email) = 'mocvskhfssr@gmail.com')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current auth user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role IN ('super_admin', 'admin') OR is_owner = TRUE)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. OWNER PROTECTION TRIGGER:
-- 1. Regular Admins CANNOT modify or delete the Owner account.
-- 2. Only the Owner can promote, demote, or create/delete Admin accounts.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.enforce_owner_security()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. PROTECT OWNER ACCOUNT:
    -- If the targeted account is the Owner, NO ONE other than the Owner himself can touch it!
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') AND OLD.is_owner = TRUE THEN
        IF auth.uid() IS NOT NULL AND auth.uid() != OLD.id THEN
            RAISE EXCEPTION 'Security Violation: Regular administrators cannot modify, suspend, or delete the Owner account.';
        END IF;

        -- Prevent accidental deletion of the Owner account
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Security Violation: The primary Owner account cannot be deleted from the administration interface.';
        END IF;
    END IF;

    -- 2. ROLE PROMOTION & DEMOTION ENFORCEMENT:
    -- Only the Owner can assign admin / super_admin role, or demote an admin
    IF TG_OP = 'UPDATE' THEN
        IF (NEW.role IN ('admin', 'super_admin') AND OLD.role NOT IN ('admin', 'super_admin'))
           OR (OLD.role IN ('admin', 'super_admin') AND NEW.role NOT IN ('admin', 'super_admin'))
           OR (NEW.is_owner != OLD.is_owner) THEN
            
            -- If triggered by an authenticated client, verify they are the Owner
            IF auth.uid() IS NOT NULL AND NOT public.is_owner() THEN
                RAISE EXCEPTION 'Security Violation: Only the platform Owner can promote users to Admin or demote Admins.';
            END IF;
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        -- If deleting an admin, ensure actor is Owner
        IF OLD.role IN ('admin', 'super_admin') AND auth.uid() IS NOT NULL AND NOT public.is_owner() THEN
            RAISE EXCEPTION 'Security Violation: Only the platform Owner can delete an Admin account.';
        END IF;
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_owner_security ON public.profiles;
CREATE TRIGGER trg_enforce_owner_security
    BEFORE UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.enforce_owner_security();

-- =============================================================================
-- 5. ROLE-BASED PERMISSIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.roles_permissions (
    role user_role PRIMARY KEY,
    permissions TEXT[] NOT NULL,
    description TEXT
);

INSERT INTO public.roles_permissions (role, permissions, description)
VALUES 
    ('super_admin', ARRAY['all:manage', 'owner:full_authority', 'admins:manage', 'settings:security', 'logs:audit', 'billing:all'], 'Sole platform Owner with ultimate authority'),
    ('admin', ARRAY['users:manage', 'content:manage', 'reports:view', 'support:manage'], 'Operational system administrator (cannot modify Owner)'),
    ('teacher', ARRAY['students:view', 'classes:manage', 'assignments:create', 'assessments:view', 'reports:export'], 'Educator supervising enrolled students'),
    ('parent', ARRAY['children:view', 'progress:track', 'subscriptions:manage', 'reports:view'], 'Guardian tracking student progress'),
    ('student', ARRAY['games:play', 'skills:train', 'profile:update', 'achievements:view'], 'Learner completing cognitive assessments')
ON CONFLICT (role) DO UPDATE SET permissions = EXCLUDED.permissions;

-- =============================================================================
-- 6. COGNITIVE SKILLS TABLE (All 50 Skills)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.cognitive_skills (
    id TEXT PRIMARY KEY,
    number INT UNIQUE NOT NULL,
    domain cognitive_domain NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    difficulty skill_difficulty NOT NULL DEFAULT 'intermediate',
    level INT NOT NULL DEFAULT 1,
    target_game_id TEXT NOT NULL,
    passing_score INT NOT NULL DEFAULT 70,
    estimated_minutes INT NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. INTERACTIVE COGNITIVE GAMES (14 Game Engines)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    domain cognitive_domain NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    default_duration_sec INT NOT NULL DEFAULT 60,
    icon TEXT,
    difficulty skill_difficulty NOT NULL DEFAULT 'intermediate',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.games ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS default_duration_sec INT NOT NULL DEFAULT 60;

-- =============================================================================
-- 8. GAME SESSIONS & TELEMETRY
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES public.cognitive_skills(id),
    game_id TEXT NOT NULL REFERENCES public.games(id),
    score INT NOT NULL DEFAULT 0,
    stars_earned INT NOT NULL DEFAULT 0 CHECK (stars_earned BETWEEN 0 AND 3),
    xp_earned INT NOT NULL DEFAULT 50,
    coins_earned INT NOT NULL DEFAULT 15,
    mean_reaction_time_ms NUMERIC(7, 2),
    fastest_reaction_time_ms NUMERIC(7, 2),
    accuracy_rate NUMERIC(5, 2),
    duration_seconds INT NOT NULL,
    telemetry JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON public.game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at);

-- =============================================================================
-- 9. ASSESSMENTS & BENCHMARKS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    skills_included TEXT[] NOT NULL,
    total_minutes INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id TEXT NOT NULL REFERENCES public.assessments(id),
    overall_nci INT NOT NULL,
    domain_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    percentile_rank NUMERIC(5, 2) NOT NULL,
    report_pdf_url TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 10. ACHIEVEMENTS & BADGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    xp_reward INT NOT NULL DEFAULT 200,
    coin_reward INT NOT NULL DEFAULT 50,
    category TEXT NOT NULL DEFAULT 'milestone'
);

-- =============================================================================
-- 11. SUBSCRIPTIONS & PAYMENTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'SAR',
    period TEXT NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly', 'lifetime')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'SAR',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    provider TEXT NOT NULL DEFAULT 'stripe',
    payment_method TEXT NOT NULL DEFAULT 'credit_card',
    invoice_number TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 12. SUPPORT TICKETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT NOT NULL DEFAULT 'technical',
    admin_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS admin_response TEXT;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'technical';
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS status ticket_status DEFAULT 'open';

-- =============================================================================
-- 13. AUDIT & ACTIVITY LOGS (Owner-Only Access)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_resource TEXT NOT NULL,
    changes JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS target_resource TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS changes JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- =============================================================================
-- 14. PLATFORM SETTINGS (Owner-Managed)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_security_setting BOOLEAN NOT NULL DEFAULT FALSE,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS is_security_setting BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS value JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- =============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES:
DROP POLICY IF EXISTS "Public can view basic profiles" ON public.profiles;
CREATE POLICY "Public can view basic profiles" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id 
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        AND is_owner = (SELECT is_owner FROM public.profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins manage non-owner users" ON public.profiles;
CREATE POLICY "Admins manage non-owner users" ON public.profiles
    FOR ALL USING (
        public.is_admin() 
        AND (is_owner = FALSE OR auth.uid() = id)
    );

DROP POLICY IF EXISTS "Owner full profile authority" ON public.profiles;
CREATE POLICY "Owner full profile authority" ON public.profiles
    FOR ALL USING (public.is_owner());

-- AUDIT LOGS POLICIES:
DROP POLICY IF EXISTS "Owner only audit access" ON public.audit_logs;
CREATE POLICY "Owner only audit access" ON public.audit_logs
    FOR ALL USING (public.is_owner());

-- USER ACTIVITY LOGS POLICIES:
DROP POLICY IF EXISTS "Owner and Admins view activity logs" ON public.user_activity_logs;
CREATE POLICY "Owner and Admins view activity logs" ON public.user_activity_logs
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "System insert activity logs" ON public.user_activity_logs;
CREATE POLICY "System insert activity logs" ON public.user_activity_logs
    FOR INSERT WITH CHECK (true);

-- PLATFORM SETTINGS POLICIES:
DROP POLICY IF EXISTS "Public view non-security settings" ON public.platform_settings;
CREATE POLICY "Public view non-security settings" ON public.platform_settings
    FOR SELECT USING (is_security_setting = FALSE OR public.is_owner());

DROP POLICY IF EXISTS "Owner only manages platform settings" ON public.platform_settings;
CREATE POLICY "Owner only manages platform settings" ON public.platform_settings
    FOR ALL USING (public.is_owner());

-- GAME SESSIONS POLICIES:
DROP POLICY IF EXISTS "Users view own sessions" ON public.game_sessions;
CREATE POLICY "Users view own sessions" ON public.game_sessions
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users insert own sessions" ON public.game_sessions;
CREATE POLICY "Users insert own sessions" ON public.game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- COGNITIVE SKILLS & GAMES POLICIES:
DROP POLICY IF EXISTS "Public can view skills" ON public.cognitive_skills;
CREATE POLICY "Public can view skills" ON public.cognitive_skills
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage skills" ON public.cognitive_skills;
CREATE POLICY "Admins manage skills" ON public.cognitive_skills
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public can view games" ON public.games;
CREATE POLICY "Public can view games" ON public.games
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage games" ON public.games;
CREATE POLICY "Admins manage games" ON public.games
    FOR ALL USING (public.is_admin());

-- SUPPORT TICKETS POLICIES:
DROP POLICY IF EXISTS "Users view own tickets" ON public.support_tickets;
CREATE POLICY "Users view own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users create tickets" ON public.support_tickets;
CREATE POLICY "Users create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage tickets" ON public.support_tickets;
CREATE POLICY "Admins manage tickets" ON public.support_tickets
    FOR ALL USING (public.is_admin());

-- =============================================================================
-- 16. AUTOMATED FIRST USER / ADMINISTRATOR -> OWNER TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role user_role := 'student';
    assigned_is_owner BOOLEAN := FALSE;
    user_name TEXT;
    u_username TEXT;
    owner_count INT;
BEGIN
    SELECT COUNT(*) INTO owner_count FROM public.profiles WHERE is_owner = TRUE;

    -- Exclusive Rule: mocvskhfssr@gmail.com is always the Owner/Super Admin
    IF lower(NEW.email) = 'mocvskhfssr@gmail.com' OR owner_count = 0 THEN
        assigned_role := 'super_admin';
        assigned_is_owner := TRUE;
    ELSE
        IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
            BEGIN
                assigned_role := (NEW.raw_user_meta_data->>'role')::user_role;
                IF assigned_role = 'super_admin' THEN
                    assigned_role := 'student';
                END IF;
            EXCEPTION WHEN OTHERS THEN
                assigned_role := 'student';
            END;
        END IF;
        assigned_is_owner := FALSE;
    END IF;

    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    u_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 4));

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        username,
        role,
        is_owner,
        country,
        language,
        avatar_url,
        date_of_birth
    ) VALUES (
        NEW.id,
        NEW.email,
        user_name,
        u_username,
        assigned_role,
        assigned_is_owner,
        COALESCE(NEW.raw_user_meta_data->>'country', 'Saudi Arabia'),
        COALESCE(NEW.raw_user_meta_data->>'language', 'ar'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', null),
        CASE 
            WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'date_of_birth')::date 
            ELSE NULL 
        END
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    INSERT INTO public.user_activity_logs (user_id, action, metadata)
    VALUES (
        NEW.id, 
        CASE WHEN assigned_is_owner THEN 'first_owner_established' ELSE 'user_registered' END, 
        jsonb_build_object('email', NEW.email, 'role', assigned_role, 'is_owner', assigned_is_owner)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 17. OWNER MANAGEMENT PROCEDURES (Callable exclusively by Owner)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF NOT public.is_owner() THEN
        RAISE EXCEPTION 'Access Denied: Only the platform Owner can promote users to Administrator.';
    END IF;

    UPDATE public.profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id AND is_owner = FALSE;

    INSERT INTO public.audit_logs (admin_id, action, target_user_id, target_resource, changes)
    VALUES (auth.uid(), 'promote_to_admin', target_user_id, 'profiles', '{"role": "admin"}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.demote_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    IF NOT public.is_owner() THEN
        RAISE EXCEPTION 'Access Denied: Only the platform Owner can demote an Administrator.';
    END IF;

    IF target_user_id = auth.uid() THEN
        RAISE EXCEPTION 'Invalid Operation: Owner cannot demote their own account.';
    END IF;

    UPDATE public.profiles
    SET role = 'student', updated_at = NOW()
    WHERE id = target_user_id AND is_owner = FALSE;

    INSERT INTO public.audit_logs (admin_id, action, target_user_id, target_resource, changes)
    VALUES (auth.uid(), 'demote_admin', target_user_id, 'profiles', '{"role": "student"}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 18. STORAGE BUCKETS CONFIGURATION (Safe block)
-- =============================================================================
DO $$ BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES 
        ('avatars', 'avatars', true),
        ('game_assets', 'game_assets', true),
        ('certificates', 'certificates', false),
        ('reports', 'reports', false)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public view avatars" ON storage.objects;
    CREATE POLICY "Public view avatars" ON storage.objects
        FOR SELECT USING (bucket_id = 'avatars');

    DROP POLICY IF EXISTS "Authenticated users upload avatars" ON storage.objects;
    CREATE POLICY "Authenticated users upload avatars" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- =============================================================================
-- 19. SEED DATA (14 Games & Platform Settings with Security Flags)
-- =============================================================================

INSERT INTO public.games (id, name_ar, name_en, domain, description_ar, description_en, difficulty)
VALUES
    ('drag-and-drop', 'السحب والإفلات الإدراكي', 'Drag & Drop Executive Classifier', 'flexibility', 'تصنيف المثيرات بالسحب والإفلات نحو السلال الإدراكية', 'Sort stimuli by dragging into neural category bins', 'intermediate'),
    ('memory-game', 'مصفوفة الذاكرة المكانية', 'Spatial Memory Matrix', 'memory', 'تذكر مواقع المربعات المضيئة على رقعة تتسع تدريجياً', 'Recall positions of illuminated tiles in expanding grids', 'intermediate'),
    ('matching', 'مطابقة الأزواج البصرية', 'Visual Pairs Matching', 'memory', 'تقليب البطاقات واكتشاف الأزواج المتطابقة', 'Flip cards to discover associative cognitive pairs', 'beginner'),
    ('sorting', 'التصنيف التنفيذي والقواعد', 'Executive Rule Sorting', 'flexibility', 'اختبار ويسكونسن: تصنيف البطاقات وفق قواعد متغيرة غير معلنة', 'Wisconsin card sorting with dynamic shifting rules', 'advanced'),
    ('visual-recognition', 'التمييز البصري السريع', 'Visual Odd-One-Out', 'speed', 'اكتشاف الرمز المنفرد بين المشتتات البصرية المعقدة', 'Locate the unique target stimulus amidst distractors', 'beginner'),
    ('pattern-recognition', 'إدراك الأنماط والمصفوفات', 'Matrix Pattern Completion', 'logic', 'استنتاج الرمز المتمم للمصفوفة الهندسية 3x3', 'Induce transformation rules across progressive matrices', 'advanced'),
    ('shape-puzzle', 'ألغاز الأشكال ثلاثية الأبعاد', 'Shape 3D Mental Rotation', 'spatial', 'تدوير الأشكال الفراغية ذهنياً ومقارنتها للتطابق', 'Mentally rotate 3D structures to check congruence', 'advanced'),
    ('color-matching', 'مطابقة الألوان وصراع ستروب', 'Stroop Color Clash', 'attention', 'تحدي ستروب: مطابقة حبر الكلمة مع لونها الحقيقي', 'Inhibit automatic verbal reading to match chromatic font', 'advanced'),
    ('sound-matching', 'مطابقة الترددات الصوتية', 'Acoustic Sound Matching', 'attention', 'الاستماع للنغمة ومطابقتها بالتردد الصحيح', 'Listen to reference probe and match identical harmonic tone', 'intermediate'),
    ('reaction-game', 'نبض سرعة الاستجابة', 'Speed Reflex Chronometry', 'speed', 'قياس زمن الرجع الحركي البصري بالميللي ثانية', 'Visual motor reaction chronometry with sub-second accuracy', 'beginner'),
    ('sequence-game', 'تسلسل الذاكرة المتتابعة', 'Sequence Recall Memory', 'memory', 'إعادة عزف تسلسل الومضات والنغمات المتسعة تدريجياً', 'Replay auditory-visual sequences of expanding span length', 'intermediate'),
    ('logic-puzzle', 'معضلات الاستدلال المنطقي', 'Deductive Logic Puzzle', 'logic', 'حل الألغاز المنطقية المعتمدة على القياس والاستنتاج', 'Solve multi-premise formal syllogisms and constraints', 'advanced'),
    ('task-switcher', 'التبديل التنفيذي بين المهام', 'Executive Task Switcher', 'flexibility', 'التبديل الفوري بين قواعد الألوان والأشكال لكبح الجمود', 'Rapid task rule switching between chromatic and morphological rules', 'advanced'),
    ('word-loom', 'الطلاقة اللفظية وسرعة المعجم', 'Word Loom Phonemic Fluency', 'logic', 'استدعاء الكلمات المعجمية المقيدة بزمن صوتي محدد', 'Phonemic verbal fluency retrieval under chrono-constraints', 'intermediate')
ON CONFLICT (id) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en;

INSERT INTO public.platform_settings (key, value, description, is_security_setting)
VALUES
    ('platform_info', '{
        "nameAr": "نَبِـه للتدريب الإدراكي",
        "nameEn": "Nabh Cognitive Systems",
        "taglineAr": "منصة قياس وتدريب 50 مهارة عصبية متقدمة",
        "taglineEn": "50 Neurological Skills Evaluation Platform",
        "supportEmail": "support@nabh.ai",
        "version": "1.0.0"
    }'::jsonb, 'General branding and metadata', false),
    ('security_policies', '{
        "requireEmailVerification": true,
        "enforceRateLimiting": true,
        "maxLoginAttempts": 5,
        "lockoutMinutes": 15,
        "sessionTimeoutHours": 24,
        "mfaEnabled": false,
        "ownerOnlyPromotions": true
    }'::jsonb, 'Platform security and authentication rules (Owner Locked)', true),
    ('smtp_config', '{
        "host": "smtp.sendgrid.net",
        "port": 587,
        "senderName": "Nabh Platform",
        "senderEmail": "noreply@nabh.ai",
        "status": "ready"
    }'::jsonb, 'Outbound email notifications (Owner Locked)', true),
    ('maintenance_mode', '{"enabled": false, "messageAr": "المنصة تحت الصيانة المجدولة", "messageEn": "Platform under scheduled maintenance"}'::jsonb, 'Emergency or maintenance toggle', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    is_security_setting = EXCLUDED.is_security_setting;
