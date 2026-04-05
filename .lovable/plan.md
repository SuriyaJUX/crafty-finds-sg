

## Problem

The "Added to cart" toast appears at the **top-right** corner, which overlaps with the cart drawer when it's open. This feels intrusive.

## Solution

Move the `ToastViewport` position from `top-0 right-0` to **bottom-center**, so notifications appear as a subtle bar at the bottom of the screen — away from the cart drawer entirely.

### Change

**`src/components/ui/toast.tsx`** (line 17)
- Change the viewport classes from `fixed top-0 right-0 ... sm:flex-col md:max-w-[420px]` to `fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col p-4 sm:flex-col md:max-w-[420px]`
- This positions all legacy toasts (used for add-to-cart, login, vouchers, etc.) at the **bottom-center** of the viewport

Single file, single line change.

