-- ==============================================================================
-- The Loft by NM: Pre-Launch VIP Waitlist Schema Migration
-- Run this script in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Create the dedicated VIP Waitlist table
CREATE TABLE IF NOT EXISTS public.vip_waitlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT DEFAULT 'VIP Guest',
    contact_value TEXT NOT NULL,
    contact_type TEXT DEFAULT 'whatsapp' CHECK (contact_type IN ('whatsapp', 'email', 'phone')),
    interest TEXT DEFAULT 'services' CHECK (interest IN ('services', 'menu', 'all')),
    notes TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'contacted', 'invited', 'booked', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.vip_waitlist ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies:
-- Allow the public (unauthenticated website visitors) to join the waitlist
DROP POLICY IF EXISTS "Public can join VIP waitlist" ON public.vip_waitlist;
CREATE POLICY "Public can join VIP waitlist" 
ON public.vip_waitlist 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated administrators to view, update, and manage the waitlist
DROP POLICY IF EXISTS "Authenticated admins can view waitlist" ON public.vip_waitlist;
CREATE POLICY "Authenticated admins can view waitlist" 
ON public.vip_waitlist 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Authenticated admins can update waitlist" ON public.vip_waitlist;
CREATE POLICY "Authenticated admins can update waitlist" 
ON public.vip_waitlist 
FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Authenticated admins can delete waitlist entries" ON public.vip_waitlist;
CREATE POLICY "Authenticated admins can delete waitlist entries" 
ON public.vip_waitlist 
FOR DELETE 
TO authenticated 
USING (true);

-- 4. Create Performance Indexes for fast filtering & searching
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_created_at ON public.vip_waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_status ON public.vip_waitlist (status);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_interest ON public.vip_waitlist (interest);
CREATE INDEX IF NOT EXISTS idx_vip_waitlist_contact_value ON public.vip_waitlist (contact_value);

-- 5. Data Migration: Automatically copy any existing waitlist registrations from contacts table
INSERT INTO public.vip_waitlist (name, contact_value, contact_type, interest, notes, status, created_at)
SELECT 
    name,
    COALESCE(NULLIF(phone, ''), email) AS contact_value,
    CASE 
        WHEN phone IS NOT NULL AND phone != '' THEN 'whatsapp' 
        ELSE 'email' 
    END AS contact_type,
    CASE 
        WHEN subject ILIKE '%menu%' THEN 'menu' 
        ELSE 'services' 
    END AS interest,
    message AS notes,
    CASE 
        WHEN status = 'read' THEN 'contacted' 
        ELSE 'registered' 
    END AS status,
    created_at
FROM public.contacts
WHERE (subject ILIKE '%waitlist%' OR message ILIKE '%waitlist%')
ON CONFLICT DO NOTHING;

-- Verification query
SELECT COUNT(*) AS total_vip_leads FROM public.vip_waitlist;

-- ==============================================================================
-- 6. Site Settings Table (Optional: stores Launch Mode globally in Supabase)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- Insert default pre-launch setting
INSERT INTO public.site_settings (key, value)
VALUES ('launch_mode', 'pre-launch')
ON CONFLICT (key) DO NOTHING;

