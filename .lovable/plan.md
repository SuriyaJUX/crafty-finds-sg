

## Redesign Notingale Bird Widget to Match Logo

### Problems
1. Current SVG doesn't match the actual logo — it's a generic bird, not the Notingale (bird with pen-nib tail, teal wing accent, flowing S-curve body)
2. Wing flap animation is on small feathers near the head instead of the actual wings
3. Button has a circular container (`rounded-full`, `w-14 h-14`, `bg-card`, `border`) — should be borderless/transparent
4. Too small

### Plan

**Rewrite `src/components/FloatingHelpButton.tsx`**

Rebuild the SVG to accurately trace the uploaded logo. The Notingale has these distinct features:
- **Head**: Round, facing left, with a small white eye
- **Body**: Flowing S-curve merging into a pen nib at the bottom
- **Wings**: Two swept-back wings extending to the upper-right — the upper wing is dark (foreground), the lower wing has a **teal accent** (`#5f7f8a` or similar)
- **Pen-nib tail**: The body tapers into a fountain pen nib pointing down, with a small oval hole and a sharp tip
- White negative-space curves separate the body from the wings

SVG structure:
- `<g id="body">` — head, body, pen-nib (static, `fill-foreground`)
- `<g id="wing-upper">` — dark upper wing (animated, `fill-foreground`)
- `<g id="wing-lower">` — teal lower wing (animated, `fill-[#5f7f8a]`)
- Eye as `fill-card` circle

**Animation**: The `animate-flap` class applies to **both wing groups**, with transform-origin at the wing joint (where wings meet the body). The wings rotate up/down to simulate flapping.

**Container changes**:
- Remove `rounded-full`, `bg-card`, `shadow-lg`, `border`
- Make container transparent, larger: `w-16 h-16` or `w-20 h-20`
- SVG fills the container
- Keep: fixed positioning, cart-aware offset, click→`/help`, tooltip

**No changes to `tailwind.config.ts`** — existing `flap` keyframes work, but update transform origin in the component.

