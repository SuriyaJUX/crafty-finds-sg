

## Problem

The Wishlist page is a plain grid of saved products with no connection to the Ink Points goal system. Users currently have to navigate to the Account page to set a product as their points goal — there's no way to do it from the page where they've already bookmarked items they want.

## Solution

Add a "Set as Goal" action to each saved product on the Wishlist page, and show a goal progress card at the top when a goal is active.

### Changes

**`src/pages/Wishlist.tsx`**

1. **Goal progress banner** — When the user has an active `pointsGoal` that matches a saved item, show a compact progress card at the top of the page (product thumbnail, name, progress bar, points needed vs current balance, estimated orders to go). Include a "Clear goal" button.

2. **"Set as Goal" button on each product card** — Below each `ProductCard` in the grid, render a small button/link: a target icon + "Set as Ink Goal". If that product is already the active goal, show a highlighted "Current Goal" badge instead. Clicking sets `pointsGoal` via `patchUser`.

3. **Goal-set product visually distinguished** — The card for the active goal product gets a subtle accent ring/border (e.g. `ring-2 ring-primary/30`) so it stands out in the grid.

4. **Auth gate** — Only show goal functionality for authenticated users. For guests, optionally show a small "Log in to set goals" hint.

### Technical details

- Import `useAuth` and `patchUser` + the `REDEMPTION_RATE` constant from existing modules
- Reuse the same `pointsGoal` shape already on `MockUser`: `{ targetAmount, targetProductId }`
- The goal progress calculation mirrors what `Account.tsx` already does (lines 347-351)
- No new context or data model changes needed — everything plugs into existing infrastructure

### File changed
- `src/pages/Wishlist.tsx`

