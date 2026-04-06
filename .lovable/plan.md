

## Improve Hero Text Visibility

### Problem
The hero headline, subtitle, and other text sit over a video background with only a 55% opacity overlay (`bg-background/55`), making text hard to read depending on the video frame.

### Changes — `src/components/IntentPrompt.tsx`

1. **Darken the overlay** — change `bg-background/55` to `bg-background/65` for better contrast
2. **Add text shadows to headline and subtitle** — apply a dark glow/shadow via inline style so text pops regardless of video brightness:
   - `h1`: `textShadow: "0 2px 12px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)"`
   - Subtitle `p`: `textShadow: "0 1px 8px rgba(0,0,0,0.3)"`
3. **Add subtle shadow to search input** — add `shadow-md` for depth separation
4. **Add text shadow to category pill buttons** — light shadow so labels stay legible over any video frame

No other files change. These are purely visual tweaks to the existing IntentPrompt component.

