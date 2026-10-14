import React from 'react';
import { Activity, Calendar, Mail, Sparkles, ImageIcon, Star, LogOut, X, BookOpen, Briefcase, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import logo from '../../assets/images/logonew.webp';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: any;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, session, isMobileMenuOpen, setIsMobileMenuOpen }: AdminSidebarProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-charcoal/5 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-charcoal/5 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />
          
          {/* Mobile Close Button */}
          <button 
            className="absolute top-4 right-4 lg:hidden text-charcoal/50 hover:text-charcoal"
            onClick={() => setIsMobileMenuOpen?.(false)}
          >
            <X size={20} />
          </button>
          
          <img src={logo} alt="The Loft CMS" decoding="async" className="h-10 sm:h-12 w-auto object-contain relative z-10 mb-2" />
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-charcoal/40 relative z-10">Management CMS</p>
        </div>

      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'waitlist', label: 'VIP Waitlist', icon: Crown, highlight: true },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'contacts', label: 'Inquiries', icon: Mail },
          { id: 'careers', label: 'Careers & Jobs', icon: Briefcase },
          { id: 'menu', label: 'Menu & Prices', icon: Sparkles },
          { id: 'blogs', label: 'Journal & Blogs', icon: BookOpen },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'reviews', label: 'Guest Reviews', icon: Star },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-gold/15 to-transparent text-gold border border-gold/20 shadow-[0_4px_20px_rgba(212,175,55,0.05)]' 
                : 'text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <tab.icon size={18} className={activeTab === tab.id ? "text-gold" : "text-charcoal/60"} /> 
              {tab.label}
            </div>
            {(tab as any).highlight && activeTab !== tab.id && (
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/20 tracking-wider">
                Pre-Launch
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-charcoal/5">
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-charcoal/10 shadow-sm mb-4">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif text-xs shadow-inner">
            {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold truncate text-charcoal">{session?.user?.email}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-charcoal/60 mt-0.5">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 py-3 rounded-xl transition-colors">
          <LogOut size={16} /> Log Out securely
        </button>
      </div>
    </aside>
    </>
  );
}
