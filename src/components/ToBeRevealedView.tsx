import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Lock,
  Eye,
  Gift,
  Mail,
  CheckCircle2,
  Phone,
  Sparkles
} from 'lucide-react';
import nmLogo from '../assets/images/NM new Logo white.webp';
import { createContact, createVipWaitlist } from '../api';

interface ToBeRevealedViewProps {
  type: 'services' | 'menu';
  setCurrentPage: (page: string) => void;
  onBookClick: () => void;
}

export default function ToBeRevealedView({ type, setCurrentPage, onBookClick }: ToBeRevealedViewProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'menu'>(type);
  const [contactInput, setContactInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Sync activeTab if parent type changes
  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      toast.error('Please enter your email or WhatsApp number');
      return;
    }

    setIsSubmitting(true);
    try {
      await createVipWaitlist({
        name: 'VIP Guest',
        contact_value: contactInput.trim(),
        contact_type: contactInput.includes('@') ? 'email' : 'whatsapp',
        interest: activeTab,
        status: 'registered',
        notes: `Registered on ${activeTab === 'services' ? 'Services' : 'Menu & Prices'} teaser page`
      });

      setIsSubscribed(true);
      toast.success('You have been added to our early access list!');
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      toast.error(err?.message || 'Could not join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isServices = activeTab === 'services';

  return (
    <div id="to-be-revealed-view" className="min-h-screen bg-charcoal text-ivory selection:bg-gold/30 selection:text-ivory relative overflow-hidden flex flex-col justify-center">
      {/* Ambient Luxury Lighting & Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Golden Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C9A66B_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 w-full">

        {/* Brand Logo & Top Badge */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <img
              src={nmLogo}
              alt="The Loft by NM"
              decoding="async"
              className="h-16 sm:h-20 w-auto object-contain mx-auto mb-5 drop-shadow-md"
            />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory/5 border border-gold/30 backdrop-blur-md text-[11px] font-sans tracking-[0.25em] text-gold uppercase shadow-inner">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>The Loft Salon • Opening Soon</span>
            </div>
          </motion.div>
        </div>

        {/* Tab Switcher: Services vs Menu */}
        <div className="flex justify-center mb-10 px-2">
          <div className="inline-flex p-1 sm:p-1.5 rounded-full bg-charcoal/80 border border-ivory/15 backdrop-blur-lg shadow-xl max-w-full overflow-hidden">
            <button
              onClick={() => {
                setActiveTab('services');
                window.location.hash = 'services';
              }}
              className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider sm:tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${isServices
                  ? 'bg-gold text-charcoal shadow-md font-bold'
                  : 'text-ivory/70 hover:text-ivory hover:bg-ivory/5'
                }`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Our Services</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('menu');
                window.location.hash = 'menu';
              }}
              className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider sm:tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${!isServices
                  ? 'bg-gold text-charcoal shadow-md font-bold'
                  : 'text-ivory/70 hover:text-ivory hover:bg-ivory/5'
                }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Menu & Prices</span>
            </button>
          </div>
        </div>

        {/* Main Hero Announcement */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 sm:space-y-5 mb-10 sm:mb-12 max-w-2xl mx-auto"
        >
          <p className="text-gold font-sans text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase font-semibold">
            {isServices
              ? '✦ Luxury Salon & Spa • Nugegoda, Colombo ✦'
              : '✦ Clear & Honest Pricing • All Taxes Included ✦'}
          </p>

          <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl lg:text-5xl text-ivory tracking-tight leading-[1.2]">
            {isServices ? (
              <>
                Our Full Service Menu is <br />
                <span className="italic text-gold font-normal font-serif">Coming Soon</span>
              </>
            ) : (
              <>
                Our Prices & Packages are <br />
                <span className="italic text-gold font-normal font-serif">Coming Soon</span>
              </>
            )}
          </h1>

          <p className="font-sans text-xs sm:text-base text-ivory/80 leading-relaxed font-light px-2 sm:px-0">
            {isServices ? (
              <>
                We are getting everything ready for you — from hair styling and relaxing facials to our private ladies' suite. Our full list of services will be shared right when we open our doors.
              </>
            ) : (
              <>
                We are putting the final touches on our treatment prices and packages. You will always see simple, honest prices with no hidden charges.
              </>
            )}
          </p>
        </motion.div>

        {/* Early Access Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/30 bg-gradient-to-b from-charcoal/90 via-charcoal/80 to-[#161617] p-5 sm:p-10 mb-10 sm:mb-12 shadow-2xl text-center max-w-2xl mx-auto backdrop-blur-md"
        >
          <div className="space-y-4 sm:space-y-5 relative z-10">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold/15 text-gold border border-gold/30">
              <Gift className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-xl sm:text-3xl text-ivory tracking-tight">
                Be the First to Know When We <span className="italic text-gold">Open</span>
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ivory/75 leading-relaxed font-light max-w-lg mx-auto">
                Sign up to see our full menu and special opening-week offers before anyone else.
              </p>
            </div>

            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gold/15 border border-gold/40 text-center space-y-1.5"
              >
                <CheckCircle2 className="w-7 h-7 text-gold mx-auto" />
                <h3 className="font-serif text-lg text-ivory">You're On The List!</h3>
                <p className="font-sans text-xs text-ivory/80 font-light">
                  We saved your spot. We will send you an update on WhatsApp or email soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleVipSubmit} className="space-y-3 pt-2">
                <div className="relative flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      placeholder="Enter WhatsApp number or Email"
                      className="w-full bg-ivory/5 border border-ivory/20 focus:border-gold rounded-full px-5 py-3 text-xs text-ivory placeholder-ivory/40 outline-none transition-colors pr-10"
                    />
                    <Mail className="w-4 h-4 text-ivory/40 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-gold/20 whitespace-nowrap"
                  >
                    {isSubmitting ? 'Saving...' : 'Get Early Access'}
                  </button>
                </div>
                <p className="text-[11px] text-ivory/50 font-sans tracking-wide">
                  ✦ We respect your privacy.
                </p>
              </form>
            )}
          </div>
        </motion.div>

        {/* Concierge Support & Alternate Actions */}
        <div className="border-t border-ivory/10 pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-serif text-base sm:text-lg text-ivory">Have Questions or Want to Book Early?</h3>
            <p className="font-sans text-xs text-ivory/70 font-light">
              Our team is happy to answer questions or help you book a private session.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-ivory text-charcoal hover:bg-gold hover:text-charcoal text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-md text-center"
            >
              Contact Us
            </button>

            <a
              href="https://wa.me/94771650650?text=Hello%20The%20Loft%20by%20NM%2C%20I'd%20like%20to%20inquire%20about%20your%20upcoming%20services%20and%20menu."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/30 text-gold text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>

            <button
              onClick={() => {
                setCurrentPage('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-ivory/20 hover:border-ivory text-ivory text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer text-center"
            >
              View Gallery
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
