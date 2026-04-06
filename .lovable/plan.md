

## Rename Tiers: Inker → Scribe, Illustrator → Creator

### Changes

**1. `src/context/AuthContext.tsx`**
- Update `TierName` type: `"inker"` → `"scribe"`, `"illustrator"` → `"creator"`
- Update `getTier()` return values
- Update `TIER_MULTIPLIERS` keys
- Update Rachel's seed data `tier: "scribe"`

**2. `src/data/inkPoints.ts`**
- Update `TierName` import usage in TIERS array: `name` fields
- Update `badge` display labels: `"Inker"` → `"Scribe"`, `"Illustrator"` → `"Creator"`
- Update benefit cross-references: `"All Sketcher benefits"` stays, `"All Inker benefits"` → `"All Scribe benefits"`, `"All Illustrator benefits"` → `"All Creator benefits"`

### Summary
A straightforward find-and-replace across 2 files. All tier logic, multipliers, and thresholds remain unchanged — only the names update.

