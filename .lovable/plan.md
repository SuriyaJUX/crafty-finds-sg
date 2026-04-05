

## Problem

The current prototype uses "Paperly" branding with DM Sans/DM Serif Display fonts and a terracotta/sage/cream palette. The user wants to rebrand to **Note & Gale** using the provided brand board: Playfair Display + Inter fonts, Ink Black/Ivory/Sage/Dusty Blue/Soft Rose palette, with Dusty Blue as a dominant accent.

## Solution

Full design system rebrand across typography, color palette, and brand name references.

### 1. Typography swap
Replace DM Sans → **Inter** and DM Serif Display → **Playfair Display** in the Google Fonts import (`src/index.css`) and Tailwind config (`tailwind.config.ts`).

### 2. Color palette overhaul
Remap CSS custom properties in `src/index.css` to the brand board palette:

| Role | Current | New (brand board) |
|------|---------|-------------------|
| **background** | warm cream (40 33% 96%) | Ivory (~40 30% 97%) |
| **foreground** | dark blue-grey | Ink Black (~220 15% 15%) |
| **primary** | terracotta (14 60% 55%) | **Dusty Blue** (~210 25% 55%) |
| **secondary** | sage green (150 25% 45%) | Sage (~130 18% 52%) |
| **ring/focus** | terracotta | Dusty Blue |
| **accent** | warm cream tint | Soft Rose tint (~10 30% 92%) |
| **deals-banner** | terracotta | Dusty Blue |
| **badge-community** | gold | Sage |

Dark mode values updated accordingly. Dusty Blue becomes the primary action color (buttons, links, focus rings, banners).

### 3. Brand name replacement
Replace all "Paperly" text references with "Note & Gale" across:
- `src/components/Navbar.tsx` — logo text
- `src/components/Footer.tsx` — brand name, tagline → "Where Ideas Take Flight", copyright
- `src/pages/About.tsx` — all mentions, email domains → `hello@noteandgale.sg`
- `src/pages/Login.tsx`, `src/pages/Signup.tsx` — welcome text
- `src/context/AuthContext.tsx` — storage keys and welcome message
- `src/pages/OrderTracking.tsx`, `src/pages/OrderReturn.tsx`, `src/components/WriteReviewModal.tsx` — storage key prefixes
- `index.html` — page title

### 4. Tailwind config update
Update `tailwind.config.ts` font family definitions to reference Inter and Playfair Display.

### Files changed
- `src/index.css` — fonts + all CSS custom properties
- `tailwind.config.ts` — font families
- `index.html` — title
- `src/components/Navbar.tsx` — brand name
- `src/components/Footer.tsx` — brand name + tagline
- `src/pages/About.tsx` — brand references
- `src/pages/Login.tsx` — brand reference
- `src/pages/Signup.tsx` — brand reference
- `src/context/AuthContext.tsx` — storage key + welcome message
- `src/pages/OrderTracking.tsx` — storage key
- `src/pages/OrderReturn.tsx` — storage key
- `src/components/WriteReviewModal.tsx` — storage key

