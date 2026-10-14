import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Sparkle,
  Sparkles,
  Award,
  Heart,
  ShieldCheck,
  Gem,
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Send,
  Upload,
  ExternalLink,
  Users,
  Compass,
  Star,
  Check,
  FileText,
  UploadCloud,
  Mail,
  Copy,
  Paperclip,
  X
} from 'lucide-react';
import { DEFAULT_CAREER_POSITIONS, IMAGES } from '../data';
import { CareerPosition, CareerApplicationForm } from '../types';
import { fetchCareerPositions, createCareerApplication, uploadCV } from '../api';

interface CareersViewProps {
  setCurrentPage?: (page: string) => void;
  onBookClick?: () => void;
}

export default function CareersView({ setCurrentPage, onBookClick }: CareersViewProps) {
  const [positions, setPositions] = useState<CareerPosition[]>(DEFAULT_CAREER_POSITIONS);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [expandedPositionId, setExpandedPositionId] = useState<string | null>(DEFAULT_CAREER_POSITIONS[0]?.id || null);

    // ================= APPLICATION FORM STATE =================
    // ============================================================
    // APPLICATION FORM STATE
    // ============================================================

    const [form, setForm] = useState<CareerApplicationForm>({
        fullName: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        positionId:
            DEFAULT_CAREER_POSITIONS[0]?.id || 'pos-nail-tech',
        positionTitle:
            DEFAULT_CAREER_POSITIONS[0]?.title || 'Nail Technician'
    });

    const [selectedCvFile, setSelectedCvFile] =
        useState<File | null>(null);

    const [isDragging, setIsDragging] =
        useState(false);

    const [uploadedCvUrl, setUploadedCvUrl] =
        useState<string | null>(null);

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [isSubmitted, setIsSubmitted] =
        useState(false);

    // Form reference for smooth scrolling
    // when "Apply" is clicked
    const formSectionRef =
        useRef<HTMLDivElement>(null);


    // ============================================================
    // LOAD CAREER POSITIONS
    // ============================================================

    useEffect(() => {
        async function loadPositions() {
            try {
                const remotePositions =
                    await fetchCareerPositions();

                if (
                    remotePositions &&
                    remotePositions.length > 0
                ) {
                    setPositions(remotePositions);
                }
            } catch (err) {
                console.warn(
                    'Using default career positions:',
                    err
                );
            }
        }

        loadPositions();
    }, []);


    // ============================================================
    // DEPARTMENTS
    // ============================================================

    const departments = [
        'All',
        'Nails',
        'Hair',
        'Skincare',
        'Wellness'
    ];

    const filteredPositions =
        selectedDepartment === 'All'
            ? positions
            : positions.filter(
                (pos) =>
                    pos.department === selectedDepartment
            );


    // ============================================================
    // SELECT ROLE TO APPLY
    // ============================================================

    const handleSelectRoleToApply = (
        position: CareerPosition
    ) => {
        setForm((prev) => ({
            ...prev,
            positionId: position.id,
            positionTitle: position.title
        }));

        if (formSectionRef.current) {
            formSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };


    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        // Position dropdown
        if (name === 'positionId') {
            const matched =
                positions.find(
                    (p) => p.id === value
                );

            setForm((prev) => ({
                ...prev,
                positionId: value,
                positionTitle: matched
                    ? matched.title
                    : 'Open Application'
            }));

            return;
        }

        // Other fields
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // ============================================================
    // CV FILE SELECT
    // ============================================================

    const handleFileSelect = (file: File) => {

        // Maximum 10MB
        if (
            file.size >
            10 * 1024 * 1024
        ) {
            toast.error(
                'File size exceeds 10MB limit. Please upload a smaller document.'
            );
            return;
        }

        // Allowed file types
        const ext =
            file.name
                .split('.')
                .pop()
                ?.toLowerCase();

        if (
            !ext ||
            !['pdf', 'doc', 'docx'].includes(ext)
        ) {
            toast.error(
                'Please upload a PDF or Word document (.pdf, .doc, .docx).'
            );
            return;
        }

        setSelectedCvFile(file);

        toast.success(
            `Attached CV: ${file.name}`
        );
    };


    // ============================================================
    // EMAIL SUBJECT
    // ============================================================

    const generateEmailSubject = () => {
        return encodeURIComponent(
            `Career Application: ${form.positionTitle} - ${form.fullName}`
        );
    };


    // ============================================================
    // EMAIL BODY
    // ============================================================

    const generateEmailBodyText = (
        cvDirectUrl?: string | null
    ) => {

        const lines = [
            'Dear Hiring Team at The Loft by NM,',
            '',

            `I would like to apply for the open position of: ${form.positionTitle}`,
            '',

            '================ CANDIDATE DETAILS ================',

            `• Full Name: ${form.fullName}`,
            `• Age: ${form.age}`,
            `• Gender: ${form.gender}`,
            `• Phone Number: ${form.phone}`,
            `• Email Address: ${form.email || 'Not specified'
            }`,

            '',

            '================ CURRICULUM VITAE (CV) ================',

            cvDirectUrl
                ? `• Direct CV Download Link: ${cvDirectUrl}`
                : selectedCvFile
                    ? `• Attached Document: ${selectedCvFile.name} (Uploaded with application)`
                    : '• CV available upon request.',

            '',

            'Thank you for your time and consideration.',

            'Warm regards,',

            form.fullName
        ];

        return lines.join('\n');
    };


    // ============================================================
    // OPEN EMAIL CLIENT
    // ============================================================

    const handleOpenEmailClient = (
        cvDirectUrl?: string | null
    ) => {

        const subject =
            generateEmailSubject();

        const body =
            encodeURIComponent(
                generateEmailBodyText(
                    cvDirectUrl || uploadedCvUrl
                )
            );

        const mailtoUrl =
            `mailto:hello@theloftbynm.com?subject=${subject}&body=${body}`;

        window.location.href = mailtoUrl;
    };


    // ============================================================
    // COPY EMAIL TEXT
    // ============================================================

    const handleCopyEmailText = (
        cvDirectUrl?: string | null
    ) => {

        const text =
            generateEmailBodyText(
                cvDirectUrl || uploadedCvUrl
            );

        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success(
                    'Application email copied to clipboard! You can paste it into Gmail or Outlook.'
                );
            })
            .catch(() => {
                toast.error(
                    'Unable to copy email text. Please try again.'
                );
            });
    };


    // ============================================================
    // SUBMIT APPLICATION
    // ============================================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        // ----------------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------------

        if (
            !form.fullName.trim() ||
            !form.age.trim() ||
            !form.gender ||
            !form.phone.trim()
        ) {
            toast.error(
                'Please fill in your name, age, gender, and phone number.'
            );
            return;
        }

        // Validate age
        const ageNumber =
            Number(form.age);

        if (
            Number.isNaN(ageNumber) ||
            ageNumber < 16 ||
            ageNumber > 100
        ) {
            toast.error(
                'Please enter a valid age between 16 and 100.'
            );
            return;
        }

        setIsSubmitting(true);

        let finalCvUrl:
            string | null = null;

        try {

            // ========================================================
            // 1. UPLOAD CV
            // ========================================================

            if (selectedCvFile) {

                toast.info(
                    'Uploading your CV document securely...'
                );

                finalCvUrl =
                    await uploadCV(
                        selectedCvFile
                    );

                if (finalCvUrl) {
                    setUploadedCvUrl(
                        finalCvUrl
                    );
                }
            }


            // ========================================================
            // 2. SAVE APPLICATION TO SUPABASE
            // ========================================================

            await createCareerApplication({

                full_name:
                    form.fullName,

                age:
                    ageNumber,

                gender:
                    form.gender,

                email:
                    form.email,

                phone:
                    form.phone,

                position_id:
                    form.positionId,

                position_title:
                    form.positionTitle,

                cv_url:
                    finalCvUrl,

                created_at:
                    new Date().toISOString()
            });


            // ========================================================
            // 3. MARK AS SUBMITTED
            // ========================================================

            setIsSubmitted(true);

            toast.success(
                'Application saved! Opening your email client...'
            );


            // ========================================================
            // 4. OPEN EMAIL CLIENT
            // ========================================================

            setTimeout(() => {
                handleOpenEmailClient(
                    finalCvUrl
                );
            }, 400);

        } catch (error) {

            console.error(
                'Application submission error:',
                error
            );

            toast.error(
                'Something went wrong while submitting your application. Please try again.'
            );

        } finally {

            setIsSubmitting(false);

        }
    };


    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div
            id="career-page-container"
            className="bg-ivory min-h-screen text-charcoal font-sans overflow-hidden"
        >

            {/* ======================================================
        1. HERO SECTION
        ====================================================== */}

            <section
                id="career-hero"
                className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden border-b border-gold/15"
            >

                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-3/4 h-full bg-gold/5 blur-3xl rounded-bl-full -z-10 pointer-events-none" />

                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-sage/10 blur-3xl rounded-tr-full -z-10 pointer-events-none" />


                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                        {/* ==================================================
              LEFT COLUMN
              ================================================== */}

                        <div className="lg:col-span-7 text-left flex flex-col items-start">

                            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.1] mb-6">

                              Passion, Respect &amp;

                                <br />

                                <span className="relative inline-block mt-2">

                                    <span className="relative z-10 italic font-light text-charcoal/90">
                                        Career Growth
                                    </span>

                                    <span className="absolute bottom-2 left-0 w-full h-3 sm:h-4 bg-gold/20 -z-10 -rotate-1 rounded" />

                                </span>

                            </h1>


                            {/* Decorative Divider */}
                            <div className="flex items-center gap-4 mb-6">

                                <div className="w-16 h-[1px] bg-gradient-to-r from-gold to-transparent" />

                                <Gem
                                    size={15}
                                    className="text-gold"
                                />

                                <div className="w-16 h-[1px] bg-gradient-to-l from-gold to-transparent" />

                            </div>


                            {/* Description */}
                            <p className="font-sans text-base sm:text-lg text-charcoal/80 leading-relaxed font-light max-w-xl mb-8">

                                At{' '}

                                <strong className="font-medium text-charcoal">
                                    The Loft by NM
                                </strong>

                                , we are creating a peaceful and welcoming beauty salon in Colombo. We believe in quality work, taking our time, caring for our clients, and treating every team member with respect. We want our artists to enjoy their work and build a successful and fulfilling career with us.

                            </p>


                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4">

                                {/* Explore Positions */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const el =
                                            document.getElementById(
                                                'open-positions'
                                            );

                                        el?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                    }}
                                    className="px-8 py-3.5 bg-charcoal text-ivory hover:bg-gold hover:text-charcoal font-sans text-xs tracking-[0.2em] uppercase font-semibold rounded-full shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                                >

                                    <span>
                                        Explore Open Positions
                                    </span>

                                    <ArrowRight
                                        size={14}
                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                    />

                                </button>


                                {/* Direct Application */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        formSectionRef.current?.scrollIntoView({
                                            behavior: 'smooth'
                                        });
                                    }}
                                    className="px-8 py-3.5 bg-white/80 hover:bg-white text-charcoal border border-gold/40 hover:border-gold font-sans text-xs tracking-[0.2em] uppercase font-semibold rounded-full shadow-sm transition-all duration-300 cursor-pointer"
                                >

                                    <span>
                                        Direct Application
                                    </span>

                                </button>

                            </div>

                        </div>


                        {/* ==================================================
              RIGHT COLUMN
              ================================================== */}

                        <div className="lg:col-span-5 relative">

                            <div className="relative mx-auto max-w-md lg:max-w-none">

                                {/* Decorative Gold Border */}
                                <div className="absolute inset-0 border border-gold/40 translate-x-4 translate-y-4 rounded-2xl -z-10 transition-transform duration-500" />


                                {/* Image */}
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-charcoal/10 border border-white/60">

                                    <img
                                        src="https://i.pinimg.com/736x/9a/f2/64/9af264632234e04e96d19fd26a17ebf9.jpg"
                                        alt="The Loft by NM Salon Sanctuary"
                                        loading="eager"
                                        decoding="async"
                                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-60" />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>



            {/* 3. OPEN POSITIONS DIRECTORY */}
            <section id="open-positions" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase block mb-3">
                                Now Welcoming Talent
                            </span>

                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight">
                                Current Open Positions
                            </h2>

                            <div className="w-12 h-0.5 bg-gold mt-4" />
                        </div>

                        {/* Department Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-2 bg-charcoal/5 p-1.5 rounded-full border border-charcoal/10">
                            {departments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDepartment(dept)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${selectedDepartment === dept
                                            ? 'bg-charcoal text-ivory shadow-sm'
                                            : 'text-charcoal/70 hover:text-charcoal hover:bg-white/60'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Positions Grid / Cards */}
                    <div className="space-y-6">
                        {filteredPositions.map((pos) => (
                            <div
                                key={pos.id}
                                className="rounded-2xl border border-gold/20 hover:border-gold/40 transition-all duration-300 overflow-hidden bg-white/90 shadow-sm"
                            >
                                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

                                    {/* Position Information */}
                                    <div className="space-y-3 flex-1 text-left">

                                        {/* Department */}
                                        <span className="inline-block px-3 py-1 bg-gold/15 text-gold border border-gold/30 rounded-full text-xs font-semibold tracking-widest uppercase">
                                            {pos.department}
                                        </span>

                                        {/* Role Name */}
                                        <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                                            {pos.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm sm:text-base text-charcoal/80 font-normal leading-relaxed max-w-3xl">
                                            {pos.summary}
                                        </p>
                                    </div>

                                    {/* Apply Button */}
                                    <div className="flex items-center self-start md:self-center">
                                        <button
                                            onClick={() => handleSelectRoleToApply(pos)}
                                            className="px-6 py-3 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold tracking-widest uppercase rounded-full shadow-md transition-all duration-300 cursor-pointer flex items-center gap-2"
                                        >
                                            <span>Apply Now</span>
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

      


          {/* 5. INTERACTIVE APPLICATION PORTAL */}
          <section
              ref={formSectionRef}
              id="application-form"
              className="py-20 bg-ivory relative"
          >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                  {/* Section Header */}
                  <div className="text-center max-w-2xl mx-auto mb-12">

                      <div className="inline-flex items-center gap-2 px-4 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs tracking-widest uppercase font-semibold mb-3">
                          <Sparkle size={12} className="fill-gold" />
                          <span>Direct Application</span>
                          <Sparkle size={12} className="fill-gold" />
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl text-charcoal tracking-tight mb-4">
                          Begin Your Journey with Us
                      </h2>

                      <div className="w-12 h-0.5 bg-gold mx-auto mb-4" />

                      <p className="text-sm text-charcoal/70 font-light">
                          Submit your application directly to our talent system. Please provide
                          your details and attach your CV to apply for your preferred position.
                      </p>

                  </div>

                  {/* Application Card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gold/30 shadow-xl p-8 sm:p-12 text-left relative overflow-hidden">

                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-bl-full pointer-events-none -z-0" />

                      {/* ================= SUCCESS MESSAGE ================= */}
                      {isSubmitted ? (

                          <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="py-12 text-center max-w-lg mx-auto"
                          >

                              {/* Success Icon */}
                              <div className="w-16 h-16 rounded-full bg-gold/15 text-gold border border-gold/40 flex items-center justify-center mx-auto mb-6">
                                  <CheckCircle2 size={36} />
                              </div>

                              {/* Success Title */}
                              <h3 className="font-serif text-3xl text-charcoal mb-3">
                                  Application Ready to Send
                              </h3>

                              {/* Success Description */}
                              <p className="text-sm text-charcoal/70 mb-4 leading-relaxed">
                                  Thank you,{" "}
                                  <strong className="text-charcoal font-semibold">
                                      {form.fullName}
                                  </strong>
                                  . Your application for{" "}
                                  <strong className="text-gold font-semibold">
                                      {form.positionTitle}
                                  </strong>{" "}
                                  has been prepared successfully.
                              </p>

                              {/* Email Information */}
                              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-left mb-6 space-y-2">

                                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal">
                                      <Mail size={15} className="text-gold" />

                                      <span>
                                          Direct Email to: hello@theloftbynm.com
                                      </span>
                                  </div>

                                  <p className="text-xs text-charcoal/70 leading-relaxed">
                                      We've opened your mail client with your application details
                                      and CV link ready. If your email client didn't open
                                      automatically, use the buttons below.
                                  </p>

                                  {/* CV Preview */}
                                  {uploadedCvUrl && (
                                      <div className="pt-1">

                                          <a
                                              href={uploadedCvUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-xs text-gold hover:underline flex items-center gap-1 font-medium"
                                          >
                                              <FileText size={12} />

                                              <span>
                                                  Preview Uploaded CV
                                              </span>

                                              <ExternalLink size={10} />
                                          </a>

                                      </div>
                                  )}

                              </div>

                              {/* Email Buttons */}
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">

                                  {/* Send Email */}
                                  <button
                                      type="button"
                                      onClick={() => handleOpenEmailClient()}
                                      className="w-full sm:w-auto px-6 py-3.5 bg-charcoal hover:bg-gold hover:text-charcoal text-ivory font-sans text-xs tracking-wider uppercase font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                      <Mail size={15} />

                                      <span>
                                          Send Email
                                      </span>
                                  </button>

                                  {/* Copy Email */}
                                  <button
                                      type="button"
                                      onClick={() => handleCopyEmailText()}
                                      className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-charcoal/5 text-charcoal border border-charcoal/20 font-sans text-xs tracking-wider uppercase font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  >
                                      <Copy size={14} />

                                      <span>
                                          Copy Email Text
                                      </span>
                                  </button>

                              </div>

                              {/* Submit Another Application */}
                              <div className="flex justify-center">

                                  <button
                                      type="button"
                                      onClick={() => {
                                          setIsSubmitted(false);
                                          setSelectedCvFile(null);
                                          setUploadedCvUrl(null);

                                          setForm({
                                              fullName: "",
                                              age: "",
                                              gender: "",
                                              email: "",
                                              phone: "",
                                              positionId:
                                                  positions[0]?.id || "pos-nail-tech",
                                              positionTitle:
                                                  positions[0]?.title || "Nail Technician"
                                          });
                                      }}
                                      className="w-full sm:w-auto px-6 py-3 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal font-sans text-xs tracking-wider uppercase font-semibold rounded-full transition-all cursor-pointer"
                                  >
                                      Submit Another Profile
                                  </button>

                              </div>

                          </motion.div>

                      ) : (

                          /* ================= APPLICATION FORM ================= */
                          <form
                              onSubmit={handleSubmit}
                              className="space-y-6 relative z-10"
                          >

                              {/* ================= POSITION ================= */}
                              <div>

                                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                      Applied Position{" "}
                                      <span className="text-gold">*</span>
                                  </label>

                                  <select
                                      name="positionId"
                                      value={form.positionId}
                                      onChange={handleInputChange}
                                      required
                                      className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all cursor-pointer"
                                  >

                                      {positions.map((p) => (
                                          <option
                                              key={p.id}
                                              value={p.id}
                                          >
                                              {p.title} ({p.department}) — {p.type}
                                          </option>
                                      ))}

                                      <option value="other-talent">
                                          Other Artistry / General Open Application
                                      </option>

                                  </select>

                              </div>


                              {/* ================= PERSONAL DETAILS ================= */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                  {/* Full Name */}
                                  <div>

                                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                          Full Name{" "}
                                          <span className="text-gold">*</span>
                                      </label>

                                      <input
                                          type="text"
                                          name="fullName"
                                          required
                                          placeholder="e.g. Ruwani Perera"
                                          value={form.fullName}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                      />

                                  </div>


                                  {/* Age */}
                                  <div>

                                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                          Age{" "}
                                          <span className="text-gold">*</span>
                                      </label>

                                      <input
                                          type="number"
                                          name="age"
                                          required
                                          min="16"
                                          max="100"
                                          placeholder="e.g. 24"
                                          value={form.age}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                      />

                                  </div>

                              </div>


                              {/* ================= GENDER & PHONE ================= */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                  {/* Gender */}
                                  <div>

                                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                          Gender{" "}
                                          <span className="text-gold">*</span>
                                      </label>

                                      <select
                                          name="gender"
                                          required
                                          value={form.gender}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all cursor-pointer"
                                      >

                                          <option value="">
                                              Select Gender
                                          </option>

                                          <option value="Female">
                                              Female
                                          </option>

                                          <option value="Male">
                                              Male
                                          </option>

                                          <option value="Other">
                                              Other
                                          </option>

                                          <option value="Prefer not to say">
                                              Prefer not to say
                                          </option>

                                      </select>

                                  </div>


                                  {/* Phone */}
                                  <div>

                                      <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                          Phone Number{" "}
                                          <span className="text-gold">*</span>
                                      </label>

                                      <input
                                          type="tel"
                                          name="phone"
                                          required
                                          placeholder="+94 77 XXXXXXX"
                                          value={form.phone}
                                          onChange={handleInputChange}
                                          className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                      />

                                  </div>

                              </div>


                              {/* ================= EMAIL ================= */}
                              <div>

                                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2">
                                      Email Address{" "}
                                      <span className="text-charcoal/50 font-normal normal-case">
                                          (Optional)
                                      </span>
                                  </label>

                                  <input
                                      type="email"
                                      name="email"
                                      placeholder="ruwani@example.com"
                                      value={form.email}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-3.5 rounded-xl border border-charcoal/20 bg-ivory/50 text-charcoal font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                  />

                              </div>


                              {/* ================= CV UPLOAD ================= */}
                              <div>

                                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-widest mb-2 flex items-center justify-between">

                                      <span>
                                          Curriculum Vitae (CV) / Resume{" "}
                                          <span className="text-charcoal/50 font-normal lowercase">
                                              (PDF, DOC, DOCX • max 10MB)
                                          </span>
                                      </span>

                                      {selectedCvFile && (
                                          <span className="text-emerald-700 text-xs font-medium flex items-center gap-1">
                                              <CheckCircle2 size={13} />
                                              Document Attached
                                          </span>
                                      )}

                                  </label>


                                  {/* Upload Box */}
                                  <div
                                      onClick={() =>
                                          fileInputRef.current?.click()
                                      }

                                      onDragOver={(e) => {
                                          e.preventDefault();
                                          setIsDragging(true);
                                      }}

                                      onDragLeave={() =>
                                          setIsDragging(false)
                                      }

                                      onDrop={(e) => {
                                          e.preventDefault();
                                          setIsDragging(false);

                                          if (
                                              e.dataTransfer.files &&
                                              e.dataTransfer.files[0]
                                          ) {
                                              handleFileSelect(
                                                  e.dataTransfer.files[0]
                                              );
                                          }
                                      }}

                                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${selectedCvFile
                                              ? "border-gold bg-gold/10"
                                              : isDragging
                                                  ? "border-gold bg-gold/15"
                                                  : "border-charcoal/20 bg-ivory/40 hover:border-gold/60 hover:bg-white/60"
                                          }`}
                                  >

                                      {/* Hidden File Input */}
                                      <input
                                          ref={fileInputRef}
                                          type="file"
                                          accept=".pdf,.doc,.docx"
                                          className="hidden"
                                          onChange={(e) => {

                                              if (
                                                  e.target.files &&
                                                  e.target.files[0]
                                              ) {
                                                  handleFileSelect(
                                                      e.target.files[0]
                                                  );
                                              }

                                          }}
                                      />


                                      {/* Selected File */}
                                      {selectedCvFile ? (

                                          <div className="flex items-center justify-between gap-4">

                                              <div className="flex items-center gap-3 text-left">

                                                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                                                      <FileText size={20} />
                                                  </div>

                                                  <div>

                                                      <p className="text-xs sm:text-sm font-semibold text-charcoal truncate max-w-[200px] sm:max-w-md">
                                                          {selectedCvFile.name}
                                                      </p>

                                                      <p className="text-[11px] text-charcoal/60">
                                                          {(
                                                              selectedCvFile.size /
                                                              (1024 * 1024)
                                                          ).toFixed(2)}{" "}
                                                          MB • Ready to email
                                                      </p>

                                                  </div>

                                              </div>


                                              {/* Remove File */}
                                              <button
                                                  type="button"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      setSelectedCvFile(null);
                                                  }}
                                                  className="p-1.5 rounded-full hover:bg-charcoal/10 text-charcoal/60 hover:text-charcoal"
                                                  title="Remove file"
                                              >
                                                  <X size={16} />
                                              </button>

                                          </div>

                                      ) : (

                                          /* Empty Upload State */
                                          <div className="space-y-1.5">

                                              <div className="w-10 h-10 rounded-xl bg-charcoal/5 text-charcoal/60 mx-auto flex items-center justify-center">
                                                  <UploadCloud
                                                      size={22}
                                                      className="text-gold"
                                                  />
                                              </div>

                                              <p className="text-xs sm:text-sm font-medium text-charcoal">
                                                  Click to upload or drag & drop your CV here
                                              </p>

                                              <p className="text-[11px] text-charcoal/50">
                                                  Your CV will be included with your application
                                                  email to{" "}
                                                  <strong>
                                                      hello@theloftbynm.com
                                                  </strong>
                                              </p>

                                          </div>

                                      )}

                                  </div>

                              </div>


                              {/* ================= SUBMIT BUTTON ================= */}
                              <div className="pt-4">

                                  <button
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="w-full py-4 bg-charcoal text-ivory hover:bg-gold hover:text-charcoal font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-full shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                  >

                                      {isSubmitting ? (

                                          <span>
                                              Submitting Profile...
                                          </span>

                                      ) : (

                                          <>
                                              <Send size={15} />

                                              <span>
                                                  Submit Application
                                              </span>
                                          </>

                                      )}

                                  </button>

                              </div>


                              {/* Privacy Message */}
                              <p className="text-center text-[11px] text-charcoal/60 pt-2">
                                  🔒 We guarantee strict privacy and discretion regarding
                                  all applications. Current employers will never be contacted
                                  without your prior consent.
                              </p>

                          </form>

                      )}

                  </div>
              </div>
          </section>

   

    </div>
  );
}
