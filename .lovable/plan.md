

## Problem

The ink expiry warning sits as a standalone card between the streak banner and the hero (`IntentPrompt`), breaking the visual flow. It's a separate block with its own container padding that disrupts the hero-to-content rhythm.

## Solution

Integrate the expiry reminder **into the hero section itself** as a subtle, non-intrusive overlay rather than a separate page-level block.

### Approach

Move the expiry warning from `Index.tsx` into the `IntentPrompt` hero component, rendered as a slim inline banner anchored near the bottom of the hero (just above the `CompactDealsStrip`). This keeps it visible but part of the hero's visual language — glass-morphism style, matching existing loyalty sidebar aesthetics — instead of a separate amber card that breaks the layout.

### Changes

**`src/pages/Index.tsx`**
- Remove the expiring points warning block (lines 79-103)
- Pass `expiringTotal`, `earliestExpiry`, `expiryDismissed`, and `setExpiryDismissed` as props to `IntentPrompt`

**`src/components/IntentPrompt.tsx`**
- Accept the expiry props
- Render a slim glass-morphism pill/banner inside the hero (positioned above the deals strip or below the search bar) with the expiry message, "Shop now →" link, and dismiss button
- Style: `backdrop-blur-md bg-amber-500/10 border border-amber-300/30 rounded-full` — blends with the hero instead of breaking flow
- Animate in with `animate-fade-in`

### Files changed
- `src/pages/Index.tsx`
- `src/components/IntentPrompt.tsx`

