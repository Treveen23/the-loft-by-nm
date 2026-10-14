import React, { useState, useEffect, useRef } from 'react';
import { MENU_ITEMS, IMAGES } from '../data';
import { BookingForm, ContactForm } from '../types';
import DatePicker from './DatePicker';
import { createBooking, createContact, fetchServices } from '../api';
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  Car,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkle,
  X,
  Download,
  PhoneCall
} from 'lucide-react';

interface ContactViewProps {
  initialServiceId?: string;
  clearInitialServiceId?: () => void;
}

export default function ContactView({ initialServiceId, clearInitialServiceId }: ContactViewProps) {
  const [activeFormTab, setActiveFormTab] = useState<'book' | 'message'>('book');

  // Accordion active FAQ index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Booking Form State
  const [booking, setBooking] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    serviceIds: initialServiceId ? [initialServiceId] : [],
    date: '',
    time: '',
    privateSuite: false,
    notes: ''
  });

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        console.error("Failed to load services for dropdown", err);
      }
    }
    loadServices();
  }, []);

  // Contact Form State
  const [contact, setContact] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isTicketCopied, setIsTicketCopied] = useState<boolean>(false);
  const [isAddressCopied, setIsAddressCopied] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  const bookingEngineRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync initial service ID if specified from the Menu page
  useEffect(() => {
    if (initialServiceId) {
      setBooking((prev) => ({
        ...prev,
        serviceIds: prev.serviceIds.includes(initialServiceId) ? prev.serviceIds : [...prev.serviceIds, initialServiceId]
      }));
      setActiveFormTab('book');

      // Auto scroll to booking engine
      setTimeout(() => {
        bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [initialServiceId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setIsSubmitting(true);

    if (!booking.date) {
      setBookingError("Please select a preferred date for your treatment.");
      bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsSubmitting(false);
      return;
    }

    const chosenDate = new Date(booking.date);
    chosenDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate.getTime() <= today.getTime()) {
      setBookingError("Please select a valid future date. Same-day online booking is disabled; please call us or message on WhatsApp for immediate appointments.");
      bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsSubmitting(false);
      return;
    }

    if (booking.serviceIds.length === 0) {
      setBookingError("Please select at least one therapy from the menu.");
      bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsSubmitting(false);
      return;
    }

    // Find the associated service details
    const chosenServices = booking.serviceIds.map(id =>
      services.find(item => item.id === id) || services.find(item => item.name === id)
    ).filter(Boolean);

    const serviceNames = chosenServices.length > 0 ? chosenServices.map(s => s.name).join(', ') : 'Custom Consultation';
    const servicePrice = chosenServices.reduce((sum, s) => {
      const priceVal = typeof s.price === 'string' ? parseFloat(s.price.replace(/,/g, '')) : (s.price || 0);
      return sum + (isNaN(priceVal) ? 0 : priceVal);
    }, 0);

    // Generate a beautiful, unique luxury ticket
    const ticketCode = `TL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      code: ticketCode,
      ...booking,
      serviceName: serviceNames,
      servicePrice,
      createdAt: new Date().toLocaleDateString()
    };

    try {
      // Save to Supabase
      await createBooking({
        service_id: serviceNames,
        customer_name: booking.name,
        customer_email: booking.email,
        customer_phone: booking.phone,
        preferred_date: booking.date,
        preferred_time: booking.time,
        private_suite: booking.privateSuite,
        notes: booking.notes
      });

      // Save to local storage for reference
      const existingBookings = JSON.parse(localStorage.getItem('the_loft_reservations') || '[]');
      existingBookings.push(newReservation);
      localStorage.setItem('the_loft_reservations', JSON.stringify(existingBookings));

      setBookingSuccess(newReservation);
    } catch (error) {
      console.error("Booking error:", error);
      setBookingError("Failed to submit booking to the server. Please try again or contact us via WhatsApp.");
      setIsSubmitting(false);
      return;
    }

    // Clear initial ID if any
    if (clearInitialServiceId) {
      clearInitialServiceId();
    }

    // Reset Form
    setBooking({
      name: '',
      email: '',
      phone: '',
      serviceIds: [],
      date: '',
      time: '',
      privateSuite: false,
      notes: ''
    });

    setIsSubmitting(false);
    // Scroll form container to view
    bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createContact({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        subject: contact.subject,
        message: contact.message
      });
      setContactSuccess(true);
    } catch (error) {
      console.error("Contact error:", error);
      alert("Failed to send message to the server. Please try again.");
      setIsSubmitting(false);
      return;
    }
    setContact({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);

    bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopyCode = () => {
    if (bookingSuccess) {
      navigator.clipboard.writeText(bookingSuccess.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyFullTicket = () => {
    if (!bookingSuccess) return;
    const text = 
`✦ THE LOFT BY NM — APPOINTMENT TICKET ✦
Ticket Code: ${bookingSuccess.code}
Guest: ${bookingSuccess.name}
Phone: ${bookingSuccess.phone}
Therapy: ${bookingSuccess.serviceName}
Schedule: ${bookingSuccess.date} at ${bookingSuccess.time}
Private Ladies' Suite: ${bookingSuccess.privateSuite ? 'Yes (Reserved)' : 'Main Salon'}
Estimated Total: Rs. ${Number(bookingSuccess.servicePrice || 0).toLocaleString()}

Address: Gamsaba Junction, Nugegoda, Colombo, Sri Lanka
Concierge Desk: +94 771 650 650`;

    navigator.clipboard.writeText(text);
    setIsTicketCopied(true);
    setTimeout(() => setIsTicketCopied(false), 2500);
  };

  const getWhatsAppConfirmationUrl = (item: any) => {
    if (!item) return 'https://wa.me/94771650650';
    const text = 
`Hello The Loft by NM! I just booked an appointment on your website:

🎫 Ticket Code: ${item.code}
👤 Guest: ${item.name}
✨ Therapy: ${item.serviceName}
📅 Date: ${item.date}
⏰ Time: ${item.time}
👑 Private Ladies' Suite: ${item.privateSuite ? 'Yes, Reserved' : 'Main Salon'}
💰 Estimated Total: Rs. ${Number(item.servicePrice || 0).toLocaleString()}

Please confirm my reservation. Looking forward to my session!`;

    return `https://wa.me/94771650650?text=${encodeURIComponent(text)}`;
  };

  const getGoogleCalendarUrl = (item: any) => {
    if (!item?.date) return 'https://calendar.google.com';
    try {
      const [year, month, day] = item.date.split('-').map(Number);
      let hours = 10;
      let minutes = 0;
      if (item.time) {
        const match = item.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const period = match[3].toUpperCase();
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }
      }
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 90 * 60 * 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      const formatGCal = (d: Date) => 
        `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

      const title = encodeURIComponent(`The Loft by NM - ${item.serviceName || 'Ritual'}`);
      const details = encodeURIComponent(
        `Appointment Ticket: ${item.code}\nGuest: ${item.name}\nTherapy: ${item.serviceName}\nPrivate Suite: ${item.privateSuite ? 'Yes' : 'No'}\nConcierge: +94 771 650 650\nAddress: Gamsaba Junction, Nugegoda, Colombo`
      );
      const location = encodeURIComponent('The Loft by NM, Gamsaba Junction, Nugegoda, Colombo, Sri Lanka');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCal(start)}/${formatGCal(end)}&details=${details}&location=${location}`;
    } catch {
      return 'https://calendar.google.com';
    }
  };

  const downloadIcsCalendar = (item: any) => {
    if (!item?.date) return;
    try {
      const [year, month, day] = item.date.split('-').map(Number);
      let hours = 10;
      let minutes = 0;
      if (item.time) {
        const match = item.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          const period = match[3].toUpperCase();
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }
      }
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 90 * 60 * 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      const formatIcs = (d: Date) => 
        `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Loft by NM//Reservation System//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${item.code}-${Date.now()}@theloftbynm.com`,
        `DTSTAMP:${formatIcs(new Date())}Z`,
        `DTSTART:${formatIcs(start)}`,
        `DTEND:${formatIcs(end)}`,
        `SUMMARY:The Loft by NM - ${item.serviceName}`,
        `DESCRIPTION:Ticket: ${item.code}\\nGuest: ${item.name}\\nTherapy: ${item.serviceName}\\nPrivate Suite: ${item.privateSuite ? 'Yes' : 'No'}\\nPhone: +94 771 650 650`,
        'LOCATION:The Loft by NM, Gamsaba Junction, Nugegoda, Colombo, Sri Lanka',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `the-loft-reservation-${item.code}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export calendar file', err);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("No. 7, Gamsaba Junction, Nugegoda, Colombo, Sri Lanka");
    setIsAddressCopied(true);
    setTimeout(() => setIsAddressCopied(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Scroll to booking helper
  const scrollToBooking = () => {
    bookingEngineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      if (dropdownRef.current) {
        setIsServiceDropdownOpen(true);
      }
    }, 800);
  };

  const faqs = [
    {
      q: "Do I need an appointment?",
          a: "No, walk-ins are always welcome. Booking ahead means your appointment is ready when you arrive, so you don't have to wait."
    },
    {
      q: "Is there a private space for women only?",
        a: "Yes, we have a private ladies' suite for clients who prefer more privacy. Just let us know when you book or when you arrive."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash, Credit/Debit Cards (Visa, MasterCard )"
    },
    {
      q: "Do you offer gift vouchers?",
        a: "Yes, gift vouchers are available for any service or custom package. They can be purchased at the Front desk or sent digitally."
    }
  ];

  return (
    <div id="contact-page-wrapper" className="bg-ivory min-h-screen animate-fadeIn overflow-hidden">

      {/* 1. HERO SECTION */}
      {/* 1. HERO SECTION */}
      <section
        id="contact-hero"
        className="relative bg-ivory pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden"
      >
        {/* Background Subtle Texture/Glow */}
        <div className="absolute top-0 left-0 w-3/4 h-full bg-gold/5 blur-3xl rounded-br-full -z-10 opacity-70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="relative z-10 text-left pt-8 lg:pt-0 pr-0 lg:pr-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-xs tracking-[0.2em] uppercase font-semibold shadow-sm cursor-default mb-5">
                <Sparkles size={12} className="fill-gold animate-pulse" />
                              <span>Contact & Support</span>
                <Sparkles size={12} className="fill-gold animate-pulse" />
              </div>

                          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-charcoal tracking-tight leading-[1.05] mb-4">
                              Get in{' '}
                              <span className="relative inline-block mt-1">
                                  <span className="relative z-10 italic font-light text-charcoal/90">
                                      Touch
                                  </span>
                                  <span className="absolute bottom-2 left-0 w-full h-3 sm:h-4 bg-gold/15 -z-10 -rotate-1"></span>
                              </span>
                          </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-gold to-transparent" />
                <MessageCircle size={14} className="text-gold" />
              </div>

              <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed font-light max-w-lg mb-8">
                Ready for considered care? Walk in, book ahead, or reach out with any questions. Our team is here to assist you.
              </p>

              {/* Trust Tags Row */}
              <div className="flex flex-wrap gap-3">
                {["Walk-Ins Welcome", "Online Booking", "WhatsApp Confirmation"].map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-charcoal/60 bg-charcoal/[0.02] border border-charcoal/10 px-4 py-2 rounded-full cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative group w-[90%] sm:w-4/5 lg:w-[85%] mx-auto lg:ml-auto lg:mr-0 mt-8 lg:mt-0">
              <div className="absolute inset-0 border border-gold/30 translate-x-4 translate-y-4 rounded-xl -z-10 transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl shadow-2xl">
                <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0" />
                              <img
                                  src="https://i.pinimg.com/1200x/bf/1c/c3/bf1cc379f533135588b668b828fc2b1a.jpg"
                                  alt="The Loft Concierge"
                                  loading="eager"
                                  decoding="async"
                                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-all duration-1000 ease-out"
                              />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SPLIT SCREEN LAYOUT (Visit Us vs. How to Find Us) */}
      <section
        id="split-info-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

          {/* Left Side (Visit Us) */}
          <div
            id="visit-us-column"
            className="group relative bg-white/80 backdrop-blur-md border border-white p-10 sm:p-12 rounded-2xl flex flex-col justify-between shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] text-left overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.15)] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="space-y-10">
              <div className="border-b border-gold/20 pb-6">
                <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase block mb-2">Colombo Sanctuary</span>
                <h2 className="font-serif text-4xl text-charcoal tracking-tight">Visit Us</h2>
              </div>

              {/* Address with copy capability */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-charcoal">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                    <MapPin size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase font-sans">Our Address</span>
                </div>
                <div className="pl-13 space-y-4">
                  <p className="font-sans text-base text-charcoal/80 leading-relaxed font-light">
                    No. 7, Gamsaba Junction,<br />
                    Nugegoda, Colombo, Sri Lanka
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gold hover:text-gold-hover transition-colors cursor-pointer bg-gold/5 hover:bg-gold/10 px-4 py-2 rounded-full"
                  >
                    {isAddressCopied ? (
                      <>
                        <Check size={12} />
                        <span>Address Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Opening Hours Table */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-charcoal">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors duration-300 delay-75">
                    <Clock size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-widest uppercase font-sans">Opening Hours</span>
                </div>

                <div className="pl-13 space-y-3 max-w-sm">
                  {[
                    { day: "Monday – Friday", hours: "10:00 AM – 07:30 PM" },
                    { day: "Saturday – Sunday", hours: "09:30 AM – 08:00 PM" },
                    { day: "Tuesday", hours: "Closed for Sanitization", isSpecial: true }
                  ].map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-charcoal/5 pb-3">
                      <span className="font-sans text-charcoal/80 font-light">{row.day}</span>
                      <span className={`font-mono text-xs tracking-wider ${row.isSpecial ? 'text-gold font-bold' : 'text-charcoal font-medium'}`}>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Policy block */}
            <div className="mt-12 bg-ivory/80 border-l-2 border-gold p-6 rounded-r-xl space-y-3 shadow-sm group-hover:bg-white transition-colors duration-300">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold flex items-center gap-2">
                <AlertCircle size={14} />
                Booking Policy
              </span>
                          <p className="font-sans text-sm text-charcoal/70 leading-relaxed font-light">
                              Walk-ins are welcome. We recommend booking in advance to get your preferred time and therapist. Please give us <strong>24 hours' notice</strong> if you need to cancel or change your booking.
                          </p>
            </div>
          </div>

          {/* Right Side (How to Find Us) */}
          <div
            id="find-us-column"
            className="flex flex-col justify-between space-y-8 text-left"
          >

            {/* By Car & Parking */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white p-8 rounded-2xl space-y-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <Car size={20} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">By Car & Parking</h3>
              </div>
                          <p className="font-sans text-sm text-charcoal/70 leading-[1.7] font-light pl-16">
                              Parking is available on-site and on the street. We also have secure basement parking for clients. 
                          </p>
            </div>

            {/* WhatsApp Link CTA */}
            <div className="group bg-white/80 backdrop-blur-sm border border-white p-8 rounded-2xl space-y-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal">WhatsApp Direct</h3>
              </div>
              <p className="font-sans text-sm text-charcoal/70 leading-[1.7] font-light pl-16 mb-2">
                Message us directly to confirm your booking, ask a question or request a specific therapist. We usually reply within minutes.
              </p>
              <div className="pl-16">
                <a
                  id="whatsapp-link-btn"
                  href="https://wa.me/94771650650?text=Hello%20The%20Loft%20by%20NM%2C%20I'd%20like%20to%20ask%20about%20booking%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
                >
                  <MessageSquare size={16} className="fill-white/20" />
                  <span>Message on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map Placeholder */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-charcoal/60 uppercase font-sans">Interactive Location Map</span>
              </div>
              <div
                id="embedded-map-container"
                className="relative h-64 sm:h-72 w-full bg-charcoal/5 rounded-2xl overflow-hidden shadow-md group"
              >
                {/* Genuine highly responsive embedded Google Maps iframe centered at Gamsaba Junction, Nugegoda */}
                <iframe
                  title="The Loft by NM Nugegoda Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0827253579036!2d79.89139617475657!3d6.880650993118228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a3a2a6136fb%3A0x6b107e3820245a49!2sGamsaba%20Junction%2C%20Nugegoda!5e0!3m2!1sen!2slk!4v1719460592984!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale-[60%] contrast-110 group-hover:grayscale-0 transition-all duration-1000"
                />
                {/* Subtle inner shadow for premium feel */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE BOOKING ENGINE & GENERAL INQUIRY SECTION */}
      <section
        id="booking-engine-section"
        ref={bookingEngineRef}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 relative"
      >
        <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full opacity-50 -z-10 transform scale-y-75" />

        <div className="bg-white/90 backdrop-blur-xl border border-white/50 p-6 sm:p-12 lg:p-16 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">

          {/* Custom Success State for Bookings */}
          {bookingSuccess ? (
            <div id="booking-success-ticket" className="space-y-10 animate-fadeIn text-left">
              <div className="flex items-center gap-4 text-gold">
                <CheckCircle2 size={42} className="shrink-0 drop-shadow-md" />
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-charcoal">Reservation Requested</h3>
                  <p className="text-[10px] sm:text-xs font-sans text-charcoal/60 uppercase tracking-[0.2em] mt-1">
                    Your digital appointment ticket is ready
                  </p>
                </div>
              </div>

              {/* Luxury Digital Ticket */}
              <div className="border border-gold/40 bg-gradient-to-br from-gold/5 to-transparent p-8 sm:p-12 rounded-2xl relative overflow-hidden space-y-8 shadow-[0_10px_30px_rgba(212,175,55,0.15)]">

                {/* Visual Ticket Serration Cut Decor */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-r border-gold/40 shadow-[inset_-3px_0_5px_rgba(0,0,0,0.05)]" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-l border-gold/40 shadow-[inset_3px_0_5px_rgba(0,0,0,0.05)]" />

                {/* Watermark */}
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                  <Sparkles size={200} />
                </div>

                {/* Ticket Header */}
                <div className="flex justify-between items-center border-b border-gold/20 pb-6 relative z-10">
                  <div className="space-y-1">
                                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gold">Visit Information</span>
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-bold text-2xl sm:text-3xl text-charcoal tracking-wide">
                        {bookingSuccess.code}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="text-gold/50 hover:text-gold transition-colors p-2 hover:bg-gold/10 rounded-full"
                        title="Copy reservation code"
                      >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal/50 block mb-1">Date Generated</span>
                    <span className="text-sm font-semibold text-charcoal font-mono">{bookingSuccess.createdAt}</span>
                  </div>
                </div>

                {/* Ticket Details Body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm font-sans relative z-10">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-charcoal/50">Guest Name</span>
                    <p className="font-medium text-base text-charcoal">{bookingSuccess.name}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-charcoal/50">Mobile Contact</span>
                    <p className="font-medium text-base text-charcoal">{bookingSuccess.phone}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-charcoal/50">Therapy Requested</span>
                    <p className="font-bold text-charcoal flex items-center gap-2 text-base">
                      <Sparkles size={14} className="text-gold fill-gold shrink-0" />
                      {bookingSuccess.serviceName}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-charcoal/50">Scheduled Date & Time</span>
                    <p className="font-medium text-base text-charcoal">{bookingSuccess.date} • {bookingSuccess.time}</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2 bg-white/50 p-4 rounded-xl border border-white">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-charcoal/50">Ladies' Private Suite Reserved</span>
                    <p className={`font-bold uppercase tracking-wider text-xs flex items-center gap-2 ${bookingSuccess.privateSuite ? 'text-gold' : 'text-charcoal/70'}`}>
                      {bookingSuccess.privateSuite ? (
                        <><CheckCircle2 size={14} className="fill-gold text-white" /> Yes - Secured Seclusion Reserved</>
                      ) : (
                        <><MapPin size={14} /> No - Main Salon work area</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Estimated Surcharge info */}
                <div className="border-t border-gold/20 pt-6 flex justify-between items-center relative z-10">
                  <span className="text-[10px] text-charcoal/60 uppercase tracking-[0.2em] font-bold font-sans">Estimated Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-gold font-serif">Rs. {bookingSuccess.servicePrice.toLocaleString()}</span>
                </div>
              </div>

              {/* VIP Concierge Fast-Track Action Hub */}
              <div className="space-y-4">
                {/* 1. PRIMARY FAST-TRACK: Instant WhatsApp Confirmation */}
                <a
                  href={getWhatsAppConfirmationUrl(bookingSuccess)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <MessageCircle size={24} className="text-white fill-white/20" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-lg sm:text-xl font-bold tracking-tight">Confirm Instantly via WhatsApp</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                      </div>
                      <p className="font-sans text-xs text-white/90 font-light mt-0.5">
                        Direct 2-way verification with our concierge desk (+94 771 650 650)
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-md shrink-0 group-hover:bg-gold-light group-hover:text-charcoal transition-colors">
                    <span>Send Ticket Now</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* 2. SECONDARY CONCIERGE ACTIONS: Calendar & Ticket Copy */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Google Calendar */}
                  <a
                    href={getGoogleCalendarUrl(bookingSuccess)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-charcoal/15 bg-white hover:bg-gold/5 hover:border-gold/50 text-charcoal font-sans text-xs font-semibold tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <Calendar size={15} className="text-gold shrink-0" />
                    <span>Add to Google Cal</span>
                  </a>

                  {/* Apple / Outlook Calendar */}
                  <button
                    type="button"
                    onClick={() => downloadIcsCalendar(bookingSuccess)}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-charcoal/15 bg-white hover:bg-gold/5 hover:border-gold/50 text-charcoal font-sans text-xs font-semibold tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <Download size={15} className="text-gold shrink-0" />
                    <span>Download .ICS File</span>
                  </button>

                  {/* Copy Full Ticket Details */}
                  <button
                    type="button"
                    onClick={handleCopyFullTicket}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-charcoal/15 bg-white hover:bg-gold/5 hover:border-gold/50 text-charcoal font-sans text-xs font-semibold tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    {isTicketCopied ? (
                      <>
                        <Check size={15} className="text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-bold">Details Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} className="text-gold shrink-0" />
                        <span>Copy Full Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Concierge Instructions & Arrival Notes */}
              <div className="bg-charcoal text-white p-6 sm:p-8 rounded-2xl space-y-4 font-sans text-sm shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-3xl group-hover:bg-gold/30 transition-colors duration-700" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                  <div className="flex items-center gap-2.5 font-bold uppercase tracking-widest text-gold text-xs">
                    <Sparkles size={15} />
                    <span>Concierge Arrival Protocol</span>
                  </div>
                  <a
                    href="tel:+94771650650"
                    className="flex items-center gap-1.5 text-xs text-ivory/80 hover:text-gold transition-colors font-medium tracking-wide"
                  >
                    <PhoneCall size={13} className="text-gold" />
                    <span>+94 771 650 650</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-white/85 relative z-10">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                    <p>
                      <strong>Arrival & Check-in:</strong> Please arrive 10 minutes prior to your session for your welcome herbal infusion tea ritual.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                    <p>
                      <strong>Complimentary Valet / Parking:</strong> Dedicated customer parking is available on-premise at Gamsaba Junction, Nugegoda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-charcoal py-3.5 px-10 rounded-full hover:bg-gold/15 transition-all cursor-pointer border border-charcoal/20 hover:border-gold"
                >
                  Book Another Therapy
                </button>
              </div>
            </div>
          ) : contactSuccess ? (
            /* Contact inquiry success card */
            <div id="contact-success-card" className="space-y-8 text-center py-16 animate-fadeIn">
              <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto relative group">
                <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping opacity-50" />
                <CheckCircle2 size={48} className="relative z-10" />
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-3xl sm:text-4xl text-charcoal">Message Transmitted</h3>
                <p className="text-base font-sans font-light text-charcoal/70 max-w-lg mx-auto leading-relaxed">
                  Your inquiry has been logged in our luxury dispatch pipeline. A senior coordinator from our desk will reach out to you shortly.
                </p>
              </div>
              <button
                onClick={() => setContactSuccess(false)}
                className="mt-8 font-sans text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase bg-charcoal text-ivory py-4 px-10 rounded-full hover:bg-gold hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Form Fields and Tabs */
            <div className="space-y-10">

              {/* Form Category Tabs */}
              <div className="flex p-1.5 bg-charcoal/5 rounded-full max-w-md mx-auto">
                <button
                  id="tab-btn-booking"
                  onClick={() => setActiveFormTab('book')}
                  className={`flex-1 text-center font-sans text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase py-3.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${activeFormTab === 'book'
                    ? 'bg-white text-gold shadow-sm'
                    : 'bg-transparent text-charcoal/60 hover:text-charcoal'
                    }`}
                >
                  Bespoke Booking
                </button>
                <button
                  id="tab-btn-message"
                  onClick={() => setActiveFormTab('message')}
                  className={`flex-1 text-center font-sans text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase py-3.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${activeFormTab === 'message'
                    ? 'bg-white text-gold shadow-sm'
                    : 'bg-transparent text-charcoal/60 hover:text-charcoal'
                    }`}
                >
                  General Inquiry
                </button>
              </div>

              {/* 1. BOOKING FORM VIEW */}
              {activeFormTab === 'book' && (
                <form id="booking-form" onSubmit={handleBookingSubmit} className="space-y-5 sm:space-y-8 animate-fadeIn">

                  {bookingError && (
                    <div id="booking-validation-error" className="bg-red-50 border border-red-200 p-5 rounded-xl flex items-start gap-4 text-red-800 text-sm font-sans text-left animate-bounce-slight shadow-sm">
                      <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold uppercase tracking-widest text-[10px] text-red-600 block">Booking Restriction</span>
                        <p className="font-medium leading-relaxed">{bookingError}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5 text-left group relative" ref={dropdownRef}>
                    <label className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans flex items-center gap-2">
                      <Sparkle size={12} className="text-gold" />
                      Select Desired Therapies *
                    </label>

                    {/* Custom Dropdown Trigger */}
                    <div
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans tracking-wide focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 cursor-pointer flex items-center justify-between"
                    >
                      <span className={booking.serviceIds.length === 0 ? "text-charcoal/50" : "text-charcoal"}>
                        {booking.serviceIds.length === 0
                          ? "-- Choose from our premium treatments --"
                          : `${booking.serviceIds.length} Therap${booking.serviceIds.length === 1 ? 'y' : 'ies'} Selected`}
                      </span>
                      <ChevronDown size={16} className={`text-charcoal/50 transition-transform duration-300 ${isServiceDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isServiceDropdownOpen && (
                      <div className="absolute top-[85px] left-0 w-full bg-white border border-charcoal/10 shadow-2xl rounded-xl z-50 max-h-72 overflow-y-auto animate-fadeIn">
                        {services.length === 0 ? (
                          <div className="p-4 text-center text-sm text-charcoal/50">Loading treatments...</div>
                        ) : (
                          services.map((item) => (
                            <label key={item.id} className="flex items-center gap-3 p-4 hover:bg-gold/5 cursor-pointer border-b border-charcoal/5 transition-colors">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="peer sr-only"
                                  checked={booking.serviceIds.includes(item.id) || booking.serviceIds.includes(item.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setBooking({ ...booking, serviceIds: [...booking.serviceIds, item.id] });
                                    } else {
                                      setBooking({ ...booking, serviceIds: booking.serviceIds.filter(id => id !== item.id && id !== item.name) });
                                    }
                                  }}
                                />
                                <div className="w-5 h-5 border-2 border-charcoal/20 rounded peer-checked:bg-gold peer-checked:border-gold transition-colors flex items-center justify-center">
                                  <Check size={14} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-charcoal">{item.name}</span>
                                <span className="text-xs text-charcoal/50">Rs. {item.price.toLocaleString()} ({item.duration} Mins)</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    )}

                    {/* Selected Pills */}
                    {booking.serviceIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {booking.serviceIds.map(id => {
                          const s = services.find(item => item.id === id) || services.find(item => item.name === id);
                          if (!s) return null;
                          return (
                            <div key={id} className="bg-charcoal text-ivory text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-fadeIn">
                              <span>{s.name}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBooking({ ...booking, serviceIds: booking.serviceIds.filter(sid => sid !== id && sid !== s.name) });
                                }}
                                className="w-4 h-4 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-left">
                    {/* Full Name */}
                    <div className="space-y-2.5">
                      <label htmlFor="booking-name" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Your Full Name *</label>
                      <input
                        id="booking-name"
                        type="text"
                        required
                        placeholder="Nadeesha Perera"
                        value={booking.name}
                        onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="space-y-2.5">
                      <label htmlFor="booking-phone" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Mobile Number (WhatsApp) *</label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        placeholder="+94 77 123 4567"
                        value={booking.phone}
                        onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-left">
                    {/* Email */}
                    <div className="space-y-2.5">
                      <label htmlFor="booking-email" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Email Address *</label>
                      <input
                        id="booking-email"
                        type="email"
                        required
                        placeholder="nadeesha@example.com"
                        value={booking.email}
                        onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                      {/* Booking Date */}
                      <div className="space-y-2.5">
                        <label htmlFor="booking-date" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Preferred Date *</label>
                        {/* We use our custom DatePicker but add wrapper styling if needed, assuming DatePicker uses native inputs or renders a styled button. If DatePicker has internal styles, we rely on them. */}
                        <div className="[&>div>input]:w-full [&>div>input]:bg-white [&>div>input]:text-charcoal [&>div>input]:border [&>div>input]:border-charcoal/15 [&>div>input]:py-3.5 [&>div>input]:px-4 sm:[&>div>input]:py-4 sm:[&>div>input]:px-5 [&>div>input]:rounded-xl [&>div>input]:text-sm [&>div>input]:font-sans [&>div>input]:focus:outline-none [&>div>input]:focus:border-gold [&>div>input]:focus:ring-4 [&>div>input]:focus:ring-gold/10 [&>div>input]:transition-all [&>div>input]:shadow-sm [&>div>input]:hover:border-gold/50">
                          <DatePicker
                            id="booking-date"
                            selectedDate={booking.date}
                            onChange={(date) => setBooking({ ...booking, date })}
                            required
                          />
                        </div>
                      </div>
                      {/* Booking Time */}
                      <div className="space-y-2.5">
                        <label htmlFor="booking-time" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Time Slot *</label>
                        <select
                          id="booking-time"
                          required
                          value={booking.time}
                          onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                          className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-3 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 cursor-pointer appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                          <option value="">-- Time --</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:30 PM">12:30 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:30 PM">03:30 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                          <option value="06:30 PM">06:30 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Private Ladies Suite checkbox - Enhanced Premium Styling */}
                  <label className="block group cursor-pointer text-left">
                    <div className={`p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 flex items-start gap-5 ${booking.privateSuite ? 'bg-gold/5 border-gold shadow-[0_10px_20px_-10px_rgba(212,175,55,0.2)]' : 'bg-white border-charcoal/10 hover:border-gold/30 hover:bg-gold/[0.02] shadow-sm'}`}>
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          checked={booking.privateSuite}
                          onChange={(e) => setBooking({ ...booking, privateSuite: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 rounded-md border-2 border-charcoal/20 peer-checked:border-gold peer-checked:bg-gold transition-colors flex items-center justify-center">
                          <Check size={16} className={`text-white transition-transform duration-300 ${booking.privateSuite ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-charcoal flex items-center gap-2">
                          <Sparkles size={16} className="text-gold fill-gold" />
                          Reserve The Private Ladies' Suite Upgrade
                        </span>
                        <p className="text-sm text-charcoal/60 leading-relaxed font-sans font-light">
                          Request your service to take place in our fully isolated, quiet private ladies' suite. Highly recommended for complete peace or clients wishing for privacy. No additional surcharge is applied (subject to availability).
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Special notes */}
                  <div className="space-y-2.5 text-left">
                    <label htmlFor="booking-notes" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Notes or Customisation Requests (Optional)</label>
                    <textarea
                      id="booking-notes"
                      rows={4}
                      placeholder="Please note any skin allergies, specific hair/nail requirements, or request a specific therapist..."
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30 resize-none"
                    />
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase bg-charcoal text-white py-5 px-8 rounded-xl hover:bg-gold transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-charcoal/20 hover:shadow-gold/30 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Secure Booking Request'}</span>
                      {!isSubmitting && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-charcoal/40 font-sans uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto">
                    By submitting, you agree that our coordinator will reach out to verify and lock in your timeslot.
                  </p>
                </form>
              )}

              {/* 2. INQUIRY FORM VIEW */}
              {activeFormTab === 'message' && (
                <form id="contact-form" onSubmit={handleContactSubmit} className="space-y-5 sm:space-y-8 animate-fadeIn">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-left">
                    <div className="space-y-2.5">
                      <label htmlFor="contact-name" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Dilini Silva"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label htmlFor="contact-phone" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Contact Phone *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        placeholder="+94 71 555 5555"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 text-left">
                    <div className="space-y-2.5">
                      <label htmlFor="contact-email" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="dilini@example.com"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <label htmlFor="contact-subject" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Subject of Inquiry *</label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        placeholder="Bridal Consultation / Custom Package inquiry..."
                        value={contact.subject}
                        onChange={(e) => setContact({ ...contact, subject: e.target.value })}
                        className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 text-left">
                    <label htmlFor="contact-message" className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-charcoal/70 font-bold font-sans pl-1">Message Body *</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Write your message here..."
                      value={contact.message}
                      onChange={(e) => setContact({ ...contact, message: e.target.value })}
                      className="w-full bg-white text-charcoal border border-charcoal/15 py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl text-sm font-sans focus:outline-hidden focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all shadow-sm hover:border-gold/50 placeholder:text-charcoal/30 resize-none"
                    />
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase bg-charcoal text-white py-5 px-8 rounded-xl hover:bg-gold transition-all duration-500 cursor-pointer shadow-xl shadow-charcoal/20 hover:shadow-gold/30 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Transmit Message'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>
      </section>

      {/* 3. FAQ ACCORDION SECTION */}
      <section
        id="faq-accordion-section"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 border-t border-charcoal/5"
      >
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-gold justify-center bg-gold/5 px-4 py-1.5 rounded-full">
            <HelpCircle size={14} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Inquiries Resolved</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[2px] bg-gold/30 mx-auto my-6" />
          <p className="font-sans text-sm sm:text-base text-charcoal/70 font-light">
            Everything you need to know about preparing for your ritual.
          </p>
        </div>

        {/* Dynamic Accordion Component */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-500 border ${isOpen ? 'border-gold/30 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.15)]' : 'border-charcoal/5 shadow-sm hover:border-gold/20 hover:shadow-md'}`}
              >
                {/* Accordion Trigger Header */}
                <button
                  id={`faq-trigger-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-6 px-6 sm:px-8 flex items-center justify-between gap-4 focus:outline-hidden group cursor-pointer"
                >
                  <span className={`font-serif text-base sm:text-lg transition-colors font-medium ${isOpen ? 'text-gold' : 'text-charcoal group-hover:text-gold'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${isOpen ? 'bg-gold text-white rotate-180' : 'bg-charcoal/5 text-charcoal/50 group-hover:bg-gold/10 group-hover:text-gold'}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 px-6 sm:px-8 pt-2 border-t border-charcoal/5 text-left">
                      <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-[1.8] font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLOSING CTA BLOCK */}
      <section
        id="contact-closing-cta"
        className="max-w-4xl mx-auto px-4 sm:px-6 text-center pb-20 sm:pb-32"
      >
        <div className="relative bg-charcoal text-white p-12 sm:p-20 rounded-3xl space-y-8 shadow-2xl overflow-hidden group">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold/20 rounded-full blur-[80px] group-hover:bg-gold/30 transition-colors duration-700" />

          <div className="space-y-6 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Ready to Experience The Loft?
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/80 font-light max-w-md mx-auto">
                          Follow us online or visit us directly to see our services for yourself.

            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <button
              id="btn-book-walkin"
              onClick={scrollToBooking}
              className="w-full sm:w-auto font-sans text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase bg-gold text-charcoal py-4 px-10 rounded-full hover:bg-white hover:text-charcoal transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105"
            >
              Book or Walk In
            </button>
            <div className="flex w-full sm:w-auto gap-4">
              <a
                id="instagram-social-btn"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-sans text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-white/30 text-white py-4 px-6 sm:px-10 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 cursor-pointer"
              >
                <span>Instagram</span>
              </a>
              <a
                id="facebook-social-btn"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 font-sans text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-white/30 text-white py-4 px-6 sm:px-10 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 cursor-pointer"
              >
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Social Media Prompt */}
          <div className="relative z-10 pt-4">
            <p className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-sans font-semibold">
              Follow us for a closer look • @theloftby.nm
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
