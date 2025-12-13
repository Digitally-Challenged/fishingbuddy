# Journal Cover Design

**Date:** 2025-12-13
**Branch:** `feature/leather-journal-theme`
**Status:** Design Complete

## Overview

Add a leather journal cover as the landing page. Users click a bronze clasp to "open" the journal, revealing the dashboard with a 3D book-opening animation.

## Cover Layout

The cover fills the viewport with `leather-dark.webp` texture and subtle edge vignette.

**Visual elements (top to bottom):**
1. **Stitching border** - Perimeter decoration using `stitching-border.webp`, 20-30px from edges
2. **Engraved fish icon** - Centered in upper third, embossed/etched effect, muted bronze tone
3. **Title** - "Westfall Fishing Journal" in Special Elite font, etched into leather
4. **Quote** - *"The River giveth, and the River taketh away."* in italic Lora, etched effect
5. **Bronze clasp** - Bottom center, invites user to open

All text and icons use the same etched-into-leather effect for cohesive handcrafted appearance.

## Etched Effect CSS

```css
color: rgba(60, 40, 25, 0.8);
text-shadow:
  1px 1px 1px rgba(255,240,220,0.3),  /* Light highlight */
  -1px -1px 1px rgba(0,0,0,0.4);       /* Dark shadow */
```

## Bronze Clasp

- Shape: Rounded rectangle (~120px × 40px)
- Background: `linear-gradient(to bottom, #c9a227, #8b6914)`
- Border: `2px solid #5c4410`
- Text: "Open Journal" in Special Elite
- Hover: Glow effect, scale 1.05
- Click: Pressed/release animation

## Book-Opening Animation

Sequence on clasp click:

1. **Clasp unlocks** (50ms) - Release animation with bounce
2. **Cover lifts** (100ms) - Shadow appears underneath
3. **3D rotation** (600-800ms) - Cover rotates on left edge
   - `transform: rotateY(-180deg)`
   - `transform-origin: left`
   - `perspective: 1500px` on parent
   - Cover fades at 90° rotation
4. **Content revealed** - Dashboard fades in

Timing: `ease-out` for natural weighted feel.

## Session Handling

- Show cover once per browser session
- Check `sessionStorage.getItem('journalOpened')` on mount
- Set `sessionStorage.setItem('journalOpened', 'true')` after opening
- Resets when browser tab closes

## Component Structure

```
App.tsx
├── JournalCover (when !isJournalOpen)
│   ├── LeatherBackground
│   ├── StitchingBorder
│   ├── EtchedFishIcon
│   ├── EtchedTitle
│   ├── EtchedQuote
│   └── BronzeClasp
│
└── AppContent (when isJournalOpen)
    └── (existing dashboard)
```

## Files to Create/Modify

- **Create:** `src/components/JournalCover.tsx`
- **Modify:** `src/App.tsx` - Add cover state and conditional rendering
