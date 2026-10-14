import React from 'react';
import { IMAGES } from '../data';
import Testimonials from './Testimonials';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  MapPin,
  Clock,
  ExternalLink,
  Check,
  Layers,
  Scissors,
  Heart,
  Eye,
  Sparkle
} from 'lucide-react';

interface HomeViewProps {
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

export default function HomeView({ setCurrentPage, onBookClick }: HomeViewProps) {
  // Navigation helper that scrolls smoothly to top
  const navigateTo = (view: string) => {
    setCurrentPage(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="home-view" className="animate-fadeIn">

      {/* 1. HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-ivory px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        {/* Subtle architectural background touches */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Premium Content Editorial */}
            <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-left space-y-6 sm:space-y-8">

              {/* Trust Badge / Eyebrow Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                id="hero-eyebrow-container"
                className="inline-flex flex-wrap items-center gap-3"
              >
              </motion.div>

              {/* Majestic Serif Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="space-y-3"
              >
                <h1
                  id="hero-title"
                  className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[1.05]"
                >
                  The Loft
                  <span className="font-serif italic text-gold font-normal block sm:inline sm:ml-4">by NM</span>
                </h1>

                {/* Elegant Luxury Subhead */}
                <p
                  id="hero-tagline"
                  className="font-serif text-xl sm:text-2xl text-gold italic font-normal tracking-wide pt-2"
                >
                                  A special touch for your hands. Beautiful finishes, quiet luxury.
                </p>
              </motion.div>

              {/* Sophisticated Editorial Body copy */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                id="hero-body"
                className="font-sans text-sm sm:text-base text-charcoal/75 max-w-2xl font-normal leading-relaxed tracking-wide"
              >
                              A beautiful sanctuary in a restored colonial house in Colombo, offering nails, body, lashes, brows, facials and hair care by trained therapists. Enjoy our private ladies’ suite for a more personal experience.
              </motion.p>

              {/* Twin Luxury CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                id="hero-cta-group"
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
              >
                <button
                  id="hero-btn-book"
                  onClick={onBookClick}
                  className="group relative font-sans text-xs font-bold tracking-[0.25em] uppercase bg-charcoal text-ivory border border-charcoal py-4.5 px-10 rounded-full hover:bg-gold hover:border-gold transition-all duration-500 text-center cursor-pointer shadow-[0_0_20px_rgba(34,34,34,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span>Book Your Ritual</span>
                  <ArrowRight size={14} className="text-gold group-hover:text-ivory transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                </button>
                <button
                  id="hero-btn-explore"
                  onClick={() => navigateTo('services')}
                  className="group font-sans text-xs font-bold tracking-[0.25em] uppercase border border-charcoal/20 text-charcoal py-4.5 px-10 rounded-full bg-transparent hover:bg-charcoal hover:text-ivory hover:border-charcoal transition-all duration-500 text-center cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Explore Services</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold group-hover:bg-ivory transition-colors duration-300" />
                </button>
              </motion.div>

              {/* Feature Badges Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                id="hero-feature-badges"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-xl"
              >
                              <div className="flex items-start gap-3.5 p-4 bg-white/40 backdrop-blur-sm border border-charcoal/[0.04] rounded-2xl shadow-sm hover:border-gold/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                                  <div className="p-2.5 bg-gold/10 text-gold rounded-xl shrink-0 group-hover:bg-gold group-hover:text-ivory transition-colors duration-300">
                                      <Sparkles size={16} />
                                  </div>
                                  <div>
                                      <h3 className="font-serif text-sm font-semibold text-charcoal tracking-tight">
                                          Private Ladies' Suite
                                      </h3>
                                      <p className="text-xs sm:text-sm font-sans text-charcoal/65 mt-0.5 leading-relaxed">
                                          A quiet and private space for ladies who prefer more privacy.
                                      </p>
                                  </div>
                              </div>

                              <div className="flex items-start gap-3.5 p-4 bg-white/40 backdrop-blur-sm border border-charcoal/[0.04] rounded-2xl shadow-sm hover:border-gold/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                                  <div className="p-2.5 bg-gold/10 text-gold rounded-xl shrink-0 group-hover:bg-gold group-hover:text-ivory transition-colors duration-300">
                                      <ShieldCheck size={16} />
                                  </div>
                                  <div>
                                      <h3 className="font-serif text-sm font-semibold text-charcoal tracking-tight">
                                          High Hygiene Standards
                                      </h3>
                                      <p className="text-xs sm:text-sm font-sans text-charcoal/65 mt-0.5 leading-relaxed">
                                          Clean, sterilized tools and safe, careful practices.
                                      </p>
                                  </div>
                              </div>
              </motion.div>

            </div>

            {/* Right Column: High-end Asymmetric Image with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="col-span-1 lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center"
            >

              {/* Premium overlapping decoration shape */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-sage/30 via-transparent to-gold/20 rounded-[2.5rem] -rotate-3 scale-102 pointer-events-none" />

              {/* Asymmetric Image Container */}
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src={IMAGES.nails}
                  alt="Premium manicure and nail art at The Loft by NM"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[8s] ease-out group-hover:scale-108"
                />

                {/* Soft gradient overlay at the base */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none opacity-60" />
              </div>

              {/* FLOATING CARD 1: Stars / Rating (Left overlay) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-12 -left-4 sm:-left-8 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 max-w-[170px]"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">★</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal tracking-tight">4.9 Rating</p>
                  <p className="text-[9px] font-sans text-charcoal/75 uppercase tracking-wider mt-0.5">Discerning Care</p>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: Specialists / Certification (Bottom Right overlay) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-16 -right-4 sm:-right-8 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 max-w-[200px]"
              >
                <div className="w-10 h-10 rounded-xl bg-sage/30 text-charcoal flex items-center justify-center shrink-0">
                  <Sparkle size={16} className="text-gold fill-gold" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal tracking-tight">Trained Therapists</p>
                  <p className="text-[9px] font-sans text-charcoal/75 uppercase tracking-wider mt-0.5">100% Certified Standard</p>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>


      </section>


      {/* 2. WHY CHOOSE US SECTION */}
      <section
        id="why-choose-us-section"
        className="py-24 sm:py-32 bg-ivory"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* Introductory block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-gold block">
              The Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight leading-tight">
              Why Discerning Clients <span className="font-normal italic text-gold">Choose Us</span>
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto my-4" />
            <p className="font-sans text-sm sm:text-base md:text-lg text-charcoal/80 font-normal leading-relaxed max-w-3xl mx-auto">
              The Loft by NM brings considered design and expert care together in suburban Colombo, a calm space built for clients who expect consistency, discretion and results, with a private suite reserved for those who want a ladies only setting.
            </p>
          </motion.div>

          {/* 3-Up Icon Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Grid Item 1: Private Ladies' Suite */}
            <motion.div
              id="why-card-suite"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="bg-white border border-charcoal/[0.04] p-8 sm:p-10 rounded-3xl flex flex-col justify-between space-y-8 transition-all duration-500 hover:shadow-xl hover:border-gold/20 hover:-translate-y-2 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110" />
              <div className="space-y-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ivory group-hover:scale-110 group-hover:rotate-3">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal tracking-tight">
                  Private Ladies' Suite
                </h3>
                <p className="font-sans text-xs sm:text-sm text-charcoal/70 font-normal leading-relaxed">
                  A dedicated, private area within the salon for clients who want a ladies only setting, available alongside our main treatment floor.
                </p>
              </div>
              <div className="w-12 h-[2px] bg-gold/30 group-hover:w-full group-hover:bg-gold transition-all duration-700 ease-in-out mt-4" />
            </motion.div>

            {/* Grid Item 2: Uncompromising Hygiene */}
            <motion.div
              id="why-card-hygiene"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-white border border-charcoal/[0.04] p-8 sm:p-10 rounded-3xl flex flex-col justify-between space-y-8 transition-all duration-500 hover:shadow-xl hover:border-gold/20 hover:-translate-y-2 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110" />
              <div className="space-y-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ivory group-hover:scale-110 group-hover:rotate-3">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal tracking-tight">
                  Uncompromising Hygiene
                </h3>
                <p className="font-sans text-xs sm:text-sm text-charcoal/70 font-normal leading-relaxed">
                  Sterilized tools, disposable-where-possible practice, and protocols you can see in every room.
                </p>
              </div>
              <div className="w-12 h-[2px] bg-gold/30 group-hover:w-full group-hover:bg-gold transition-all duration-700 ease-in-out mt-4" />
            </motion.div>

            {/* Grid Item 3: Trained Therapists */}
            <motion.div
              id="why-card-therapists"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-white border border-charcoal/[0.04] p-8 sm:p-10 rounded-3xl flex flex-col justify-between space-y-8 transition-all duration-500 hover:shadow-xl hover:border-gold/20 hover:-translate-y-2 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110" />
              <div className="space-y-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ivory group-hover:scale-110 group-hover:rotate-3">
                  <Compass size={24} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal tracking-tight">
                  Trained Therapists
                </h3>
                <p className="font-sans text-xs sm:text-sm text-charcoal/70 font-normal leading-relaxed">
                  Skilled professionals trained to consistent standards, so results and the experience never vary.
                </p>
              </div>
              <div className="w-12 h-[2px] bg-gold/30 group-hover:w-full group-hover:bg-gold transition-all duration-700 ease-in-out mt-4" />
            </motion.div>

          </div>

        </div>
      </section>


      {/* 3. POPULAR SERVICES SECTION */}
      <section
        id="popular-services-section"
        className="py-12 sm:py-16 bg-charcoal text-ivory border-t border-charcoal/10 overflow-hidden"
      >
        <div className="space-y-8">

          {/* Header block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto space-y-3 px-4 sm:px-6 lg:px-8"
          >
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory tracking-tight">
              Our Selection
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ivory/80 font-normal leading-relaxed">
              Explore our most-loved rituals, each delivered with precision, patience and care.
            </p>
          </motion.div>

          {/* Non-stop Horizontally Floating Marquee Container */}
          <div className="relative w-full overflow-hidden flex select-none py-2">
            <motion.div
              className="flex gap-6 pr-6 flex-nowrap"
              animate={{ x: [0, "-50%"] }}
              transition={{
                ease: "linear",
                duration: 22, // Adjusted slightly for the tighter layout
                repeat: Infinity,
              }}
            >
              {[
                { id: "nails", title: "Nails", desc: "Manicures, pedicures, gel finishes and nail art.", img: IMAGES.nails },
                { id: "body", title: "Body", desc: "Waxing and massage, performed with precision and discretion.", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop" },
                { id: "lashes", title: "Lashes & Brows", desc: "Extensions, lifts and tints for definition that lasts.", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop" },
                { id: "face", title: "Face", desc: "Facials and facial hair removal for clear, loved skin.", img: IMAGES.facial },
                { id: "hair", title: "Hair", desc: "Cuts, colour and styling tailored to what you want to change.", img: IMAGES.hair }
              ].concat([
                { id: "nails-dup", title: "Nails", desc: "Manicures, pedicures, gel finishes and nail art.", img: IMAGES.nails },
                { id: "body-dup", title: "Body", desc: "Waxing and massage, performed with precision and discretion.", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop" },
                { id: "lashes-dup", title: "Lashes & Brows", desc: "Extensions, lifts and tints for definition that lasts.", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop" },
                { id: "face-dup", title: "Face", desc: "Facials and facial hair removal for clear, loved skin.", img: IMAGES.facial },
                { id: "hair-dup", title: "Hair", desc: "Cuts, colour and styling tailored to what you want to change.", img: IMAGES.hair }
              ]).map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className="flex-none w-[200px] sm:w-[240px] bg-charcoal border border-ivory/10 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:border-gold/30 transition-all duration-500 group relative cursor-pointer"
                  onClick={() => navigateTo('services')}
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={card.img}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col space-y-1 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="font-serif text-lg text-ivory group-hover:text-gold transition-colors duration-300">
                      {card.title}
                    </h4>
                    <p className="font-sans text-[11px] text-ivory/70 font-normal leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center pt-2 px-4 sm:px-6 lg:px-8"
          >
            <button
              id="popular-btn-view-all"
              onClick={() => navigateTo('services')}
              className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase border-2 border-ivory text-ivory hover:bg-ivory hover:text-charcoal py-3 px-10 rounded-full transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              View All Services
            </button>
          </motion.div>

        </div>
      </section>


      {/* 4. OUR SPECIALITY SECTION */}
      <section
        id="our-speciality-section"
        className="py-24 sm:py-32 bg-ivory relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

            {/* Visual Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-6 relative order-2 lg:order-1"
            >
              <div className="absolute -top-6 -left-6 w-3/4 h-3/4 bg-gold/10 -z-10 rounded-[2rem]" />
              <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-charcoal/5 -z-10 rounded-[2rem]" />

              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
                <img
                  src={IMAGES.salonVibe2}
                  alt="Our Custom-Trained Techniques"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-[500px] object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent opacity-60" />
              </div>

              {/* Floating aesthetic stats marker */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-4 sm:-right-8 bg-white/90 backdrop-blur-md text-charcoal p-6 rounded-2xl shadow-xl max-w-[220px] border border-white/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="font-serif text-3xl text-gold font-normal">100%</p>
                </div>
                <p className="text-xs uppercase tracking-wider text-charcoal/80 font-bold leading-tight">Sterilized and Checked Tools</p>
              </motion.div>
            </motion.div>

            {/* Copy Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-6 space-y-10 order-1 lg:order-2"
            >
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold block flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-gold" />
                  Our Speciality
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.1]">
                  An Intentional Approach <br />to Every Detail
                </h2>
              </div>

              <p className="font-sans text-base sm:text-lg text-charcoal/70 font-normal leading-relaxed">
                At The Loft by NM, every treatment begins with a consultation and ends with a result you can see. From classic manicures to lash lifts, considered facials and hair rituals, we deliver consistency through trained technique, premium products and an unhurried pace.
              </p>

              {/* Bulleted checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 pt-2">
                {[
                  "Trained, certified therapists",
                  "A calm, considered atmosphere",
                  "Premium, internationally recognised products",
                  "Walk in or book ahead, never rushed"
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0 mt-0.5 group-hover:bg-gold group-hover:text-ivory transition-colors duration-300">
                      <Check size={12} className="stroke-[3px]" />
                    </div>
                    <span className="font-sans text-sm text-charcoal/80 font-medium leading-tight">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <button
                  id="speciality-btn-menu"
                  onClick={() => navigateTo('menu')}
                  className="font-sans text-xs font-bold tracking-[0.25em] uppercase bg-charcoal text-ivory py-4 px-10 rounded-full hover:bg-gold hover:text-ivory transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  See Our Menu
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. WHY WOMEN CHOOSE THE LOFT SECTION */}
      <section
        id="why-women-choose-section"
        className="py-24 sm:py-32 bg-white border-t border-charcoal/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* Header block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-tight">
              Why Women Choose The Loft
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto my-4" />
            <p className="font-sans text-sm sm:text-base md:text-lg text-charcoal/70 font-normal leading-relaxed">
              We built The Loft by NM around four commitments: craftsmanship, curation, intention and trust. Here's what that means for you.
            </p>
          </motion.div>

          {/* 4-Card/Column layout representing the brand pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Column 1: Premium Craftsmanship */}
            <motion.div
              id="pillar-card-craftsmanship"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="bg-ivory/50 border border-charcoal/[0.04] p-10 rounded-[2rem] space-y-6 transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-gold/20 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold tracking-widest uppercase font-mono block">
                    Pillar I
                  </span>
                  <div className="h-[1px] flex-grow bg-gold/20 group-hover:bg-gold/50 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">
                  Premium Craftsmanship
                </h3>
                <p className="font-sans text-sm text-charcoal/70 font-normal leading-relaxed">
                  Trained therapists, precise technique, consistent results.
                </p>
              </div>
            </motion.div>

            {/* Column 2: Curated Experience */}
            <motion.div
              id="pillar-card-experience"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-ivory/50 border border-charcoal/[0.04] p-10 rounded-[2rem] space-y-6 transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-gold/20 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold tracking-widest uppercase font-mono block">
                    Pillar II
                  </span>
                  <div className="h-[1px] flex-grow bg-gold/20 group-hover:bg-gold/50 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">
                  Curated Experience
                </h3>
                <p className="font-sans text-sm text-charcoal/70 font-normal leading-relaxed">
                  Bespoke consultations and signature rituals, with the flexibility to walk in or book ahead.
                </p>
              </div>
            </motion.div>

            {/* Column 3: Intentional Space */}
            <motion.div
              id="pillar-card-space"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="bg-ivory/50 border border-charcoal/[0.04] p-10 rounded-[2rem] space-y-6 transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-gold/20 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold tracking-widest uppercase font-mono block">
                    Pillar III
                  </span>
                  <div className="h-[1px] flex-grow bg-gold/20 group-hover:bg-gold/50 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">
                  Intentional Space
                </h3>
                <p className="font-sans text-sm text-charcoal/70 font-normal leading-relaxed">
                  A renovated colonial house designed for stillness, not spectacle, including a private ladies' suite for those who want it.
                </p>
              </div>
            </motion.div>

            {/* Column 4: Trusted Results */}
            <motion.div
              id="pillar-card-results"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-ivory/50 border border-charcoal/[0.04] p-10 rounded-[2rem] space-y-6 transition-all duration-500 hover:bg-white hover:shadow-xl hover:-translate-y-2 hover:border-gold/20 flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold tracking-widest uppercase font-mono block">
                    Pillar IV
                  </span>
                  <div className="h-[1px] flex-grow bg-gold/20 group-hover:bg-gold/50 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">
                  Trusted Results
                </h3>
                <p className="font-sans text-sm text-charcoal/70 font-normal leading-relaxed">
                  Transparent outcomes and honest aftercare guidance.
                </p>
              </div>
            </motion.div>

          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center pt-8"
          >
            <button
              id="why-women-btn-more"
              onClick={() => navigateTo('about')}
              className="font-sans text-xs font-bold tracking-[0.25em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory py-4 px-12 rounded-full transition-all duration-500 cursor-pointer"
            >
              Learn More About Us
            </button>
          </motion.div>

        </div>
      </section>


      {/* 6. WHAT TO EXPECT (TESTIMONIALS & COMMITMENTS) */}
      <section
        id="what-to-expect-section"
        className="py-24 sm:py-32 bg-ivory border-t border-charcoal/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-gold block">
              Guest Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
              Verified Client Testimonials
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto my-4" />
            <p className="font-sans text-sm sm:text-base text-charcoal/70 font-normal leading-relaxed">
              We prioritize absolute perfection and unhurried care. Read what our distinguished guests say about their luxurious treatments at The Loft.
            </p>
          </motion.div>

          {/* Testimonials Component */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <Testimonials />
          </motion.div>

          {/* Commitments Divider & Section Header */}
         
         

          {/* Beautiful placeholder signoff card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-white border border-gold/20 p-10 sm:p-16 rounded-[2rem] text-center space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage/10 rounded-tr-[100px]" />
            <p className="font-serif text-2xl sm:text-3xl text-charcoal italic relative z-10 leading-relaxed">
              "We measure our success by the absolute quietude and serene satisfaction of our guests."
            </p>
            <p className="font-sans text-xs tracking-widest uppercase font-bold text-gold relative z-10">
              The Loft by NM Executive Suite
            </p>
          </motion.div>

        </div>
      </section>





      {/* 7.5. LATEST FROM THE JOURNAL */}
      <section className="py-24 sm:py-32 bg-ivory border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-gold block">
          BLOGS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
                Latest from the Journal
              </h2>
            </div>
            <button
              onClick={() => navigateTo('blog')}
              className="font-sans text-xs font-bold tracking-[0.25em] uppercase border-b border-charcoal text-charcoal hover:text-gold hover:border-gold transition-colors duration-300 pb-1 self-start md:self-end flex items-center gap-2 group cursor-pointer"
            >
              <span>View All Articles</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'The Art of Parisian Balayage',
                excerpt: 'Discover the secrets behind our signature sun-kissed hair painting technique.',
                image: IMAGES.hair,
                category: 'Hair Care'
              },
              {
                title: 'Why We Chose 24k Gold',
                excerpt: 'An inside look at the science and tradition behind our most requested facial.',
                image: IMAGES.facial,
                category: 'Skincare'
              },
              {
                title: 'Sanctuary Protocol',
                excerpt: 'Learn exactly how we maintain clinical-grade hygiene across all our suites.',
                image: IMAGES.salonVibe2,
                category: 'Behind the Scenes'
              }
            ].map((post, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="group cursor-pointer flex flex-col space-y-4"
                onClick={() => navigateTo('blog')}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-2">
                  <div className="absolute inset-0 bg-charcoal/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-charcoal shadow-sm">
                    {post.category}
                  </div>
                </div>
                <h3 className="font-serif text-2xl text-charcoal group-hover:text-gold transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="font-sans text-sm text-charcoal/70 font-light leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VISIT US / HOURS SECTION */}
      <section
        id="visit-us-section"
        className="py-24 sm:py-32 bg-ivory"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">

            {/* Contact, Address, & Hours Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white border border-charcoal/5 p-10 sm:p-16 rounded-[2rem] flex flex-col justify-between space-y-16 shadow-xl"
            >

              {/* Address detail */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase rounded-full">
                  <MapPin size={14} />
                  <span>The Location</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight">
                  Our Colombo Sanctuary
                </h3>
                <p className="font-sans text-lg text-charcoal/70 font-normal leading-relaxed">
                  No. 7, Gamsaba Junction, Nugegoda, Colombo, Sri Lanka
                </p>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=No.+7,+Gamsaba+Junction,+Nugegoda,+Colombo,+Sri+Lanka"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-sans text-xs font-bold tracking-widest uppercase text-charcoal border-b border-charcoal pb-1 hover:text-gold hover:border-gold transition-colors group cursor-pointer"
                  >
                    <span>Get Directions</span>
                    <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Separator */}
              <div className="h-[1px] bg-charcoal/10" />

              {/* Opening Hours: 2-tier text layout */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold text-xs font-bold tracking-widest uppercase rounded-full">
                  <Clock size={14} />
                  <span>Salon Hours</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-2 border-l-2 border-gold/30 pl-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/50">
                      Weekdays
                    </p>
                    <p className="font-serif text-xl text-charcoal font-medium">
                      Mon – Fri
                    </p>
                    <p className="font-sans text-sm text-charcoal/80">
                      10:00 AM – 07:30 PM
                    </p>
                  </div>

                  <div className="space-y-2 border-l-2 border-gold/30 pl-5">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-charcoal/50">
                      Weekends
                    </p>
                    <p className="font-serif text-xl text-charcoal font-medium">
                      Sat – Sun
                    </p>
                    <p className="font-sans text-sm text-charcoal/80">
                      09:30 AM – 08:00 PM
                    </p>
                  </div>

                  <div className="space-y-2 border-l-2 border-gold/30 pl-5 sm:col-span-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gold">
                      Sanitization & Reset
                    </p>
                    <p className="font-serif text-xl text-charcoal font-medium">
Tuesday
                    </p>
                    <p className="font-sans text-sm text-gold font-bold uppercase tracking-wider">
                      Closed
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Immersive visual & CTA block */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative min-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-end p-10 sm:p-14 text-ivory group"
            >
              {/* Background cover image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={IMAGES.salonVibe1}
                  alt="The Loft by NM Colombo Experience"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[10s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-90" />
              </div>

              {/* Bottom aligned closing CTA content */}
              <div className="relative z-10 space-y-6">
                <h4 className="font-serif text-3xl sm:text-4xl text-ivory leading-tight max-w-md">
                  Experience Colombo's Most Considered Rituals
                </h4>
                <p className="font-sans text-sm sm:text-base text-ivory/80 font-normal leading-relaxed max-w-sm">
                  We welcome both advanced appointments and casual walk-ins. Come as you are, leave fully restored.
                </p>
                <div className="pt-4">
                  <button
                    id="visit-btn-book"
                    onClick={onBookClick}
                    className="font-sans text-xs font-bold tracking-[0.25em] uppercase bg-gold text-charcoal py-4.5 px-10 rounded-full hover:bg-ivory transition-all duration-300 cursor-pointer shadow-lg w-full sm:w-auto text-center"
                  >
                    Book or Visit Us
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
