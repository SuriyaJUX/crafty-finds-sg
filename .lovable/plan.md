

## Problem

The "Set as Ink Goal" button is a tiny, unstyled text link that blends into the page. The goal progress banner appears without animation. There's no visual feedback when setting/clearing a goal, and the overall goal feature feels static and forgettable.

## Solution

Make the goal system feel alive with hover effects, animated transitions, and visual feedback.

### Changes to `src/pages/Wishlist.tsx`

1. **Animated goal banner entrance** — Wrap the goal progress card in a `animate-fade-in` transition so it slides in smoothly when a goal is set. Add a pulsing glow on the Target icon (`animate-pulse`). When progress reaches 100%, add a celebratory shimmer effect on the "Ready to redeem!" text.

2. **"Set as Ink Goal" button upgrade** — Replace the plain text link with a styled pill button that has:
   - A subtle border and rounded-full shape so it's visually distinct
   - Hover: scale up slightly (`hover:scale-105`) + border color transition to primary
   - The Target icon rotates on hover (`group-hover:rotate-45 transition-transform`)
   - Opacity transition on the entire card group: the button starts at lower opacity and becomes fully visible on card hover

3. **Goal-setting animation** — When a user clicks "Set as Ink Goal", use React state to trigger a brief scale-in animation (`animate-scale-in`) on the ring border appearing around the card, and animate the badge appearing with `animate-fade-in`.

4. **Goal card ring animation** — The `ring-2 ring-primary/30` on the active goal card transitions in with a CSS transition instead of appearing instantly. Add `transition-all duration-300` to the card wrapper so the ring animates on/off.

5. **Staggered grid entrance** — Add staggered `animate-fade-in` with incremental `animation-delay` to each product card in the grid for a cascading load effect.

6. **Progress bar animation** — Add `transition-all duration-700` to the Progress component value so it animates when points change.

### Files changed
- `src/pages/Wishlist.tsx` — All animation and interaction enhancements above

