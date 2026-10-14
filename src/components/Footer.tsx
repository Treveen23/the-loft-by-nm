import React from 'react';
import { Mail, MapPin, Phone, MessageSquare, Instagram, Facebook, Sparkles } from 'lucide-react';
import nmLogo from '../assets/images/footer.webp';

interface FooterProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Footer({ currentPage, setCurrentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'join-us', label: 'Join Us' }
  ];

  return (
    <footer id="global-footer" className="bg-charcoal text-ivory pt-20 pb-10 border-t border-gold/20 relative overflow-hidden">
      {/* Structural background highlights for premium luxury feel */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column (Col Span 4) */}
          <div id="footer-brand" className="lg:col-span-4 space-y-8">
            <div className="flex items-start">
              <img
                src={nmLogo}
                alt="The Loft by NM"
                loading="lazy"
                decoding="async"
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-sm font-normal text-ivory/70 leading-relaxed font-sans pr-8">
              Colombo’s premier boutique sanctuary offering bespoke, couture hair care, restorative botanical facials, and artisanal nail styling in absolute comfort and seclusion.
            </p>

            {/* Social Icons */}
            <div id="footer-socials" className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-charcoal hover:bg-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-charcoal hover:bg-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-ivory/5 border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-charcoal hover:bg-gold hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-sm"
                aria-label="TikTok"
              >
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94.38 2 .53 3.02.46V8.6c-1.32-.07-2.61-.45-3.76-1.14-.04 2.21-.01 4.41-.03 6.62-.03 1.56-.5 3.12-1.37 4.41-1.29 2.13-3.72 3.52-6.26 3.51-2.91.09-5.85-1.57-7.14-4.21-1.37-2.61-.88-6.13 1.22-8.22 1.4-1.44 3.42-2.18 5.41-1.95V11.8c-.83-.17-1.72.07-2.32.67-.68.64-.84 1.7-.42 2.52.46.99 1.63 1.57 2.7 1.43 1.01-.06 1.87-.84 2.03-1.84.07-2.52.02-5.04.03-7.56V0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column (Col Span 2) */}
          <div id="footer-links" className="lg:col-span-2 space-y-6">
            <h4 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-gold">
              Navigation
            </h4>
            <ul className="space-y-4 font-sans text-sm">
              {pages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => handleLinkClick(page.id)}
                    className={`hover:text-gold text-left font-normal transition-colors duration-300 flex items-center gap-2 group cursor-pointer ${currentPage === page.id || (page.id === 'join-us' && currentPage === 'careers') ? 'text-gold' : 'text-ivory/70'
                      }`}
                  >
                    <span className="w-4 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                    {page.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column (Col Span 3) */}
          <div id="footer-contact" className="lg:col-span-3 space-y-6">
            <h4 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-gold">
              Get in Touch
            </h4>
            <ul className="space-y-5 font-sans text-sm text-ivory/70">
              <li className="flex items-start gap-4 group">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="font-normal leading-relaxed">
                  No. 7, Gamsaba Junction,<br />Nugegoda, Colombo,<br />Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <Phone size={16} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+94771650650" className="hover:text-gold transition-colors">
                  +94 771 650 650
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <MessageSquare size={16} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href="https://wa.me/94771650650"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <Mail size={16} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:appointments@theloftbynm.com" className="hover:text-gold transition-colors">
                  hello@theloftbynm.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours Column (Col Span 3) */}
          <div id="footer-hours" className="lg:col-span-3 space-y-6">
            <h4 className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-gold">
              Opening Hours
            </h4>
            <div className="space-y-4 font-sans text-sm text-ivory/70">
              <div className="border-b border-ivory/10 pb-3">
                <div className="flex justify-between items-center font-normal">
                  <span>Mon - Fri</span>
                  <span className="text-gold font-medium">10:00 AM - 07:30 PM</span>
                </div>
              </div>
              <div className="border-b border-ivory/10 pb-3">
                <div className="flex justify-between items-center font-normal">
                  <span>Sat - Sun</span>
                  <span className="text-gold font-medium">09:30 AM - 08:00 PM</span>
                </div>
              </div>
              <div className="border-b border-ivory/10 pb-3">
                <div className="flex justify-between items-center font-normal">
                  <span>Tuesday</span>
                  <span className="text-ivory/40 uppercase tracking-widest text-[10px] font-bold">Closed</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[11px] italic text-ivory/50 font-normal leading-relaxed border-l-2 border-gold/30 pl-3">
                  Private Ladies' Suite bookings should be requested at least 24 hours in advance.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright and Bottom bar */}
        <div className="border-t border-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-xs text-ivory/50">
          <p>© {currentYear} The Loft by NM. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 font-normal">
            <a href="#privacy" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-gold transition-colors">Terms of Service</a>
            <button onClick={() => { setCurrentPage('admin'); window.scrollTo(0, 0); }} className="hover:text-gold transition-colors opacity-30 hover:opacity-100">Admin Login</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
