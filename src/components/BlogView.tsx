import React, { useState, useEffect } from 'react';
import { IMAGES } from '../data';
import { ArrowRight, BookOpen, Clock, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBlogs } from '../api';

interface BlogViewProps {
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: 'The Art of Parisian Balayage',
    excerpt: 'Discover the secrets behind our signature sun-kissed hair painting technique and why it outlasts traditional foils.',
    image_url: IMAGES.hair,
    date: 'Sep 12, 2026',
    read_time: '4 min read',
    category: 'Hair Care'
  },
  
];

export default function BlogView({ setCurrentPage, onBookClick }: BlogViewProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs();
        if (data && data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(FALLBACK_BLOGS); // Use fallback if DB is empty or unconfigured
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs(FALLBACK_BLOGS);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <div className="bg-ivory min-h-screen animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section
        id="blog-hero"
        className="relative bg-ivory pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden"
      >
        {/* Background Subtle Texture/Glow */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gold/5 blur-3xl rounded-bl-full -z-10 opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="relative z-10 text-left pt-8 lg:pt-0 pr-0 lg:pr-8 flex flex-col items-start order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-xs tracking-[0.2em] uppercase font-semibold shadow-sm cursor-default mb-5">
                <BookOpen size={12} className="text-gold" />
                <span>Blogs</span>
                <BookOpen size={12} className="text-gold" />
              </div>
                          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-charcoal tracking-tight leading-[1.05] mb-4">
                            Our{' '}
                              <span className="relative inline-block mt-1">
                                  <span className="relative z-10 italic font-light text-charcoal/90">
                                    Journal
                                  </span>
                                  <span className="absolute bottom-2 left-0 w-full h-3 sm:h-4 bg-gold/15 -z-10 -rotate-1"></span>
                              </span>
                          </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <BookOpen size={14} className="text-gold" />
              </div>

              <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed font-light max-w-lg mb-8">
                              Beauty tips, techniques and care ideas from the team at The Loft by NM.
              </p>

            </div>

            {/* Right Image */}
            <div className="relative group w-[90%] sm:w-4/5 lg:w-[85%] mx-auto lg:ml-auto lg:mr-0 mt-8 lg:mt-0 order-1 lg:order-2">
              <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4 rounded-xl -z-10 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
                              <img
                                  src="https://i.pinimg.com/736x/ad/6c/a6/ad6ca687f0c0ca31e94b2713a1e90cca.jpg"
                                  alt="The Loft Journal"
                                  loading="eager"
                                  decoding="async"
                                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-all duration-1000 ease-out"
                              />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 sm:py-24 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {blogs.map((post) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => setSelectedBlog(post)}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-6 shadow-sm group-hover:shadow-lg transition-all duration-500">
                    <div className="absolute inset-0 bg-charcoal/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={post.image_url || post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-charcoal shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex items-center gap-4 text-xs font-sans text-charcoal/50 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{post.read_time || post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-charcoal group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="font-sans text-sm text-charcoal/70 font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-charcoal group-hover:text-gold transition-colors duration-300">
                      <span>Read Article</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-charcoal text-white py-24 sm:py-32 text-center relative overflow-hidden">
        {/* Soft background luxury visual aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-8">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-gold/50" />
            Your Experience Awaits
            <span className="w-8 h-[1px] bg-gold/50" />
          </span>
          
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
                      Ready to Book Your <br className="hidden sm:block" />
                      <span className="italic text-gold">Appointment?</span>
          </h2>
          
                  <p className="font-sans text-sm sm:text-base text-white/70 font-light max-w-2xl mx-auto pb-4">
                      Visit The Loft by NM and enjoy our beauty and wellness services. Book your next appointment and let us take care of you.
                  </p>
          
          <button 
            onClick={onBookClick}
            className="font-sans text-xs font-bold tracking-[0.25em] uppercase bg-gold text-charcoal py-4.5 px-10 rounded-full hover:bg-ivory transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 inline-block"
          >
            Reserve Your Time
          </button>
        </div>
      </section>

      {/* Blog Article Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12" style={{ zIndex: 100 }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedBlog(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-ivory rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10"
            >
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-colors cursor-pointer shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto overflow-x-hidden relative flex-1" style={{ scrollbarWidth: 'none' }}>
                <div className="h-64 sm:h-80 md:h-[450px] w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent z-10" />
                  <img
                    src={selectedBlog.image_url || selectedBlog.image}
                    alt={selectedBlog.title}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase text-charcoal shadow-sm">
                    {selectedBlog.category}
                  </div>
                </div>

                <div className="p-8 sm:p-12 md:p-16 max-w-3xl mx-auto bg-ivory -mt-20 relative z-20 rounded-t-[2rem] sm:rounded-t-[3rem]">
                  <div className="flex items-center gap-6 text-xs font-sans text-charcoal/50 uppercase tracking-widest mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{selectedBlog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{selectedBlog.read_time || selectedBlog.readTime}</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal mb-8 leading-tight">
                    {selectedBlog.title}
                  </h2>

                  <div className="w-16 h-[1px] bg-gold mb-8" />

                  <div className="font-sans text-base sm:text-lg text-charcoal/80 font-light leading-relaxed space-y-6">
                    <p className="text-xl font-medium text-charcoal leading-relaxed mb-8 italic border-l-2 border-gold pl-6">
                      {selectedBlog.excerpt}
                    </p>
                    
                    {/* Simulated Full Content placeholder since we only store excerpt currently */}
                                      <p>
                                          Welcome to The Loft by NM journal. We believe in giving you the best care, focusing not only on great results but also on the health and beauty of your hair, skin, and nails.
                                      </p>

                                      <p>
                                          Every treatment is designed to help you feel relaxed and refreshed. Our skilled team uses professional techniques and personal care to make sure every visit is comfortable and enjoyable.
                                      </p>

                                      <p>
                                          Thank you for reading. We look forward to welcoming you to The Loft by NM and giving you a great experience.
                                      </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
