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
  inStock: boolean;
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
