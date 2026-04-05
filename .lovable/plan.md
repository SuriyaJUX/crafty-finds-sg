

## Problem

The confirmation page stacks everything in a single narrow column: hero → order summary → ink points → tier upgrade → guest upsell → notification toggle → product recommendation → CTA buttons. The "Track Order" button and notification toggle end up far below the fold.

## Solution

Restructure into a **two-column layout** (desktop) so primary actions are immediately visible, and compact the hero card.

### Layout

```text
┌─────────────────────────┬──────────────────────┐
│  Confirmation Hero      │  Track Order + CTAs   │
│  (compact: icon+title   │  Notification toggle  │
│   + order ID + address  │  Ink Points earned    │
│   + delivery date)      │  (or Guest upsell)    │
│─────────────────────────│                       │
│  Order Summary          │                       │
│  (collapsible)          │                       │
└─────────────────────────┴──────────────────────┘
│  Below fold: Tier upgrade, Recommendation       │
└─────────────────────────────────────────────────┘
```

### Key changes

1. **Two-column grid on `md:`** — Left column: hero card + order summary. Right column: CTA buttons, notification toggle, Ink Points card (or guest upsell). Right column is `sticky top-24` so it stays visible while scrolling.

2. **Compact the hero card** — Reduce the checkmark icon from `w-16 h-16` to `w-10 h-10`. Reduce heading from `text-3xl` to `text-2xl`. Tighten padding from `p-8` to `p-5`. This saves ~80px of vertical space.

3. **Move CTA buttons to right column top** — "Track Order" and "Continue Shopping" become the first thing in the right column, immediately visible on load.

4. **Notification toggle moves to right column** — sits right below the CTAs, naturally discoverable.

5. **Ink Points / Guest upsell in right column** — below the notification toggle in the sidebar.

6. **Order summary becomes collapsible** — wrapped in a `<details>` element, open by default but saves space if user collapses it.

7. **Below the grid**: Tier upgrade panel and product recommendation remain full-width below the two-column area (secondary content).

8. **Mobile**: Single column, but reorder so CTAs + notification toggle come **immediately after** the hero card, before the order summary.

### Files changed
- `src/pages/CheckoutConfirmation.tsx` — restructure layout to two-column grid, reorder elements, compact hero

