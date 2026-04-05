

## Problem

The current hover effect uses an **absolute-positioned popup floating above** the thumbnail, which gets clipped by the hero section above it. The user wants an **inline expansion** — when hovering over a thumbnail, it smoothly expands in-place into a full product card within the row, pushing siblings aside. This matches the reference images exactly.

## Approach

Replace the floating popup with an **inline width/height transition** on the item itself:

### How it works

1. **Default state**: Each item is a small `w-[72px] h-[72px]` rounded thumbnail (same as now)
2. **Hovered state (desktop)**: The hovered item smoothly expands to `w-[180px]` with auto height, becoming a mini product card showing image, badges, heart, name, rating, price, and color swatches — all **inline in the flex row**, not floating
3. **Other items stay as thumbnails** — the row naturally reflows as one item grows
4. The flex container uses `items-start` so expanded cards align from the top

### Technical details in `CompactDealsStrip.tsx`

- **Remove**: The entire absolute-positioned floating card (lines 80-149) and the hover-lift effects on the pill
- **Replace with**: A single `div` per item that transitions `width` and `height` via CSS `transition-all duration-400 ease-out`. On `group-hover`, width goes from `72px` to `180px`, overflow becomes visible, and the details section (name, rating, price, swatches) fades in with `opacity-0 → opacity-100` and a slight delay
- The image stays `aspect-square` at the top, badges overlay the image, details render below
- Use `overflow-hidden` on non-hovered state to clip the details section, which is always rendered but hidden when collapsed
- The flex container changes from `justify-center` to `justify-center` with `items-start` alignment

### Animation

- `transition-all duration-[400ms] ease-out` on the card wrapper for smooth width/height expansion
- Details section uses `opacity-0 group-hover:opacity-100 transition-opacity delay-150` so text fades in after the card starts expanding
- No translate/scale — pure dimensional growth for a clean, non-clumsy feel

### Files changed
- `src/components/CompactDealsStrip.tsx` — rewrite the card markup to use inline expansion instead of floating popup

