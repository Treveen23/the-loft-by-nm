import React, { useState, useEffect } from 'react';
import { Mail, Search, Filter, ChevronLeft, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { fetchContacts, updateContactStatus } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, and Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setContacts(await fetchContacts());
    } catch (error) {
      console.error("Error loading contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateContactStatus(id, 'read');
      toast.success('Inquiry marked as read');
      loadData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const cleanPhoneForWhatsApp = (rawPhone: string) => {
    let cleaned = (rawPhone || '').replace(/[^\d+]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '94' + cleaned.substring(1);
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  };

  const getContactWhatsAppLink = (c: any) => {
    const cleanNum = cleanPhoneForWhatsApp(c.phone);
    const message = encodeURIComponent(
      `Hello ${c.name}! Thank you for contacting The Loft by NM regarding "${c.subject}". We would be delighted to assist you.`
    );
    return `https://wa.me/${cleanNum}?text=${message}`;
  };

  // Derived state for filtering and searching
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-6">
            <Mail size={12} className="text-gold" /> Communications
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-4 leading-tight">
            Guest <span className="text-gold italic font-normal">Inquiries</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Review and respond to general inquiries and messages sent by potential clients.
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-charcoal/5 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white border border-charcoal/10 rounded-2xl p-12 text-center">
          <Mail className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
          <p className="text-charcoal/40 text-sm">No messages found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {paginatedContacts.map(c => (
            <div key={c.id} className="bg-white border border-charcoal/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${c.status === 'unread' ? 'bg-amber-500' : 'bg-charcoal/5'}`} />
              
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 pl-4">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal flex items-center gap-3">
                    {c.name}
                    <span className={`text-[9px] px-2 py-1 rounded-full uppercase tracking-widest font-bold ${c.status === 'unread' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-charcoal/5 text-charcoal/40 border border-charcoal/10'}`}>{c.status}</span>
                  </h3>
                  <p className="text-[10px] font-medium text-charcoal/60 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-semibold text-charcoal mb-0.5">{c.email}</p>
                  <p className="text-[10px] font-medium text-charcoal/60 uppercase tracking-widest">{c.phone || 'No phone provided'}</p>
                </div>
              </div>
              
              <div className="bg-charcoal/5 p-5 rounded-xl border border-charcoal/10 pl-4 ml-4">
                <span className="text-[10px] text-gold uppercase tracking-widest font-bold mb-2 block">Subject: {c.subject}</span>
                <p className="text-sm text-charcoal/80 leading-relaxed font-light">"{c.message}"</p>
              </div>
              
                <div className="mt-6 flex flex-wrap justify-end gap-2.5">
                  {c.phone && (
                    <a
                      href={getContactWhatsAppLink(c)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare size={12} /> Chat on WhatsApp
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}?subject=RE: ${encodeURIComponent(c.subject)}`}
                      className="text-[11px] bg-charcoal/5 hover:bg-charcoal/10 text-charcoal border border-charcoal/10 px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Mail size={12} /> Reply Email
                    </a>
                  )}
                  {c.status === 'unread' && (
                    <button onClick={() => handleMarkAsRead(c.id)} className="text-[11px] bg-charcoal/5 hover:bg-charcoal/10 text-charcoal px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer">
                      Mark as Read
                    </button>
                  )}
                </div>
            </div>
          ))}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-2 flex items-center justify-between p-6 rounded-2xl border border-charcoal/10 bg-white">
              <span className="text-xs text-charcoal/60 font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length} messages
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-charcoal/5 border border-charcoal/10 text-charcoal hover:bg-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-gold text-black' : 'bg-transparent text-charcoal/60 hover:bg-charcoal/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-charcoal/5 border border-charcoal/10 text-charcoal hover:bg-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
