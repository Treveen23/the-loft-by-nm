import React, { useState } from 'react';
import { Phone, Menu, X, Sparkles } from 'lucide-react';
import nmLogo from '../assets/images/logonew.webp';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

export default function Header({ currentPage, setCurrentPage, onBookClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'join-us', label: 'Join Us' }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
      {/* Top Banner - Trust Line & Phone */}
      <div id="top-bar" className="w-full bg-charcoal text-ivory py-2.5 px-4 text-xs tracking-wider uppercase font-sans-luxury border-b border-gold/15 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Left Click-to-call */}
          <a
            href="tel:+94771650650"
            id="click-to-call"
            className="flex items-center gap-1.5 hover:text-gold transition-colors duration-300 group"
          >
            <Phone size={13} className="text-gold group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold tracking-widest">+94 771 650 650</span>
          </a>

          {/* Centered Trust line */}
          <div id="trust-line" className="flex items-center gap-1.5 font-medium text-xs sm:text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Private Ladies' Suite Available • Colombo
          </div>

          {/* Right Hours Summary */}
          <div className="hidden md:block font-medium opacity-80 text-xs">
            Mon - Sun: 9:00 AM - 7:30 PM
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className="w-full bg-ivory/95 backdrop-blur-md border-b border-charcoal/5 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            id="brand-logo"
            className="flex items-center cursor-pointer group"
          >
            <img
              src={nmLogo}
              alt="The Loft by NM"
              loading="eager"
              decoding="async"
              className="h-14 sm:h-16 w-auto object-contain group-hover:scale-105 transition-all duration-500"
            />
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === 'join-us' && currentPage === 'careers');
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-sans-luxury text-xs font-semibold tracking-widest uppercase relative py-2 transition-luxury cursor-pointer group ${isActive ? 'text-gold' : 'text-charcoal hover:text-gold'
                    }`}
                >
                  {item.label}
                  {/* Subtle active line */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-500 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* CTA Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Call to Action Book Button */}
            <button
              id="header-cta-book"
              onClick={onBookClick}
              className="font-sans-luxury text-xs sm:text-sm sm:text-xs font-bold tracking-widest uppercase bg-charcoal text-ivory border border-charcoal py-2.5 px-4 sm:px-6 rounded-xs hover:bg-gold hover:border-gold hover:text-ivory transition-luxury shadow-sm cursor-pointer"
            >
              Book or Visit Us
            </button>

            {/* Mobile Navigation Toggle Button */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors duration-300 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-dropdown"
            className="lg:hidden bg-ivory border-b border-charcoal/5 absolute top-20 left-0 w-full shadow-lg z-50 animate-fadeIn"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 flex flex-col">
              {navItems.map((item) => {
                const isActive = currentPage === item.id || (item.id === 'join-us' && currentPage === 'careers');
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`font-sans-luxury text-sm font-bold tracking-wider uppercase text-left py-2.5 px-4 rounded-xs transition-luxury ${isActive
                      ? 'bg-gold/10 text-gold font-bold'
                      : 'text-charcoal hover:bg-charcoal/5 hover:text-gold'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Extra info for mobile */}
              <div className="border-t border-charcoal/5 pt-4 mt-2 px-4 space-y-2">
                <a
                  href="tel:+94771650650"
                  className="flex items-center gap-2 text-xs font-medium text-charcoal/75 hover:text-gold transition-colors duration-300"
                >
                  <Phone size={14} className="text-gold" />
                  +94 771 650 650
                </a>
                <p className="text-xs tracking-wider text-charcoal/55 uppercase font-medium">
                  Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
