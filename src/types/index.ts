export interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: string;
  images: string[];
  location: string;
  posted_date: string;
  isPriority: boolean; // premium
  premiumExpiryDate?: string; // set only if isPriority = true, default 7 days
  expiryDate: string; // default 30 days from posted_date
  views: number;
  tags?: string[];
  userId: string;
  status: 'draft' | 'available' | 'sold' | 'removed';
  favorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  rating: number;
  totalRatings: number;
}

export interface UserRating {
  id: string;
  userId: string;
  ratedBy: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  adId: string;
  content: string;
  createdAt: string;
  read: boolean;
}


export interface Report {
  id: string;
  adId: string;
  userId: string;
  reason: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}