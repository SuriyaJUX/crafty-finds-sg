

## Problem

The order tracking page has three issues:

1. **Stiff timeline** — The tracking timeline is a static vertical list with no sense of progression or phase transitions. It feels like a plain list, not a journey.

2. **"What would you like to do?" buried below fold** — Users must scroll past the timeline and order items to reach post-delivery actions.

3. **Duplicate review CTAs** — After confirming receipt, there's both a prominent review card AND a "Leave a Review" tile in the action grid. Also, clicking "Write a review" navigates to the product page but doesn't scroll to or open the review section.

---

## Solution

### 1. Dynamic phase-based timeline

Replace the vertical list timeline with a **horizontal stepper** that shows the current phase as a prominent "card" with animated transitions between phases.

- **Horizontal step indicators** at the top: small circles/dots connected by a progress bar, showing all phases at a glance
- **Active phase card** below: a larger card showing the current step's icon (animated pulse), label, description, and timestamp — this replaces the vertical list
- When advancing, the card **cross-fades** (fade-out old → fade-in new) for a smooth phase transition feel
- "Show full timeline" becomes a collapsible vertical detail log below the phase card, for users who want granular history
- Use existing `animate-fade-in` and `animate-scale-in` keyframes for transitions

### 2. Two-column layout with sticky actions sidebar

Restructure into `grid md:grid-cols-[1fr_280px]` when the order is delivered:

- **Left column**: Header card → Phase timeline → Order items
- **Right column** (sticky): "What would you like to do?" card — always visible without scrolling

On mobile: reorder so the actions card appears **immediately after the header**, before the timeline.

### 3. Remove review duplication & fix navigation

- **Remove** the "Leave a Review" tile from the 3-column action grid (lines 619-628) — the prominent review card above it is sufficient
- The action grid becomes 2 columns: "Report an Issue" and "Request a Return"
- **Fix the review navigation**: In `ProductDetail.tsx`, consume `location.state.openReview`:
  - Auto-open the `WriteReviewModal` when `openReview` is true
  - Scroll the reviews section into view with `scrollIntoView({ behavior: 'smooth', block: 'center' })`

### 4. Entrance animations

- Action cards in the "What would you like to do?" section get staggered `animate-fade-in` with increasing delays
- The phase card uses `animate-scale-in` on mount and cross-fades on phase change

---

## Files changed

**`src/pages/OrderTracking.tsx`**
- Replace vertical timeline with horizontal stepper + active phase card with cross-fade
- Restructure to two-column grid (desktop) with sticky right sidebar for actions
- Mobile: move actions section above timeline
- Remove duplicate "Leave a Review" tile from action grid
- Add staggered animations to action cards

**`src/pages/ProductDetail.tsx`**
- Read `location.state?.openReview` via `useLocation`
- If true, auto-open `WriteReviewModal` and scroll reviews section into view on mount

**`tailwind.config.ts`**
- Add `cross-fade-in` keyframe if needed for the phase card transition

