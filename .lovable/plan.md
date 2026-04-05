

## Color Audit: Too Much Blue

### Findings

The brand board defines 5 colors: **Ink Black**, **Ivory**, **Sage**, **Dusty Blue**, and **Soft Rose**. Currently:

| Color | Role | Usage |
|-------|------|-------|
| Dusty Blue (`--primary`) | Everything interactive | 879 matches in 43 files — buttons, links, badges, deals banner, discount tags, focus rings, hover states, nav, progress bars |
| Sage (`--secondary`) | Positive feedback | 406 matches in 23 files — shipping, savings, ink points, verified badges |
| Soft Rose (`--accent`) | Almost unused | 116 matches but nearly all in shadcn UI primitives (hover/focus defaults). Zero custom usage |

**Diagnosis**: Dusty Blue is doing triple duty as CTA color, link color, promotional/sale color, and banner background. Soft Rose — a core brand color — is essentially invisible to users.

### Proposed Rebalancing

1. **Deals banner** — Change `--deals-banner` from Dusty Blue (`210 25% 55%`) to a warm Soft Rose tone (`10 40% 65%`), giving the promotional strip a distinct, warmer identity
2. **Discount badges** on ProductCard — Switch from `bg-primary` to a new `bg-deals-banner` so sale callouts use the rose/warm palette instead of blue
3. **"Community Favourite" badge** — Keep Sage (already distinct, works well)
4. **Footer link hovers** — Change from `hover:text-primary` to `hover:text-foreground` so not every interactive element goes blue
5. **Category pill hovers** in the hero — Use `hover:border-secondary/50 hover:text-secondary` on alternating pills, or use a warmer border highlight
6. **Heart/saved icon** — Switch filled heart from `fill-primary text-primary` to a rose tone (`fill-destructive/80 text-destructive/80`) — hearts are conventionally warm-colored

### CSS Variable Changes (in `src/index.css`)
- Light: `--deals-banner: 10 40% 65%` (warm rose-mauve for banners/promos)
- Dark: `--deals-banner: 10 35% 50%` (muted rose for dark mode)

### Files Touched
- `src/index.css` — adjust `--deals-banner` values
- `src/components/ProductCard.tsx` — discount badge and heart icon colors
- `src/components/Footer.tsx` — link hover colors
- `src/components/IntentPrompt.tsx` — category button hover variation
- `src/components/Navbar.tsx` — minor: Deals link dot color

### Result
Dusty Blue stays as the primary action color (buttons, main CTAs, links in content) but promotional/sale elements shift to Soft Rose, hearts become warm-toned, and the footer feels less blue-saturated. This gives users a richer visual experience aligned with the full brand palette.

