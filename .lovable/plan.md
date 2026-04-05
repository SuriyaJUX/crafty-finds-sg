

## Problem
The hero section currently cycles through 4 static JPG background images with crossfade transitions. The user wants to replace this with a looping background video.

## Solution
Replace the image carousel with a single `<video>` element playing the uploaded MP4 on loop, muted, and autoplaying. Remove the image cycling logic (state, refs, timers, imports) that is no longer needed.

### Changes — `src/components/IntentPrompt.tsx`

1. **Copy uploaded video** to `public/videos/hero-bg.mp4` (public folder since it's a large media asset better served statically than bundled)
2. **Remove** imports for `heroBg1–heroBg6`, the `heroImages` array, `FADE_DURATION` constant
3. **Remove** the `currentImage`, `leavingImage`, and `leavingTimerRef` state/refs and the `useEffect` that cycles images
4. **Replace** the `heroImages.map(...)` block with a single `<video>` element:
   - `autoPlay`, `muted`, `loop`, `playsInline` attributes
   - `className="absolute inset-0 w-full h-full object-cover"` with `zIndex: 1`
   - `src="/videos/hero-bg.mp4"`
5. **Keep** the overlay div and all content below unchanged

### File touched
- `src/components/IntentPrompt.tsx` — swap images for video, remove cycling logic

