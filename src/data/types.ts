export interface ProductVariant {
  label: string;
  value: string;
  colorHex?: string; // for colour swatches
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  description: string;
  isCommunityFavourite: boolean;
  purchaseCount: number;
  reviewCount: number;
  rating: number;
  creativePath?: 'journalling' | 'illustration' | 'lettering';
  hasStartSmall?: boolean;
  startSmallPrice?: number;
  pairsWellWith?: string[];
  colors?: string[];
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  text: string;
  hasPhoto: boolean;
  photoUrl?: string;
  isVerified: boolean;
  date: string;
}

export interface QAAnswer {
  id: string;
  text: string;
  answeredBy: string;
  isVerifiedBuyer: boolean;
  createdAt: string;
}

export interface QAQuestion {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  answers: QAAnswer[];
  createdAt: string;
}
