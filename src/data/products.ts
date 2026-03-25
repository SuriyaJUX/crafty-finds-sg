import productMicron from "@/assets/product-micron.jpg";
import productLeuchtturm from "@/assets/product-leuchtturm.jpg";
import productWatercolour from "@/assets/product-watercolour.jpg";
import productTombow from "@/assets/product-tombow.jpg";
import productStrathmore from "@/assets/product-strathmore.jpg";

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

export const products: Product[] = [
  {
    id: "1",
    name: "Sakura Pigma Micron Set",
    price: 24.90,
    originalPrice: 32.00,
    images: [productMicron],
    category: "Pens & Markers",
    tags: ["pens", "illustration", "fine-liner"],
    description: "Professional-grade archival ink pens in 6 tip sizes. Perfect for detailed illustration, journalling, and technical drawing. Waterproof and fade-resistant.",
    isCommunityFavourite: true,
    purchaseCount: 1247,
    reviewCount: 389,
    rating: 4.8,
    creativePath: "illustration",
    hasStartSmall: true,
    startSmallPrice: 12.90,
    pairsWellWith: ["2", "5"],
    inStock: true,
  },
  {
    id: "2",
    name: "Leuchtturm1917 Dotted Notebook A5",
    price: 29.90,
    images: [productLeuchtturm],
    category: "Notebooks",
    tags: ["notebook", "journalling", "dotted"],
    description: "251 numbered pages with dotted grid. Includes table of contents, page markers, and an expandable pocket. Ink-proof paper quality.",
    isCommunityFavourite: true,
    purchaseCount: 2103,
    reviewCount: 567,
    rating: 4.9,
    creativePath: "journalling",
    pairsWellWith: ["1", "4"],
    inStock: true,
  },
  {
    id: "3",
    name: "Winsor & Newton Cotman Watercolour Set",
    price: 45.90,
    originalPrice: 58.00,
    images: [productWatercolour],
    category: "Paints",
    tags: ["watercolour", "paint", "illustration"],
    description: "12-pan watercolour set with a travel-friendly compact case. Excellent colour mixing and transparency. Includes a brush.",
    isCommunityFavourite: false,
    purchaseCount: 634,
    reviewCount: 178,
    rating: 4.5,
    creativePath: "illustration",
    hasStartSmall: true,
    startSmallPrice: 22.90,
    pairsWellWith: ["6", "7"],
    inStock: true,
  },
  {
    id: "4",
    name: "Tombow Dual Brush Pen Set",
    price: 38.90,
    images: [productTombow],
    category: "Pens & Markers",
    tags: ["brush-pen", "lettering", "calligraphy"],
    description: "10-pack of dual-tip brush pens with flexible brush tip and fine tip. Water-based ink for blending. Ideal for hand lettering and calligraphy.",
    isCommunityFavourite: true,
    purchaseCount: 1856,
    reviewCount: 423,
    rating: 4.7,
    creativePath: "lettering",
    hasStartSmall: true,
    startSmallPrice: 18.90,
    pairsWellWith: ["2", "8"],
    inStock: true,
  },
  {
    id: "5",
    name: "Strathmore Mixed Media Pad",
    price: 18.50,
    images: [productStrathmore],
    category: "Paper & Pads",
    tags: ["paper", "mixed-media", "sketchbook"],
    description: "40 sheets of heavyweight 300gsm paper suitable for wet and dry media. Vellum surface with excellent tooth for pencil, ink, and light washes.",
    isCommunityFavourite: false,
    purchaseCount: 412,
    reviewCount: 98,
    rating: 4.3,
    creativePath: "illustration",
    pairsWellWith: ["1", "3"],
    inStock: true,
  },
  {
    id: "6",
    name: "Princeton Velvetouch Brush Set",
    price: 32.00,
    originalPrice: 39.90,
    images: [productWatercolour],
    category: "Brushes",
    tags: ["brush", "watercolour", "acrylic"],
    description: "Set of 4 premium synthetic brushes with ergonomic handles. Excellent spring and snap for precise control. Works with all water-based media.",
    isCommunityFavourite: false,
    purchaseCount: 287,
    reviewCount: 64,
    rating: 4.6,
    pairsWellWith: ["3"],
    inStock: true,
  },
  {
    id: "7",
    name: "Canson XL Watercolour Pad A4",
    price: 14.90,
    images: [productStrathmore],
    category: "Paper & Pads",
    tags: ["paper", "watercolour", "pad"],
    description: "30 sheets of cold-pressed 300gsm watercolour paper. Fine grain texture ideal for watercolour, gouache, and acrylic techniques.",
    isCommunityFavourite: false,
    purchaseCount: 523,
    reviewCount: 134,
    rating: 4.4,
    pairsWellWith: ["3", "6"],
    inStock: true,
  },
  {
    id: "8",
    name: "Rhodia Dot Pad No. 16",
    price: 12.90,
    images: [productLeuchtturm],
    category: "Notebooks",
    tags: ["notebook", "dot-grid", "lettering"],
    description: "80 sheets of ultra-smooth Clairefontaine paper with dot grid. Staple-bound with micro-perforated pages. Fountain pen and marker friendly.",
    isCommunityFavourite: true,
    purchaseCount: 945,
    reviewCount: 256,
    rating: 4.6,
    creativePath: "lettering",
    pairsWellWith: ["4"],
    inStock: true,
  },
  {
    id: "9",
    name: "Staedtler Triplus Fineliner Set",
    price: 19.90,
    originalPrice: 24.90,
    images: [productMicron],
    category: "Pens & Markers",
    tags: ["pens", "fineliner", "journalling"],
    description: "20 vibrant colours with ergonomic triangular barrel. Dry-safe ink technology. Perfect for bullet journalling, planning, and colouring.",
    isCommunityFavourite: false,
    purchaseCount: 678,
    reviewCount: 189,
    rating: 4.5,
    creativePath: "journalling",
    pairsWellWith: ["2", "8"],
    inStock: true,
  },
  {
    id: "10",
    name: "Kuretake Zig Clean Colour Real Brush",
    price: 42.90,
    images: [productTombow],
    category: "Pens & Markers",
    tags: ["brush-pen", "watercolour", "lettering"],
    description: "Set of 12 water-based brush pens with flexible bristle tips. Blendable colours for watercolour effects. Professional quality for lettering and illustration.",
    isCommunityFavourite: true,
    purchaseCount: 1123,
    reviewCount: 312,
    rating: 4.8,
    creativePath: "lettering",
    pairsWellWith: ["7", "5"],
    inStock: true,
  },
];

export const reviews: Review[] = [
  { id: "r1", productId: "1", userName: "Sarah T.", rating: 5, text: "These pens are absolutely perfect for my bullet journal. The fine tips don't bleed through my Leuchtturm pages at all!", hasPhoto: true, photoUrl: productMicron, isVerified: true, date: "2024-12-15" },
  { id: "r2", productId: "1", userName: "Ming Wei", rating: 5, text: "I've been using Microns for years and they never disappoint. Great for architectural sketches.", hasPhoto: true, photoUrl: productMicron, isVerified: true, date: "2024-11-28" },
  { id: "r3", productId: "1", userName: "Alex K.", rating: 4, text: "Good quality but the 005 tip dried out faster than expected.", hasPhoto: false, isVerified: true, date: "2024-11-10" },
  { id: "r4", productId: "2", userName: "Priya S.", rating: 5, text: "The paper quality is incredible. No ghosting, no bleeding. This is my 4th one!", hasPhoto: true, photoUrl: productLeuchtturm, isVerified: true, date: "2024-12-20" },
  { id: "r5", productId: "2", userName: "Jun Hao", rating: 5, text: "Best notebook I've ever owned. The dot grid is perfectly spaced.", hasPhoto: false, isVerified: true, date: "2024-12-01" },
  { id: "r6", productId: "4", userName: "Rachel L.", rating: 5, text: "Amazing for hand lettering! The brush tip is so flexible and the colours are vibrant.", hasPhoto: true, photoUrl: productTombow, isVerified: true, date: "2024-12-18" },
  { id: "r7", productId: "4", userName: "Daniel C.", rating: 4, text: "Great pens but I wish the fine tip was a bit finer. Still, excellent value.", hasPhoto: false, isVerified: true, date: "2024-11-25" },
];

export const communityPickOfMonth = {
  product: products[1],
  customerName: "Mei Ling",
  customerNote: "I've tried so many notebooks but the Leuchtturm is the one I keep coming back to. The paper handles everything — fineliners, brush pens, even light watercolour washes. I use mine for daily journalling and meal planning. It's become my creative sanctuary.",
  projectDescription: "Weekly spread journal with watercolour accents",
};

export const categories = ["All", "Pens & Markers", "Notebooks", "Paper & Pads", "Paints", "Brushes"];

export const deals = [
  { text: "🎨 20% off all Sakura products", code: "SAKURA20" },
  { text: "📦 Free shipping over S$50", code: null },
  { text: "✨ Flash Sale: Watercolour sets from S$22.90", code: "FLASH" },
  { text: "🎁 Buy 2 notebooks, get 1 free", code: "NOTE3" },
];
