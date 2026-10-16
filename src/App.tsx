import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ComingSoonModal from './components/ComingSoonModal';
import { Toaster } from 'sonner';
import { getSalonLaunchMode } from './api';

import ServicesView from './components/ServicesView';
import MenuView from './components/MenuView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import BlogView from './components/BlogView';
import CareersView from './components/CareersView';
import ToBeRevealedView from './components/ToBeRevealedView';
import AdminView from './components/AdminView';

const BASE_URL = 'https://theloft.lk';
const DEFAULT_OG_IMAGE = `${BASE_URL}/OgImg.png`;

const PAGE_METADATA: Record<string, {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}> = {
  home: {
    title: "The Loft by NM | Luxury Salon & Spa Nugegoda Colombo",
    description: "Welcome to The Loft by NM in Colombo. Discover an elegant, high-contrast, premium beauty sanctuary offering bespoke hair care, skincare, facial rituals, master nail artistry, and a private ladies' wing.",
    ogTitle: "The Loft by NM | Premium Beauty Sanctuary in Colombo",
    ogDescription: "Bespoke hair care, skincare, facial rituals, and master nail artistry in a serene colonial house at Nugegoda.",
    ogImage: DEFAULT_OG_IMAGE
  },
  services: {
    title: "Our Luxury Services | The Loft by NM Colombo",
    description: "Explore our curated rituals: precision couture hair design, professional skincare, expert makeup, and artisanal nail spa treatments delivered by master therapists.",
    ogTitle: "Curated Beauty Rituals | The Loft by NM Services",
    ogDescription: "Precision cuts, skin-redefining facials, and couture aesthetics in our premium Colombo sanctuary.",
    ogImage: DEFAULT_OG_IMAGE
  },
  menu: {
    title: "Menu & Transparent Pricing | The Loft by NM Nugegoda",
    description: "View our comprehensive menu of premium treatments for Nails, Body, Lashes, Brows, Face, and Hair. Enjoy completely transparent pricing, local VAT-inclusive estimates, and detailed customized services.",
    ogTitle: "Our Ritual Menu & Pricing | The Loft by NM",
    ogDescription: "Bespoke beauty services with clear, transparent pricing. Review our Nails, Body, Lashes, brows, and hair care menu.",
    ogImage: DEFAULT_OG_IMAGE
  },
  gallery: {
    title: "Our Photo Gallery & Experience | The Loft by NM",
    description: "Step inside our tranquil sanctuary. High-definition visuals of our curated interiors, finished couture nail art, and dedicated private ladies' wing.",
    ogTitle: "A Glimpse of Serenity | The Loft by NM Gallery",
    ogDescription: "Explore visual moments of quiet luxury, pristine treatment suites, and precise beauty craftsmanship.",
    ogImage: DEFAULT_OG_IMAGE
  },
  about: {
    title: "Our Ethos & Founders | The Loft by NM",
    description: "Learn the story of The Loft by NM. Established in a beautifully renovated colonial house, we prioritize uncompromised clinical hygiene, premium international products, and highly specialized therapists.",
    ogTitle: "Our Story & Sanctuary Pillars | The Loft by NM",
    ogDescription: "A calm, editorial sanctuary in Colombo, built on craftsmanship, rigorous hygiene, and unhurried care.",
    ogImage: DEFAULT_OG_IMAGE
  },
  blog: {
    title: "The Journal & Sanctuary Notes | The Loft by NM",
    description: "Read curated thoughts on beauty, technique, and intentional care from the masters at The Loft by NM.",
    ogTitle: "The Journal | The Loft by NM",
    ogDescription: "Curated thoughts on beauty, technique, and intentional care from our Colombo sanctuary.",
    ogImage: DEFAULT_OG_IMAGE
  },
  contact: {
    title: "Schedule Your Appointment | The Loft by NM Colombo",
    description: "Find us at Gamsaba Junction, Nugegoda. Book your bespoke beauty session online with immediate WhatsApp confirmation, view opening hours, or check out our comprehensive FAQs.",
    ogTitle: "Reserve Your Sanctuary Hour | The Loft by NM",
    ogDescription: "Use our interactive booking engine, check opening hours, view parking access, or request our private ladies' suite upgrade.",
    ogImage: DEFAULT_OG_IMAGE
  },
  'join-us': {
    title: "Join Our Sanctuary Team | Careers at The Loft by NM Colombo",
    description: "Explore career opportunities at The Loft by NM in Colombo. We are seeking passionate Nail Technicians, Hairdressers, Estheticians, and Masseuses for our luxury salon.",
    ogTitle: "Join Our Circle of Masters | The Loft by NM Careers",
    ogDescription: "Flourish in an unhurried, respectful sanctuary with above-market earnings, masterclass training, and private luxury suites.",
    ogImage: DEFAULT_OG_IMAGE
  },
  careers: {
    title: "Join Our Sanctuary Team | Careers at The Loft by NM Colombo",
    description: "Explore career opportunities at The Loft by NM in Colombo. We are seeking passionate Nail Technicians, Hairdressers, Estheticians, and Masseuses for our luxury salon.",
    ogTitle: "Join Our Circle of Masters | The Loft by NM Careers",
    ogDescription: "Flourish in an unhurried, respectful sanctuary with above-market earnings, masterclass training, and private luxury suites.",
    ogImage: DEFAULT_OG_IMAGE
  }
};

// Map URL paths to metadata keys
function pathToMetaKey(pathname: string): string {
  const clean = pathname.replace(/^\//, '') || 'home';
  return clean;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isPreLaunchMode, setIsPreLaunchMode] = useState<boolean>(() => getSalonLaunchMode() === 'pre-launch');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Derive current page name from URL path
  const currentPage = pathToMetaKey(location.pathname);
  const isAdmin = currentPage === 'admin';

  // Listen to Launch Mode switch toggled from Admin
  useEffect(() => {
    const handleModeChange = (e: any) => {
      setIsPreLaunchMode(e.detail === 'pre-launch');
    };
    window.addEventListener('the-loft-launch-mode-changed', handleModeChange);
    return () => window.removeEventListener('the-loft-launch-mode-changed', handleModeChange);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Monitor scroll height to show/hide Floating Scroll To Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation helpers
  const navigateTo = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookClick = () => {
    setSelectedServiceId('');
    navigateTo('contact');
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    navigateTo('contact');
  };

  // SEO metadata
  const meta = PAGE_METADATA[currentPage] || PAGE_METADATA.home;
  const canonicalUrl = location.pathname === '/'
    ? `${BASE_URL}/`
    : `${BASE_URL}${location.pathname}`;

  return (
    <div id="app-container" className="min-h-screen flex flex-col bg-ivory text-charcoal selection:bg-gold/30 selection:text-charcoal relative">
      <Toaster position="top-right" richColors />

      {/* Dynamic SEO Meta Injection with react-helmet-async */}
      <Helmet>
        {/* Core Search Engine Meta */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonicalUrl} />
        {isAdmin && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {/* Facebook / OpenGraph Protocol */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:site_name" content="The Loft by NM" />

        {/* Twitter Card Protocol */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />
      </Helmet>

      {/* Sticky Premium Header */}
      {!isAdmin && (
        <Header
          currentPage={currentPage}
          navigateTo={navigateTo}
          onBookClick={handleBookClick}
        />
      )}

      {/* Main Content View Container */}
      <main id="main-content" className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Routes>
              <Route path="/" element={
                <HomeView
                  setCurrentPage={navigateTo}
                  onBookClick={handleBookClick}
                />
              } />

              <Route path="/services" element={
                isPreLaunchMode ? (
                  <ToBeRevealedView
                    type="services"
                    setCurrentPage={navigateTo}
                    onBookClick={handleBookClick}
                  />
                ) : (
                  <ServicesView
                    setCurrentPage={navigateTo}
                    onBookClick={handleBookClick}
                  />
                )
              } />

              <Route path="/menu" element={
                isPreLaunchMode ? (
                  <ToBeRevealedView
                    type="menu"
                    setCurrentPage={navigateTo}
                    onBookClick={handleBookClick}
                  />
                ) : (
                  <MenuView
                    onBookService={handleBookService}
                  />
                )
              } />

              <Route path="/gallery" element={
                <GalleryView
                  onBookClick={handleBookClick}
                  setCurrentPage={navigateTo}
                />
              } />

              <Route path="/about" element={
                <AboutView
                  setCurrentPage={navigateTo}
                  onBookClick={handleBookClick}
                />
              } />

              <Route path="/blog" element={
                <BlogView
                  setCurrentPage={navigateTo}
                  onBookClick={handleBookClick}
                />
              } />

              <Route path="/contact" element={
                <ContactView
                  initialServiceId={selectedServiceId}
                  clearInitialServiceId={() => setSelectedServiceId('')}
                />
              } />

              <Route path="/join-us" element={
                <CareersView
                  setCurrentPage={navigateTo}
                  onBookClick={handleBookClick}
                />
              } />

              {/* Legacy /careers alias → redirect to /join-us */}
              <Route path="/careers" element={<Navigate to="/join-us" replace />} />

              <Route path="/admin" element={<AdminView />} />

              {/* Catch-all: redirect unknown paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Consistent Luxury Footer */}
      {!isAdmin && (
        <Footer
          currentPage={currentPage}
          navigateTo={navigateTo}
        />
      )}

      {/* Elegant Floating Scroll-to-Top Button */}
      {!isAdmin && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-to-top"
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={scrollToTop}
              id="scroll-to-top-btn"
              className="fixed bottom-[88px] right-6 z-40 flex items-center justify-center w-14 h-14 bg-charcoal text-ivory hover:bg-gold border border-charcoal/10 hover:border-gold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-luxury focus:outline-hidden cursor-pointer group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />

              {/* Small Elegant text on hover for desktop */}
              <span className="absolute right-16 bg-charcoal text-ivory text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-xs shadow-md opacity-0 scale-90 translate-x-3 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                Back To Top
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Elegant Floating WhatsApp Button */}
      {!isAdmin && (
        <a
          href="https://wa.me/94771650650?text=Hello%20The%20Loft%20by%20NM%2C%20I'd%20like%20to%20inquire%20about%20a%20booking."
          target="_blank"
          rel="noreferrer"
          id="floating-whatsapp-btn"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gold hover:bg-gold-hover text-ivory rounded-full shadow-lg group hover:scale-105 active:scale-95 transition-luxury focus:outline-hidden cursor-pointer"
          aria-label="Contact us on WhatsApp"
        >
          {/* Pulsing Outer Gold Rings representing luxury aura */}
          <span className="absolute -inset-1.5 rounded-full bg-gold/20 animate-ping pointer-events-none" />
          <span className="absolute -inset-3 rounded-full bg-gold/10 animate-pulse pointer-events-none" />

          {/* WhatsApp Elegant SVG Icon */}
          <svg
            className="w-7 h-7 fill-current text-ivory group-hover:rotate-12 transition-transform duration-500"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.022-.08-.063-.125-.137-.184l-1.637-.818c-.148-.074-.325-.015-.41.137l-.723.904c-.458.572-.738.45-.98.318-.466-.233-.896-.543-1.272-.918-.375-.376-.685-.806-.918-1.272-.132-.242-.01-.522.318-.98l.904-.723c.152-.085.21-.262.137-.41l-.818-1.637c-.059-.074-.104-.115-.184-.137a1.053 1.053 0 0 0-.585.03l-.707.354c-.6.3-.96.885-.92 1.543.085 1.402.68 2.73 1.674 3.725s2.323 1.59 3.725 1.674c.658.04 1.243-.32 1.543-.92l.354-.707a1.053 1.053 0 0 0 .03-.585zM12 2a10 10 0 0 0-10 10c0 1.83.493 3.55 1.353 5.04l-.883 3.22c-.11.402.262.774.664.664l3.22-.883A9.94 9.94 0 0 0 12 22a10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18c-1.6 0-3.13-.43-4.47-1.21l-.32-.18-1.92.52.52-1.92-.18-.32A7.952 7.952 0 0 1 4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8z" />
          </svg>

          {/* Small Elegant text on hover for desktop */}
          <span className="absolute right-16 bg-charcoal text-ivory text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 rounded-xs shadow-md opacity-0 scale-90 translate-x-3 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            WhatsApp Support
          </span>
        </a>
      )}

      {/* Interactive Coming Soon Pop-up Banner & Floating Reopen Pill */}
      {!isAdmin && (
        <ComingSoonModal
          onNavigate={(page) => {
            navigateTo(page);
          }}
        />
      )}

    </div>
  );
}
