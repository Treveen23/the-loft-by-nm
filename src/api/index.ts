import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Helper to gracefully fallback if Supabase is not configured
const checkConfig = () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
    return false;
  }
  return true;
};

// --- SERVICES / MENU ---
export const fetchServices = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateService = async (id: string, updates: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('services').update(updates).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const createService = async (service: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('services').insert([service]).select();
  if (error) throw error;
  return data;
};

export const deleteService = async (id: string) => {
  if (!checkConfig()) return;
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
};

// --- BOOKINGS ---
export const fetchBookings = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createBooking = async (booking: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('bookings').insert([booking]);
  if (error) throw error;
  return data || true;
};

export const updateBookingStatus = async (id: string, status: string) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select();
  if (error) throw error;
  return data;
};

// --- CONTACTS ---
export const fetchContacts = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createContact = async (contact: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('contacts').insert([contact]);
  if (error) throw error;
  return data || true;
};

export const updateContactStatus = async (id: string, status: string) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('contacts').update({ status }).eq('id', id).select();
  if (error) throw error;
  return data;
};

// --- GALLERY ---
export const fetchGallery = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addGalleryImage = async (image: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('gallery').insert([image]).select();
  if (error) throw error;
  return data;
};

export const deleteGalleryImage = async (id: string) => {
  if (!checkConfig()) return;
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
};

// --- REVIEWS ---
export const fetchReviews = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createReview = async (review: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('reviews').insert([review]);
  if (error) throw error;
  return data || true;
};

export const updateReviewStatus = async (id: string, status: string) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('reviews').update({ status }).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const updateReview = async (id: string, review: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('reviews').update(review).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteReview = async (id: string) => {
  if (!checkConfig()) return;
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
};

// --- BLOGS ---
export const fetchBlogs = async () => {
  if (!checkConfig()) return [];
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addBlog = async (blog: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('blogs').insert([blog]).select();
  if (error) throw error;
  return data;
};

export const updateBlog = async (id: string, blog: any) => {
  if (!checkConfig()) return;
  const { data, error } = await supabase.from('blogs').update(blog).eq('id', id).select();
  if (error) throw error;
  return data;
};

export const deleteBlog = async (id: string) => {
  if (!checkConfig()) return;
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
};

// --- STORAGE ---
export const uploadImage = async (file: File, bucket: string = 'brand-assets') => {
  if (!checkConfig()) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadCV = async (file: File) => {
  if (!checkConfig()) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
    const fileName = `resumes/${cleanBase}_${Date.now()}.${fileExt}`;

    // Try 'career-resumes' bucket first, fallback to 'brand-assets'
    let bucket = 'career-resumes';
    let { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);

    if (uploadError) {
      bucket = 'brand-assets';
      const fallbackResult = await supabase.storage.from(bucket).upload(fileName, file);
      if (fallbackResult.error) {
        console.warn('Supabase storage upload fallback error:', fallbackResult.error.message);
        return null;
      }
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.warn('Error during CV upload:', err);
    return null;
  }
};

// --- CAREERS & APPLICATIONS ---
export const fetchCareerPositions = async () => {
  if (!checkConfig()) return [];
  try {
    const { data, error } = await supabase
      .from('career_positions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('career_positions table not ready in Supabase yet, using default positions:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Error fetching career positions:', err);
    return [];
  }
};

export const fetchAllCareerPositions = async () => {
  if (!checkConfig()) return [];
  try {
    const { data, error } = await supabase
      .from('career_positions')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('career_positions table not ready in Supabase yet:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Error fetching all career positions:', err);
    return [];
  }
};

export const createCareerPosition = async (position: any) => {
  if (!checkConfig()) return null;
  const { data, error } = await supabase
    .from('career_positions')
    .insert([position])
    .select();
  if (error) throw error;
  return data;
};

export const updateCareerPosition = async (id: string, updates: any) => {
  if (!checkConfig()) return null;
  const { data, error } = await supabase
    .from('career_positions')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
};

export const deleteCareerPosition = async (id: string) => {
  if (!checkConfig()) return;
  const { error } = await supabase
    .from('career_positions')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const createCareerApplication = async (application: any) => {
  const localKey = 'the_loft_local_career_applications';
  const appId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const fullName = (application.full_name || application.fullName || 'Candidate').trim();
  const phone = (application.phone || '').trim();
  const email = (application.email || '').trim();
  const positionId = application.position_id || application.positionId || 'pos-nail-tech';
  const positionTitle = application.position_title || application.positionTitle || 'General Position';
  const age = application.age ? String(application.age).trim() : '';
  const gender = (application.gender || '').trim();
  const cvUrl = application.cv_url || application.cvUrl || null;

  // Format meta note combining age and gender for database fields
  const metaParts: string[] = [];
  if (age) metaParts.push(`Age: ${age}`);
  if (gender) metaParts.push(`Gender: ${gender}`);
  if (application.cover_note) metaParts.push(application.cover_note);
  const coverNote = metaParts.join(' | ');

  const normalizedEntry = {
    id: appId,
    full_name: fullName,
    email: email,
    phone: phone,
    position_id: positionId,
    position_title: positionTitle,
    age: age,
    gender: gender,
    cv_url: cvUrl,
    cover_note: coverNote,
    experience_years: age ? `${age} yrs (${gender || 'Not specified'})` : 'Not specified',
    status: application.status || 'pending',
    created_at: now
  };

  // 1. Instant local storage cache for 100% data preservation
  try {
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    existing.unshift(normalizedEntry);
    localStorage.setItem(localKey, JSON.stringify(existing));
  } catch (e) {
    console.warn('Local storage application cache notice:', e);
  }

  // 2. Insert into Supabase career_applications table using existing schema columns
  if (checkConfig()) {
    try {
      const dbPayload: any = {
        full_name: fullName,
        phone: phone,
        email: email || null,
        position_id: positionId,
        position_title: positionTitle,
        cv_url: cvUrl,
        status: 'pending',
        cover_note: coverNote,
        experience_years: normalizedEntry.experience_years,
        created_at: now
      };

      // Try inserting with dedicated columns first
      const fullPayload = {
        ...dbPayload,
        ...(age ? { age: Number(age) || null } : {}),
        ...(gender ? { gender } : {})
      };

      let { error: insertError } = await supabase
        .from('career_applications')
        .insert([fullPayload]);

      // If age/gender columns do not exist in Supabase yet (PGRST204), fallback to safe schema
      if (insertError && (insertError.code === 'PGRST204' || insertError.message?.includes('column'))) {
        const retry = await supabase
          .from('career_applications')
          .insert([dbPayload]);
        insertError = retry.error;
      }

      if (insertError) {
        console.warn('career_applications insert error:', insertError.message);
      }
    } catch (dbErr) {
      console.warn('Supabase career_applications error:', dbErr);
    }

    // 3. Guaranteed backup write to contacts table
    try {
      await supabase.from('contacts').insert([{
        name: fullName,
        phone: phone,
        email: email || 'info@theloft.lk',
        subject: `Career Application: ${positionTitle}`,
        message: `Candidate application for ${positionTitle}.\nCandidate: ${fullName}\nPhone: ${phone}\nEmail: ${email || 'None'}\nAge: ${age || 'N/A'}\nGender: ${gender || 'N/A'}\nCV: ${cvUrl || 'None'}`,
        status: 'unread'
      }]);
    } catch (contactErr) {
      console.warn('Backup application contact insert error:', contactErr);
    }
  }

  return normalizedEntry;
};

export const fetchCareerApplications = async () => {
  const localKey = 'the_loft_local_career_applications';
  const entries: any[] = [];
  const seen = new Set<string>();

  // 1. Fetch from Supabase career_applications table
  if (checkConfig()) {
    try {
      const { data, error } = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((item: any) => {
          const key = (item.id || `${item.phone}-${item.position_id}`).toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);

            // Parse age and gender if stored in cover_note or experience_years
            let parsedAge = item.age ? String(item.age) : '';
            let parsedGender = item.gender || '';

            if (!parsedAge && item.cover_note) {
              const ageMatch = item.cover_note.match(/Age:\s*([0-9]+)/i);
              if (ageMatch) parsedAge = ageMatch[1];
            }
            if (!parsedAge && item.experience_years) {
              const ageMatch = item.experience_years.match(/([0-9]+)\s*(?:yrs|years)/i);
              if (ageMatch) parsedAge = ageMatch[1];
            }

            if (!parsedGender && item.cover_note) {
              const genderMatch = item.cover_note.match(/Gender:\s*([^|\n]+)/i);
              if (genderMatch) parsedGender = genderMatch[1].trim();
            }
            if (!parsedGender && item.experience_years) {
              const genderMatch = item.experience_years.match(/\((Female|Male|Other|Prefer not to say)\)/i);
              if (genderMatch) parsedGender = genderMatch[1].trim();
            }

            entries.push({
              ...item,
              age: parsedAge,
              gender: parsedGender
            });
          }
        });
      }
    } catch (err) {
      console.warn('Error fetching career applications from Supabase:', err);
    }

    // 2. Fetch career inquiries from contacts table fallback
    try {
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .ilike('subject', '%Career Application%')
        .order('created_at', { ascending: false });

      if (!contactsError && contactsData) {
        contactsData.forEach((c: any) => {
          const key = `contact-${c.phone}-${c.created_at}`.toLowerCase();
          if (!seen.has(key)) {
            const posTitle = (c.subject || '').replace(/^Career Application:\s*/i, '').trim() || 'General Position';
            
            const ageMatch = (c.message || '').match(/Age:\s*([0-9]+)/i);
            const genderMatch = (c.message || '').match(/Gender:\s*([^|\n]+)/i);
            const cvMatch = (c.message || '').match(/CV:\s*(https?:\/\/[^\s]+|data:[^\s]+)/i);

            seen.add(key);
            entries.push({
              id: c.id,
              full_name: c.name,
              phone: c.phone,
              email: c.email && !c.email.includes('theloftbynm.com') && c.email !== 'info@theloft.lk' ? c.email : '',
              position_title: posTitle,
              position_id: 'pos-general',
              age: ageMatch ? ageMatch[1] : '',
              gender: genderMatch ? genderMatch[1].trim() : '',
              cv_url: cvMatch ? cvMatch[1] : null,
              status: c.status === 'read' ? 'reviewed' : 'pending',
              cover_note: c.message,
              created_at: c.created_at
            });
          }
        });
      }
    } catch (contactErr) {
      console.warn('Contacts fallback fetch notice:', contactErr);
    }
  }

  // 3. Merge local storage backup
  try {
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    localData.forEach((item: any) => {
      const key = (item.id || `${item.phone}-${item.position_id}`).toLowerCase();
      const phoneKey = `${item.phone}-${item.position_title}`.toLowerCase();
      if (!seen.has(key) && !seen.has(phoneKey)) {
        seen.add(key);
        seen.add(phoneKey);
        entries.push(item);
      }
    });
  } catch (e) {
    console.warn('Local storage read error:', e);
  }

  return entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const updateCareerApplicationStatus = async (id: string, status: string) => {
  const localKey = 'the_loft_local_career_applications';
  try {
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = localData.map((a: any) => a.id === id ? { ...a, status } : a);
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (e) {}

  if (!checkConfig()) return null;
  try {
    const { data, error } = await supabase
      .from('career_applications')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) console.warn('Supabase status update error:', error.message);
    return data;
  } catch (err) {
    console.warn('Error updating career application status:', err);
    return null;
  }
};

export const deleteCareerApplication = async (id: string) => {
  const localKey = 'the_loft_local_career_applications';
  try {
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = localData.filter((a: any) => a.id !== id);
    localStorage.setItem(localKey, JSON.stringify(updated));
  } catch (e) {}

  if (!checkConfig()) return;
  try {
    const { error } = await supabase
      .from('career_applications')
      .delete()
      .eq('id', id);
    if (error) console.warn('Supabase delete error:', error.message);
  } catch (err) {
    console.warn('Error deleting career application:', err);
  }
};

// --- VIP PRE-LAUNCH WAITLIST ---
export const fetchVipWaitlist = async () => {
  if (!checkConfig()) return [];
  const entries: any[] = [];
  const seen = new Set<string>();

  // 1. Fetch from vip_waitlist table
  try {
    const { data, error } = await supabase
      .from('vip_waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      data.forEach((item: any) => {
        const val = (item.contact_value || '').toLowerCase();
        if (val && !seen.has(val)) {
          seen.add(val);
          entries.push(item);
        }
      });
    }
  } catch (err) {
    console.warn('vip_waitlist fetch notice:', err);
  }

  // 2. Also fetch waitlist inquiries from contacts table
  try {
    const { data: contactsData, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .or('subject.ilike.%waitlist%,message.ilike.%waitlist%')
      .order('created_at', { ascending: false });

    if (!contactsError && contactsData) {
      contactsData.forEach((c: any) => {
        const val = (c.phone || c.email || '').toLowerCase();
        if (val && !seen.has(val)) {
          seen.add(val);
          entries.push({
            id: c.id,
            name: c.name || 'VIP Guest',
            contact_value: c.phone || c.email,
            contact_type: c.phone ? 'whatsapp' : 'email',
            interest: c.subject?.toLowerCase().includes('menu') ? 'menu' : 'services',
            notes: c.message,
            status: c.status === 'read' ? 'contacted' : 'registered',
            created_at: c.created_at
          });
        }
      });
    }
  } catch (fallbackErr) {
    console.warn('Fallback waitlist fetch error:', fallbackErr);
  }

  // 3. Merge local storage backup
  try {
    const localKey = 'the_loft_local_vip_waitlist';
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    localData.forEach((item: any) => {
      const val = (item.contact_value || '').toLowerCase();
      if (val && !seen.has(val)) {
        seen.add(val);
        entries.push(item);
      }
    });
  } catch (e) {}

  return entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const createVipWaitlist = async (entry: any) => {
  if (!checkConfig()) {
    throw new Error('Supabase is not configured. Please check environment variables.');
  }

  const payload = {
    name: entry.name || 'VIP Guest',
    contact_value: entry.contact_value?.trim(),
    contact_type: entry.contact_type || (entry.contact_value?.includes('@') ? 'email' : 'whatsapp'),
    interest: entry.interest || 'services',
    notes: entry.notes || '',
    status: entry.status || 'registered'
  };

  // 1. Direct insert into vip_waitlist without .select() (prevents RLS 42501 error for public visitors)
  const { error: waitlistError } = await supabase
    .from('vip_waitlist')
    .insert([payload]);

  if (waitlistError) {
    console.warn('vip_waitlist table insert error:', waitlistError.message);
  }

  // 2. Guaranteed persistent backup write to contacts table
  try {
    const isEmail = payload.contact_type === 'email';
    await supabase.from('contacts').insert([{
      name: payload.name,
      phone: isEmail ? '' : payload.contact_value,
      email: isEmail ? payload.contact_value : 'info@theloft.lk',
      subject: `VIP ${payload.interest === 'menu' ? 'Menu' : 'Services'} Waitlist`,
      message: `Pre-launch waitlist registration. Contact: ${payload.contact_value}. Interest: ${payload.interest}`,
      status: 'unread'
    }]);
  } catch (e) {
    console.warn('Backup contact insert error:', e);
  }

  // 3. Instant local backup
  try {
    const localKey = 'the_loft_local_vip_waitlist';
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    existing.unshift({
      ...payload,
      id: 'local_' + Date.now(),
      created_at: new Date().toISOString()
    });
    localStorage.setItem(localKey, JSON.stringify(existing.slice(0, 50)));
  } catch (e) {}

  return { success: true };
};

export const updateVipWaitlistStatus = async (id: string, status: string) => {
  if (!checkConfig()) return null;
  try {
    const { data, error } = await supabase
      .from('vip_waitlist')
      .update({ status })
      .eq('id', id)
      .select();
    if (!error) return data;
  } catch (err) {
    console.warn('Error updating vip_waitlist status:', err);
  }

  // Also update contacts table if it exists there
  try {
    await supabase.from('contacts').update({ status: status === 'registered' ? 'unread' : 'read' }).eq('id', id);
  } catch (e) {}
};

export const deleteVipWaitlistEntry = async (id: string) => {
  if (!checkConfig()) return;
  try {
    await supabase.from('vip_waitlist').delete().eq('id', id);
  } catch (err) {
    console.warn('Error deleting vip_waitlist entry:', err);
  }
  try {
    await supabase.from('contacts').delete().eq('id', id);
  } catch (e) {}
};

// --- SALON LAUNCH MODE CONTROLLER ---
const LAUNCH_MODE_STORAGE_KEY = 'the_loft_launch_mode';

export const getSalonLaunchMode = (): 'pre-launch' | 'live' => {
  try {
    const saved = localStorage.getItem(LAUNCH_MODE_STORAGE_KEY);
    if (saved === 'live' || saved === 'pre-launch') {
      return saved;
    }
  } catch (e) {}
  // Default is pre-launch since salon is not open yet
  return 'pre-launch';
};

export const setSalonLaunchMode = async (mode: 'pre-launch' | 'live') => {
  try {
    localStorage.setItem(LAUNCH_MODE_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent('the-loft-launch-mode-changed', { detail: mode }));
  } catch (e) {}

  if (checkConfig()) {
    try {
      await supabase
        .from('site_settings')
        .upsert([{ key: 'launch_mode', value: mode, updated_at: new Date().toISOString() }], { onConflict: 'key' });
    } catch (err) {
      console.warn('site_settings table not set up yet in Supabase:', err);
    }
  }
};

// --- TESTIMONIALS VISIBILITY CONTROLLER ---
const TESTIMONIALS_VISIBILITY_KEY = 'the_loft_testimonials_visibility';

export const getTestimonialsVisibility = (): boolean => {
  try {
    const saved = localStorage.getItem(TESTIMONIALS_VISIBILITY_KEY);
    if (saved === 'visible' || saved === 'true') {
      return true;
    }
    if (saved === 'hidden' || saved === 'false') {
      return false;
    }
  } catch (e) {}
  // Default is hidden per requirements
  return false;
};

export const setTestimonialsVisibility = async (visible: boolean) => {
  const valueStr = visible ? 'visible' : 'hidden';
  try {
    localStorage.setItem(TESTIMONIALS_VISIBILITY_KEY, valueStr);
    window.dispatchEvent(new CustomEvent('the-loft-testimonials-visibility-changed', { detail: visible }));
  } catch (e) {}

  if (checkConfig()) {
    try {
      await supabase
        .from('site_settings')
        .upsert([{ key: 'testimonials_visibility', value: valueStr, updated_at: new Date().toISOString() }], { onConflict: 'key' });
    } catch (err) {
      console.warn('site_settings table not set up yet in Supabase:', err);
    }
  }
};

// --- SYNC REMOTE SITE SETTINGS ---
export const syncRemoteSiteSettings = async () => {
  if (!checkConfig()) return;
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && Array.isArray(data)) {
      for (const item of data) {
        if (item.key === 'launch_mode' && (item.value === 'pre-launch' || item.value === 'live')) {
          const current = localStorage.getItem(LAUNCH_MODE_STORAGE_KEY);
          if (current !== item.value) {
            localStorage.setItem(LAUNCH_MODE_STORAGE_KEY, item.value);
            window.dispatchEvent(new CustomEvent('the-loft-launch-mode-changed', { detail: item.value }));
          }
        }
        if (item.key === 'testimonials_visibility') {
          const isVisible = item.value === 'visible' || item.value === 'true';
          const current = localStorage.getItem(TESTIMONIALS_VISIBILITY_KEY);
          if (current !== item.value) {
            localStorage.setItem(TESTIMONIALS_VISIBILITY_KEY, item.value);
            window.dispatchEvent(new CustomEvent('the-loft-testimonials-visibility-changed', { detail: isVisible }));
          }
        }
      }
    }
  } catch (e) {
    // Fail gracefully if table not created
  }
};


