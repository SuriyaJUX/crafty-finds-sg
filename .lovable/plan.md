

## Problem

The current homepage stacks three sections vertically: DealsBanner (~96px), PersonalisedDeals (~400px with full product cards), then IntentPrompt (85vh hero). This pushes the hero well below the fold, and PersonalisedDeals itself is only partially visible. The user wants both the hero and deals visible on first load without scrolling.

## Approach Options

Here are three viable approaches, starting with the two you suggested:

### Option A — Compact deals strip with hover-expand (your suggestion)

Embed a slim "Deals picked for you" row directly beneath or overlapping the bottom of the hero section. Each deal shows as a small thumbnail pill (~80px wide) with a price badge. On hover, the card expands (scale + z-index) to reveal the full product card with name, discount, and Add to Cart.

```text
┌──────────────────────────────────────────────┐
│  DealsBanner (marquee strip, ~60px)          │
├──────────────────────────────────────────────┤
│                                              │
│         HERO (IntentPrompt)                  │
│        search bar, greeting, bg              │
│                                              │
│  ┌─┐ ┌─┐ ┌─┐ ┌─┐  ← compact deal pills     │
│  └─┘ └─┘ └─┘ └─┘    anchored to bottom      │
└──────────────────────────────────────────────┘
```

- Hero reduced from 85vh to ~70vh to fit both comfortably
- Deal pills sit in an absolutely-positioned tray at the hero's bottom edge
- Hover expands a card upward with shadow and scale transition
- Keeps the hero as the dominant visual

### Option B — Side-by-side split layout (your suggestion)

On desktop (md+), render the hero and deals as a two-column layout: hero takes ~65-70% width, deals take ~30-35% as a vertical card stack on the right. On mobile, deals collapse back to a compact horizontal scroll beneath the hero.

```text
┌────────────────────────────────────────────────┐
│  DealsBanner (marquee strip)                   │
├─────────────────────────────┬──────────────────┤
│                             │ Deals picked     │
│       HERO                  │ for you          │
│    search, greeting         │ ┌──────────┐     │
│                             │ │ Product  │     │
│                             │ └──────────┘     │
│                             │ ┌──────────┐     │
│                             │ │ Product  │     │
│                             │ └──────────┘     │
├─────────────────────────────┴──────────────────┤
```

- Feels more like a dashboard/marketplace
- Trades hero visual impact for information density
- More complex responsive handling

### Option C — Overlay carousel at hero bottom (hybrid)

A floating semi-transparent card carousel anchored to the bottom of the hero. Shows 3-4 compact deal cards in a horizontal strip with auto-scroll. Cards are small (~140px) with product image, name, and crossed-out price. Clicking navigates to the product. A subtle glass-morphism background keeps them readable over the hero image.

## Recommendation

**Option A** is the strongest fit. It preserves the hero's visual dominance (which was carefully designed with cycling backgrounds and personalised greeting), keeps the page feeling clean on first load, and uses the hover-expand interaction you suggested. The deals are visible but unobtrusive, and expanding on hover creates a satisfying discovery moment.

## Implementation (Option A)

1. **Reduce IntentPrompt hero height** from `min-h-[85vh]` to `min-h-[70vh]` and add `relative` positioning for the deal tray anchor.

2. **Create a new `CompactDealsStrip` component** rendered inside IntentPrompt at its bottom edge (absolutely positioned). Shows 4 deal products as small circular/square thumbnails (~64px) with a discount badge. On hover, each expands into a ~200px card showing image, name, price, and discount — animated with `transition-all duration-300 scale-100 hover:scale-[1.8]` and `z-50`.

3. **Remove the standalone `<PersonalisedDeals />` section** from Index.tsx since its content is now integrated into the hero. The "View all deals" link moves into the compact strip heading.

4. **Mobile adaptation**: On mobile, the strip becomes a horizontally scrollable row of small cards (no hover — tap to navigate to product). Slightly larger thumbnails (~80px) since hover isn't available.

5. **Files changed**:
   - `src/components/CompactDealsStrip.tsx` — new component
   - `src/components/IntentPrompt.tsx` — reduce height, embed CompactDealsStrip
   - `src/pages/Index.tsx` — remove standalone PersonalisedDeals import

