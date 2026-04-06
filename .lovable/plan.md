

## Replace Floating Help Button with Animated Notingale Bird Widget

### Overview
Replace the circular help button in the bottom-right corner with the Notingale bird mascot. The bird faces left, sits idle by default, and plays a wing-flap animation whenever the user scrolls — returning to its resting state when scrolling stops.

### Approach

Since we have a single raster logo (Original.png) and can't extract individual frames from the sprite sheet programmatically, the bird will be rendered as an **inline SVG** traced from the Original.png design. This allows:
- Guaranteed left-facing orientation
- CSS-driven wing-flap animation by transforming the wing path elements independently
- Crisp rendering at any size
- No image loading delays

The SVG will have two logical groups: **body** (head, torso, tail, pen nib) and **wing** (the upper swept feathers). The wing group gets a CSS keyframe animation (`@keyframes flap`) that applies a slight rotateZ + scaleY oscillation anchored at the wing joint, creating a convincing flap effect.

### Animation Behavior
- **Idle**: Bird sits still, subtle hover-bounce on mouse hover
- **Scrolling**: Detect scroll via a `scroll` event listener with a debounced timeout (~150ms). While scrolling, add a `flapping` class that triggers 3-4 rapid wing cycles
- **Stop scrolling**: Remove class, bird eases back to rest

### Technical Changes

**1. Copy asset**: Copy `Original.png` to `src/assets/notingale.png` as a fallback reference

**2. Rewrite `src/components/FloatingHelpButton.tsx`** → rename concept to `NotingaleWidget`
- Remove HelpCircle icon, replace with inline SVG of the bird (facing left)
- Add `useEffect` with scroll listener + timeout to toggle `isFlapping` state
- SVG wing group gets `animate-flap` class when `isFlapping` is true
- Keep: click → navigate("/help"), cart-aware positioning, tooltip
- Size: ~56×56px container, bird fills ~44px

**3. Add flap keyframes to `tailwind.config.ts`**
```
"flap": {
  "0%, 100%": { transform: "rotate(0deg) scaleY(1)" },
  "25%": { transform: "rotate(-12deg) scaleY(0.85)" },
  "75%": { transform: "rotate(8deg) scaleY(1.1)" }
}
```
Animation: `"flap": "flap 0.3s ease-in-out 3"` (3 cycles per scroll burst)

**4. No changes to `src/App.tsx`** — component name stays `FloatingHelpButton` (or we rename the import).

### Result
A branded bird mascot that feels alive — flapping its wings when the page moves, resting when idle. Clicking it still navigates to `/help`. The widget shifts left when the cart drawer opens (existing behavior preserved).

