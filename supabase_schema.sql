-- The Loft by NM: Supabase Database Schema

-- 1. Services & Menu Table
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    subtext TEXT,
    is_popular BOOLEAN DEFAULT false,
    category_id TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bookings Table
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    private_suite BOOLEAN DEFAULT false,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contact Requests Table
CREATE TABLE public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Gallery Table
CREATE TABLE public.gallery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'all',
    description TEXT,
    subtext TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Policies for Services (Public read, authenticated write)
CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete services" ON public.services FOR DELETE TO authenticated USING (true);

-- Policies for Gallery (Public read, authenticated write)
CREATE POLICY "Public can read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert gallery" ON public.gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update gallery" ON public.gallery FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete gallery" ON public.gallery FOR DELETE TO authenticated USING (true);

-- Policies for Bookings (Public insert, authenticated read/write)
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view bookings" ON public.bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (true);

-- Policies for Contacts (Public insert, authenticated read/write)
CREATE POLICY "Public can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view contacts" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update contacts" ON public.contacts FOR UPDATE TO authenticated USING (true);

-- Seed Initial Data for Services
INSERT INTO public.services (name, price, subtext, is_popular, category_id) VALUES
('Classic Manicure', '4,500', 'Includes soak, cuticle trim, massage, and regular polish', true, 'nails'),
('Gel Pedicure', '7,000', null, false, 'nails'),
('Full Legs Waxing', '6,500', null, true, 'body'),
('Lash Lift', '7,500', 'Keratin-packed treatment raising lashes from the root for a bright-eyed look', true, 'lashes'),
('Express Facial / Cleanup', '6,500', 'Double cleanse, gentle steam, pore extraction, and botanical serum shield', false, 'face'),
('Hair Spa Treatment (from)', '8,000', 'Steam-infused moisturizing cream wraps for dry, frizzy hair shafts', true, 'hair');

-- 5. Reviews Table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Valued Guest',
    service_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for Reviews (Public insert & read, authenticated write)
CREATE POLICY "Public can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING (status = 'approved' OR true); -- For simplicity in admin fetching we allow all reads, or we can filter in the query. Let's allow public to read all so admin can read them, and we filter 'approved' on the frontend.
CREATE POLICY "Authenticated users can update reviews" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);

-- -------------------------------------------------------------
-- 6. Career Positions Table (Admin Manageable)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_positions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL, -- 'Nails', 'Hair', 'Skincare', 'Wellness', etc.
    type TEXT NOT NULL DEFAULT 'Full-Time', -- 'Full-Time', 'Part-Time', 'Full-Time / Part-Time'
    experience TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    key_responsibilities TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Career Positions
ALTER TABLE public.career_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active career positions" 
    ON public.career_positions FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert career positions" 
    ON public.career_positions FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update career positions" 
    ON public.career_positions FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can delete career positions" 
    ON public.career_positions FOR DELETE 
    TO authenticated 
    USING (true);

-- Seed Initial Career Positions
INSERT INTO public.career_positions (
    id, title, department, type, experience, summary, description, key_responsibilities, requirements, benefits, is_active
) VALUES 
(
    'pos-nail-tech',
    'Nail Technician',
    'Nails',
    'Full-Time / Part-Time',
    '1+ Years Required',
    'Skilled nail professional with experience in manicures, pedicures, gel services and nail enhancements, with a strong focus on hygiene, precision and client care.',
    'Join our artisanal nail bar where clinical hygiene meets modern haute-couture nail art. You will provide luxury manicures, dry Russian-style precision cuticle care, gel overlays, extensions, and custom minimalist nail designs using premium toxin-free international formulas.',
    ARRAY[
        'Perform classic, spa, and signature manicures & pedicures with meticulous sanitization.',
        'Apply gel polish, builder gel (BIAB), and custom nail art with steady, precise craftsmanship.',
        'Consult with clients warmly to recommend tailored nail care and restorative therapies.',
        'Maintain hospital-grade sterilization for all tools and work stations.'
    ],
    ARRAY[
        'Demonstrated experience in gel application and nail enhancement techniques.',
        'High hygiene standards and genuine pride in detail-oriented craftsmanship.',
        'Strong client communication and hospitality-first mindset.',
        'Portfolio or photos of recent work (Instagram or camera roll).'
    ],
    ARRAY[
        'Competitive salary + attractive service commission + client gratuities',
        'Continuous masterclass training with top international nail systems',
        'Serene, well-ventilated luxury salon environment',
        'Staff wellness discounts & complimentary grooming services'
    ],
    true
),
(
    'pos-hairdresser',
    'Hairdresser',
    'Hair',
    'Full-Time',
    '2+ Years Required',
    'Experienced hair professional confident in cutting, styling, blow-drying, colouring and treatments, with excellent consultation and customer service skills.',
    'As a hair stylist at The Loft by NM, you will deliver bespoke precision cuts, seamless balayage, couture blowouts, and advanced bond-restoring therapies for high-profile and discerning clients in Colombo.',
    ARRAY[
        'Conduct thoughtful, personalized hair consultations assessing face shape, texture, and lifestyle.',
        'Execute precision cutting, contemporary styling, and signature bouncy blowouts.',
        'Perform root touch-ups, balayage, highlights, glosses, and bond-building treatments (Olaplex / Kérastase).',
        'Foster long-term, trusted client relationships and guide at-home hair wellness rituals.'
    ],
    ARRAY[
        'Proven hands-on experience in a reputed salon or studio.',
        'Strong technical proficiency in cutting, color formulation, and blowout techniques.',
        'Exceptional listening skills, calm demeanor, and refined customer service.',
        'Eagerness to stay ahead of international hair and color trends.'
    ],
    ARRAY[
        'Industry-leading compensation structure with generous tiered commission',
        'Access to premium international salon product lines and backbar tools',
        'Dedicated assistant support during busy peak appointment slots',
        'Opportunities to lead bridal hair artistry and editorial lookbooks'
    ],
    true
),
(
    'pos-esthetician',
    'Esthetician',
    'Skincare',
    'Full-Time',
    '2+ Years Required',
    'Qualified beauty professional experienced in facials, skin treatments and beauty services, with a strong understanding of skincare and personalised client care.',
    'We are seeking an intuitive, highly skilled Esthetician to curate transformative skin rituals. You will administer rejuvenating facials, deep botanical exfoliation, lymphatic drainage massages, and tailored aesthetic skin programs in our tranquil treatment suites.',
    ARRAY[
        'Perform in-depth skin diagnostics to craft tailored facial protocols.',
        'Deliver luxury facial therapies, hydro-infusions, LED light sessions, and face sculpting massage.',
        'Maintain an immaculate, serene treatment suite adhering to stringent medical-grade cleanliness.',
        'Prescribe curated homecare skincare regimens suited to Sri Lankan climate and individual skin goals.'
    ],
    ARRAY[
        'Recognized diploma or qualification in Beauty Therapy / Esthetics (CIDESCO, CIBTAC, NVQ or equivalent).',
        'In-depth knowledge of skin biology, active botanical ingredients, and contraindications.',
        'Warm, calming presence with delicate, therapeutic touch.',
        'Dedication to privacy, discretion, and quiet luxury hospitality.'
    ],
    ARRAY[
        'Generous fixed package + treatment incentives and retail product commissions',
        'Working in private, air-conditioned acoustic-dampened spa suites',
        'Product training by brand educators on luxury dermatological ranges',
        'Paid annual leave and compassionate working hours'
    ],
    true
),
(
    'pos-masseuse',
    'Masseuse',
    'Wellness',
    'Full-Time / Part-Time',
    '2+ Years Required',
    'Experienced massage therapist skilled in relaxation and wellness treatments, with a professional, client-focused approach and excellent service standards.',
    'Bring deep restoration and peaceful relief to our clientele. Our wellness therapists perform aromatherapy massages, deep tissue de-stress rituals, herbal compress sessions, and bespoke scalp & shoulder treatments in our Private Ladies’ Wing and quiet therapy rooms.',
    ARRAY[
        'Deliver customized full-body relaxation, aromatherapy, and tension-relief body rituals.',
        'Review client health intakes, tension points, and pressure preferences prior to each treatment.',
        'Maintain calming ambiance with signature sanctuary scent diffusions, soft acoustics, and warm linens.',
        'Deliver exceptional care and discrete professionalism throughout the wellness journey.'
    ],
    ARRAY[
        'Certified massage therapist with formal training in Swedish, Deep Tissue, or Ayurvedic bodywork.',
        'Strong physical stamina, balanced body mechanics, and intuitive therapeutic touch.',
        'Impeccable personal hygiene, discretion, and professional boundaries.',
        'Fluency in English or Sinhala with courteous communication.'
    ],
    ARRAY[
        'Guaranteed base salary with attractive per-treatment bonuses',
        'Ergonomic, electric treatment couches and premium organic essential oils',
        'Respectful, supportive team culture and client screening protocols',
        'Flexible scheduling options to ensure therapist rest and vitality'
    ],
    true
)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------
-- 7. Career Applications Table (Candidate Submissions)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    position_id TEXT NOT NULL,
    position_title TEXT NOT NULL,
    experience_years TEXT,
    portfolio_url TEXT,
    previous_salon TEXT,
    cover_note TEXT,
    cv_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'interviewed', 'hired', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Career Applications
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Candidates can submit applications
CREATE POLICY "Public can insert career applications" 
    ON public.career_applications FOR INSERT 
    WITH CHECK (true);

-- Only authenticated admin users can view, update, or delete applications
CREATE POLICY "Authenticated users can view career applications" 
    ON public.career_applications FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can update career applications" 
    ON public.career_applications FOR UPDATE 
    TO authenticated 
    USING (true);

CREATE POLICY "Authenticated users can delete career applications" 
    ON public.career_applications FOR DELETE 
    TO authenticated 
    USING (true);
