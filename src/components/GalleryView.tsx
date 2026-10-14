import React, { useState, useMemo, useEffect } from 'react';
import { fetchGallery } from '../api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Sparkle,
  Compass,
  Instagram,
  Facebook,
  Info,
  ArrowRight
} from 'lucide-react';
import heroSalonLoftImg from '../assets/images/hero_salon_loft_1782535958615.webp';
import privateSuiteImg from '../assets/images/private_suite_1782535989218.webp';

interface GalleryViewProps {
  setCurrentPage?: (page: string) => void;
  onBookClick?: () => void;
}

interface GalleryImage {
  id: string;
  category: 'suite' | 'nails' | 'body' | 'lashes' | 'face' | 'hair';
  title: string;
  subtext: string;
  image: string;
}

export default function GalleryView({ setCurrentPage, onBookClick }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // High-end local imagery with exact 1:1 aesthetic ratio
  // High-end imagery with exact 1:1 aesthetic ratio
  const galleryImages: GalleryImage[] = [
    // Private Ladies Suite & Interiors
    {
      id: 'suite-1',
      category: 'suite',
      title: 'The Private Ladies\' Suite Entrance',
      subtext: 'Bespoke entry crafted for complete discretion and peace of mind.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'suite-2',
      category: 'suite',
      title: 'Tranquil In-Suite Treatment Lounge',
      subtext: 'Plush custom linen upholstery and warm timber design elements.',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'suite-3',
      category: 'suite',
      title: 'Dedicated Suite Vanity Station',
      subtext: 'Individually climate-controlled suite for specialized styling.',
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop'
    },

    // Nails
    {
      id: 'nails-1',
      category: 'nails',
      title: 'Minimalist Gold-Leaf Nude Manicure',
      subtext: 'Clean hand-painted lines on an immaculate, toxin-free gel base.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'nails-2',
      category: 'nails',
      title: 'Precision Russian Cuticle Finish',
      subtext: 'Bespoke dry e-file technique offering uncompromised cuticle health.',
      image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'nails-3',
      category: 'nails',
      title: 'Deluxe Mud Mask Pedicure',
      subtext: 'Warm organic honey soak paired with signature clay heel refinement.',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop'
    },

    // Body
    {
      id: 'body-1',
      category: 'body',
      title: 'Deep Tissue Hot Stone Massage',
      subtext: 'Therapeutic basalt stones designed to dissolve desk fatigue and knots.',
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'body-2',
      category: 'body',
      title: 'Lavender Botanical Oils',
      subtext: 'Warm organic essential oils custom-blended for cellular rest.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop'
    },

    // Lashes & Brows
    {
      id: 'lashes-1',
      category: 'lashes',
      title: 'Classic Silk Fiber Extensions',
      subtext: 'One-to-one individual lash mapping for organic, weightless volume.',
      image: 'https://tse4.mm.bing.net/th/id/OIP.gR4IYuKYoB9xMEHMhsuEhAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      id: 'lashes-2',
      category: 'lashes',
      title: 'Precision Brow Lamination',
      subtext: 'Setting brow hairs in a clean, brushed-up editorial layout.',
      image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop'
    },

    // Face
    {
      id: 'face-1',
      category: 'face',
      title: 'Vitamin C Glow Peptide Facial',
      subtext: 'Double cleanse, botanical steam, and active serum shield.',
      image: 'https://i0.wp.com/luviabeauty.co.ke/wp-content/uploads/2023/03/55a78aa9-f2e9-4030-98ac-f0b6c7bedd00.6b06d73e4cfcec922835f2ec210b2784.jpeg?fit=1500%2C1500&ssl=1'
    },
    {
      id: 'face-2',
      category: 'face',
      title: 'Advanced Cellular Skincare Ritual',
      subtext: 'Antioxidant-rich masks targeting deep hydration and contour lift.',
      image: 'https://cdn.notinoimg.com/detail_main_mq/lancaster/3616303470449_09/365-skin-repair-liposomal-cellular-serum___250313.jpg'
    },

    // Hair
    {
      id: 'hair-1',
      category: 'hair',
      title: 'Parisian Balayage Soft Waves',
      subtext: 'Hand-painted Parisian transitions with premium protective plex.',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'hair-2',
      category: 'hair',
      title: 'Couture Precision Bob Cut',
      subtext: 'Personalized face-structure mapping and high-gloss signature styling.',
      image: 'https://www.fabmood.com/wp-content/uploads/2024/09/Chestnut-Sleek-Perfection-Bob-570x855.jpg'
    }
  ];
  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGallery();
        if (data && data.length > 0) {
          const mapped = data.map((img: any) => ({
            id: img.id,
            category: img.category,
            title: img.description || 'Gallery Image',
            subtext: img.subtext || '',
            image: img.image_url
          }));
          setDbImages(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };
    loadGallery();
  }, []);

  const allGalleryImages = useMemo(() => {
    return [...dbImages, ...galleryImages];
  }, [dbImages]);

  // Filters setup
  const filterCategories = [
    { id: 'all', label: 'All Work' },
    { id: 'suite', label: 'Space & Suite' },
    { id: 'nails', label: 'Nails' },
    { id: 'body', label: 'Body' },
    { id: 'lashes', label: 'Lashes' },
    { id: 'face', label: 'Face' },
    { id: 'hair', label: 'Hair' }
  ];

  // Filtering logic
  const filteredImages = useMemo(() => {
    return allGalleryImages.filter(img => selectedCategory === 'all' || img.category === selectedCategory);
  }, [selectedCategory, allGalleryImages]);

  const handleOpenLightbox = (imgId: string) => {
    const idx = filteredImages.findIndex(item => item.id === imgId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) => (prev === null || prev === 0 ? filteredImages.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && filteredImages.length > 0) {
      setLightboxIndex((prev) => (prev === null || prev === filteredImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleBookVisit = () => {
    if (onBookClick) {
      onBookClick();
    } else if (setCurrentPage) {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="gallery-page" className="bg-ivory min-h-screen animate-fadeIn">

      {/* 1. HERO SECTION (Split Layout) */}
      <section
        id="gallery-hero"
        className="relative bg-ivory pt-8 pb-16 sm:pt-12 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-charcoal/5 overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Text Content (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 lg:col-span-7 space-y-8 text-left order-2 lg:order-1"
          >
            {/* Subtle Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gold/10 border border-gold/25 rounded-full text-gold text-xs tracking-widest uppercase font-semibold">
              <Sparkle size={11} className="fill-gold animate-pulse" />
                          <span> Our Gallery </span>
            </div>

            {/* Majestic H1 */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-charcoal tracking-tight leading-[1.05]">
              The <br className="hidden lg:block" />
              <span className="italic text-gold font-normal">Collection</span>
            </h1>

            <div className="w-16 h-[1px] bg-gold" />

            {/* Elegant Subhead */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-charcoal/75 leading-relaxed font-normal max-w-xl">
                          A visual look at our space, our work and the experience we create.
            </p>

            {/* Core aesthetics tag row */}
            <div className="flex flex-wrap items-center justify-start gap-2 pt-4">
                          {["Lighting", "Calm Space", "Our Work", "Private Suite"].map((tag, idx) => (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                  key={idx}
                  className="text-[10px] tracking-widest uppercase font-semibold text-charcoal/75 bg-white border border-charcoal/5 px-4 py-2 rounded-full shadow-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Image Content (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="col-span-1 lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center order-1 lg:order-2"
          >
            {/* Premium overlapping decoration shape */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-sage/30 via-transparent to-gold/20 rounded-[2.5rem] -rotate-3 scale-102 pointer-events-none" />

            {/* Asymmetric Image Container */}
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none" />
              <img
                src={heroSalonLoftImg}
                alt="Luxury Salon Interior"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover:scale-110"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. EXCLUSIVE SPACE SPOTLIGHT: THE PRIVATE LADIES' SUITE */}
      <section id="private-suite-featured-block" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-charcoal border border-gold/10 rounded-[2rem] p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Background Flairs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                              <span className="text-xs font-bold tracking-[0.25em] uppercase text-gold">
                                  A Private Space
                              </span>
                          </div>

                          <h2 className="font-serif text-4xl sm:text-5xl text-ivory tracking-tight leading-[1.1]">
                              The <br /><span className="italic text-gold font-normal">Ladies' Suite</span>
                          </h2>
              <div className="w-16 h-[1px] bg-gold/30" />
              <div className="space-y-4">
                              <p className="font-sans text-sm sm:text-base text-ivory/80 font-normal leading-relaxed">
                                  For guests who prefer complete privacy, our Ladies' Suite offers a quiet,
                                  private space away from the main salon.
                              </p>

                              <p className="font-sans text-sm sm:text-base text-ivory/80 font-normal leading-relaxed">
                                  With a private entrance, personal temperature control, custom sound
                                  and a refreshment bar serving Ceylon tea, the suite is designed for
                                  comfort and relaxation. Enjoy a peaceful experience while our senior
                                  stylists take care of your hair, skin and nails.
                              </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleBookVisit}
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] uppercase bg-gold text-ivory py-4 px-8 rounded-full hover:bg-gold-hover transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer hover:-translate-y-0.5"
                >
                                  <span>Book the Private Suite</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Images Layout */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleOpenLightbox('suite-1')}
                  className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-charcoal border border-gold/10 cursor-pointer shadow-lg"
                >
                  <img
                    src={privateSuiteImg}
                    alt="Ladies Suite Entrance"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs font-bold tracking-widest uppercase text-ivory flex items-center gap-2">
                      <Eye size={14} className="text-gold" /> View Layout
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleOpenLightbox('suite-2')}
                  className="group relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-charcoal border border-gold/10 cursor-pointer shadow-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=75&w=800&auto=format&fit=crop&fm=webp"
                    alt="Ladies Suite Lounge"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs font-bold tracking-widest uppercase text-ivory flex items-center gap-2">
                      <Eye size={14} className="text-gold" /> View Lounge
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col justify-center sm:pt-12">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleOpenLightbox('suite-3')}
                  className="group relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-charcoal border border-gold/10 cursor-pointer shadow-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=75&w=800&auto=format&fit=crop&fm=webp"
                    alt="Ladies Suite Timber Vanity"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs font-bold tracking-widest uppercase text-ivory flex items-center gap-2">
                      <Eye size={14} className="text-gold" /> View Details
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 3. FILTERABLE IMAGES GRID */}
      <section id="lookbook-categories-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
          <h3 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight">
            The Lookbook Portfolio
          </h3>
          <p className="font-sans text-sm text-charcoal/75 font-normal leading-relaxed">
            Toggle categories to inspect close-up treatments and finished transformations from our masters.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 pb-12 mb-4">
          {filterCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[10px] sm:text-xs font-bold font-sans tracking-[0.15em] uppercase py-3 px-6 transition-all duration-300 cursor-pointer rounded-full shrink-0 border ${isActive
                  ? 'bg-charcoal text-ivory border-charcoal shadow-md'
                  : 'text-charcoal hover:text-gold hover:border-gold/30 bg-transparent border-charcoal/10 hover:shadow-sm'
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Multi-column even-grid layout */}
        <motion.div
          layout
          id="masonry-even-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img.id}
                id={`grid-item-${img.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => handleOpenLightbox(img.id)}
                className="group relative aspect-[4/5] overflow-hidden bg-charcoal rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={img.image}
                  alt={img.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out filter saturate-95 group-hover:saturate-100"
                />

                {/* Premium Editorial Hover Panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 text-left translate-y-4 group-hover:translate-y-0">
                  <div className="absolute top-6 right-6">
                    <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-ivory group-hover:text-gold transition-colors duration-300">
                      <Eye size={18} />
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gold bg-gold/10 px-3 py-1.5 rounded-full inline-block backdrop-blur-sm">
                      {img.category === 'suite' ? "Private Suite" : img.category}
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl text-ivory tracking-wide leading-tight">
                      {img.title}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-ivory/70 font-normal line-clamp-2 leading-relaxed">
                      {img.subtext}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-dashed border-charcoal/10 rounded-2xl max-w-lg mx-auto space-y-4 shadow-sm"
          >
            <p className="font-serif text-lg text-charcoal">No lookbook photos found.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors underline decoration-gold/30 underline-offset-4"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* 4. THE LOFT EXPERIENCE SECTION */}
      <section id="sensory-experience-section" className="relative w-full py-24 sm:py-32 bg-charcoal text-ivory mt-20 overflow-hidden">
        {/* Subtle Background Flairs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ivory/5 border border-ivory/10 rounded-full text-gold text-[10px] tracking-[0.25em] uppercase font-bold">
              <Sparkles size={12} className="text-gold animate-pulse" />
              Sensory Ritual Philosophy
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ivory tracking-tight leading-tight">
              The Loft Experience
            </h2>
            <div className="w-16 h-[1px] bg-gold/50 mx-auto" />
            <p className="font-sans text-sm sm:text-base md:text-lg text-ivory/70 leading-relaxed font-normal">
              Every appointment at Nugegoda is designed as an architectural escape. We replace salon noise with a quiet dialogue of luxury elements.
            </p>
          </motion.div>

          {/* 4-column layout detailing sensory experience highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            {[
              { icon: <Compass size={20} />, title: "Considered Comfort", desc: "Honed marble, warm timber and linen upholstery, designed for stillness." },
              { icon: <Clock size={20} />, title: "Calm, Unhurried Pacing", desc: "A curated, low-tempo soundtrack and a signature scent set the tone." },
              { icon: <Sparkle size={20} />, title: "Premium Care", desc: "Only internationally recognised products, applied with precision." },
              { icon: <ShieldCheck size={20} />, title: "Hygiene & Privacy", desc: "Sterilized tools, strict protocols, and a private ladies' suite." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm p-8 border border-white/5 rounded-2xl space-y-5 text-left hover:bg-white/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 group-hover:bg-gold group-hover:text-ivory transition-all duration-500">
                  {item.icon}
                </div>
                <h4 className="font-serif text-xl text-ivory tracking-wide">
                  {item.title}
                </h4>
                <p className="font-sans text-sm text-ivory/60 leading-relaxed font-normal group-hover:text-ivory/80 transition-colors">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-[10px] text-ivory/30 uppercase tracking-[0.3em] font-mono font-bold">
              Nugegoda Sanctuary • Architectural Integrity
            </p>
          </div>

        </div>
      </section>

      {/* 5. CLOSING CTA BLOCK */}
      <section id="gallery-closing-cta" className="max-w-3xl mx-auto px-4 sm:px-6 text-center mt-32 mb-16 space-y-12">
        <div className="space-y-6">
          <p className="font-serif text-2xl sm:text-3xl text-charcoal italic leading-relaxed max-w-xl mx-auto tracking-wide">
            "Space to breathe, design to calm, care crafted entirely around your rhythm."
          </p>
          <div className="w-12 h-[1px] bg-gold/50 mx-auto" />
        </div>

        <div className="space-y-8 pt-6">
          <button
            onClick={handleBookVisit}
            className="font-sans text-xs font-bold tracking-[0.25em] uppercase bg-gold text-ivory py-4.5 px-12 rounded-full hover:bg-gold-hover transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer hover:scale-105 active:scale-95"
          >
            Book Your Visit
          </button>

          <div className="space-y-4 pt-4">
            <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-charcoal/50">
              Follow us for a closer look
            </p>
            <div className="flex justify-center items-center gap-6 text-charcoal">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase group"
              >
                <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Instagram size={14} />
                </div>
                <span>@theloftbynm</span>
              </a>
              <span className="text-charcoal/10">|</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors text-xs font-bold tracking-widest uppercase group"
              >
                <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Facebook size={14} />
                </div>
                <span>The Loft NM</span>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* 6. LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="gallery-lightbox"
            onClick={handleCloseLightbox}
            className="fixed inset-0 bg-charcoal/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Close trigger */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-gold flex items-center justify-center transition-all z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation Controls */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 md:left-12 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-gold flex items-center justify-center transition-all z-50 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 md:right-12 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-white/10 text-ivory/60 hover:text-gold flex items-center justify-center transition-all z-50 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight size={28} />
            </button>

            {/* Image & Description Wrap */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col items-center gap-6 sm:gap-8 relative"
            >
              <div className="relative max-h-[70vh] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={filteredImages[lightboxIndex].image}
                  alt={filteredImages[lightboxIndex].title}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>

              {/* Description Meta */}
              <div className="text-center space-y-3 text-ivory max-w-2xl px-4">
                <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-gold uppercase bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm">
                  {filteredImages[lightboxIndex].category === 'suite' ? "Private Ladies' Suite" : `${filteredImages[lightboxIndex].category} collection`}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-wide text-ivory">
                  {filteredImages[lightboxIndex].title}
                </h3>
                <p className="font-sans text-sm sm:text-base text-ivory/80 font-normal leading-relaxed max-w-xl mx-auto">
                  {filteredImages[lightboxIndex].subtext}
                </p>
                <div className="pt-4">
                  <p className="text-[10px] text-ivory/40 uppercase tracking-[0.3em] font-mono">
                    Image {lightboxIndex + 1} of {filteredImages.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
