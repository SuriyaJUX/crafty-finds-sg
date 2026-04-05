

## Problem

The expiry reminder pill floats as a separate element in the hero's vertical flow — between the category buttons and the deals strip. It adds visual noise to the central content area and competes with the search bar and CTAs for attention.

## Solution

Move the expiry warning **into the existing loyalty sidebar** (desktop) and **into the mobile greeting pill** (mobile) — the natural home for Ink-related information. This eliminates the standalone pill entirely.

### Changes to `src/components/IntentPrompt.tsx`

1. **Desktop: Add expiry line to loyalty sidebar** — Below the streak line in the left-anchored glass card (lines 106-136), add a compact amber-tinted row: `⏳ 150 Ink expiring · Shop →`. Same `text-[11px]` size as existing sidebar content. The "Shop" link navigates to `/shop`. Include a small dismiss X. This keeps all loyalty info in one place.

2. **Mobile: Append to greeting pill** — Extend the mobile greeting chip (lines 143-155) with a second line or adjacent pill when expiry is active: `⏳ 150 Ink expiring soon · Shop →` in the same compact style.

3. **Remove the standalone expiry pill** — Delete lines 213-234 (the centered `backdrop-blur-md bg-amber-500/10` block). No more floating element in the hero flow.

### Why this works
- Loyalty sidebar already shows points, tier, and streak — expiry is contextually related
- No new visual element added to the hero; information density stays the same
- Mobile gets a subtle addition to an existing chip rather than a separate banner
- The hero's headline → search → categories → deals flow remains uninterrupted

### File changed
- `src/components/IntentPrompt.tsx`

