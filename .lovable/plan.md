

## What's changing

The current hover-expand card is too small (48px wide, tiny text). The user wants it to expand into a full product card similar to the reference image — showing a large product image, community favourite badge, discount badge, wishlist heart, product name, star rating with review count, price with strikethrough original, and color swatches.

## Plan

### Enlarge the expanded hover card in `CompactDealsStrip.tsx`

**Current**: The expanded card is `w-48` (~192px) with minimal details.

**New**: Expand to `w-56` (~224px) and add all ProductCard-style details:

1. **Card size**: Change from `w-48` to `w-56` for a more substantial card
2. **Image area**: Keep aspect-square with the product image, gradient overlay
3. **Badges on image**:
   - Community Favourite badge (top-left, amber pill with heart emoji) — shown conditionally
   - Discount percentage badge (top-left, below community badge, amber/yellow pill)
   - Wishlist heart icon (top-right, circular button)
4. **Details section** below image:
   - Product name (2-line clamp, medium weight)
   - Star rating + review count (e.g. "★ 4.6 (334)")
   - Price row: current price bold + original price strikethrough
   - Color swatches row (small dots) if product has multiple colors
5. **Animation**: Keep the existing slide-up + fade + scale transition at 400ms

### Files changed
- `src/components/CompactDealsStrip.tsx` — update the expanded card markup (lines 76-113)

