# Arkansas Map Table Watermark Design

**Date:** 2025-12-13
**Branch:** `feature/leather-journal-theme`
**Status:** Design Complete

## Overview

Add the Arkansas map as a subtle decorative watermark behind the journal entries table, reinforcing the Arkansas fishing theme.

## Visual Treatment

- **Placement:** Behind the table only, centered and contained within bounds
- **Light mode:** ~20% opacity, sepia filter, blends with cream paper texture
- **Dark mode:** ~10-15% opacity, warm amber tint, soft-light blend
- **Scaling:** Fit within table bounds, maintain aspect ratio, centered

## Font Contrast

Ensure readability over the map background:

- **Light mode:** Enforce `#2d2a26` (inkBlack) for table text
- **Dark mode:** Enforce `#e8dfd0` (warmCream) for table text
- Add subtle text shadow for extra separation

## Implementation

Modify `JournalEntryList.tsx` TableContainer:

```tsx
backgroundImage: isDark
  ? 'url(/book_Images/ArkansasMap.jpeg)'
  : 'url(/book_Images/ArkansasMap.jpeg)',
backgroundSize: 'contain',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat',
```

Use pseudo-element or filter for opacity/tone control without modifying source image.

## Files to Modify

- `src/components/dashboard/JournalEntryList.tsx` - Add map background, fix font contrast
