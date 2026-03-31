// Re-export types for backwards compatibility
export type { Product, Review, QAQuestion, QAAnswer } from "./types";

// Image imports
import imgPilotV5 from "@/assets/products/pilot-v5-gel-pen.jpg";
import imgPilotG2 from "@/assets/products/pilot-g2-gel-pen.jpg";
import imgPilotAcroball from "@/assets/products/pilot-acroball.jpg";
import imgMujiGel05 from "@/assets/products/muji-gel-pen-05.jpg";
import imgMujiGel038 from "@/assets/products/muji-gel-pen-038.jpg";
import imgStaedtlerHB from "@/assets/products/staedtler-noris-hb.jpg";
import imgStaedtler2B from "@/assets/products/staedtler-noris-2b.jpg";
import imgFaberGraphite from "@/assets/products/faber-castell-graphite-hb.jpg";
import imgFaberGrip from "@/assets/products/faber-castell-grip.jpg";
import imgTombowMono from "@/assets/products/tombow-mono-pencil.jpg";
import imgPentelMech from "@/assets/products/pentel-mechanical-pencil.jpg";
import imgJetstream from "@/assets/products/uniball-jetstream.jpg";
import imgTriplus from "@/assets/products/staedtler-triplus-set.jpg";
import imgPilotHL from "@/assets/products/pilot-highlighter.jpg";
import imgStabiloBoss from "@/assets/products/stabilo-boss.jpg";
import imgPentelFude from "@/assets/products/pentel-fude-touch.jpg";
import imgFudenosuke from "@/assets/products/tombow-fudenosuke.jpg";
import imgMicron05 from "@/assets/products/sakura-micron-05.jpg";
import imgMujiNBA5 from "@/assets/products/muji-notebook-a5.jpg";
import imgMujiNBA4 from "@/assets/products/muji-notebook-a4.jpg";
import imgMoleskineClassic from "@/assets/products/moleskine-classic.jpg";
import imgMoleskineCahier from "@/assets/products/moleskine-cahier.jpg";
import imgLeuchtturmDotted from "@/assets/products/leuchtturm-dotted.jpg";
import imgLeuchtturmRuled from "@/assets/products/leuchtturm-ruled.jpg";
import imgKokuyo from "@/assets/products/kokuyo-dotted.jpg";
import imgRhodia from "@/assets/products/rhodia-dotpad.jpg";
import imgCansonSketch from "@/assets/products/canson-sketch.jpg";
import imgCansonWC from "@/assets/products/canson-watercolor.jpg";
import imgClairefontaine from "@/assets/products/clairefontaine-drawing.jpg";
import imgStrathmore from "@/assets/products/strathmore-drawing.jpg";
import imgKoi24 from "@/assets/products/sakura-koi-24.jpg";
import imgKoi48 from "@/assets/products/sakura-koi-48.jpg";
import imgCotman12 from "@/assets/products/winsor-cotman-12.jpg";
import imgCotman24 from "@/assets/products/winsor-cotman-24.jpg";
import imgWCPencils from "@/assets/products/staedtler-watercolor-pencils.jpg";
import imgPolychromos from "@/assets/products/faber-castell-polychromos.jpg";
import imgTombowDual10 from "@/assets/products/tombow-dual-10.jpg";
import imgTombowDual24 from "@/assets/products/tombow-dual-24.jpg";
import imgColored12 from "@/assets/products/staedtler-colored-12.jpg";
import imgNeocolor from "@/assets/products/caran-dache-neocolor.jpg";
import imgScotchTape from "@/assets/products/scotch-tape.jpg";
import imgStapler from "@/assets/products/heavy-duty-stapler.jpg";
import imgDeskOrg from "@/assets/products/muji-desk-organizer.jpg";
import imgPentelEraser from "@/assets/products/pentel-eraser.jpg";
import imgFaberEraser from "@/assets/products/faber-castell-eraser.jpg";
import imgParallel from "@/assets/products/pilot-parallel.jpg";
import imgBrushSignSet from "@/assets/products/pentel-brush-sign-set.jpg";
import imgGellyRoll from "@/assets/products/sakura-gelly-roll.jpg";
import imgTracing from "@/assets/products/clairefontaine-tracing.jpg";
import imgBrushSet from "@/assets/products/winsor-brush-set.jpg";

import type { Product, Review, QAQuestion } from "./types";

export const products: Product[] = [
  // === PENS & MARKERS ===
  { id: "1", name: "Pilot V5 Gel Pen - Black", price: 4.50, images: [imgPilotV5], category: "Pens & Markers", tags: ["pen", "gel", "writing"], description: "Ultra-fine 0.5mm needle-tip gel pen with smooth liquid ink flow. Ideal for detailed note-taking and everyday writing. Consistent ink delivery to the last drop.", isCommunityFavourite: false, purchaseCount: 892, reviewCount: 201, rating: 4.4, creativePath: "journalling", pairsWellWith: ["19", "25"], colors: ["black"], inStock: true },
  { id: "2", name: "Pilot G2 Gel Pen - 0.7mm", price: 5.90, images: [imgPilotG2], category: "Pens & Markers", tags: ["pen", "gel", "writing"], description: "Retractable gel pen with comfortable rubber grip and smooth-writing 0.7mm tip. Refillable design for long-term value. A favourite for journalling and everyday use.", isCommunityFavourite: true, purchaseCount: 1534, reviewCount: 412, rating: 4.7, creativePath: "journalling", pairsWellWith: ["19", "23"], colors: ["black"], inStock: true },
  { id: "3", name: "Pilot Acroball Ballpoint Pen", price: 6.80, images: [imgPilotAcroball], category: "Pens & Markers", tags: ["pen", "ballpoint", "writing"], description: "Advanced Acro Ink technology for the smoothest ballpoint writing experience. Ergonomic rubber grip and retractable design. Low-viscosity ink dries quickly.", isCommunityFavourite: false, purchaseCount: 456, reviewCount: 98, rating: 4.3, pairsWellWith: ["20"], colors: ["black"], inStock: true },
  { id: "4", name: "Muji Gel Pen 0.5mm - Black", price: 2.90, images: [imgMujiGel05], category: "Pens & Markers", tags: ["pen", "gel", "muji", "minimal"], description: "Iconic minimalist gel pen with smooth 0.5mm writing. Clean design with transparent barrel. A cult favourite for bullet journalling and everyday notes.", isCommunityFavourite: true, purchaseCount: 2341, reviewCount: 623, rating: 4.8, creativePath: "journalling", pairsWellWith: ["5", "19"], colors: ["black"], inStock: true },
  { id: "5", name: "Muji Gel Pen 0.38mm - Black", price: 3.20, images: [imgMujiGel038], category: "Pens & Markers", tags: ["pen", "gel", "muji", "fine"], description: "Extra-fine 0.38mm tip for precise, detailed writing. Perfect for small handwriting, planners, and intricate note-taking. Same beloved Muji quality in a finer point.", isCommunityFavourite: true, purchaseCount: 1876, reviewCount: 489, rating: 4.7, creativePath: "journalling", pairsWellWith: ["4", "25"], colors: ["black"], inStock: true },
  { id: "12", name: "Uni-ball Jetstream Pen - Black", price: 6.50, images: [imgJetstream], category: "Pens & Markers", tags: ["pen", "ballpoint", "smooth"], description: "Revolutionary hybrid ink combines ballpoint reliability with gel pen smoothness. Quick-drying, smudge-proof, and incredibly smooth. The pen that converts ballpoint sceptics.", isCommunityFavourite: true, purchaseCount: 1678, reviewCount: 445, rating: 4.8, pairsWellWith: ["19", "21"], colors: ["black"], inStock: true },
  { id: "13", name: "Staedtler Triplus Fineliner - Set of 10", price: 12.90, originalPrice: 15.90, images: [imgTriplus], category: "Pens & Markers", tags: ["fineliner", "set", "colour"], description: "10 vibrant colours with ergonomic triangular barrel. Dry-safe ink technology means they won't dry out even uncapped for days. Perfect for colour-coding, journalling, and illustration.", isCommunityFavourite: true, purchaseCount: 1245, reviewCount: 334, rating: 4.6, creativePath: "journalling", hasStartSmall: true, startSmallPrice: 6.90, pairsWellWith: ["23", "25"], colors: ["black", "multicolor"], inStock: true },
  { id: "14", name: "Pilot Highlighter Pen - Yellow", price: 4.20, images: [imgPilotHL], category: "Pens & Markers", tags: ["highlighter", "yellow", "study"], description: "Bright fluorescent yellow highlighter with chisel tip for both broad and fine highlighting. Fade-resistant ink. Essential for study and document review.", isCommunityFavourite: false, purchaseCount: 567, reviewCount: 112, rating: 4.2, pairsWellWith: ["15"], colors: ["yellow"], inStock: true },
  { id: "15", name: "Stabilo Boss Highlighter - Yellow", price: 3.80, images: [imgStabiloBoss], category: "Pens & Markers", tags: ["highlighter", "yellow", "study"], description: "The original flat highlighter with unique pocket-clip cap. Anti-dry-out technology lasts up to 4 hours uncapped. Bright, even coverage without streaking.", isCommunityFavourite: false, purchaseCount: 789, reviewCount: 156, rating: 4.4, pairsWellWith: ["14"], colors: ["yellow"], inStock: true },
  { id: "16", name: "Pentel Fude Touch Brush Sign Pen - Black", price: 8.90, images: [imgPentelFude], category: "Pens & Markers", tags: ["brush-pen", "lettering", "calligraphy"], description: "Flexible felt brush tip creates beautiful thick-to-thin strokes. Water-based dye ink for rich, saturated lines. Perfect for modern calligraphy, lettering, and sketching.", isCommunityFavourite: true, purchaseCount: 1023, reviewCount: 278, rating: 4.7, creativePath: "lettering", pairsWellWith: ["17", "26"], colors: ["black"], inStock: true },
  { id: "17", name: "Tombow Fudenosuke Brush Pen - Set of 2", price: 7.50, originalPrice: 9.90, images: [imgFudenosuke], category: "Pens & Markers", tags: ["brush-pen", "lettering", "calligraphy"], description: "Set includes both hard and soft tip brush pens. Elastomer tip produces beautiful calligraphy strokes. Water-based ink in deep black. A must-have for brush lettering beginners.", isCommunityFavourite: true, purchaseCount: 1456, reviewCount: 389, rating: 4.8, creativePath: "lettering", pairsWellWith: ["16", "26"], colors: ["black"], inStock: true },
  { id: "18", name: "Sakura Pigma Micron Pen 0.5mm", price: 5.60, images: [imgMicron05], category: "Pens & Markers", tags: ["fineliner", "illustration", "archival"], description: "Professional-grade archival pigment ink pen. Waterproof, chemical-proof, and fade-resistant. The industry standard for illustration, manga, and technical drawing.", isCommunityFavourite: true, purchaseCount: 1567, reviewCount: 423, rating: 4.8, creativePath: "illustration", pairsWellWith: ["27", "30"], colors: ["black"], inStock: true },
  { id: "46", name: "Pilot Parallel Pen 3.8mm - Black", price: 16.50, images: [imgParallel], category: "Pens & Markers", tags: ["calligraphy", "parallel", "broad-nib"], description: "Unique parallel plate nib creates crisp calligraphic strokes. 3.8mm nib width ideal for Gothic and Italic scripts. Includes ink cartridges and mixing plate for colour blending.", isCommunityFavourite: false, purchaseCount: 345, reviewCount: 87, rating: 4.5, creativePath: "lettering", pairsWellWith: ["49"], colors: ["black"], inStock: true },
  { id: "47", name: "Pentel Brush Sign Pen Set - 12 colours", price: 28.00, images: [imgBrushSignSet], category: "Pens & Markers", tags: ["brush-pen", "set", "colour", "lettering"], description: "12 vibrant colours with flexible fibre tip for expressive brush lettering. Water-based dye ink blends beautifully. Each pen produces consistent thick-to-thin variation.", isCommunityFavourite: true, purchaseCount: 934, reviewCount: 245, rating: 4.6, creativePath: "lettering", hasStartSmall: true, startSmallPrice: 14.90, pairsWellWith: ["16", "26"], colors: ["multicolor"], inStock: true },
  { id: "48", name: "Sakura Gelly Roll Pen Set - 10 Metallic", price: 18.90, images: [imgGellyRoll], category: "Pens & Markers", tags: ["gel", "metallic", "decorative"], description: "10 shimmering metallic gel pens that write beautifully on light and dark paper. Archival-quality waterproof ink. Perfect for card-making, journalling accents, and creative projects.", isCommunityFavourite: false, purchaseCount: 567, reviewCount: 134, rating: 4.4, creativePath: "journalling", pairsWellWith: ["23", "25"], colors: ["gold", "silver", "multicolor"], inStock: true },

  // === PENCILS ===
  { id: "6", name: "Staedtler Noris Pencil HB", price: 1.50, images: [imgStaedtlerHB], category: "Pencils", tags: ["pencil", "HB", "graphite"], description: "The iconic yellow-and-black pencil trusted by students and professionals worldwide. Break-resistant lead with smooth laydown. PEFC-certified wood from sustainably managed forests.", isCommunityFavourite: false, purchaseCount: 2100, reviewCount: 312, rating: 4.3, pairsWellWith: ["7", "44"], colors: ["grey", "black"], inStock: true },
  { id: "7", name: "Staedtler Noris Pencil 2B", price: 1.80, images: [imgStaedtler2B], category: "Pencils", tags: ["pencil", "2B", "graphite", "sketching"], description: "Soft 2B graphite for rich, dark sketching and shading. Same trusted Noris quality in a softer grade. Ideal for drawing, life sketching, and expressive mark-making.", isCommunityFavourite: false, purchaseCount: 1450, reviewCount: 198, rating: 4.4, creativePath: "illustration", pairsWellWith: ["6", "27"], colors: ["grey", "black"], inStock: true },
  { id: "8", name: "Faber-Castell Graphite Pencil HB", price: 2.10, images: [imgFaberGraphite], category: "Pencils", tags: ["pencil", "HB", "graphite"], description: "Premium graphite pencil with SV bonded lead for extra break-resistance. Smooth writing and drawing in all conditions. Classic dark green barrel design.", isCommunityFavourite: false, purchaseCount: 876, reviewCount: 145, rating: 4.3, pairsWellWith: ["9", "45"], colors: ["grey", "black"], inStock: true },
  { id: "9", name: "Faber-Castell GRIP Pencil", price: 3.50, images: [imgFaberGrip], category: "Pencils", tags: ["pencil", "ergonomic", "grip"], description: "Patented triangular barrel with raised dots for secure, fatigue-free grip. Break-resistant bonded lead. Ergonomic design encourages correct pencil hold for children and adults alike.", isCommunityFavourite: false, purchaseCount: 654, reviewCount: 112, rating: 4.5, pairsWellWith: ["8", "45"], colors: ["grey", "black"], inStock: true },
  { id: "10", name: "Tombow Mono Pencil", price: 2.40, images: [imgTombowMono], category: "Pencils", tags: ["pencil", "professional", "drawing"], description: "Professional-grade drawing pencil with high-density, uniformly-blended graphite. Produces clean, consistent lines with minimal breakage. A favourite among architects and illustrators.", isCommunityFavourite: false, purchaseCount: 534, reviewCount: 89, rating: 4.6, creativePath: "illustration", pairsWellWith: ["27", "44"], colors: ["grey", "black"], inStock: true },
  { id: "11", name: "Pentel S359 Mechanical Pencil 0.5mm", price: 4.80, images: [imgPentelMech], category: "Pencils", tags: ["mechanical", "pencil", "precise"], description: "Precision 0.5mm mechanical pencil with metal tip for accurate technical drawing. Comfortable knurled grip and built-in eraser. Reliable click mechanism for consistent lead advancement.", isCommunityFavourite: false, purchaseCount: 723, reviewCount: 167, rating: 4.5, pairsWellWith: ["44", "27"], colors: ["grey", "black"], inStock: true },

  // === NOTEBOOKS ===
  { id: "19", name: "Muji Notebook A5 - 40 pages", price: 3.50, images: [imgMujiNBA5], category: "Notebooks", tags: ["notebook", "muji", "minimal", "A5"], description: "Simple, functional notebook with smooth recycled paper. Minimalist kraft cover embodies the Muji philosophy. Lightweight and perfect for on-the-go note-taking and daily journalling.", isCommunityFavourite: false, purchaseCount: 3210, reviewCount: 567, rating: 4.3, creativePath: "journalling", pairsWellWith: ["4", "5"], colors: ["white", "grey"], inStock: true },
  { id: "20", name: "Muji Notebook A4 - 50 pages", price: 6.20, images: [imgMujiNBA4], category: "Notebooks", tags: ["notebook", "muji", "minimal", "A4"], description: "Larger A4 format with 50 pages of smooth recycled paper. Ample space for sketches, meeting notes, and study summaries. Same elegant Muji simplicity in a bigger canvas.", isCommunityFavourite: false, purchaseCount: 1456, reviewCount: 234, rating: 4.2, pairsWellWith: ["4", "13"], colors: ["white", "grey"], inStock: true },
  { id: "21", name: "Moleskine Classic Notebook A5 Hardcover - Black", price: 48.00, originalPrice: 58.00, images: [imgMoleskineClassic], category: "Notebooks", tags: ["notebook", "premium", "hardcover"], description: "The legendary notebook with ivory-coloured acid-free paper, elastic closure, and expandable inner pocket. Rounded corners and ribbon bookmark. A timeless companion for writers and thinkers.", isCommunityFavourite: true, purchaseCount: 1876, reviewCount: 456, rating: 4.7, creativePath: "journalling", pairsWellWith: ["2", "12"], colors: ["black"], inStock: true },
  { id: "22", name: "Moleskine Cahier Notebook A5 Softcover - Black", price: 24.50, images: [imgMoleskineCahier], category: "Notebooks", tags: ["notebook", "softcover", "lightweight"], description: "Lightweight cardboard cover with visible stitching for a casual, literary aesthetic. Acid-free paper and last 16 detachable pages. Comes in a set of 3 for continuous journalling.", isCommunityFavourite: false, purchaseCount: 987, reviewCount: 213, rating: 4.4, creativePath: "journalling", pairsWellWith: ["21", "4"], colors: ["black"], inStock: true },
  { id: "23", name: "Leuchtturm1917 Medium A5 Hardcover Dotted - Black", price: 47.00, images: [imgLeuchtturmDotted], category: "Notebooks", tags: ["notebook", "dotted", "premium", "bujo"], description: "251 numbered pages with dotted grid — the gold standard for bullet journalling. Includes table of contents, page markers, and expandable pocket. Ink-proof 80gsm paper.", isCommunityFavourite: true, purchaseCount: 2567, reviewCount: 678, rating: 4.9, creativePath: "journalling", pairsWellWith: ["13", "4"], colors: ["black"], inStock: true },
  { id: "24", name: "Leuchtturm1917 Medium A5 Hardcover Ruled - Blue", price: 47.50, images: [imgLeuchtturmRuled], category: "Notebooks", tags: ["notebook", "ruled", "premium"], description: "Beautiful Nordic blue hardcover with 251 numbered ruled pages. Same premium Leuchtturm quality with traditional lined format. Two ribbon bookmarks and sticker labels included.", isCommunityFavourite: false, purchaseCount: 1234, reviewCount: 312, rating: 4.8, creativePath: "journalling", pairsWellWith: ["23", "2"], colors: ["blue"], inStock: true },
  { id: "25", name: "Kokuyo Dotted Notebook A5", price: 8.90, images: [imgKokuyo], category: "Notebooks", tags: ["notebook", "dotted", "Japanese"], description: "Japanese-engineered dot grid on silky-smooth paper. Slim profile slides easily into bags. Excellent ink resistance for gel pens and fineliners. A hidden gem for minimalist journallers.", isCommunityFavourite: true, purchaseCount: 1567, reviewCount: 389, rating: 4.7, creativePath: "journalling", pairsWellWith: ["4", "13"], colors: ["white", "grey"], inStock: true },
  { id: "26", name: "Rhodia DotPad Notebook A4", price: 12.50, images: [imgRhodia], category: "Notebooks", tags: ["notebook", "dotted", "French", "A4"], description: "80 sheets of ultra-smooth Clairefontaine paper with 5mm dot grid. Iconic orange cover with staple binding. Micro-perforated pages tear cleanly. Fountain pen and marker friendly.", isCommunityFavourite: true, purchaseCount: 1123, reviewCount: 289, rating: 4.6, creativePath: "lettering", pairsWellWith: ["16", "17"], colors: ["orange"], inStock: true },

  // === PAPER & PADS ===
  { id: "27", name: "Canson XL Series Sketch Pad A4", price: 12.90, images: [imgCansonSketch], category: "Paper & Pads", tags: ["paper", "sketch", "drawing"], description: "100 sheets of 90gsm fine-grain paper with micro-perforated edges. Side spiral binding lies flat for comfortable drawing. Excellent tooth for pencil, charcoal, and pastel.", isCommunityFavourite: false, purchaseCount: 789, reviewCount: 178, rating: 4.4, creativePath: "illustration", pairsWellWith: ["7", "10"], colors: ["white"], inStock: true },
  { id: "28", name: "Canson Montval Watercolour Pad A5", price: 18.50, images: [imgCansonWC], category: "Paper & Pads", tags: ["paper", "watercolour", "cold-pressed"], description: "12 sheets of 300gsm cold-pressed watercolour paper. Natural white with fine grain texture. Excellent colour lifting and wet-on-wet performance. Spiral-bound for easy page removal.", isCommunityFavourite: false, purchaseCount: 534, reviewCount: 123, rating: 4.5, creativePath: "illustration", pairsWellWith: ["31", "33"], colors: ["white"], inStock: true },
  { id: "29", name: "Clairefontaine Drawing Pad A4", price: 14.80, images: [imgClairefontaine], category: "Paper & Pads", tags: ["paper", "drawing", "smooth"], description: "25 sheets of ultra-smooth 200gsm white paper. The Clairefontaine surface is legendarily smooth for ink work. Excellent for illustration, technical drawing, and marker rendering.", isCommunityFavourite: false, purchaseCount: 423, reviewCount: 89, rating: 4.3, pairsWellWith: ["18", "13"], colors: ["white"], inStock: true },
  { id: "30", name: "Strathmore 400 Series Drawing Pad A5", price: 11.20, images: [imgStrathmore], category: "Paper & Pads", tags: ["paper", "drawing", "mixed-media"], description: "24 sheets of 130gsm medium-weight drawing paper. Cream-coloured with a consistent medium surface. Ideal for pencil, pen, marker, and light washes. Tape-bound with firm backing.", isCommunityFavourite: false, purchaseCount: 456, reviewCount: 98, rating: 4.3, creativePath: "illustration", pairsWellWith: ["18", "7"], colors: ["white"], inStock: true },
  { id: "49", name: "Clairefontaine Tracing Paper Pad A4", price: 16.20, images: [imgTracing], category: "Paper & Pads", tags: ["paper", "tracing", "transparent"], description: "50 sheets of 90gsm highly transparent tracing paper. Smooth surface accepts ink and pencil cleanly. Ideal for calligraphy practice, architectural drawing, and transfer work.", isCommunityFavourite: false, purchaseCount: 234, reviewCount: 56, rating: 4.2, pairsWellWith: ["18", "46"], colors: ["white"], inStock: true },

  // === PAINTS & WATERCOLOURS ===
  { id: "31", name: "Sakura Koi Watercolour Set - 24 colours", price: 32.00, images: [imgKoi24], category: "Paints", tags: ["watercolour", "paint", "travel"], description: "24 vibrant pan watercolours in a compact travel case with built-in palette and water brush. Excellent pigmentation and blending. Perfect for plein air painting and travel sketching.", isCommunityFavourite: true, purchaseCount: 1234, reviewCount: 334, rating: 4.6, creativePath: "illustration", hasStartSmall: true, startSmallPrice: 18.90, pairsWellWith: ["28", "50"], inStock: true },
  { id: "32", name: "Sakura Koi Watercolour Set - 48 colours", price: 58.00, images: [imgKoi48], category: "Paints", tags: ["watercolour", "paint", "professional"], description: "Complete 48-colour watercolour set for the serious artist. Fold-out case with generous mixing palette and water brush pen included. Lightfast, vibrant pigments.", isCommunityFavourite: false, purchaseCount: 567, reviewCount: 145, rating: 4.5, creativePath: "illustration", pairsWellWith: ["28", "50"], inStock: true },
  { id: "33", name: "Winsor & Newton Cotman Watercolour Set - 12 colours", price: 28.50, originalPrice: 35.00, images: [imgCotman12], category: "Paints", tags: ["watercolour", "paint", "beginner"], description: "12 carefully selected colours providing an excellent introduction to watercolour. High-quality student-grade pigments with good transparency and mixing properties. Compact metal tin.", isCommunityFavourite: false, purchaseCount: 789, reviewCount: 198, rating: 4.5, creativePath: "illustration", hasStartSmall: true, startSmallPrice: 15.90, pairsWellWith: ["28", "50"], inStock: true },
  { id: "34", name: "Winsor & Newton Cotman Watercolour Set - 24 colours", price: 42.00, images: [imgCotman24], category: "Paints", tags: ["watercolour", "paint", "intermediate"], description: "24-colour expanded palette for more adventurous colour mixing. Same excellent Cotman quality with a wider range. Durable metal tin with built-in mixing wells.", isCommunityFavourite: true, purchaseCount: 1023, reviewCount: 267, rating: 4.7, creativePath: "illustration", pairsWellWith: ["28", "50"], inStock: true },

  // === COLOURED PENCILS & PASTELS ===
  { id: "35", name: "Staedtler Luna Watercolour Pencil Set - 24 colours", price: 35.90, images: [imgWCPencils], category: "Coloured Pencils", tags: ["coloured-pencil", "watercolour", "set"], description: "24 watercolour pencils that can be used dry or activated with water for painterly effects. Rich, highly pigmented cores with smooth laydown. ABS coating prevents breakage.", isCommunityFavourite: false, purchaseCount: 456, reviewCount: 112, rating: 4.4, creativePath: "illustration", hasStartSmall: true, startSmallPrice: 18.90, pairsWellWith: ["28", "27"], inStock: true },
  { id: "36", name: "Faber-Castell Polychromos Coloured Pencil Set - 24 colours", price: 65.00, originalPrice: 78.00, images: [imgPolychromos], category: "Coloured Pencils", tags: ["coloured-pencil", "professional", "premium"], description: "Premium oil-based coloured pencils with unmatched lightfastness and colour intensity. Thick 3.8mm cores for rich coverage and fine detail. The professional's choice for illustration.", isCommunityFavourite: true, purchaseCount: 678, reviewCount: 178, rating: 4.9, creativePath: "illustration", pairsWellWith: ["27", "30"], inStock: true },
  { id: "39", name: "Staedtler Coloured Pencil Set - 12 colours", price: 14.50, images: [imgColored12], category: "Coloured Pencils", tags: ["coloured-pencil", "set", "beginner"], description: "12 bright, blendable coloured pencils with break-resistant leads. Ergonomic hexagonal barrel for comfortable grip. Excellent value for students, colouring enthusiasts, and creative projects.", isCommunityFavourite: false, purchaseCount: 1234, reviewCount: 234, rating: 4.3, pairsWellWith: ["27"], inStock: true },
  { id: "40", name: "Caran d'Ache Neocolor II Pastels - 15 colours", price: 22.00, images: [imgNeocolor], category: "Coloured Pencils", tags: ["pastel", "water-soluble", "premium"], description: "Water-soluble wax pastels that blend like watercolours when activated with water. Vibrant, lightfast Swiss-made colours. Excellent for mixed-media, journalling accents, and illustration.", isCommunityFavourite: false, purchaseCount: 345, reviewCount: 78, rating: 4.5, creativePath: "illustration", pairsWellWith: ["28", "27"], inStock: true },

  // === BRUSH PENS (SETS) ===
  { id: "37", name: "Tombow Dual Brush Pen Set - 10 colours", price: 31.50, originalPrice: 38.00, images: [imgTombowDual10], category: "Pens & Markers", tags: ["brush-pen", "lettering", "dual-tip"], description: "10 dual-tip brush pens with flexible brush tip and fine tip. Water-based ink blends beautifully. Ideal for hand lettering, calligraphy, and watercolour-style illustrations.", isCommunityFavourite: true, purchaseCount: 1876, reviewCount: 456, rating: 4.7, creativePath: "lettering", hasStartSmall: true, startSmallPrice: 15.90, pairsWellWith: ["23", "26"], inStock: true },
  { id: "38", name: "Tombow Dual Brush Pen Set - 24 colours", price: 68.00, images: [imgTombowDual24], category: "Pens & Markers", tags: ["brush-pen", "lettering", "dual-tip", "professional"], description: "Expanded 24-colour set for the serious letterer and illustrator. Same beloved flexible brush tip with wider colour palette for more creative possibilities. Blendable, water-based ink.", isCommunityFavourite: false, purchaseCount: 567, reviewCount: 134, rating: 4.6, creativePath: "lettering", pairsWellWith: ["37", "26"], inStock: true },

  // === OFFICE SUPPLIES ===
  { id: "41", name: "3M Scotch Tape Dispenser - Clear", price: 9.50, images: [imgScotchTape], category: "Office Supplies", tags: ["tape", "office", "essential"], description: "Weighted desktop tape dispenser with non-slip base. Includes one roll of crystal-clear Scotch tape. One-hand dispensing with clean, straight cuts every time.", isCommunityFavourite: false, purchaseCount: 654, reviewCount: 112, rating: 4.1, pairsWellWith: ["42"], inStock: true },
  { id: "42", name: "Staples Heavy-Duty Stapler", price: 14.90, images: [imgStapler], category: "Office Supplies", tags: ["stapler", "office", "heavy-duty"], description: "Full-strip stapler that handles up to 40 sheets. Durable all-metal construction with soft-grip handle. Non-skid rubber base. Uses standard 26/6 and 24/6 staples.", isCommunityFavourite: false, purchaseCount: 345, reviewCount: 67, rating: 4.0, pairsWellWith: ["41"], inStock: true },
  { id: "43", name: "Muji Desk Organiser - 3 compartments", price: 15.80, images: [imgDeskOrg], category: "Office Supplies", tags: ["organiser", "desk", "muji", "storage"], description: "Clear acrylic desk organiser with 3 compartments for pens, pencils, and accessories. Minimalist Muji design keeps your workspace tidy. Durable and easy to clean.", isCommunityFavourite: true, purchaseCount: 1123, reviewCount: 289, rating: 4.6, pairsWellWith: ["4", "11"], inStock: true },

  // === ERASERS ===
  { id: "44", name: "Pentel Eraser - Small", price: 1.80, images: [imgPentelEraser], category: "Erasers", tags: ["eraser", "vinyl", "precise"], description: "Compact Hi-Polymer eraser that removes graphite cleanly without smudging or tearing paper. Minimal crumbs for tidy erasing. Ideal for detailed corrections and tight spaces.", isCommunityFavourite: false, purchaseCount: 2345, reviewCount: 345, rating: 4.3, pairsWellWith: ["6", "10"], inStock: true },
  { id: "45", name: "Faber-Castell Eraser - Dust-free", price: 2.50, images: [imgFaberEraser], category: "Erasers", tags: ["eraser", "dust-free", "clean"], description: "Innovative dust-free formula collects eraser shavings into neat strips instead of scattered crumbs. PVC-free and gentle on paper. Protective sliding sleeve keeps it clean.", isCommunityFavourite: false, purchaseCount: 1567, reviewCount: 234, rating: 4.4, pairsWellWith: ["8", "9"], inStock: true },

  // === BRUSHES ===
  { id: "50", name: "Winsor & Newton Sablé Brush Set - 6 pieces", price: 24.80, images: [imgBrushSet], category: "Brushes", tags: ["brush", "watercolour", "sable"], description: "Set of 6 premium synthetic sable brushes in assorted sizes. Excellent spring, snap, and paint-holding capacity. Seamless ferrules and lacquered wooden handles. Works with all water-based media.", isCommunityFavourite: false, purchaseCount: 345, reviewCount: 78, rating: 4.5, pairsWellWith: ["31", "34"], inStock: true },
];

export const reviews: Review[] = [
  { id: "r1", productId: "4", userName: "Sarah T.", rating: 5, text: "This is THE pen for bullet journalling. Smooth, consistent, and impossibly cheap for the quality. I buy them 10 at a time.", hasPhoto: true, photoUrl: imgMujiGel05, isVerified: true, date: "2025-12-15" },
  { id: "r2", productId: "4", userName: "Ming Wei", rating: 5, text: "Clean, simple, reliable. Everything a pen should be. The 0.5mm is my sweet spot.", hasPhoto: false, isVerified: true, date: "2025-11-28" },
  { id: "r3", productId: "23", userName: "Priya S.", rating: 5, text: "The paper quality is incredible. No ghosting, no bleeding. This is my 4th Leuchtturm and I'm never switching!", hasPhoto: true, photoUrl: imgLeuchtturmDotted, isVerified: true, date: "2025-12-20" },
  { id: "r4", productId: "23", userName: "Jun Hao", rating: 5, text: "Best notebook I've ever owned. The dot grid is perfectly spaced and the pages are numbered — a dream for bujo.", hasPhoto: false, isVerified: true, date: "2025-12-01" },
  { id: "r5", productId: "17", userName: "Rachel L.", rating: 5, text: "The hard tip is perfect for small lettering and the soft tip for flourishes. This set is a must for beginners.", hasPhoto: true, photoUrl: imgFudenosuke, isVerified: true, date: "2025-12-18" },
  { id: "r6", productId: "12", userName: "Daniel C.", rating: 5, text: "The smoothest pen I've ever used. Converts ballpoint haters instantly. Quick-drying too — no smudges!", hasPhoto: false, isVerified: true, date: "2025-11-25" },
  { id: "r7", productId: "18", userName: "Alex K.", rating: 5, text: "Microns are the gold standard for illustration pens. Consistent line width and truly waterproof. Worth every cent.", hasPhoto: true, photoUrl: imgMicron05, isVerified: true, date: "2025-11-10" },
  { id: "r8", productId: "36", userName: "Mei Ling", rating: 5, text: "The Polychromos are buttery smooth and the colours are stunning. Worth the splurge if you're serious about coloured pencil work.", hasPhoto: true, photoUrl: imgPolychromos, isVerified: true, date: "2025-12-22" },
  { id: "r9", productId: "37", userName: "Aisha N.", rating: 5, text: "Love the dual tips — brush for lettering headers and fine tip for details. The colours blend so nicely with a water brush.", hasPhoto: true, photoUrl: imgTombowDual10, isVerified: true, date: "2025-12-05" },
  { id: "r10", productId: "31", userName: "Tom H.", rating: 4, text: "Great travel set for the price. The included water brush is decent. Pigmentation is solid for student-grade paints.", hasPhoto: false, isVerified: true, date: "2025-11-15" },
  { id: "r11", productId: "21", userName: "Jasmine T.", rating: 4, text: "Beautiful notebook but the paper is a bit thinner than I expected. Minor ghosting with wet inks. Still gorgeous though.", hasPhoto: false, isVerified: true, date: "2025-10-28" },
  { id: "r12", productId: "43", userName: "Kevin L.", rating: 5, text: "Keeps my desk so tidy. Classic Muji design — minimal and functional. Holds all my daily pens perfectly.", hasPhoto: true, photoUrl: imgDeskOrg, isVerified: true, date: "2025-12-10" },
];

export const communityPickOfMonth = {
  product: products.find(p => p.id === "23")!,
  customerName: "Mei Ling",
  customerNote: "I've tried so many notebooks but the Leuchtturm is the one I keep coming back to. The paper handles everything — fineliners, brush pens, even light watercolour washes. I use mine for daily journalling and meal planning. It's become my creative sanctuary.",
  projectDescription: "Weekly spread journal with watercolour accents",
};

export const categories = [
  "All",
  "Pens & Markers",
  "Pencils",
  "Notebooks",
  "Paper & Pads",
  "Paints",
  "Coloured Pencils",
  "Brushes",
  "Office Supplies",
  "Erasers",
];

export const deals = [
  { text: "🎨 20% off all Sakura products", code: "SAKURA20" },
  { text: "📦 Free shipping over S$50", code: null },
  { text: "✨ Flash Sale: Watercolour sets from S$15.90", code: "FLASH" },
  { text: "🎁 Buy 2 notebooks, get 1 free", code: "NOTE3" },
  { text: "✏️ 15% off Faber-Castell pencils", code: "FABER15" },
];

export const qaData: QAQuestion[] = [
  {
    id: "qa-1",
    productId: "4",
    question: "Is the Muji 0.5mm gel pen refillable?",
    askedBy: "Priya L.",
    createdAt: "2025-11-10T08:00:00Z",
    answers: [
      {
        id: "qa-1-a1",
        text: "Yes! Muji sells separate ink refills in-store. Just unscrew the barrel and swap out the cartridge. The 0.5mm refill fits perfectly.",
        answeredBy: "Sarah T.",
        isVerifiedBuyer: true,
        createdAt: "2025-11-11T10:30:00Z",
      },
      {
        id: "qa-1-a2",
        text: "Confirmed — I've been refilling mine for over a year. Much more eco-friendly and cost-effective.",
        answeredBy: "Ming Wei",
        isVerifiedBuyer: true,
        createdAt: "2025-11-12T14:15:00Z",
      },
    ],
  },
  {
    id: "qa-2",
    productId: "4",
    question: "Does the ink smear when used with highlighters on top?",
    askedBy: "Jun Hao",
    createdAt: "2025-12-01T09:00:00Z",
    answers: [
      {
        id: "qa-2-a1",
        text: "I highlight over my Muji gel pen notes all the time without smearing. Wait about 10 seconds after writing before highlighting to be safe.",
        answeredBy: "Rachel L.",
        isVerifiedBuyer: true,
        createdAt: "2025-12-02T11:00:00Z",
      },
    ],
  },
  {
    id: "qa-3",
    productId: "23",
    question: "Does the Leuchtturm1917 paper handle fountain pens without ghosting?",
    askedBy: "Daniel C.",
    createdAt: "2025-10-15T07:00:00Z",
    answers: [
      {
        id: "qa-3-a1",
        text: "Absolutely — I use a medium-nib fountain pen with wet ink and there's barely any ghosting. The 80gsm paper is excellent for fountain pen users.",
        answeredBy: "Priya S.",
        isVerifiedBuyer: true,
        createdAt: "2025-10-16T09:45:00Z",
      },
      {
        id: "qa-3-a2",
        text: "Very wet inks may ghost slightly on the opposite side, but for most fountain pens it's completely fine. No bleed-through at all.",
        answeredBy: "Alex K.",
        isVerifiedBuyer: true,
        createdAt: "2025-10-17T12:00:00Z",
      },
    ],
  },
  {
    id: "qa-4",
    productId: "17",
    question: "How long do the Tombow Fudenosuke tips last before they fray?",
    askedBy: "Mei Ling",
    createdAt: "2025-11-20T10:00:00Z",
    answers: [
      {
        id: "qa-4-a1",
        text: "With regular daily lettering practice, mine lasted around 4 months before the soft tip started to show wear. The hard tip is noticeably more durable.",
        answeredBy: "Aisha N.",
        isVerifiedBuyer: true,
        createdAt: "2025-11-21T08:30:00Z",
      },
    ],
  },
];
