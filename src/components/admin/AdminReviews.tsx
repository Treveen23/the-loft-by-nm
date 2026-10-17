import React, { useState, useEffect } from 'react';
import { Star, Plus, X, Check, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { fetchReviews, createReview, updateReviewStatus, updateReview, deleteReview, getTestimonialsVisibility, setTestimonialsVisibility } from '../../api';
import AdminSkeleton from './AdminSkeleton';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: '', role: '', service_name: '', rating: 5, comment: '', status: 'approved'
  });
  const [loading, setLoading] = useState(true);
  const [testimonialsVisible, setTestimonialsVisible] = useState<boolean>(getTestimonialsVisibility);

  useEffect(() => {
    const handleTestimonialsChange = (e: any) => {
      setTestimonialsVisible(Boolean(e.detail));
    };
    window.addEventListener('the-loft-testimonials-visibility-changed', handleTestimonialsChange);
    return () => window.removeEventListener('the-loft-testimonials-visibility-changed', handleTestimonialsChange);
  }, []);

  const handleToggleTestimonials = async () => {
    const nextVisible = !testimonialsVisible;
    await setTestimonialsVisibility(nextVisible);
    setTestimonialsVisible(nextVisible);
    toast.success(
      nextVisible
        ? 'Testimonials are now visible on Homepage and About page!'
        : 'Testimonials are now hidden from Homepage and About page.'
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setReviews(await fetchReviews());
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, reviewForm);
        toast.success('Review updated successfully!');
      } else {
        await createReview({ ...reviewForm, created_at: new Date().toISOString() });
        toast.success('Review created successfully!');
      }
      setIsReviewFormOpen(false);
      setEditingReviewId(null);
      setReviewForm({ name: '', role: '', service_name: '', rating: 5, comment: '', status: 'approved' });
      loadData();
    } catch (err) {
      console.error('Error saving review', err);
      toast.error('Failed to save review. Check console for details.');
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="animate-fadeIn">
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 p-8 sm:p-10 rounded-[2rem] shadow-sm mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[60px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-charcoal/70 mb-4">
            <Star size={12} className="text-gold" /> Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif text-charcoal tracking-tight mb-2 leading-tight">
            Guest <span className="text-gold italic font-normal">Reviews</span>.
          </h2>
          <p className="text-sm text-charcoal/70 font-sans tracking-wide max-w-xl leading-relaxed">
            Moderate feedback and showcase glowing testimonials from your clientele.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleToggleTestimonials}
            className={`flex items-center gap-2 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer border ${
              testimonialsVisible
                ? 'bg-white border-amber-400 text-amber-800 hover:bg-amber-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
          >
            {testimonialsVisible ? (
              <>
                <EyeOff size={16} />
                <span>Hide from Website</span>
              </>
            ) : (
              <>
                <Eye size={16} />
                <span>Reveal on Website</span>
              </>
            )}
          </button>

          <button onClick={() => {
            setEditingReviewId(null);
            setReviewForm({ name: '', role: '', service_name: '', rating: 5, comment: '', status: 'approved' });
            setIsReviewFormOpen(true);
          }} className="flex items-center gap-2 bg-gold hover:bg-white text-black px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer">
            <Plus size={16} /> Add Testimonial
          </button>
        </div>
      </header>

      {/* Testimonials Public Status Banner */}
      <div className={`p-5 rounded-2xl border mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
        testimonialsVisible
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-950'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            testimonialsVisible ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-charcoal'
          }`}>
            {testimonialsVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                testimonialsVisible
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {testimonialsVisible ? '● Live on Homepage & About' : '● Hidden from Homepage & About'}
              </span>
            </div>
            <p className="text-xs font-sans mt-1 text-charcoal/80">
              {testimonialsVisible
                ? 'Client reviews and ratings are currently visible to visitors across both Home and About pages.'
                : 'The testimonials section is currently hidden from public view. Guests cannot see reviews until revealed.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleTestimonials}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer shadow-sm ${
            testimonialsVisible
              ? 'bg-charcoal hover:bg-amber-600 text-white'
              : 'bg-gold hover:bg-white text-black border border-gold/40'
          }`}
        >
          {testimonialsVisible ? 'Hide Testimonials' : 'Reveal Testimonials'}
        </button>
      </div>

      {isReviewFormOpen && (
        <div className="mb-10 bg-white border border-charcoal/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="font-serif text-2xl text-charcoal">{editingReviewId ? 'Edit Testimonial' : 'Manual Testimonial Entry'}</h3>
            <button onClick={() => {
              setIsReviewFormOpen(false);
              setEditingReviewId(null);
            }} className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50 hover:bg-charcoal/10 hover:text-charcoal transition-colors"><X size={16} /></button>
          </div>
          
          <form onSubmit={handleSaveReview} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Client Name</label>
                <input required type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none" placeholder="e.g. Sarah T." />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Role / Context</label>
                <input required type="text" value={reviewForm.role} onChange={e => setReviewForm({...reviewForm, role: e.target.value})} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none" placeholder="e.g. Regular Client" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Service Received</label>
                <input required type="text" value={reviewForm.service_name} onChange={e => setReviewForm({...reviewForm, service_name: e.target.value})} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none" placeholder="e.g. Signature Facial" />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Review Content</label>
              <textarea required value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} rows={3} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none resize-none" placeholder="Write the review here..."></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal/70 uppercase tracking-widest mb-1.5">Status</label>
              <select value={reviewForm.status} onChange={e => setReviewForm({...reviewForm, status: e.target.value})} className="w-full bg-charcoal/5 border border-charcoal/10 rounded-lg px-4 py-3 text-charcoal focus:border-gold focus:outline-none">
                <option value="approved" className="bg-white">Approved (Public)</option>
                <option value="pending" className="bg-white">Pending</option>
              </select>
            </div>
            <div className="pt-2 text-right">
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-colors inline-flex items-center gap-2">
                <Check size={16} /> Save Review
              </button>
            </div>
          </form>
        </div>
      )}
      
      {reviews.length === 0 ? (
        <div className="bg-white border border-charcoal/5 rounded-2xl p-12 text-center">
          <Star className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
          <p className="text-charcoal/40 text-sm">No reviews found in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {reviews.map(r => (
            <div key={r.id} className="bg-white border border-charcoal/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Star size={100} />
                </div>
                
                <div className="relative z-10 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'text-gold' : 'text-charcoal/10'} />
                    ))}
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold border ${
                    r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                    r.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                    'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  }`}>
                    {r.status}
                  </span>
                </div>
                
                <p className="text-sm text-charcoal/80 italic font-serif leading-relaxed mb-4 line-clamp-4">"{r.comment}"</p>
                
                <div>
                  <h3 className="font-semibold text-charcoal text-sm">{r.name}</h3>
                  <p className="text-xs text-charcoal/40 mt-0.5">{r.role}</p>
                  <div className="inline-block bg-charcoal/5 border border-charcoal/5 px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest text-gold mt-3">
                    Therapy: {r.service_name}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-5 border-t border-charcoal/10 relative z-10">
                {r.status === 'pending' && (
                  <>
                    <button onClick={async () => {
                      await updateReviewStatus(r.id, 'approved');
                      toast.success('Review approved');
                      loadData();
                    }} className="text-[10px] bg-emerald-600/90 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex-1 sm:flex-none">Approve</button>
                    <button onClick={async () => {
                      await updateReviewStatus(r.id, 'rejected');
                      toast.info('Review rejected');
                      loadData();
                    }} className="text-[10px] bg-charcoal/[0.05] hover:bg-charcoal/10 text-charcoal px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex-1 sm:flex-none">Reject</button>
                  </>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={() => {
                    setEditingReviewId(r.id);
                    setReviewForm({
                      name: r.name,
                      role: r.role,
                      service_name: r.service_name,
                      rating: r.rating,
                      comment: r.comment,
                      status: r.status
                    });
                    setIsReviewFormOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} className="text-[10px] border border-charcoal/20 hover:bg-charcoal/5 text-charcoal px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                    <Edit size={12} /> Edit
                  </button>
                  <button onClick={async () => {
                    if (window.confirm("Delete this review entirely?")) {
                      await deleteReview(r.id);
                      toast.success('Review deleted');
                      loadData();
                    }
                  }} className="text-[10px] border border-red-500/50 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
