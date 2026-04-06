

## Create Help & Support Page

### Overview
A dedicated `/help` page with three main sections using accordions: FAQ, Ink Points system guide, and returns/unsatisfactory items policy. The floating help button will navigate here instead of the About page.

### Sections

**1. Frequently Asked Questions**
- Ordering & payment (accepted methods, order changes, processing time)
- Shipping & delivery (timeframes, tracking, delivery areas)
- Account & login issues

**2. Ink Points System — Tips & Guidelines**
- How to earn points (purchase, reviews, referrals, daily login streaks, Creative Paths)
- Tier breakdown: Scribe vs Creator with benefits
- Redemption rate (200 pts = S$1)
- Seasonal challenges explanation
- Tips to maximise earnings

**3. Unsatisfactory Items & Returns**
- What to do if an item arrives damaged or defective
- Return/exchange eligibility and timeframe
- How to initiate a return (contact email)
- Refund process and timeline

### Technical Changes

**New file: `src/pages/HelpSupport.tsx`**
- Uses Accordion components from `@/components/ui/accordion`
- Three sections with icons (HelpCircle, Sparkles, PackageX)
- Pulls tier and earn rate data from `@/data/inkPoints.ts` for accuracy
- Consistent styling with About page (container, font-serif headings)

**Edit: `src/App.tsx`**
- Add route: `/help` → `<HelpSupport />`

**Edit: `src/components/FloatingHelpButton.tsx`**
- Change navigation from `/about` to `/help`

**Edit: `src/components/Navbar.tsx`** (if Help link exists)
- Update any nav links pointing to About for help purposes

