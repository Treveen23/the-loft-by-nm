import React, { useState, useMemo, useRef, useEffect } from 'react';
import { fetchServices } from '../api';
import { IMAGES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkle,
  Calendar,
  Clock,
  HelpCircle,
  ArrowRight,
  Info,
  CheckCircle,
  Scissors,
  Eye,
  Sparkles,
  Heart
} from 'lucide-react';

interface MenuViewProps {
  onBookService: (serviceId: string) => void;
}

interface PricingItem {
  name: string;
  price: string;
  isPopular?: boolean;
  subtext?: string;
}

interface PricingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  items: PricingItem[];
}

export default function MenuView({ onBookService }: MenuViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('nails');
  const [dbServices, setDbServices] = useState<any[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchServices().then(data => {
      if (data && data.length > 0) {
        setDbServices(data);
      }
    }).catch(console.error);
  }, []);



  const menuData: PricingCategory[] = [
    {
      id: 'nails',
      title: 'Nails',
      description: 'Meticulous manicures, organic therapeutic pedicures, precise gel work, Russian techniques, and bespoke nail repairs.',
      icon: <Sparkles size={18} className="text-gold" />,
      image: IMAGES.nails,
      items: dbServices.filter(s => s.category_id === 'nails').length > 0 ? dbServices.filter(s => s.category_id === 'nails') : [
        { name: 'Express Manicure', price: '3,500', isPopular: false },
        { name: 'Express Pedicure', price: '4,000', isPopular: false },
        { name: 'Classic Manicure', price: '4,500', isPopular: true, subtext: 'Includes soak, cuticle trim, massage, and regular polish' },
        { name: 'Classic Pedicure', price: '5,000', isPopular: true, subtext: 'Relaxing foot soak, scrub, file, cuticle trim, and regular polish' },
        { name: 'Spa Deluxe Manicure', price: '6,500', isPopular: false, subtext: 'Extended herbal hand soak, exfoliating scrub, warm wrap, and deep massage' },
        { name: 'Spa Deluxe Pedicure', price: '8,000', isPopular: true, subtext: 'Detox clay foot mask, hot towel wrap, extended foot massage, and paraffin hydration' },
        { name: 'Spa Deluxe Pedicure + Treatment', price: '9,500', isPopular: false, subtext: 'Targeted cracked-heel restoration with clinical tea tree oil serum' },
        { name: 'Gel Manicure', price: '6,500', isPopular: true, subtext: 'Premium toxin-free LED-cured gel color with exceptional 3-week gloss' },
        { name: 'Gel Pedicure', price: '7,000', isPopular: false },
        { name: 'Russian Manicure', price: '8,500', isPopular: true, subtext: 'Precision dry e-file technique for immaculate, ultra-deep cuticle finishes' },
        { name: 'Russian Pedicure', price: '9,500', isPopular: false },
        { name: 'Russian Gel Manicure', price: '11,500', isPopular: true },
        { name: 'Russian Gel Pedicure', price: '13,000', isPopular: false },
        { name: 'Gel Color Removal', price: '2,000', isPopular: false, subtext: 'Gentle, zero-scrape wrapping removal to keep natural nail plates strong' },
        { name: 'Gel Color Application', price: '3,500', isPopular: false },
        { name: 'Classic Color Change', price: '2,500', isPopular: false },
        { name: 'French Finish (add-on)', price: '1,500', isPopular: false },
        { name: 'Nail Repair (per nail, from)', price: '1,000', isPopular: false, subtext: 'Structural silk wrap or clear acrylic consolidation' },
        { name: 'Nail Extensions (Gel / Polygel)', price: '15,500', isPopular: true, subtext: 'Sleek, lightweight nail enhancements customized to your ideal curvature' },
        { name: 'Gel Tips (Temporary)', price: '8,500', isPopular: false },
        { name: 'Gel Overlay', price: '10,000', isPopular: false, subtext: 'Reinforcement protective layer directly on top of your natural nail length' },
        { name: 'Extension Removal', price: '4,500', isPopular: false },
        { name: 'Gel Refill (2 weeks)', price: '8,500', isPopular: false },
        { name: 'Nail Art (per nail, from)', price: '800', isPopular: false, subtext: 'Custom minimalist linework, hand-painted details, or gold leaf foil additions' },
        { name: 'Chrome / Cateye / Ombre (add-on)', price: '2,000', isPopular: false },
        { name: 'Paraffin Treatment (Hands / Feet)', price: '4,000', isPopular: false, subtext: 'Deep-heating nourishing liquid wax treatment for intense joint and skin softness' },
        { name: 'Foot / Hand Scrub', price: '2,500', isPopular: false }
      ]
    },
    {
      id: 'body',
      title: 'Body',
      description: 'Hygienic botanical waxing therapies and deeply relaxing structural massages delivered with complete personal discretion.',
      icon: <Heart size={18} className="text-gold" />,
      image: IMAGES.salonVibe1,
      items: dbServices.filter(s => s.category_id === 'body').length > 0 ? dbServices.filter(s => s.category_id === 'body') : [
        { name: 'Underarm Waxing', price: '2,000', isPopular: false },
        { name: 'Half Arm Waxing', price: '3,500', isPopular: false },
        { name: 'Full Arm Waxing', price: '5,000', isPopular: false },
        { name: 'Half Legs Waxing', price: '4,500', isPopular: false },
        { name: 'Full Legs Waxing', price: '6,500', isPopular: true },
        { name: 'Bikini Line Waxing', price: '4,000', isPopular: false },
        { name: 'Brazilian Wax', price: '8,500', isPopular: true, subtext: 'Performed using premium, low-temperature hypoallergenic hard wax' },
        { name: 'Full Body Wax', price: '22,500', isPopular: false },
        { name: 'Abdominal Wax', price: '3,500', isPopular: false },
        { name: 'Chest / Back Wax', price: '5,500', isPopular: false },
        { name: 'Hollywood Wax', price: '9,500', isPopular: false },
        { name: 'Head, Neck & Shoulder Massage (30 mins)', price: '5,500', isPopular: true, subtext: 'Acupressure relief designed to melt away desk fatigue and tension' },
        { name: 'Foot Reflexology (30 mins)', price: '5,500', isPopular: true, subtext: 'Targeted pressure-point therapy to stimulate circulation and full-body vitality' },
        { name: 'Basic Foot Massage (15 mins)', price: '3,000', isPopular: false },
        { name: 'Full Body Relaxation Massage (60 mins)', price: '11,500', isPopular: true, subtext: 'A flowing, rhythmic massage using warm organic lavender oil in a low-lit room' },
        { name: 'Hot Stone Massage (60 mins)', price: '13,500', isPopular: false, subtext: 'Smooth basalt stones heated to comfort temperature to melt deep-seated muscle knots' }
      ]
    },
    {
      id: 'lashes',
      title: 'Lashes & Brows',
      description: 'High-definition lifts, tinting, meticulous lamination, and individually placed extensions for effortless definition.',
      icon: <Eye size={18} className="text-gold" />,
      image: IMAGES.makeup,
      items: dbServices.filter(s => s.category_id === 'lashes').length > 0 ? dbServices.filter(s => s.category_id === 'lashes') : [
        { name: 'Classic Lash Extensions (full set)', price: '12,000', isPopular: true, subtext: 'One-to-one application of featherlight silk fibers for natural elegance' },
        { name: 'Mega Lash Extensions (full set)', price: '18,000', isPopular: false, subtext: 'Ultra-dense multi-dimensional lash arrangements for stunning luxury volume' },
        { name: 'Lash Lift', price: '7,500', isPopular: true, subtext: 'Keratin-packed treatment raising lashes from the root for a bright-eyed look' },
        { name: 'Classic Lash Refill (13 days)', price: '6,000', isPopular: false },
        { name: 'Mega Lash Refill (13 days)', price: '9,000', isPopular: false },
        { name: 'Lash Removal', price: '3,000', isPopular: false, subtext: 'Safe, zero-damage release cream treatment' },
        { name: 'Lash Tint', price: '3,500', isPopular: false },
        { name: 'Eyebrow Tint', price: '3,500', isPopular: false, subtext: 'Custom mixed vegetable pigments mapping perfect facial balance' },
        { name: 'Eyebrow Lamination', price: '8,500', isPopular: true, subtext: 'Setting brow hairs in a sleek, upward, full format for a brushed-up editorial look' },
        { name: 'Brow Lift', price: '7,000', isPopular: false },
        { name: 'Eyebrow Threading', price: '2,000', isPopular: true }
      ]
    },
    {
      id: 'face',
      title: 'Face',
      description: 'Botanical cellular facial rituals, results-driven pore extraction, and gentle face mapping threadings.',
      icon: <Sparkle size={18} className="text-gold" />,
      image: IMAGES.facial,
      items: dbServices.filter(s => s.category_id === 'face').length > 0 ? dbServices.filter(s => s.category_id === 'face') : [
        { name: 'Express Facial / Cleanup', price: '6,500', isPopular: false, subtext: 'Double cleanse, gentle steam, pore extraction, and botanical serum shield' },
        { name: 'Vitamin C Glow Facial', price: '12,000', isPopular: true, subtext: 'Active antioxidant rich vitamin C complex infusion targeting hyperpigmentation' },
        { name: 'Anti-Ageing Lift Facial', price: '15,500', isPopular: true, subtext: 'Collagen-boosting massage, active peptide concentrates, and cooling firming mask' },
        { name: 'Clay Mask (add-on)', price: '2,000', isPopular: false },
        { name: 'Lip Scrub (add-on)', price: '1,500', isPopular: false },
        { name: 'Eye Mask (add-on)', price: '2,000', isPopular: false },
        { name: 'Upper Lip Threading', price: '1,200', isPopular: false },
        { name: 'Chin Threading', price: '1,200', isPopular: false },
        { name: 'Full Face Threading / Waxing', price: '4,500', isPopular: true },
        { name: 'Nasal Waxing', price: '1,500', isPopular: false },
        { name: 'Spa Face Massage (30 mins)', price: '4,000', isPopular: false, subtext: 'Lymphatic facial massage to contour, lift, and drain puffiness' }
      ]
    },
    {
      id: 'hair',
      title: 'Hair',
      description: 'Precision couture haircuts, hand-painted Parisian balayages, root touchups, and amino keratin restorative treatments.',
      icon: <Scissors size={18} className="text-gold" />,
      image: IMAGES.hair,
      items: dbServices.filter(s => s.category_id === 'hair').length > 0 ? dbServices.filter(s => s.category_id === 'hair') : [
        { name: 'Hair Cut with Style (any length)', price: '8,500', isPopular: true, subtext: 'Diagnostic face structure mapping, luxury botanical wash, cut, and blowout' },
        { name: 'Highlight / Balayage / Ombré (from)', price: '22,500', isPopular: true, subtext: 'Creative hand-painted custom coloring including premium plex protection' },
        { name: 'Blow Dry (from)', price: '4,500', isPopular: false, subtext: 'Smooth sleek, bouncy waves, or pin-straight glamour' },
        { name: 'Root Touch Up (from)', price: '7,500', isPopular: false },
        { name: 'Hair Color Full Head (from)', price: '14,500', isPopular: false },
        { name: 'Hair Styling (from)', price: '6,500', isPopular: false, subtext: 'Editorial updos, intricate braids, or red-carpet styling' },
        { name: 'Toner / Rinsage (from)', price: '5,000', isPopular: false },
        { name: 'Hot Oil Treatment (from)', price: '4,000', isPopular: false, subtext: 'Deep pre-shampoo warm herbal infusion for intensive scalp hydration' },
        { name: 'Hair Spa Treatment (from)', price: '8,000', isPopular: true, subtext: 'Steam-infused moisturizing cream wraps for dry, frizzy hair shafts' },
        { name: 'Keratin Brazilian Blow Out (from)', price: '28,000', isPopular: false, subtext: 'Formaldehyde-free smoothing therapy for frizz control and intense glow' }
      ]
    }
  ];

  // Display logic
  const displayCategories = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = menuData.map(cat => {
        const categoryMatches = cat.title.toLowerCase().includes(query) || cat.id.toLowerCase().includes(query);
        const filteredItems = cat.items.filter(item =>
          categoryMatches ||
          item.name.toLowerCase().includes(query) ||
          (item.subtext && item.subtext.toLowerCase().includes(query))
        );
        return { ...cat, items: filteredItems };
      }).filter(cat => cat.items.length > 0);

      // Prioritize categories whose title matches the search query
      return results.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(query) || a.id.toLowerCase().includes(query);
        const bTitleMatch = b.title.toLowerCase().includes(query) || b.id.toLowerCase().includes(query);
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return 0;
      });
    }

    // Default tab view
    return menuData.filter(cat => cat.id === activeCategory);
  }, [searchQuery, activeCategory, dbServices]);

  return (
    <div id="menu-pricing-page" className="bg-[#FAF9F6] min-h-screen text-charcoal animate-fadeIn selection:bg-gold/30 selection:text-charcoal">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 lg:pt-16 pb-16">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center space-y-6 mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.35em] uppercase text-gold block">
            The Salon Menu
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-tight">
            Our Services & <span className="font-normal italic text-gold">Pricing</span>
          </h1>
          <div className="w-16 h-[1px] bg-gold mx-auto my-4" />
          <p className="font-sans text-sm sm:text-base md:text-lg text-charcoal/80 font-normal leading-relaxed max-w-2xl mx-auto">
            Transparent pricing for every therapy. Select your desired treatment from our carefully assembled catalog.
          </p>
        </motion.div>

        <div ref={filterRef} className="scroll-mt-[160px]" />
        {/* Top Filter Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 sticky top-[135px] md:top-[125px] lg:top-[115px] z-40 bg-[#FAF9F6] py-4 transition-all">
          {/* Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto w-full pb-4 lg:pb-0 scrollbar-none snap-x">
            {menuData.map((cat) => {
              const isActive = activeCategory === cat.id && !searchQuery.trim();
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                    if (filterRef.current) {
                      filterRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`shrink-0 snap-start flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 border text-sm font-medium ${
                    isActive
                      ? 'bg-charcoal text-white border-charcoal shadow-md'
                      : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-charcoal/30 hover:text-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-charcoal/40'}>{cat.icon}</span>
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80 shrink-0 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40 group-focus-within:text-gold transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search specific treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-charcoal text-sm border border-charcoal/10 pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all shadow-sm placeholder:text-charcoal/40"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-full text-charcoal/40 hover:text-charcoal transition-colors cursor-pointer"
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid Content */}
        <div className="space-y-20">
          <AnimatePresence mode="wait">
            {displayCategories.length > 0 ? (
              displayCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-8"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <span className="text-gold"><Sparkles size={20} /></span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">{category.title}</h2>
                    <div className="h-[1px] bg-charcoal/10 flex-grow ml-4"></div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        onClick={() => onBookService(item.id || item.name)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                        className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-charcoal/5 hover:border-gold/30"
                      >
                        {/* Image Container */}
                        <div className="w-full aspect-[4/3] relative overflow-hidden bg-charcoal/5">
                          <img
                            src={(item as any).image || category.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          {(item.isPopular || (item as any).is_popular) && (
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                              <span className="text-[9px] font-bold tracking-wider uppercase text-charcoal/80">
                                Popular
                              </span>
                            </div>
                          )}
                          {item.name.toLowerCase().includes('signature') && !(item.isPopular || (item as any).is_popular) && (
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                              <span className="text-[9px] font-bold tracking-wider uppercase text-charcoal/80">
                                Signature
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                          <div className="space-y-2 mb-6">
                            <h3 className="font-serif text-lg sm:text-xl text-charcoal leading-tight group-hover:text-gold transition-colors duration-300">
                              {item.name}
                            </h3>
                            {item.subtext && (
                              <p className="font-sans text-xs sm:text-sm text-charcoal/60 leading-relaxed line-clamp-2">
                                {item.subtext}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-end justify-between border-t border-charcoal/5 pt-4">
                            <div>
                              <span className="block text-[9px] font-bold tracking-[0.2em] text-charcoal/40 uppercase mb-1">LKR</span>
                              <span className="font-sans text-lg sm:text-xl font-semibold tracking-wide text-charcoal">
                                {item.price}
                              </span>
                            </div>
                            
                            {/* Booking Arrow */}
                            <div className="w-10 h-10 rounded-full bg-charcoal/5 group-hover:bg-charcoal flex items-center justify-center transition-colors duration-300 shrink-0">
                              <ArrowRight size={16} className="text-charcoal/40 group-hover:text-gold transition-colors duration-300 group-hover:-rotate-45" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 px-4 bg-white border border-dashed border-charcoal/10 rounded-[2rem] max-w-xl mx-auto space-y-6"
              >
                <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto text-charcoal/40">
                  <Search size={24} />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-2xl text-charcoal">No rituals found matching "{searchQuery}"</p>
                  <p className="font-sans text-sm text-charcoal/50 font-normal max-w-md mx-auto leading-relaxed">
                    Try adjusting your search terms or simply select a category from the menu to explore.
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="font-sans text-xs font-bold tracking-[0.2em] uppercase bg-charcoal text-white px-8 py-4 rounded-full hover:bg-gold hover:text-charcoal transition-colors cursor-pointer shadow-md"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Notes & CTA */}
        <div className="mt-20 space-y-8">
          <div className="border border-charcoal/10 p-6 sm:p-8 rounded-[2rem] space-y-3 bg-white">
            <div className="inline-flex items-center gap-1.5 text-gold">
              <Info size={14} />
              <span className="font-sans text-xs font-bold uppercase tracking-wider">Pricing Considerations</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-charcoal/60 leading-relaxed font-normal">
              Prices may vary based on customisation. All prices are subject to local government taxes and service charges where applicable.
            </p>
          </div>

          <div className="py-12 border-t border-charcoal/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-tight">
                Ready for your <span className="italic text-gold">ritual?</span>
              </h3>
              <p className="font-sans text-sm text-charcoal/60 font-normal flex items-center justify-center md:justify-start gap-2">
                <Clock size={12} className="text-gold" />
                Walk-ins catered promptly
              </p>
            </div>
            <button
              onClick={() => onBookService('Custom Consultation')}
              className="w-full md:w-auto font-sans text-xs font-bold tracking-[0.25em] uppercase bg-charcoal text-white py-4 px-10 rounded-full hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md cursor-pointer hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span>Book Now</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
