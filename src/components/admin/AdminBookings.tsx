import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Eye, X, Mail, Phone, MapPin, Sparkles, Search, Filter, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { fetchBookings, updateBookingStatus } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
      setBookings(await fetchBookings());
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status} successfully`);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      loadData();
    } catch (error) {
      toast.error(`Failed to update booking to ${status}`);
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

  const getBookingWhatsAppLink = (b: any) => {
    const cleanNum = cleanPhoneForWhatsApp(b.customer_phone);
    const message = encodeURIComponent(
      `Hello ${b.customer_name}! This is The Loft by NM regarding your reservation for ${b.service_id} on ${b.preferred_date} at ${b.preferred_time}. We would love to assist you with your booking.`
    );
    return `https://wa.me/${cleanNum}?text=${message}`;
  };

  // Derived state for filtering and searching
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customer_phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
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
            <Calendar size={12} className="text-gold" /> Bookings Management
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-4 leading-tight">
            Recent <span className="text-gold italic font-normal">Reservations</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Manage and confirm your upcoming sanctuary reservations. Keep track of all client appointments.
          </p>
        </div>
      </header>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by guest name or phone..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-charcoal/10 rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
          <p className="text-charcoal/40 text-sm">No reservations found.</p>
        </div>
      ) : (
        <div className="bg-white border border-charcoal/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-charcoal/10 bg-charcoal/[0.03] text-charcoal/60 uppercase tracking-widest text-[10px] font-bold">
                  <th className="py-5 px-6 font-medium">Scheduled For</th>
                  <th className="py-5 px-6 font-medium">Guest Details</th>
                  <th className="py-5 px-6 font-medium">Therapy</th>
                  <th className="py-5 px-6 font-medium">Status</th>
                  <th className="py-5 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {paginatedBookings.map(b => (
                  <tr key={b.id} className="hover:bg-charcoal/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-charcoal font-medium block mb-1">{b.preferred_date}</span>
                      <span className="text-gold text-xs font-mono">{b.preferred_time}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-charcoal font-semibold block mb-1">{b.customer_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-charcoal/70 text-xs font-medium">{b.customer_phone}</span>
                        {b.customer_phone && (
                          <a
                            href={getBookingWhatsAppLink(b)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-[10px] font-bold transition-all"
                            title="Chat with guest on WhatsApp"
                          >
                            <MessageSquare size={10} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {b.service_id.split(', ').map((svc: string, idx: number) => (
                          <span key={idx} className="inline-flex px-2 py-1 bg-charcoal/5 rounded-md text-[10px] sm:text-xs border border-charcoal/10 leading-none">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                        b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        b.status === 'completed' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' : 
                        'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {b.status === 'pending' ? <Clock size={10} /> : 
                         b.status === 'confirmed' ? <CheckCircle size={10} /> :
                         b.status === 'completed' ? <CheckCircle size={10} /> : 
                         <X size={10} />} {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedBooking(b)} className="text-[10px] bg-charcoal/5 text-charcoal hover:bg-charcoal/10 px-3 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5">
                          <Eye size={12} /> View
                        </button>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="text-[10px] bg-gold text-black hover:bg-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                              Confirm
                            </button>
                            <button onClick={() => window.confirm('Are you sure you want to cancel this booking?') && handleUpdateStatus(b.id, 'cancelled')} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors">
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <>
                            <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="text-[10px] bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-lg font-bold uppercase tracking-widest transition-all">
                              Complete
                            </button>
                            <button onClick={() => window.confirm('Are you sure you want to cancel this booking?') && handleUpdateStatus(b.id, 'cancelled')} className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors">
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-charcoal/10 bg-charcoal/[0.02]">
              <span className="text-xs text-charcoal/60 font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-charcoal/10 text-charcoal hover:bg-charcoal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="p-2 rounded-lg bg-white border border-charcoal/10 text-charcoal hover:bg-charcoal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-charcoal/10 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-6 border-b border-charcoal/10 flex justify-between items-center bg-charcoal/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Calendar size={18} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-charcoal tracking-tight">Reservation Details</h3>
                  <p className="text-[10px] text-charcoal/60 uppercase tracking-widest font-bold mt-0.5">ID: {selectedBooking.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-charcoal/40 hover:text-charcoal transition-colors p-2 bg-charcoal/5 rounded-full hover:bg-charcoal/10">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-2 block">Guest</label>
                  <p className="text-charcoal font-semibold">{selectedBooking.customer_name}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-2 block">Contact</label>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-charcoal font-semibold flex items-center gap-1.5"><Phone size={12} className="text-charcoal/50"/> {selectedBooking.customer_phone}</p>
                    {selectedBooking.customer_phone && (
                      <a
                        href={getBookingWhatsAppLink(selectedBooking)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-sm"
                      >
                        <MessageSquare size={11} /> WhatsApp
                      </a>
                    )}
                  </div>
                  <p className="text-charcoal/80 text-sm font-medium flex items-center gap-2"><Mail size={12} className="text-charcoal/50"/> {selectedBooking.customer_email}</p>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-charcoal/5 border border-charcoal/10 rounded-xl p-5">
                <label className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold mb-3 block flex items-center gap-2">
                  <Sparkles size={12} className="text-gold" /> Therapies Requested
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.service_id.split(', ').map((svc: string, idx: number) => (
                    <span key={idx} className="inline-flex px-3 py-1.5 bg-charcoal/5 rounded-md text-xs border border-charcoal/10 text-charcoal shadow-sm">
                      {svc}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-6 mt-5 pt-5 border-t border-charcoal/10">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1 block">Scheduled For</label>
                    <p className="text-charcoal">{selectedBooking.preferred_date} at <span className="text-gold">{selectedBooking.preferred_time}</span></p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1 block">Private Suite</label>
                    <p className={selectedBooking.private_suite ? "text-emerald-400" : "text-charcoal/50"}>{selectedBooking.private_suite ? "Requested" : "Not Requested"}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-2 block">Client Notes / Requests</label>
                  <p className="text-charcoal/80 text-sm bg-charcoal/5 p-4 rounded-xl leading-relaxed italic border border-charcoal/10">"{selectedBooking.notes}"</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-charcoal/10 flex justify-end gap-3 bg-charcoal/[0.02]">
              <button onClick={() => setSelectedBooking(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-charcoal hover:bg-charcoal/10 transition-colors">
                Close
              </button>
              {selectedBooking.status === 'pending' && (
                <>
                  <button onClick={() => { if(window.confirm('Cancel?')) handleUpdateStatus(selectedBooking.id, 'cancelled'); }} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                    Cancel Booking
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gold text-black hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    Confirm Booking
                  </button>
                </>
              )}
              {selectedBooking.status === 'confirmed' && (
                <>
                  <button onClick={() => { if(window.confirm('Cancel?')) handleUpdateStatus(selectedBooking.id, 'cancelled'); }} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                    Cancel Booking
                  </button>
                  <button onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')} className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-slate-800 text-white hover:bg-slate-700 transition-all shadow-sm">
                    Mark Completed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
