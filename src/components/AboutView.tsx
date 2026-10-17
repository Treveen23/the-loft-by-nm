import React, { useState, useEffect } from 'react';
import { IMAGES } from '../data';
import Testimonials from './Testimonials';
import { getTestimonialsVisibility } from '../api';
import {
  Sparkle,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  Award,
  Gem,
  Compass,
  ArrowRight,
  Quote,
  Sparkle as SparkleIcon
} from 'lucide-react';

interface AboutViewProps {
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

export default function AboutView({ setCurrentPage, onBookClick }: AboutViewProps) {
  const [showTestimonials, setShowTestimonials] = useState<boolean>(getTestimonialsVisibility);

  useEffect(() => {
    const handleToggle = (e: any) => {
      setShowTestimonials(Boolean(e.detail));
    };
    window.addEventListener('the-loft-testimonials-visibility-changed', handleToggle);
    return () => window.removeEventListener('the-loft-testimonials-visibility-changed', handleToggle);
  }, []);

  // Navigation helper that scrolls smoothly to top
  const handleNavigate = (view: string) => {
    setCurrentPage(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="about-page-container" className="bg-ivory min-h-screen animate-fadeIn overflow-hidden">

      {/* 1. HERO SECTION */}
      <section
        id="about-hero"
        className="relative bg-ivory pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden"
      >
        {/* Background Subtle Texture/Glow */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gold/5 blur-3xl rounded-bl-full -z-10 opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            {/* Left Content */}
            <div className="relative z-10 text-left order-2 lg:order-1 pt-8 lg:pt-0 pr-0 lg:pr-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-xs tracking-[0.2em] uppercase font-semibold shadow-sm cursor-default mb-5">
                <Sparkle size={12} className="fill-gold animate-pulse" />
                <span>The Sanctuary Ethos</span>
                <Sparkle size={12} className="fill-gold animate-pulse" />
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-charcoal tracking-tight leading-[1.05] mb-4">
                About <br />
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 italic font-light text-charcoal/90">The Loft by NM</span>
                  <span className="absolute bottom-2 left-0 w-full h-3 sm:h-4 bg-gold/15 -z-10 -rotate-1"></span>
                </span>
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <Gem size={14} className="text-gold" />
              </div>

              <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed font-light max-w-lg mb-6">
                A calm, editorial sanctuary in suburban Colombo, built on craft, intention, and trust. We believe beauty care should be an unhurried ritual.
              </p>

            </div>

            {/* Right Image */}
            <div className="order-1 lg:order-2 relative group w-[90%] sm:w-4/5 lg:w-[85%] mx-auto lg:ml-auto lg:mr-0 mt-8 lg:mt-0">
              <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4 rounded-xl -z-10 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
                <img
                  src={IMAGES.hero}
                  alt="The Loft by NM Interior"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
              </div>


            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section
        id="our-story-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative"
      >
        <div className="absolute left-0 top-1/4 w-32 h-32 border-l border-t border-gold/20 -translate-x-8 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Narrative Text Column */}
          <div className="col-span-1 lg:col-span-5 space-y-10 text-left order-2 lg:order-1 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-gold" />
                <span className="text-xs tracking-[0.3em] font-sans font-bold text-gold uppercase block">
                  Our Foundation
                </span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-charcoal tracking-tight leading-[1.15]">
                Crafted for Ritual, <br />
                <span className="font-light italic text-charcoal/70">Not Transaction</span>
              </h2>
            </div>

            <div className="font-sans text-sm sm:text-base font-normal text-charcoal/70 space-y-6 leading-[1.8] relative">
              <p className="relative z-10">
                The Loft by NM was founded on a simple idea: that beauty care should feel like a ritual, not a transaction. Inside a renovated colonial house in Colombo, we've designed a calm, considered space, with a private ladies' suite for those who want it.
              </p>
              <p className="relative z-10">
                Here, nails, body treatments, lashes, brows, face and hair services are delivered with the same care and consistency, every single time.
              </p>
            </div>

            {/* Standalone Mission Line */}
            <div className="p-8 border-l-[3px] border-gold bg-gradient-to-r from-gold/5 to-transparent relative group rounded-r-xl">
              <Quote className="absolute top-4 right-4 text-gold/10 w-12 h-12 rotate-180 group-hover:scale-110 transition-transform duration-500" />
              <p className="font-serif text-lg sm:text-xl text-charcoal italic leading-relaxed relative z-10">
                "Considered care, without compromise on hygiene, on technique, or on you."
              </p>
            </div>
          </div>

          {/* Asymmetric Image Placeholder (16:9 aspect) */}
          <div className="col-span-1 lg:col-span-7 relative order-1 lg:order-2 group">
            <div className="absolute inset-0 border-[0.5px] border-gold/40 translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 rounded-sm -z-10 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6 sm:group-hover:translate-x-8 sm:group-hover:translate-y-8" />
            <div className="absolute inset-0 bg-gold/10 -translate-x-2 -translate-y-2 sm:-translate-x-4 sm:-translate-y-4 rounded-sm -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-2xl bg-charcoal/5">
              <div className="absolute inset-0 bg-charcoal/20 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
              <img
                src={IMAGES.salonVibe1}
                alt="The Loft by NM Colonial Sanctuary Interior"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter grayscale-[40%] contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXPERIENCE PREMIUM CARE SECTION */}
      <section
        id="experience-premium-care"
        className="bg-[#1F1F20] py-16 sm:py-20 relative overflow-hidden"
      >
        {/* Fluid Luxury Ambient Blur Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#BFC9C1]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-[#C9A66B]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

            {/* LEFT ASPECT: Artistic Editorial Accent Canvas */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              {/* Dynamic organically rounded graphic panel using Muted Sage over Deep Charcoal */}
              <div className="w-full aspect-[4/5] bg-gradient-to-br from-[#BFC9C1]/20 to-[#BFC9C1]/5 rounded-[4rem] rounded-tr-[12rem] rounded-bl-[12rem] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden border border-[#BFC9C1]/10 shadow-[0_30px_70px_rgba(0,0,0,0.3)]">

                {/* Subtle Abstract Gold Highlight Orb inside the canvas */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />

                <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-[#F6F4F2] leading-tight max-w-xs">
                  Experience Premium Care
                </h2>

              </div>
            </div>

            {/* RIGHT ASPECT: Integrated Fluid Typographic Pillars */}
            <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">

              {/* Value Item 1: Rigorous Hygiene Standards */}
              <div className="group flex gap-6 sm:gap-8 items-start cursor-default">
                {/* Custom Fine-Line Shield SVG Icon */}
                <div className="w-8 h-8 text-[#BFC9C1] group-hover:text-[#C9A66B] transition-colors duration-500 transform group-hover:scale-110 select-none flex-shrink-0 pt-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-[#F6F4F2] tracking-wide transition-colors duration-300 group-hover:text-[#C9A66B]">
                    Rigorous Hygiene Standards
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#F6F4F2]/70 font-light leading-relaxed max-w-xl">
                    Strict sterilization protocols and disposable tools wherever possible.
                  </p>
                </div>
              </div>

              {/* Value Item 2: Premium Products */}
              <div className="group flex gap-6 sm:gap-8 items-start cursor-default">
                {/* Custom Fine-Line Lotus/Starburst SVG Icon */}
                <div className="w-8 h-8 text-[#BFC9C1] group-hover:text-[#C9A66B] transition-colors duration-500 transform group-hover:scale-110 select-none flex-shrink-0 pt-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M12 2v20M17 5H7M19 9H5M21 14H3M19 19H5" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-[#F6F4F2] tracking-wide transition-colors duration-300 group-hover:text-[#C9A66B]">
                    Premium Products
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#F6F4F2]/70 font-light leading-relaxed max-w-xl">
                    Only internationally recognised brands, chosen for results that last.
                  </p>
                </div>
              </div>

              {/* Value Item 3: Considered Service */}
              <div className="group flex gap-6 sm:gap-8 items-start cursor-default">
                {/* Custom Fine-Line Hourglass SVG Icon */}
                <div className="w-8 h-8 text-[#BFC9C1] group-hover:text-[#C9A66B] transition-colors duration-500 transform group-hover:scale-110 select-none flex-shrink-0 pt-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                    <path d="M5 2h14M5 22h14M19 2l-7 7-7-7M5 22l7-7 7 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-[#F6F4F2] tracking-wide transition-colors duration-300 group-hover:text-[#C9A66B]">
                    Considered Service
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#F6F4F2]/70 font-light leading-relaxed max-w-xl">
                    An unhurried approach, whether you walk in or book ahead - every visit begins with a consultation.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      {/* 4. PRIVATE LADIES' SUITE FEATURE */}
      <section
        id="private-suite-feature"
        className="bg-[#F6F4F2] py-10 sm:py-12 relative overflow-hidden"
      >
        {/* Combined Animations: Liquid Mesh + Shimmering Aesthetic Star Galaxy */}
        <style dangerouslySetInnerHTML={{
          __html: `
@keyframes liquid-mesh {
    0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
    33% { transform: translate(40px, -60px) scale(1.15) rotate(120deg); }
    66% { transform: translate(-30px, 30px) scale(0.9) rotate(240deg); }
    100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
}
@keyframes sparkle-float {
    0% { transform: translateY(30px) scale(0.3) rotate(0deg); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-50px) scale(1.1) rotate(180deg); opacity: 0; }
}
.animate-liquid-gold {
    animation: liquid-mesh 20s infinite ease-in-out;
}
.animate-liquid-sage {
    animation: liquid-mesh 26s infinite ease-in-out reverse;
}
.aesthetic-sparkle {
    position: absolute;
    pointer-events: none;
    animation: sparkle-float infinite ease-in-out;
    z-index: 5;
}
`}} />

        {/* The Alive Cinematic Aura Clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
          <div className="animate-liquid-gold absolute top-[-10%] left-[10%] w-[45rem] h-[45rem] bg-[#C9A66B]/15 rounded-full blur-[130px] mix-blend-multiply" />
          <div className="animate-liquid-sage absolute bottom-[-10%] right-[15%] w-[50rem] h-[50rem] bg-[#BFC9C1]/30 rounded-full blur-[140px] mix-blend-multiply" />
          <div className="animate-liquid-gold absolute top-[20%] right-[-5%] w-[35rem] h-[35rem] bg-[#C9A66B]/10 rounded-full blur-[110px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 text-center">

          {/* Floating Experiential Layout Canvas */}
          <div className="relative py-8 sm:py-12 px-4 group">

            {/* --- STAR GALAXY LAYER --- */}
            {/* Left Upper Area */}
            <svg className="aesthetic-sparkle text-[#C9A66B]/60 w-4 h-4" style={{ top: '10%', left: '15%', animationDuration: '4.5s', animationDelay: '0s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 11.6l-5.6 4.4L17.8 22 12 17.6 6.2 22l1.4-6-5.6-4.4 7.6-2.4z" />
            </svg>
            <svg className="aesthetic-sparkle text-[#BFC9C1]/70 w-3 h-3" style={{ top: '25%', left: '8%', animationDuration: '6s', animationDelay: '2s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>

            {/* Left Mid/Lower Area */}
            <svg className="aesthetic-sparkle text-[#C9A66B]/50 w-5 h-5" style={{ top: '55%', left: '12%', animationDuration: '5.5s', animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 11.6l-5.6 4.4L17.8 22 12 17.6 6.2 22l1.4-6-5.6-4.4 7.6-2.4z" />
            </svg>
            <svg className="aesthetic-sparkle text-[#BFC9C1]/40 w-4 h-4" style={{ top: '75%', left: '22%', animationDuration: '7s', animationDelay: '3.5s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>

            {/* Center Header Cluster */}
            <svg className="aesthetic-sparkle text-[#C9A66B]/70 w-3.5 h-3.5" style={{ top: '-5%', left: '48%', animationDuration: '4s', animationDelay: '1.8s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>
            <svg className="aesthetic-sparkle text-[#BFC9C1]/50 w-3 h-3" style={{ top: '35%', left: '38%', animationDuration: '5s', animationDelay: '0.5s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 11.6l-5.6 4.4L17.8 22 12 17.6 6.2 22l1.4-6-5.6-4.4 7.6-2.4z" />
            </svg>

            {/* Right Upper Area */}
            <svg className="aesthetic-sparkle text-[#C9A66B]/40 w-3 h-3" style={{ top: '20%', right: '18%', animationDuration: '5.2s', animationDelay: '2.5s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 11.6l-5.6 4.4L17.8 22 12 17.6 6.2 22l1.4-6-5.6-4.4 7.6-2.4z" />
            </svg>
            <svg className="aesthetic-sparkle text-[#BFC9C1]/80 w-4 h-4" style={{ top: '12%', right: '8%', animationDuration: '6.5s', animationDelay: '0.8s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>

            {/* Right Mid/Lower Area */}
            <svg className="aesthetic-sparkle text-[#C9A66B]/60 w-5 h-5" style={{ top: '60%', right: '12%', animationDuration: '4.8s', animationDelay: '1.2s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2L22 11.6l-5.6 4.4L17.8 22 12 17.6 6.2 22l1.4-6-5.6-4.4 7.6-2.4z" />
            </svg>
            <svg className="aesthetic-sparkle text-[#BFC9C1]/50 w-3.5 h-3.5" style={{ top: '80%', right: '25%', animationDuration: '5.8s', animationDelay: '4s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>

            {/* Floating Decorative Fine-Art Typography Signature */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-5 font-serif text-[12vw] tracking-widest text-[#1F1F20] font-light italic whitespace-nowrap">
              THE LOFT BY NM
            </div>

            <div className="max-w-2xl mx-auto space-y-8 relative z-10">

              {/* High-End Fashion Editorial Headline */}
              <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1F1F20] font-light tracking-wide leading-tight">
                The Ladies’ <br className="sm:hidden" />
                <span className="italic font-normal text-[#C9A66B] relative inline-block">
                  Private Suite
                  <span className="absolute bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B]/40 to-transparent" />
                </span>
              </h3>

              {/* Airy Body Description */}
              <p className="font-sans text-base sm:text-lg text-[#1F1F20]/80 leading-[1.9] font-light max-w-xl mx-auto transition-colors duration-500 group-hover:text-[#1F1F20]">
                Alongside our main treatment floor, The Loft by NM offers a dedicated, fully-enclosed space exclusively for women who require complete discretion and privacy.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* 5. OUR CORE VALUES SECTION */}
      <section
        id="core-values-section"
        className="bg-[#FAF9F6] max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 border-t border-stone-200/60 relative overflow-hidden"
      >
        {/* Advanced Hardware-Accelerated Shimmer Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
    @keyframes line-shimmer {
      0% { transform: translateX(-100%); }
      50%, 100% { transform: translateX(100%); }
    }
    .hover-line-shine::after {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(201, 166, 107, 0.6), transparent);
      transform: translateX(-100%);
    }
    .group:hover .hover-line-shine::after {
      animation: line-shimmer 1.5s infinite ease-in-out;
    }
  `}} />

        {/* Luxury Structural Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#2c2c2c] tracking-wide">
            Our Core Values
          </h2>
        </div>

        {/* Premium Editorial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">

          {/* Pillar 1: Premium Craftsmanship */}
          <div className="group bg-white border border-stone-100 p-8 sm:p-10 flex flex-col justify-between rounded-sm shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(138,106,60,0.04)] hover:bg-[#1F1F20] relative">
            <div className="space-y-6">
              {/* Layered Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=75&fm=webp"
                  alt="Premium Craftsmanship"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A66B]/30 m-2 transition-all duration-500 pointer-events-none" />
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#2c2c2c] group-hover:text-white transition-colors duration-300">
                  Premium Craftsmanship
                </h3>
                <p className="font-sans text-sm text-stone-500 group-hover:text-stone-400 leading-relaxed font-light transition-colors duration-300">
                  Trained therapists, precise technique, and standards that hold steady every time.
                </p>
              </div>
            </div>

            {/* Decorative Interactive Accent Line with Shimmer */}
            <div className="mt-8 relative w-16 h-[2px] bg-stone-200 group-hover:w-full transition-all duration-500 ease-out overflow-hidden hover-line-shine">
              <div className="absolute inset-0 bg-[#C9A66B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Pillar 2: Intentional Space */}
          <div className="group bg-white border border-stone-100 p-8 sm:p-10 flex flex-col justify-between rounded-sm shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(138,106,60,0.04)] hover:bg-[#1F1F20] relative">
            <div className="space-y-6">
              {/* Layered Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=75&fm=webp"
                  alt="Intentional Space"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A66B]/30 m-2 transition-all duration-500 pointer-events-none" />
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#2c2c2c] group-hover:text-white transition-colors duration-300">
                  Intentional Space
                </h3>
                <p className="font-sans text-sm text-stone-500 group-hover:text-stone-400 leading-relaxed font-light transition-colors duration-300">
                  Every material,  marble, timber, linen, brass  was chosen on purpose, not for show.
                </p>
              </div>
            </div>

            {/* Decorative Interactive Accent Line with Shimmer */}
            <div className="mt-8 relative w-16 h-[2px] bg-stone-200 group-hover:w-full transition-all duration-500 ease-out overflow-hidden hover-line-shine">
              <div className="absolute inset-0 bg-[#C9A66B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Pillar 3: Trusted Results */}
          <div className="group bg-white border border-stone-100 p-8 sm:p-10 flex flex-col justify-between rounded-sm shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(138,106,60,0.04)] hover:bg-[#1F1F20] relative">
            <div className="space-y-6">
              {/* Layered Image Frame */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=75&fm=webp"
                  alt="Trusted Results"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A66B]/30 m-2 transition-all duration-500 pointer-events-none" />
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#2c2c2c] group-hover:text-white transition-colors duration-300">
                  Trusted Results
                </h3>
                <p className="font-sans text-sm text-stone-500 group-hover:text-stone-400 leading-relaxed font-light transition-colors duration-300">
                  Transparent outcomes and honest aftercare advice, always.
                </p>
              </div>
            </div>

            {/* Decorative Interactive Accent Line with Shimmer */}
            <div className="mt-8 relative w-16 h-[2px] bg-stone-200 group-hover:w-full transition-all duration-500 ease-out overflow-hidden hover-line-shine">
              <div className="absolute inset-0 bg-[#C9A66B] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION (DYNAMICAL COMPONENT) */}
      {showTestimonials && (
        <section
          id="about-testimonials-section"
          className="py-24 sm:py-32 bg-ivory border-t border-charcoal/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold block">
                Guest Experiences
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl tracking-tight text-charcoal">
                Honest Client Chronicles
              </h2>
              <div className="w-16 h-[2px] bg-gold/50 mx-auto my-6" />
              <p className="font-sans text-sm sm:text-base text-charcoal/70 font-light leading-relaxed">
                Real opinions, unprompted satisfaction, and verified accounts of our curated beauty sessions.
              </p>
            </div>

            <Testimonials />

          </div>
        </section>
      )}

      {/* COMMITMENTS SECTION */}
      <section className="py-20 sm:py-32 bg-ivory/50 border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Commitments Divider & Section Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold block">
              Our Commitments
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight">
              Sanctuary Standards
            </h3>
            <p className="font-sans text-sm text-charcoal/70 font-light leading-relaxed">
              We operate under an uncompromised strict discipline to render peaceful sanctuary hours for all guests.
            </p>
          </div>

          {/* Elegant Card Layout for Commitments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                title: "Private Consultation",
                text: "A personal mapping of your expectations, custom preferences, and wellness status before starting any session."
              },
              {
                title: "Sterilized Tools",
                text: "Uncompromising clinical autoclave sanitation protocols on all high-touch beauty and nail treatment apparatus."
              },
              {
                title: "A Calm Room",
                text: "Low sensory distraction, soft acoustics, climate settings, and pristine, unhurried space reserved just for you."
              },
              {
                title: "Trained Therapists",
                text: "Our dedicated personnel are tested strictly and certified to hold up our signature standards of care."
              }
            ].map((commitment, index) => (
              <div
                key={index}
                className="group border border-charcoal/10 bg-white p-8 sm:p-10 rounded-xl space-y-6 flex flex-col justify-between transition-all duration-500 hover:border-gold/40 hover:shadow-[0_10px_30px_-15px_rgba(212,175,55,0.2)] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-charcoal/5 group-hover:bg-gold/10 flex items-center justify-center font-serif text-sm text-charcoal group-hover:text-gold transition-colors duration-300">
                    0{index + 1}
                  </div>
                  <h3 className="font-serif text-xl text-charcoal/90 group-hover:text-charcoal transition-colors">
                    {commitment.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal/70 font-light leading-relaxed">
                    {commitment.text}
                  </p>
                </div>
                <div className="text-[10px] font-sans tracking-[0.2em] text-gold uppercase pt-6 border-t border-charcoal/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/50 inline-block group-hover:bg-gold group-hover:animate-ping" />
                  <span>Verified Standard</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CLOSING CTA BLOCK */}
      <section
        id="about-closing-cta"
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20 sm:pb-32"
      >
        <div className="relative bg-charcoal text-white p-12 sm:p-20 rounded-2xl space-y-8 shadow-2xl overflow-hidden group">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold/20 rounded-full blur-[80px] group-hover:bg-gold/30 transition-colors duration-700" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gold/10 rounded-full blur-[80px] group-hover:bg-gold/20 transition-colors duration-700" />

          <div className="space-y-6 relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-tight">
              Make It Your Ritual
            </h2>
            <p className="font-sans text-base sm:text-lg text-white/80 font-light max-w-md mx-auto">
              Discover what intentional care feels like.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 relative z-10">
            <button
              id="about-btn-book"
              onClick={onBookClick}
              className="w-full sm:w-auto font-sans text-xs font-bold tracking-[0.2em] uppercase bg-gold text-charcoal py-4 px-10 rounded-full hover:bg-white hover:text-charcoal transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105 flex items-center justify-center gap-2"
            >
              Book Your Visit <ArrowRight size={14} />
            </button>
            <button
              id="about-btn-services"
              onClick={() => handleNavigate('services')}
              className="w-full sm:w-auto font-sans text-xs font-bold tracking-[0.2em] uppercase border border-white/30 text-white py-4 px-10 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 cursor-pointer"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
