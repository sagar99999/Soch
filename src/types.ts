export interface EventEntry {
  id?: string;
  city: string;
  venue: string;
  date: string;
  ticketUrl?: string;
  status: 'upcoming' | 'cancelled' | 'completed';
  createdAt?: string;
}

export interface MerchItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt?: string;
}

export interface NewsPost {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  author: string;
}

export interface FanMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface BandMember {
  name: string;
  role: string;
  instruments: string[];
  imageUrl: string;
  bio: string;
}
