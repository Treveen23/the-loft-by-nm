import React, { useState, useEffect } from 'react';
import {
  Gift,
  Search,
  Filter,
  Download,
  Copy,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchVipWaitlist,
  updateVipWaitlistStatus,
  deleteVipWaitlistEntry
} from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminWaitlist() {
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, interestFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchVipWaitlist();
      setWaitlist(data || []);
    } catch (error) {
      console.error('Error loading VIP waitlist:', error);
      toast.error('Failed to load waitlist entries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateVipWaitlistStatus(id, newStatus);
      toast.success(`Guest status updated to ${newStatus}`);
      setWaitlist(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this guest from the VIP waitlist?')) {
      return;
    }
    try {
      await deleteVipWaitlistEntry(id);
      toast.success('Waitlist entry deleted');
      setWaitlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  // Helper to format clean international phone numbers for WhatsApp
  const cleanPhoneForWhatsApp = (rawPhone: string) => {
    let cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('0')) {
      // Convert Sri Lankan local 077... to +9477...
      cleaned = '94' + cleaned.substring(1);
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  };

  const getWhatsAppLink = (contact: string, name: string = 'Guest', interest: string = 'Services') => {
    const cleanNum = cleanPhoneForWhatsApp(contact);
    const message = encodeURIComponent(
      `Hello ${name !== 'VIP Guest' ? name : ''}! Thank you for joining The Loft by NM's private pre-launch registry. We are delighted to share that our ${interest === 'menu' ? 'treatment menu & prices' : 'sanctuary rituals'} are preparing to launch. Would you like to reserve priority booking for opening week?`
    );
    return `https://wa.me/${cleanNum}?text=${message}`;
  };

  // Export to CSV
  const exportToCsv = () => {
    if (waitlist.length === 0) {
      toast.error('No waitlist entries to export');
      return;
    }

    const headers = ['ID', 'Contact', 'Type', 'Interest', 'Status', 'Registered At'];
    const rows = filteredWaitlist.map(w => [
      w.id,
      `"${w.contact_value || w.phone || w.email || ''}"`,
      w.contact_type || (w.contact_value?.includes('@') ? 'email' : 'whatsapp'),
      w.interest || 'services',
      w.status || 'registered',
      new Date(w.created_at).toLocaleString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TheLoft_VIP_Waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('VIP Waitlist exported to CSV!');
  };

  // Copy all phone numbers for broadcast
  const copyAllPhoneNumbers = () => {
    const phoneNumbers = waitlist
      .map(w => w.contact_value || w.phone || '')
      .filter(val => val && !val.includes('@'))
      .map(cleanPhoneForWhatsApp)
      .filter(Boolean);

    if (phoneNumbers.length === 0) {
      toast.error('No phone numbers found to copy');
      return;
    }

    const uniqueNumbers = Array.from(new Set(phoneNumbers));
    navigator.clipboard.writeText(uniqueNumbers.join(', '));
    toast.success(`Copied ${uniqueNumbers.length} unique WhatsApp numbers to clipboard!`);
  };

  // Derived filtered data
  const filteredWaitlist = waitlist.filter(item => {
    const contact = (item.contact_value || item.phone || item.email || '').toLowerCase();
    const notes = (item.notes || item.message || '').toLowerCase();
    const matchesSearch = contact.includes(searchQuery.toLowerCase()) || notes.includes(searchQuery.toLowerCase());

    const itemStatus = item.status || 'registered';
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;

    const itemInterest = (item.interest || (item.subject?.toLowerCase().includes('menu') ? 'menu' : 'services')).toLowerCase();
    const matchesInterest = interestFilter === 'all' || itemInterest === interestFilter;

    return matchesSearch && matchesStatus && matchesInterest;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredWaitlist.length / itemsPerPage);
  const paginatedWaitlist = filteredWaitlist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metrics
  const totalCount = waitlist.length;
  const whatsappCount = waitlist.filter(w => {
    const c = w.contact_value || w.phone || '';
    return c && !c.includes('@');
  }).length;
  const emailCount = waitlist.filter(w => {
    const c = w.contact_value || w.email || '';
    return c && c.includes('@');
  }).length;
  const contactedCount = waitlist.filter(w => w.status === 'contacted' || w.status === 'invited').length;

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header Banner */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/15 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-4">
            <Crown size={12} className="text-gold" /> Pre-Launch Intelligence
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-serif text-charcoal tracking-tight leading-tight">
                VIP Pre-Launch <span className="text-gold italic font-normal">Waitlist</span>.
              </h2>
              <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed mt-2">
                Potential guests who registered to receive early invitations, menu reveals, and opening week privileges before the salon doors open.
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={copyAllPhoneNumbers}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 text-charcoal border border-charcoal/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                title="Copy all phone numbers for WhatsApp broadcast"
              >
                <Copy size={14} className="text-gold" />
                <span>Copy Numbers</span>
              </button>

              <button
                onClick={exportToCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-hover text-charcoal shadow-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total VIP Signups', count: totalCount, icon: Crown, color: 'text-gold', bg: 'bg-gold/10' },
          { label: 'WhatsApp Leads', count: whatsappCount, icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Email Leads', count: emailCount, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Contacted / Invited', count: contactedCount, icon: CheckCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-charcoal/10 rounded-2xl p-5 shadow-sm hover:border-gold/30 transition-all flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif text-charcoal font-semibold">{stat.count}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by WhatsApp phone, email, or interest..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
          />
        </div>

        {/* Filter by Interest */}
        <div className="relative min-w-[170px]">
          <select
            value={interestFilter}
            onChange={e => setInterestFilter(e.target.value)}
            className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold/50 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Interest: All Pages</option>
            <option value="services">Ritual Services</option>
            <option value="menu">Menu & Prices</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="relative min-w-[160px]">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-gold/50 transition-all appearance-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="registered">Registered</option>
            <option value="contacted">Contacted</option>
            <option value="invited">Invited</option>
            <option value="booked">Booked</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Waitlist Entries List */}
      <div className="bg-white border border-charcoal/10 rounded-2xl shadow-sm overflow-hidden">
        {paginatedWaitlist.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mx-auto text-charcoal/40">
              <Gift size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl text-charcoal">No VIP waitlist entries found</h3>
              <p className="text-xs text-charcoal/60 font-sans max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all' || interestFilter !== 'all'
                  ? 'Try clearing your search filters to view all entries.'
                  : 'Guests who register on the "To Be Revealed" pages will appear here immediately.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-charcoal/10 bg-charcoal/[0.02] text-[10px] font-bold uppercase tracking-wider text-charcoal/60">
                  <th className="py-4 px-6">Guest Contact</th>
                  <th className="py-4 px-6">Channel</th>
                  <th className="py-4 px-6">Interest</th>
                  <th className="py-4 px-6">Registered On</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5 text-xs">
                {paginatedWaitlist.map(item => {
                  const contactVal = item.contact_value || item.phone || item.email || '';
                  const isEmail = contactVal.includes('@');
                  const itemInterest = (
                    item.interest ||
                    (item.subject?.toLowerCase().includes('menu') ? 'menu' : 'services')
                  ).toLowerCase();
                  const itemStatus = item.status || 'registered';

                  return (
                    <tr key={item.id} className="hover:bg-charcoal/[0.015] transition-colors group">
                      {/* Contact value & details */}
                      <td className="py-4 px-6 font-medium text-charcoal">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isEmail ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {isEmail ? <Mail size={14} /> : <Phone size={14} />}
                          </div>
                          <div>
                            <span className="font-semibold text-charcoal block select-all">
                              {contactVal}
                            </span>
                            {item.name && item.name !== 'VIP Guest' && item.name !== 'VIP Waitlist Guest' && (
                              <span className="text-[10px] text-charcoal/50 block">
                                {item.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isEmail
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isEmail ? 'Email' : 'WhatsApp'}
                        </span>
                      </td>

                      {/* Interest */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-charcoal/80 bg-charcoal/5 px-2.5 py-1 rounded-lg">
                          <Sparkles size={11} className="text-gold" />
                          {itemInterest === 'menu' ? 'Menu & Prices' : 'Ritual Services'}
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6 text-charcoal/60 font-sans text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-charcoal/40" />
                          <span>
                            {item.created_at
                              ? new Date(item.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Recent'}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          value={itemStatus}
                          onChange={e => handleStatusChange(item.id, e.target.value)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                            itemStatus === 'registered'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : itemStatus === 'contacted'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : itemStatus === 'invited'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : itemStatus === 'booked'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-charcoal/5 text-charcoal/60 border-charcoal/10'
                          }`}
                        >
                          <option value="registered">Registered</option>
                          <option value="contacted">Contacted</option>
                          <option value="invited">Invited</option>
                          <option value="booked">Booked</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Quick Action buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isEmail ? (
                            <a
                              href={getWhatsAppLink(contactVal, item.name, itemInterest)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-all shadow-sm"
                              title="Chat directly on WhatsApp"
                            >
                              <MessageSquare size={12} />
                              <span>WhatsApp</span>
                            </a>
                          ) : (
                            <a
                              href={`mailto:${contactVal}?subject=The%20Loft%20by%20NM%20VIP%20Preview`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] transition-all shadow-sm"
                              title="Send Email"
                            >
                              <Mail size={12} />
                              <span>Email</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-charcoal/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-t border-charcoal/10 bg-charcoal/[0.01]">
                <span className="text-xs text-charcoal/60">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredWaitlist.length)} of{' '}
                  {filteredWaitlist.length} guests
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white border border-charcoal/10 text-charcoal hover:bg-charcoal/5 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-semibold px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white border border-charcoal/10 text-charcoal hover:bg-charcoal/5 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
