

## Rebuild Notingale SVG to Match Reference Image

### Problem
The current SVG paths produce a bird shape that doesn't closely match the uploaded reference logo. The proportions, curves, and overall silhouette need to be redrawn.

### What changes

**File: `src/components/FloatingHelpButton.tsx`** — rewrite SVG paths only

Studying the reference image closely, the Notingale has these proportions and features:

- **Head**: Large round head on the left, centered around ~25% from left, ~30% from top. Small white dot eye
- **Breast/belly**: Smooth curve from chin downward, forming a rounded belly that flows into the pen nib tail
- **Pen-nib tail**: Extends down and slightly right from the belly, tapering to a sharp point at bottom-right. Has a small oval breather hole and a slit at the tip
- **Upper wing (dark)**: Sweeps from mid-body up and to the right, pointed tip at upper-right. Separated from body by a white S-curve
- **Lower wing (teal)**: Below the upper wing, also sweeps right, with the same white separation curves. Fill `#5f7f8a`
- **Tail feathers (dark)**: Below the wings, a dark swept shape pointing right, separated by white curves from the nib

The key issue is the body is much larger/rounder in the reference — the bird has a plump rounded breast, and the wings emerge from the back/shoulder area sweeping upward-right. The nib extends downward from the belly.

I will redraw all SVG paths with better bezier curves to match the silhouette, adjusting the viewBox if needed to accommodate the proportions. The animation groups and scroll logic remain unchanged.

### No other files change

