export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'hair' | 'nails' | 'facial' | 'bridal' | 'exclusive';
  price: number;
  duration: string;
  description: string;
  popular?: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'all' | 'hair' | 'nails' | 'facial' | 'bridal' | 'salon' | 'exclusive';
  title: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  date: string;
  serviceName?: string;
}

export interface BookingForm {
  name: string;
  email: string;
  phone: string;
  serviceIds: string[];
  date: string;
  time: string;
  privateSuite: boolean;
  notes: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CareerPosition {
    id: string;
    title: string;
    department: 'Nails' | 'Hair' | 'Skincare' | 'Wellness' | 'General';
    summary: string;
    isActive?: boolean;
    type?: string;
    experience?: string;
    description?: string;
    keyResponsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
}

export interface CareerApplicationForm {
    fullName: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    positionId: string;
    positionTitle: string;
    cvUrl?: string;

}
