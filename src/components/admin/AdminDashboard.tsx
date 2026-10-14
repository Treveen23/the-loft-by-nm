import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Star, Sparkles, ArrowRight, Briefcase, Crown, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBookings, fetchContacts, fetchReviews, fetchServices, fetchVipWaitlist, getSalonLaunchMode, setSalonLaunchMode } from '../../api';
import AdminSkeleton from './AdminSkeleton';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboard({ setActiveTab }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState({
    vipWaitlist: 0,
    pendingBookings: 0,
    unreadInquiries: 0,
    pendingReviews: 0,
    totalServices: 0
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [launchMode, setLaunchMode] = useState<'pre-launch' | 'live'>(getSalonLaunchMode);

  const handleToggleLaunchMode = async () => {
    const nextMode = launchMode === 'pre-launch' ? 'live' : 'pre-launch';
    const confirmMsg = nextMode === 'live' 
      ? 'Are you ready to reveal full services and pricing to the public? This will switch your salon website LIVE!'
      : 'Do you want to switch the website back to Pre-Launch Teaser mode (services and prices will be hidden)?';

    if (window.confirm(confirmMsg)) {
      await setSalonLaunchMode(nextMode);
      setLaunchMode(nextMode);
      toast.success(nextMode === 'live' ? 'Salon Website is now LIVE to the public!' : 'Website returned to Pre-Launch Teaser Mode');
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [bookingsData, contactsData, reviewsData, servicesData, waitlistData] = await Promise.all([
          fetchBookings(),
          fetchContacts(),
          fetchReviews(),
          fetchServices(),
          fetchVipWaitlist()
        ]);

        setMetrics({
          vipWaitlist: waitlistData.length,
          pendingBookings: bookingsData.filter((b: any) => b.status === 'pending').length,
          unreadInquiries: contactsData.filter((c: any) => c.status === 'unread').length,
          pendingReviews: reviewsData.filter((r: any) => r.status === 'pending').length,
          totalServices: servicesData.length
        });

        const combinedActivity = [
          ...waitlistData.map((w: any) => ({
            ...w,
            activityType: 'VIP Waitlist',
            title: `VIP Signup: ${w.contact_value || w.phone || w.email}`,
            date: new Date(w.created_at),
            status: w.status || 'registered'
          })),
          ...bookingsData.map((b: any) => ({ ...b, activityType: 'Booking', title: `${b.customer_name} booked ${b.service_id}`, date: new Date(b.created_at), status: b.status })),
          ...contactsData.map((c: any) => ({ ...c, activityType: 'Inquiry', title: `${c.name} sent a message: ${c.subject}`, date: new Date(c.created_at), status: c.status }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);
        
        setRecentActivity(combinedActivity);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn space-y-10">
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-6">
            <Sparkles size={12} className="text-gold" /> Command Center
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-4 leading-tight">
            Good <span className="text-gold italic font-normal">{new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Here is your sanctuary overview for today. Monitor pre-launch signups, manage bookings, and oversee operations.
          </p>
        </div>
      </header>

      {/* Salon Website Launch Controller Banner */}
      <div className={`p-6 sm:p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden shadow-sm ${
        launchMode === 'pre-launch'
          ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-amber-500/30'
          : 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white border-emerald-500/30'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              launchMode === 'pre-launch' ? 'bg-amber-500 text-charcoal' : 'bg-emerald-500 text-white'
            }`}>
              {launchMode === 'pre-launch' ? <Lock size={24} /> : <Unlock size={24} />}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                  launchMode === 'pre-launch'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}>
                  {launchMode === 'pre-launch' ? '● Pre-Launch Teaser Mode' : '● Live Grand Opening Mode'}
                </span>
                <span className="text-[10px] text-charcoal/50 uppercase tracking-wider font-mono">Website Controller</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal">
                {launchMode === 'pre-launch' ? 'Services & Prices are Hidden' : 'Full Services & Menu are Live to Public'}
              </h3>
              <p className="text-xs text-charcoal/70 font-sans max-w-xl leading-relaxed">
                {launchMode === 'pre-launch'
                  ? 'Guests visiting Services and Menu will see your "To Be Revealed" page with the VIP waitlist. Click the button to switch live on opening day!'
                  : 'Visitors can now freely view all treatment rituals, transparent prices, and book online.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleLaunchMode}
              className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md flex items-center gap-2 ${
                launchMode === 'pre-launch'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-105'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 hover:scale-105'
              }`}
            >
              {launchMode === 'pre-launch' ? (
                <>
                  <Unlock size={15} />
                  <span>Switch Website to Live Mode</span>
                </>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Switch to Pre-Launch Teaser</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'VIP Waitlist Leads', value: metrics.vipWaitlist, icon: Crown, color: 'text-gold', bg: 'bg-gold/10', tab: 'waitlist' },
          { label: 'Pending Bookings', value: metrics.pendingBookings, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', tab: 'bookings' },
          { label: 'Unread Inquiries', value: metrics.unreadInquiries, icon: Mail, color: 'text-emerald-500', bg: 'bg-emerald-500/10', tab: 'contacts' },
          { label: 'Active Services', value: metrics.totalServices, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10', tab: 'menu' }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveTab(stat.tab)}
            className="bg-white border border-charcoal/10 p-6 rounded-2xl flex items-start gap-4 shadow-xl hover:border-gold/40 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <h3 className="text-3xl font-serif text-charcoal mb-1">{stat.value}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-charcoal/10 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-serif text-charcoal">Recent Activity</h3>
            <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-charcoal transition-colors flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-10 text-charcoal/30 text-sm">No recent activity found.</div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-charcoal/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${act.activityType === 'Booking' ? 'bg-gold/10 text-gold' : 'bg-blue-400/10 text-blue-400'}`}>
                    {act.activityType === 'Booking' ? <Calendar size={16} /> : <Mail size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">{act.title}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-charcoal/60 mt-1">{act.date.toLocaleString()} • {act.activityType}</p>
                  </div>
                  <div>
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg ${
                      act.status === 'pending' || act.status === 'unread' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 
                      act.status === 'confirmed' || act.status === 'read' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                      act.status === 'completed' ? 'bg-slate-50 text-slate-600 border border-slate-200' :
                      act.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      'bg-charcoal/5 text-charcoal/70 border border-charcoal/20'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif text-charcoal mb-6">Quick Actions</h3>
          <button onClick={() => setActiveTab('bookings')} className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gold/10 to-transparent hover:from-gold/20 border border-gold/30 rounded-2xl text-left transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Calendar size={18} className="text-gold" />
              </div>
              <span className="text-sm font-semibold text-charcoal">Manage Bookings</span>
            </div>
            <ArrowRight size={18} className="text-gold/60 group-hover:text-gold group-hover:translate-x-1 transition-all" />
          </button>
          <button onClick={() => setActiveTab('contacts')} className="w-full flex items-center justify-between p-5 bg-white hover:bg-charcoal/[0.02] border border-charcoal/15 rounded-2xl text-left transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center shadow-inner">
                <Mail size={18} className="text-charcoal/70 group-hover:text-charcoal" />
              </div>
              <span className="text-sm font-semibold text-charcoal/80 group-hover:text-charcoal">Read Inquiries</span>
            </div>
            <ArrowRight size={18} className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
          </button>
          <button onClick={() => setActiveTab('reviews')} className="w-full flex items-center justify-between p-5 bg-white hover:bg-charcoal/[0.02] border border-charcoal/15 rounded-2xl text-left transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center shadow-inner">
                <Star size={18} className="text-charcoal/70 group-hover:text-charcoal" />
              </div>
              <span className="text-sm font-semibold text-charcoal/80 group-hover:text-charcoal">Approve Reviews</span>
            </div>
            <ArrowRight size={18} className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
          </button>
          <button onClick={() => setActiveTab('careers')} className="w-full flex items-center justify-between p-5 bg-white hover:bg-charcoal/[0.02] border border-charcoal/15 rounded-2xl text-left transition-all group shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center shadow-inner">
                <Briefcase size={18} className="text-charcoal/70 group-hover:text-charcoal" />
              </div>
              <span className="text-sm font-semibold text-charcoal/80 group-hover:text-charcoal">Talent &amp; Vacancies</span>
            </div>
            <ArrowRight size={18} className="text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
