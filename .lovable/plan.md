

## Problem

When authenticated, the hero stacks **9 distinct elements** vertically in a narrow center column:
1. Greeting pill (name + Ink balance + tier badge)
2. Headline
3. Subtitle
4. Search bar
5. Image search hint
6. Category buttons
7. Tier progress strip (streak + progress bar)
8. Expiring ink nudge link
9. CompactDealsStrip

This creates a cramped, noisy layout that pushes the hero well past its ideal height.

## Redistribution Strategy

### Keep in hero center (priority elements)
- Headline
- Search bar + camera icon
- Category buttons (Just browsing, Pens & Markers, etc.)
- CompactDealsStrip (at the bottom, untouched)

### Move: Greeting + loyalty info → left-anchored sidebar card
Instead of a center-aligned pill above the headline, render a small **glass-morphism card anchored to the left edge** of the hero (vertically centered). Contains:
- "Welcome back, {name}" heading
- Ink balance + tier badge on one line
- Streak count as a subtle line
- Tier progress bar (compact)

This uses the empty left side of the hero and removes 3 elements from the vertical stack.

### Remove from hero entirely
- **Expiring ink nudge** — already duplicated as the amber warning card in `Index.tsx` (lines 80-103), so the hero version (lines 242-251) is redundant. Remove it.

### Subtitle → smaller, integrated with headline
Reduce the subtitle from `text-lg` to `text-sm text-muted-foreground` and tighten the margin, making it feel like a tagline rather than a separate block.

### Animations
- Left loyalty card: `animate-fade-in` with a slight horizontal slide (enters from left)
- Category buttons: staggered fade-in using inline `animation-delay` on each button
- Search bar: subtle scale-in on mount

## Technical Details

### Files changed

**`src/components/IntentPrompt.tsx`**
- Restructure the content div from single centered column to a relative layout:
  - Center: headline + subtitle + search + buttons (narrower `max-w-2xl`)
  - Left side: authenticated loyalty card, absolutely positioned at `left-4 md:left-8 top-1/2 -translate-y-1/2`
- Remove the tier progress strip (lines 218-254) and the greeting pill above the headline (lines 129-146)
- Add the new left-anchored card: ~160px wide glass card with `bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-4`
- Add staggered animation delays to category buttons
- Reduce subtitle size
- The left card only renders on `md:` and up; on mobile, show a compact single-line greeting above the headline (much smaller than current)

**`tailwind.config.ts`** (if needed)
- Add a `slide-in-left` keyframe for the loyalty card entrance animation

