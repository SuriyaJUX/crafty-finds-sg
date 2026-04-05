

## Problem

The Savings & Rewards card is embedded **inside the left payment column** (after the payment method panel), forcing the page to scroll. The goal is to fit the entire payment page in a single viewport.

## Solution

Move the Savings & Rewards card to the **right sidebar**, stacked below the Order Summary. This removes significant vertical bulk from the left column and uses the empty space on the right.

### Layout changes

**Right column** (desktop): Stack Order Summary + Savings & Rewards inside the sticky sidebar, both in a single scrollable container if needed.

**Left column**: Remove the inline `<SavingsRewardsCard />` call (line 633) and the confirmation nudge (lines 636-662). The left column becomes: payment method selection → trust badges → error display → Place Order button. This should comfortably fit in one viewport.

**Mobile**: Keep Savings & Rewards below the mobile order summary accordion (since there's no right column on mobile).

### Additional improvements

1. **Compact the right sidebar** — combine Order Summary and Savings & Rewards under a single card with a subtle divider, reducing border/padding overhead.
2. **Sticky "Place Order" on mobile** — add a fixed bottom bar on small screens so the user never has to scroll to find the CTA.
3. **Savings badge on Place Order button** — if savings are applied, show a small "You save S$X.XX" line below the button total, reinforcing the value without needing the nudge card.

### Files changed

**`src/pages/CheckoutPayment.tsx`**
- Move `<SavingsRewardsCard />` from left column (line 633) into the right sidebar `div` (after `<OrderSummary />`), wrapped with a `<Separator />` or `border-t`
- Remove the confirmation nudge block (lines 636-662) — savings are now always visible in the sidebar
- Add mobile rendering of `<SavingsRewardsCard />` inside the mobile summary accordion area
- Optionally add a sticky mobile bottom bar with the Place Order button

