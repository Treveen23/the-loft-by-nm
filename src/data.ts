import { ServiceCategory, MenuItem, GalleryItem, Testimonial, CareerPosition } from './types';
import heroImg from './assets/images/hero_salon_loft_1782535958615.webp';
import hairImg from './assets/images/service_hair_1782535974284.webp';
import privateSuiteImg from './assets/images/private_suite_1782535989218.webp';
import facialImg from './assets/images/service_facial_1782536004491.webp';

// Custom-generated assets with exact paths
export const IMAGES = {
  hero: heroImg,
  hair: hairImg,
  privateSuite: privateSuiteImg,
  facial: facialImg,
  
  // Premium curated stock photography optimized for fast WebP loading
  nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=75&w=800&auto=format&fit=crop&fm=webp',
  bridal: 'https://images.unsplash.com/photo-1591555200813-b5e298ee4df4?q=75&w=800&auto=format&fit=crop&fm=webp',
  makeup: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=75&w=800&auto=format&fit=crop&fm=webp',
  pedicure: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=75&w=800&auto=format&fit=crop&fm=webp',
  salonVibe1: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=75&w=800&auto=format&fit=crop&fm=webp',
  salonVibe2: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=75&w=800&auto=format&fit=crop&fm=webp',
  founder: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=75&w=800&auto=format&fit=crop&fm=webp'
};

export const SERVICES_CATEGORIES: ServiceCategory[] = [
  {
    id: 'hair',
    name: 'Couture Hair Care',
    description: 'Bespoke precision cuts, Parisian balayage, signature blowouts, and advanced therapeutic restructuring treatments customized for your unique hair profile.',
    image: IMAGES.hair
  },
  {
    id: 'facial',
    name: 'Skincare & Facials',
    description: 'High-performance botanical treatments, deep hydration therapies, and gold-infused cellular renewal facials that leave your skin with a luminous, youthful glow.',
    image: IMAGES.facial
  },
  {
    id: 'nails',
    name: 'Artisanal Nail Spa',
    description: 'Exclusive manicures, gel extensions, and bespoke nail artistry crafted with premium, toxin-free polishes and restorative hand massages.',
    image: IMAGES.nails
  },
  {
    id: 'bridal',
    name: 'Bridal & Occasions',
    description: 'Meticulous luxury styling, high-definition airbrush makeup, and traditional Sri Lankan / Western bridal transformations orchestrated by senior masters.',
    image: IMAGES.bridal
  },
  {
    id: 'exclusive',
    name: 'Private Ladies\' Suite',
    description: 'A completely sequestered, tranquil inner sanctum. Experience our full catalog of services in absolute privacy, accompanied by premium tea, curated music, and high-touch service.',
    image: IMAGES.privateSuite
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Hair Services
  {
    id: 'h1',
    name: 'The Loft Signature Cut & Blowout',
    category: 'hair',
    price: 8500,
    duration: '75 Mins',
    description: 'Personalized consultation, luxury hair bath, scalp massage, precision cut, and signature bounce blowout.',
    popular: true
  },
  {
    id: 'h2',
    name: 'Parisian Balayage & Olaplex',
    category: 'hair',
    price: 24500,
    duration: '180 Mins',
    description: 'Bespoke hand-painted sun-kissed highlighting, customized gloss toner, and comprehensive Olaplex bond-building protection.',
    popular: true
  },
  {
    id: 'h3',
    name: 'Keratin Infusion Therapy',
    category: 'hair',
    price: 32000,
    duration: '150 Mins',
    description: 'Premium smoothing treatment designed to eliminate frizz, restore amino acid structures, and add deep brilliant shine.',
  },
  {
    id: 'h4',
    name: 'Royal Caviar Scalp & Hair Ritual',
    category: 'hair',
    price: 12500,
    duration: '60 Mins',
    description: 'Intense anti-aging nourishment featuring caviar extract beads, scalp detox, and micro-steam massage.'
  },
  
  // Skincare / Facials
  {
    id: 'f1',
    name: 'Signature Gold Cellular Renewal',
    category: 'facial',
    price: 18500,
    duration: '90 Mins',
    description: '24k gold leaf-infused facial combining sonic cleansing, cellular renewal serums, and a firming collagen mask.',
    popular: true
  },
  {
    id: 'f2',
    name: 'Hydra-Dew Botanical Infusion',
    category: 'facial',
    price: 14000,
    duration: '75 Mins',
    description: 'Ultra-hydrating multi-level facial featuring organic botanical concentrates and lymphatic drainage massage to de-puff.',
  },
  {
    id: 'f3',
    name: 'Express Glow Treatment',
    category: 'facial',
    price: 8000,
    duration: '45 Mins',
    description: 'A quick double cleanse, enzyme peel, dynamic vitamin C booster, and soothing hydration shield.'
  },

  // Nails
  {
    id: 'n1',
    name: 'The Loft Premium Manicure & Gel Polish',
    category: 'nails',
    price: 6500,
    duration: '60 Mins',
    description: 'Meticulous cuticle work, shaping, hydrating hand wrap, and flawless application of premium, non-chip gel color.',
    popular: true
  },
  {
    id: 'n2',
    name: 'Bespoke Gel Extension & Nail Art',
    category: 'nails',
    price: 15500,
    duration: '120 Mins',
    description: 'Premium lightweight hard gel nail extensions with customized shape, hand-painted minimalist line work, or gold-foil details.'
  },
  {
    id: 'n3',
    name: 'Luxury Milk & Honey Pedicure Ritual',
    category: 'nails',
    price: 8500,
    duration: '75 Mins',
    description: 'Warm organic milk soak, natural honey scrub, callus refining, marine mud mask, hot stone massage, and polish.'
  },

  // Bridal / Occasions
  {
    id: 'b1',
    name: 'Couture Bridal Transformation',
    category: 'bridal',
    price: 95000,
    duration: '240 Mins',
    description: 'Full high-definition bridal styling, luxury makeup (airbrush optional), dressing, veil setting, and pre-wedding consultation.',
    popular: true
  },
  {
    id: 'b2',
    name: 'Sari Draping & Hair Design',
    category: 'bridal',
    price: 12000,
    duration: '90 Mins',
    description: 'Impeccable traditional or modern pleated sari draping paired with a premium chic updo or classic waves.'
  },
  {
    id: 'b3',
    name: 'Occasion Red-Carpet Glamour',
    category: 'bridal',
    price: 18000,
    duration: '120 Mins',
    description: 'Flawless makeup application and creative hair styling tailored to fit your cocktail dress or evening gala attire.'
  },

  // Exclusive Private Suite
  {
    id: 'e1',
    name: 'The Loft Private Suite Half-Day Experience',
    category: 'exclusive',
    price: 45000,
    duration: '240 Mins',
    description: 'Exclusive, completely private access to the suite for one guest. Includes: Signature Hair Ritual, 24k Gold Facial, Premium Pedicure, organic gourmet teas, and fine chocolates.',
    popular: true
  },
  {
    id: 'e2',
    name: 'Private Suite Styling Booking Upgrade',
    category: 'exclusive',
    price: 5000,
    duration: 'Per Session',
    description: 'Add absolute seclusion to any regular service. The suite will be reserved entirely for you, with personalized climate and music controls.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', category: 'salon', title: 'Modern Luxury Interior', image: IMAGES.hero },
  { id: 'g2', category: 'hair', title: 'Parisian Balayage on Soft Waves', image: IMAGES.hair },
  { id: 'g3', category: 'exclusive', title: 'The Private Ladies\' Suite', image: IMAGES.privateSuite },
  { id: 'g4', category: 'facial', title: 'Advanced Cellular Skincare', image: IMAGES.facial },
  { id: 'g5', category: 'nails', title: 'Minimalist Nude Gel Polish', image: IMAGES.nails },
  { id: 'g6', category: 'bridal', title: 'Editorial Bridal Portrait', image: IMAGES.bridal },
  { id: 'g7', category: 'hair', title: 'Precision Modern Bob Cut', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop' },
  { id: 'g8', category: 'nails', title: 'Milk & Honey Pedicure lounge', image: IMAGES.pedicure },
  { id: 'g9', category: 'salon', title: 'Our Minimalist Product Lounge', image: IMAGES.salonVibe1 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Minoli Samarasinghe',
    role: 'Editorial Director',
    comment: 'The Private Ladies Suite is an absolute sanctuary in Colombo. The service is incredibly detailed, discrete, and professional. My balayage has never looked so natural.',
    rating: 5,
    date: 'June 2026',
    serviceName: 'Parisian Balayage & Olaplex'
  },
  {
    id: 't2',
    name: 'Dr. Anisha De Silva',
    role: 'Regular Client',
    comment: 'I visit The Loft every month for their Signature Gold Facial and a blowout. It is rare to find a place that truly understands minimalist luxury and the value of quiet, serene time.',
    rating: 5,
    date: 'May 2026',
    serviceName: 'Signature Gold Cellular Renewal'
  },
  {
    id: 't3',
    name: 'Yolanda K.',
    role: 'Bride of 2026',
    comment: 'Nadia and her senior styling team did my bridal hair and makeup. The transition from my ceremony look to the reception was seamless, and I felt so incredibly elegant. Best in Sri Lanka.',
    rating: 5,
    date: 'April 2026',
    serviceName: 'Couture Bridal Transformation'
  }
];


export const DEFAULT_CAREER_POSITIONS: CareerPosition[] = [
    {
        id: 'pos-nail-tech',
        title: 'Nail Technician',
        department: 'Nails',
        summary:
            'Skilled nail professional with experience in manicures, pedicures, gel services and nail enhancements, with a strong focus on hygiene, precision and client care.',
        isActive: true
    },

    {
        id: 'pos-hairdresser',
        title: 'Hairdresser',
        department: 'Hair',
        summary:
            'Experienced hair professional confident in cutting, styling, blow-drying, colouring and treatments, with excellent consultation and customer service skills.',
        isActive: true
    },

    {
        id: 'pos-esthetician',
        title: 'Esthetician',
        department: 'Skincare',
        summary:
            'Qualified beauty professional experienced in facials, skin treatments and beauty services, with a strong understanding of skincare and personalised client care.',
        isActive: true
    },

    {
        id: 'pos-masseuse',
        title: 'Masseuse',
        department: 'Wellness',
        summary:
            'Experienced massage therapist skilled in relaxation and wellness treatments, with a professional, client-focused approach and excellent service standards.',
        isActive: true
    }
];