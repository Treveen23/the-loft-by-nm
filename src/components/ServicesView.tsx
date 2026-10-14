import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGES } from '../data';
import {
  Sparkle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  Smile,
  Users,
  Info,
  ArrowUpRight,
  X
} from 'lucide-react';

interface ServicesViewProps {
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

interface ServiceCardItem {
  id: string;
  category: 'nails' | 'body' | 'lashes' | 'face' | 'hair';
  title: string;
  image: string;
  description: string;
  duration: string;
  priceEstimate: string;
}

export default function ServicesView({ setCurrentPage, onBookClick }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedInfoService, setSelectedInfoService] = useState<ServiceCardItem | null>(null);

  const navigateTo = (view: string) => {
    setCurrentPage(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'nails', label: 'Nails' },
    { id: 'body', label: 'Body' },
    { id: 'lashes', label: 'Lashes & Brows' },
    { id: 'face', label: 'Face' },
    { id: 'hair', label: 'Hair' }
  ];

  const serviceCards: ServiceCardItem[] = [
    {
      id: 's-nails-1',
      category: 'nails',
      title: 'Artisanal Manicures & Gel Art',
      image: IMAGES.nails,
      description: 'Precision cuticle therapy, hydrating masks, organic sugar exfoliations, and custom hand-painted gel linework configured exactly to your lifestyle.',
      duration: '60 Mins',
      priceEstimate: 'Rs. 6,500'
    },
    {
      id: 's-body-1',
      category: 'body',
      title: 'Therapeutic Stress Release Massage',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
      description: 'Slow-paced, restorative back and shoulder massage performed by certified therapists within our temperature-regulated, candle-lit suite.',
      duration: '75 Mins',
      priceEstimate: 'Rs. 11,500'
    },
    {
      id: 's-lashes-1',
      category: 'lashes',
      title: 'Keratin Brow Lamination & Tint',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
      description: 'Rich vitamin-infused lamination paired with architectural brow mapping and a custom tint to add effortless structure and elegant symmetry.',
      duration: '45 Mins',
      priceEstimate: 'Rs. 8,500'
    },
    {
      id: 's-face-1',
      category: 'face',
      title: 'Botanical Gold Cellular facial',
      image: IMAGES.facial,
      description: 'A multi-tier botanical infusion incorporating active enzymes, warm micro-steaming, and firming 24k gold serum applications for an unmatched dewiness.',
      duration: '90 Mins',
      priceEstimate: 'Rs. 18,500'
    },
    {
      id: 's-hair-1',
      category: 'hair',
      title: 'Couture Cut & French Balayage',
      image: IMAGES.hair,
      description: 'A customized, face-framing diagnostic cut combined with hand-painted balayage accents and an Olaplex bond-building gloss to elevate natural bounce.',
      duration: '180 Mins',
      priceEstimate: 'Rs. 24,500'
    },
    {
      id: 's-nails-2',
      category: 'nails',
      title: 'Luxury Milk & Honey Pedicure Ritual',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=600&auto=format&fit=crop',
      description: 'Warm organic milk foot bath, real wild honey mask wraps, hot stone massage therapy, and precision clinical nail-shaping finishes.',
      duration: '75 Mins',
      priceEstimate: 'Rs. 8,500'
    },
    {
      id: 's-body-2',
      category: 'body',
      title: 'Precise Botanical Waxing Services',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600&auto=format&fit=crop',
      description: 'Highly hygienic, low-temperature organic botanical wax formulations applied with meticulous discretion to ensure absolute skin calmness.',
      duration: '30 Mins',
      priceEstimate: 'Rs. 4,500'
    },
    {
      id: 's-lashes-2',
      category: 'lashes',
      title: 'Premium Featherlight Lash Extensions',
      image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?q=80&w=600&auto=format&fit=crop',
      description: 'Individual medical-grade custom lash placements applied with seamless artistry to give you lightweight, comfortable density.',
      duration: '120 Mins',
      priceEstimate: 'Rs. 14,000'
    }
  ];

  // Filter service cards based on chosen active tab
  const filteredServices = useMemo(() => {
    return serviceCards.filter((card) => {
      return activeTab === 'all' || card.category === activeTab;
    });
  }, [activeTab]);

  const handleMoreInfoClick = (service: ServiceCardItem) => {
    setSelectedInfoService(service);
  };

  const handleCloseInfoModal = () => {
    setSelectedInfoService(null);
  };

  return (
    <div id="services-page-view" className="animate-fadeIn">

      {/* 1. HERO SECTION (Split Layout) */}
      <section
        id="services-hero"
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
              <span>The Catalog</span>
            </div>

            {/* Majestic H1 */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-charcoal tracking-tight leading-[1.05]">
              Curated <br className="hidden lg:block" />
              <span className="italic text-gold font-normal">Rituals</span>
            </h1>

            <div className="w-16 h-[1px] bg-gold" />

            {/* Elegant Subhead */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-charcoal/75 leading-relaxed font-normal max-w-xl">
              A curated menu of nail, body, lash, brow, face and hair rituals, each performed by trained therapists, with a private ladies' suite available for those who want it.
            </p>

            {/* Trust Stats Row */}
            <div
              id="services-stats-row"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl"
            >
              {[
                { title: "5 Categories", desc: "Head-to-toe premium care" },
                { title: "Trained Masters", desc: "Strict certification standards" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (idx * 0.1), ease: "easeOut" }}
                  className="bg-white border border-charcoal/[0.04] p-5 rounded-2xl text-left space-y-1.5 hover:border-gold/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="font-serif text-xl text-gold font-medium">
                    {stat.title}
                  </p>
                  <p className="font-sans text-xs text-charcoal/70 leading-relaxed font-normal">
                    {stat.desc}
                  </p>
                </motion.div>
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
                src={IMAGES.facial}
                alt="Luxury Facial Service"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover:scale-110"
              />
            </div>
          </motion.div>

        </div>
      </section>


      {/* 2. FILTERABLE SERVICE MENU GRID */}
      <section
        id="filterable-menu-grid"
        className="py-24 bg-ivory px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
      >

        {/* Tabbed Filter Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-charcoal/75">
            Select A Category
          </span>
          <div
            id="services-tabs"
            className="flex flex-wrap justify-center gap-2 border-b border-charcoal/10 pb-6 w-full"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[10px] sm:text-xs font-bold tracking-[0.15em] font-sans uppercase py-3 px-6 rounded-full transition-all duration-300 cursor-pointer border ${isActive
                    ? 'bg-charcoal text-ivory border-charcoal shadow-md'
                    : 'text-charcoal hover:text-gold hover:border-gold/30 bg-transparent border-charcoal/10 hover:shadow-sm'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Dynamic Grid of Service Cards */}
        <motion.div
          layout
          id="filtered-services-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((card, cardIdx) => (
              <motion.div
                key={card.id}
                id={`service-card-${card.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: cardIdx * 0.05 }}
                className="bg-white border border-charcoal/[0.05] rounded-[1.5rem] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
              >
                <div className="space-y-4">
                  {/* 4:5 Image Placeholder with Cinematic Hover */}
                  <div className="aspect-[4/5] overflow-hidden relative cursor-pointer" onClick={() => handleMoreInfoClick(card)}>
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                    {/* Dark gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Subtle Elegant Tag */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-gold uppercase rounded-full shadow-sm">
                      {card.category}
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="px-6 space-y-2 text-left pt-2 pb-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-charcoal group-hover:text-gold transition-colors duration-300 leading-tight">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-charcoal/70 font-normal leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Service Footer CTAs */}
                <div className="p-6 pt-4 border-t border-charcoal/[0.03] flex flex-col gap-4">
                  <div className="flex justify-center items-center text-[10px] font-bold font-sans uppercase tracking-widest text-charcoal/60 bg-charcoal/5 px-4 py-2 rounded-full">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> {card.duration}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={onBookClick}
                      className="flex-grow font-sans text-xs font-bold tracking-[0.2em] uppercase bg-charcoal text-ivory py-3.5 rounded-full hover:bg-gold transition-colors duration-300 shadow-md text-center cursor-pointer"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => handleMoreInfoClick(card)}
                      className="w-12 h-12 flex items-center justify-center rounded-full border border-charcoal/10 text-charcoal hover:bg-gold/10 hover:border-gold/30 hover:text-gold transition-all duration-300 cursor-pointer"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-dashed border-charcoal/10 rounded-2xl max-w-lg mx-auto space-y-4 shadow-sm"
          >
            <p className="font-serif text-lg text-charcoal">No services found for this category.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors underline decoration-gold/30 underline-offset-4 cursor-pointer"
            >
              View All Services
            </button>
          </motion.div>
        )}
      </section>
      {/* 3. GROUP EXPERIENCES SECTION */}
      <section
        id="group-experiences-section"
        className="py-24 sm:py-32 bg-charcoal relative overflow-hidden"
      >
        {/* Subtle Background Flairs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">

          {/* Header block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ivory/5 border border-ivory/10 rounded-full text-gold text-[10px] tracking-[0.25em] uppercase font-bold">
              <Sparkles size={12} className="text-gold animate-pulse" />
              Group Experiences
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory tracking-tight leading-tight">
              Private Pampering, <span className="italic text-gold font-normal">Together</span>
            </h2>
            <div className="w-16 h-[1px] bg-gold/50 mx-auto" />
            <p className="font-sans text-sm sm:text-base md:text-lg text-ivory/70 font-normal leading-relaxed max-w-2xl mx-auto">
              From bridal parties and kitty get-togethers to birthdays and corporate wellness sessions. The Loft by NM offers exclusive use of the space for groups who want to be pampered, together, in private.
            </p>
          </motion.div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch max-w-6xl mx-auto">

            {/* Left Column ("Perfect for") */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12 rounded-[2rem] space-y-8 flex flex-col justify-between hover:bg-white/10 hover:border-gold/30 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gold">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                    Perfect For
                  </h3>
                </div>
                <div className="h-[1px] bg-white/10" />
                <ul className="space-y-5 font-sans text-sm text-ivory/80">
                  {[
                    "Bridal & Pre-Wedding Prep",
                    "Girls' Gatherings",
                    "Birthdays & Baby Showers",
                    "Corporate Women's Wellness Sessions"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 group">
                      <span className="w-2 h-2 bg-gold/50 group-hover:bg-gold rounded-full transition-colors duration-300" />
                      <span className="font-medium tracking-wide group-hover:text-ivory transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-ivory/40 pt-4 border-t border-white/5">
                * Booking our fully isolated ladies' suites allows absolute seclusion.
              </p>
            </motion.div>

            {/* Right Column ("Good to know") */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12 rounded-[2rem] space-y-8 flex flex-col justify-between hover:bg-white/10 hover:border-gold/30 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gold">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ivory">
                    Good to Know
                  </h3>
                </div>
                <div className="h-[1px] bg-white/10" />
                <ul className="space-y-5 font-sans text-sm text-ivory/80">
                  {[
                    "Custom packages available with fully tailored treatments",
                    "Minimum group size of 5 guests applies",
                    "Optional add-ons: refreshments, high tea, décor upgrades"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <span className="text-gold font-bold select-none mt-0.5 group-hover:scale-125 transition-transform duration-300">✦</span>
                      <span className="leading-relaxed group-hover:text-ivory transition-colors duration-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8 border-t border-white/5">
                <button
                  id="group-btn-enquire"
                  onClick={() => setCurrentPage('contact')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-xs font-bold tracking-[0.2em] uppercase bg-gold text-ivory py-4.5 px-10 rounded-full hover:bg-gold-hover transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                >
                  <span>Enquire Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 4. WHY CHOOSE OUR SERVICES SECTION */}
      <section
        id="why-choose-services-section"
        className="py-24 sm:py-32 bg-ivory"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-gold block">Our Standards</span>
            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal">The Foundations of Every Ritual</h3>
            <div className="w-16 h-[1px] bg-gold mx-auto" />
          </motion.div>

          {/* 4-column horizontal layout featuring clean monoline icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              { icon: <Award size={24} />, title: "Certified Professionals", desc: "Every therapist is trained, certified and held to the same consistent standard." },
              { icon: <Sparkles size={24} />, title: "Premium Products", desc: "We use only internationally recognised brands for results that last." },
              { icon: <Calendar size={24} />, title: "Flexible Scheduling", desc: "Walk in when it suits you, or book ahead to guarantee your preferred time." },
              { icon: <Smile size={24} />, title: "Personalised Care", desc: "Every visit opens with a short consultation to understand what you need." }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="group space-y-6 p-8 bg-white border border-charcoal/[0.04] rounded-3xl transition-all duration-500 hover:shadow-xl hover:border-gold/20 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-ivory transition-all duration-500">
                  {stat.icon}
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-charcoal">
                  {stat.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-charcoal/70 font-normal leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>


      {/* 5. CLOSING CTA BLOCK */}
      <section
        id="services-closing-cta"
        className="bg-charcoal text-ivory py-32 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-12"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ivory/5 border border-ivory/10 rounded-full text-gold text-[10px] tracking-[0.25em] uppercase font-bold">
              Experience Seclusion
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory tracking-tight leading-tight">
              Ready for Intentional Care?
            </h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto" />
            <p className="font-sans text-sm sm:text-base md:text-lg text-ivory/80 max-w-lg mx-auto leading-relaxed font-normal">
              Schedule your desired therapy session. Walk-ins and advanced private ladies' suite upgrades are welcome.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-xs sm:max-w-xl mx-auto">
            <button
              id="closing-btn-book"
              onClick={onBookClick}
              className="w-full sm:w-auto font-sans text-xs font-bold tracking-[0.25em] uppercase bg-gold text-ivory py-4.5 px-12 rounded-full hover:bg-gold-hover transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105"
            >
              Book Appointment
            </button>
            <button
              id="closing-btn-menu"
              onClick={() => navigateTo('menu')}
              className="w-full sm:w-auto font-sans text-xs font-bold tracking-[0.2em] uppercase border-2 border-ivory/20 text-ivory py-4 px-12 rounded-full hover:bg-ivory hover:text-charcoal transition-all duration-300 cursor-pointer"
            >
              View Pricing
            </button>
          </div>
        </motion.div>
      </section>


      {/* 6. Service Info Modal */}
      <AnimatePresence>
        {selectedInfoService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="service-info-modal"
            onClick={handleCloseInfoModal}
            className="fixed inset-0 bg-charcoal/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory text-charcoal max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-charcoal/10 relative"
            >
              {/* Modal Header Image */}
              <div className="h-64 relative overflow-hidden bg-charcoal">
                <img
                  src={selectedInfoService.image}
                  alt={selectedInfoService.title}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

                <button
                  onClick={handleCloseInfoModal}
                  className="absolute top-4 right-4 text-ivory hover:text-gold text-sm bg-charcoal/40 backdrop-blur-sm hover:bg-charcoal/80 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold z-10"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-6 left-8 space-y-2">
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gold bg-gold/10 px-3 py-1.5 rounded-full inline-block backdrop-blur-md">
                    {selectedInfoService.category}
                  </span>
                  <h4 className="text-ivory font-serif text-2xl sm:text-3xl leading-tight">
                    {selectedInfoService.title}
                  </h4>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8 text-left bg-ivory">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <span className="text-[10px] tracking-[0.2em] font-sans font-bold text-charcoal/50 uppercase">
                      Service Specifics
                    </span>
                  </div>
                  <p className="font-sans text-sm text-charcoal/80 font-normal leading-relaxed">
                    {selectedInfoService.description}
                  </p>
                </div>

                {/* Specific highlights */}
                <div className="bg-charcoal/[0.03] p-6 rounded-xl border border-charcoal/[0.05] space-y-4 font-sans text-xs">

                  <div className="flex justify-between items-center border-b border-charcoal/10 pb-3">
                    <span className="text-charcoal/60 font-medium uppercase tracking-[0.1em]">Estimated Duration:</span>
                    <span className="text-charcoal font-bold flex items-center gap-1.5"><Clock size={14} className="text-gold" /> {selectedInfoService.duration}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-charcoal/60 font-medium uppercase tracking-[0.1em]">Suite Upgrade:</span>
                    <span className="text-charcoal font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkle size={12} className="text-gold" /> Available
                    </span>
                  </div>
                </div>

                {/* Book CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleCloseInfoModal();
                      onBookClick();
                    }}
                    className="w-full font-sans text-xs font-bold tracking-[0.2em] uppercase bg-charcoal text-ivory py-4.5 rounded-full hover:bg-gold transition-colors duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Book This Ritual
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
