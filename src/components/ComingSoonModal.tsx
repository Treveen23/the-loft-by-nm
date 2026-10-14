import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkle,
    X,
    ArrowRight
} from 'lucide-react';
import colonialHouseImage from '../assets/images/Colonial House Nail Salon Entrance.webp';

interface ComingSoonModalProps {
    onNavigate: (page: string) => void;
}

export default function ComingSoonModal({ onNavigate }: ComingSoonModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Open on first visit with smooth entrance
    useEffect(() => {
        const hasSeen = sessionStorage.getItem('theloft_coming_soon_seen');

        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 700);

            return () => clearTimeout(timer);
        } else {
            setIsMinimized(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(true);
        sessionStorage.setItem('theloft_coming_soon_seen', 'true');
    };

    const handleOpenFromPill = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    return (
        <>
            {/* 1. MINIMIZED FLOATING PILL */}
            <AnimatePresence>
                {isMinimized && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 max-w-[calc(100vw-5.5rem)] sm:max-w-none"
                    >
                        <button
                            onClick={handleOpenFromPill}
                            className="flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-5 sm:py-3 bg-charcoal/95 hover:bg-charcoal text-ivory border border-gold/40 hover:border-gold rounded-full shadow-2xl backdrop-blur-md transition-all group cursor-pointer"
                            aria-label="Open Coming Soon Announcement"
                        >
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                            </span>

                            {/* Opening Soon */}
                            <motion.span
                                animate={{
                                    opacity: [0.7, 1, 0.7],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="text-xs sm:text-base font-serif italic text-gold font-normal whitespace-nowrap"
                            >
                                Opening Soon
                            </motion.span>

                            <span className="hidden sm:inline w-[1px] h-4 bg-white/20" />

                            <span className="hidden sm:inline text-[11px] font-sans font-semibold uppercase tracking-wider text-ivory/90 group-hover:text-gold transition-colors whitespace-nowrap">
                                Discover The Loft
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. FULL INTERACTIVE MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">

                        {/* Dark luxury backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Responsive Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 15 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="relative w-full max-w-lg lg:max-w-3xl bg-charcoal text-ivory rounded-2xl sm:rounded-[2.2rem] border border-gold/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-10 my-auto"
                        >

                            {/* Background ambient lighting */}
                            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-[90px] pointer-events-none" />

                            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-charcoal/70 sm:bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-ivory/70 hover:text-ivory transition-colors cursor-pointer shadow-md"
                                aria-label="Close Announcement"
                            >
                                <X size={16} />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-12">

                                {/* MOBILE TOP VISUAL STRIP */}
                                <div className="relative block lg:hidden h-32 sm:h-44 w-full overflow-hidden bg-charcoal/50 border-b border-gold/15">
                                    <img
                                        src={colonialHouseImage}
                                        alt="The Loft by NM Colonial House Entrance"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover object-center opacity-75"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                                </div>

                                {/* DESKTOP LEFT SIDE: TEASER VISUAL */}
                                <div className="lg:col-span-5 relative hidden lg:block overflow-hidden bg-charcoal/50 border-r border-gold/15">

                                    <img
                                        src={colonialHouseImage}
                                        alt="The Loft by NM Colonial House Entrance"
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full min-h-[390px] object-cover object-center transform hover:scale-105 transition-transform duration-1000 opacity-80"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                                </div>

                                {/* CONTENT SECTION */}
                                <div className="lg:col-span-7 px-5 py-6 sm:px-9 sm:py-9 flex flex-col justify-center text-left">

                                    <div>

                                        {/* Brand Badge - STATIC with right padding to clear close button */}
                                        <div className="flex items-center gap-4 mb-4 sm:mb-5 pr-10 sm:pr-0">

                                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em]">

                                                <Sparkle
                                                    size={11}
                                                    className="fill-gold shrink-0"
                                                />

                                                <span className="truncate">
                                                    Grand Launch Approaching
                                                </span>

                                            </div>

                                        </div>

                                        {/* COMING SOON - RESPONSIVE SCALING */}
                                        <motion.div
                                            animate={{
                                                opacity: [0.8, 1, 0.8],
                                                y: [0, -3, 0]
                                            }}
                                            transition={{
                                                duration: 2.8,
                                                repeat: Infinity,
                                                ease: 'easeInOut'
                                            }}
                                            className="mb-2 sm:mb-3"
                                        >
                                            <span className="block font-serif italic text-gold text-4xl sm:text-5xl lg:text-6xl tracking-tight sm:tracking-wide leading-[1.05]">
                                                Coming Soon
                                            </span>
                                        </motion.div>

                                        {/* Description */}
                                        <p className="font-sans text-xs sm:text-sm md:text-base text-ivory/70 leading-relaxed font-light mb-5 sm:mb-7 max-w-md">
                                            We are putting the final touches on our space. The Loft by NM will be opening its doors very soon.
                                        </p>

                                    </div>

                                    {/* FOOTER / JOIN US CTA */}
                                    <div className="pt-4 sm:pt-5 border-t border-white/10 flex items-center justify-start w-full">

                                        {/* Hiring Artists CTA - Fluid & Mobile Responsive */}
                                        <button
                                            onClick={() => {
                                                handleClose();
                                                onNavigate('join-us');
                                            }}
                                            className="group relative flex items-center justify-between sm:justify-center gap-3 sm:gap-4 px-5 sm:px-8 py-3 rounded-full border border-gold/40 bg-gold/10 hover:bg-gold/20 hover:border-gold/70 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.08)] w-full sm:w-auto"
                                        >

                                            {/* Centered Text */}
                                            <div className="text-left sm:text-center">

                                                <span className="block text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.2em] font-semibold mb-0.5">
                                                    We’re Hiring
                                                </span>

                                                <span className="block text-xs sm:text-sm text-ivory group-hover:text-gold transition-colors font-medium tracking-wide">
                                                    Join Our Team
                                                </span>

                                            </div>

                                            {/* Arrow */}
                                            <ArrowRight
                                                size={16}
                                                className="text-gold group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                                            />

                                        </button>

                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}