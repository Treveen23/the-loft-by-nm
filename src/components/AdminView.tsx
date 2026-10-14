import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import logo from '../assets/images/logonew.webp';
import AdminAuth from './admin/AdminAuth';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AdminBookings from './admin/AdminBookings';
import AdminContacts from './admin/AdminContacts';
import AdminMenu from './admin/AdminMenu';
import AdminGallery from './admin/AdminGallery';
import AdminReviews from './admin/AdminReviews';
import AdminBlogs from './admin/AdminBlogs';
import AdminCareers from './admin/AdminCareers';
import AdminWaitlist from './admin/AdminWaitlist';

export default function AdminView() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-ivory text-charcoal">Loading Dashboard...</div>;
  }

  if (!session) {
    return <AdminAuth />;
  }

  return (
    <div className="flex h-screen bg-ivory text-charcoal font-sans overflow-hidden">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false); // Close menu on tab change on mobile
        }} 
        session={session} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <main className="flex-1 overflow-y-auto bg-ivory relative flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-charcoal/10 bg-white sticky top-0 z-40">
          <img src={logo} alt="The Loft CMS" decoding="async" className="h-8 w-auto object-contain" />
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12 relative z-10 w-full flex-1">
          {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'waitlist' && <AdminWaitlist />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'contacts' && <AdminContacts />}
          {activeTab === 'careers' && <AdminCareers />}
          { activeTab === 'menu' && <AdminMenu /> }
          { activeTab === 'blogs' && <AdminBlogs /> }
          { activeTab === 'gallery' && <AdminGallery /> }
          { activeTab === 'reviews' && <AdminReviews /> }
        </div>
      </main>
    </div>
  );
}
