import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ShieldCheck, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { Testimonial } from '../types';
import { TESTIMONIALS } from '../data';
import { fetchReviews } from '../api';

export default function Testimonials() {
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  // Initial fetch from database
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        if (data && data.length > 0) {
          setDbReviews(data);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    };
    loadReviews();
  }, []);

  const approvedDbReviews = dbReviews
    .filter(r => r.status === 'approved')
    .map(r => ({
      id: r.id,
      name: r.name,
      role: r.role,
      comment: r.comment,
      rating: r.rating,
      date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      serviceName: r.service_name
    }));

  const allReviews = [...approvedDbReviews, ...TESTIMONIALS];

  return (
    <div id="testimonials-component" className="w-full">
      {/* Grid of Reviews */}
      {allReviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center border border-dashed border-charcoal/15 bg-ivory/20 rounded-2xl space-y-4 shadow-sm"
        >
          <MessageSquare size={32} className="text-gold/40 mx-auto" />
          <p className="font-serif text-lg text-charcoal/80 italic">No verified guest notes available yet.</p>
        </motion.div>
      ) : (
        <div id="testimonials-grid" className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {allReviews.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.7, 
                delay: (idx % 3) * 0.1, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="break-inside-avoid"
            >
              <div
                id={`testimonial-card-${item.id}`}
                className="group relative bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 p-8 rounded-[2rem] flex flex-col justify-between text-left overflow-hidden h-full"
              >
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors duration-700 pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-sage/10 rounded-full blur-2xl group-hover:bg-sage/20 transition-colors duration-700 pointer-events-none" />
                
                <div className="absolute top-8 right-8 text-gold/10 group-hover:text-gold/20 transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-6">
                  <Quote size={48} strokeWidth={1} />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Rating & Verification */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < item.rating ? 'currentColor' : 'none'}
                          className={i < item.rating ? 'text-gold' : 'text-charcoal/20'}
                        />
                      ))}
                    </div>

                    <span className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest text-emerald-700 font-semibold uppercase bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-100/50 backdrop-blur-md">
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  </div>

                  {/* Comment Text with elegant serif italics */}
                  <p className="font-serif text-[15px] sm:text-base text-charcoal/85 leading-loose italic">
                    "{item.comment}"
                  </p>
                </div>

                {/* Attribution and Footer */}
                <div className="mt-8 pt-5 border-t border-charcoal/5 space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans font-bold text-charcoal block tracking-wide text-sm">
                        {item.name}
                      </span>
                      <span className="font-sans text-xs text-charcoal/50 font-medium block mt-0.5">
                        {item.role}
                      </span>
                    </div>
                    {item.date && (
                      <span className="font-sans text-[10px] uppercase tracking-wider text-charcoal/40 font-medium">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Service Attribution Highlight */}
                  {item.serviceName && (
                    <div className="bg-ivory/60 group-hover:bg-ivory/90 transition-colors duration-300 rounded-xl px-3 py-2 text-[10px] uppercase tracking-wider font-sans text-charcoal/70 flex items-center gap-2">
                      <span className="font-medium text-charcoal/50">Therapy:</span>
                      <span className="font-bold text-gold">{item.serviceName}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
