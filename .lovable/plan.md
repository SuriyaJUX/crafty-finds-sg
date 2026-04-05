

## Current State

The hover-expand card already exists (lines 76-102) but uses basic `opacity-0 scale-95 → opacity-100 scale-100` with `duration-300`. It works but feels flat — no easing personality, no subtle motion cues on the pill itself, and the transition is generic.

## Plan

Enhance the hover interaction to feel polished and dynamic:

### 1. Pill hover micro-animation
- Add a subtle `group-hover:-translate-y-1` lift on the pill thumbnail so it feels like it's "rising" to meet the expanding card
- Add `group-hover:ring-2 group-hover:ring-primary/30` glow effect on the pill border

### 2. Expanded card animation refinement
- Change from `scale-95 → scale-100` to `translate-y-2 scale-95 opacity-0 → translate-y-0 scale-100 opacity-1` so the card slides up into view rather than just fading
- Increase duration to `duration-[400ms]` with `ease-out` for a smoother feel
- Add a subtle `backdrop-blur-sm` on the card's shadow area for depth
- Add the discount badge on the expanded card too, as a colored pill

### 3. Visual polish on expanded card
- Add a gradient overlay at the bottom of the product image (subtle dark-to-transparent) so the text area has more contrast separation
- Add a "View →" micro-link at the bottom of the card in primary color to hint at clickability
- Slightly round the card more (`rounded-2xl`) for a modern feel

### Files changed
- `src/components/CompactDealsStrip.tsx` — all changes in this single file

