# Leather Journal Theme Design

**Date:** 2025-12-12
**Branch:** `feature/leather-journal-theme`
**Status:** Design Complete

## Overview

Transform the fishing journal app's visual styling to evoke a vintage leather-bound fishing logbook from the 1970s. The aesthetic combines weathered leather covers, aged cream paper, typewriter text, and hand-colored illustrations.

## Design Direction

**Era/Feeling:** Vintage/Nostalgic — like grandpa's tackle box logbook
**Primary Surface:** Weathered leather journal with cream pages inside
**Typography:** Typewriter for headers/dates, warm serif for body text
**Color Approach:** Sepia/cream base with pops of color for fish icons (like hand-colored illustrations)
**Leather Treatment:** Subtle full frame on viewport, heavier treatment on modals

---

## Color Palette

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-paper` | `#f5f0e6` | Main background |
| `cream-light` | `#faf8f3` | Cards, entry backgrounds |
| `leather-dark` | `#5c4033` | Primary accent, borders |
| `leather-deep` | `#3d2b1f` | Headers, deep accents |
| `leather-light` | `#8b6b4a` | Lighter accents, stitching |
| `ink-black` | `#2d2a26` | Primary text (warm black) |
| `ink-faded` | `#5a544a` | Secondary text |
| `sepia` | `#704214` | Dates, timestamps, metadata |
| `line-rule` | `#d4c4a8` | Ruled lines on paper |

### Dark Mode ("Lamplight Study")

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-dark` | `#1a1512` | Dark walnut background |
| `paper-dark` | `#2d2520` | Aged parchment cards |
| `leather-dark-mode` | `#2a1f1a` | Deep leather |
| `text-primary-dark` | `#e8dfd0` | Warm cream text |
| `text-secondary-dark` | `#a89880` | Muted tan |
| `accent-amber` | `#c4956a` | Amber highlights |

---

## Typography

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| Headers/Dates/Labels | Special Elite | Courier New, monospace |
| Body/Entries | Lora | Georgia, serif |
| UI Elements | Lora | Georgia, serif |

### Type Scale

```
Entry dates:     Special Elite, 14px, sepia (#704214)
Section headers: Special Elite, 18-20px, leather-deep (#3d2b1f)
Entry body:      Lora, 16px, ink-black (#2d2a26)
Metadata/labels: Special Elite, 12-13px, ink-faded (#5a544a)
```

### Special Treatments

- Dates: Subtle "stamped" look (slightly rotated, faint border)
- Entry titles: Typewriter feel
- Body text: Readable serif for longer content

---

## Textures

All textures generated via Gemini AI, optimized as WebP.

| File | Size | Usage |
|------|------|-------|
| `leather-dark.webp` | 145KB | Modal frames, viewport border |
| `leather-light.webp` | 309KB | Buttons, light accents |
| `paper-cream.webp` | 9KB | Main backgrounds, cards |
| `paper-lined.webp` | 23KB | Entry detail view |
| `stitching-border.webp` | 186KB | Decorative modal separators |

**Location:** `public/textures/`

### Dark Mode Texture Handling

Apply CSS filters to existing textures:
- Leather: `brightness(0.4)`
- Paper: `brightness(0.3) sepia(0.2)` for lamplight warmth

---

## Component Styling

### Cards (Journal Entries)

- Background: `paper-cream.webp` texture
- Border: Subtle leather color (`#5c4033`) with soft shadow
- Border radius: 4-8px (crisp, not overly rounded)
- Entry detail: Optional `paper-lined.webp` background

### Modals ("Open Journal" Experience)

- Outer frame: `leather-dark.webp` as border (16-24px padding)
- Inner content: `paper-cream.webp` background
- Decorative: `stitching-border.webp` at top/bottom edges
- Shadow: Deep, warm drop shadow

### Buttons

| Type | Style |
|------|-------|
| Primary | Leather-brown bg (`#5c4033`), cream text, embossed effect |
| Secondary | Cream bg, leather-brown border |
| Hover | Slightly darker, pressed-into-leather feel |

### Form Inputs

- Background: Light cream (`#faf8f3`)
- Border: Thin sepia line (`#d4c4a8`)
- Focus: Darker sepia border, subtle warm glow

### Viewport Frame

- Subtle leather texture on edges (CSS border-image or pseudo-elements)
- More prominent on desktop, minimal on mobile

---

## Implementation Phases

### Phase 1: Foundation
1. Install `@fontsource/special-elite` and `@fontsource/lora`
2. Create `src/theme/journalTheme.ts` with palette and typography
3. Add CSS custom properties for texture URLs in `index.css`

### Phase 2: Global Styling
1. Apply paper-cream texture to app background
2. Add leather frame to viewport edges
3. Update base typography

### Phase 3: Components
1. Update card styling (entries list)
2. Style modals with leather frame
3. Update buttons and form inputs

### Phase 4: Dark Mode
1. Add dark palette to theme
2. Implement texture filter adjustments
3. Test contrast and readability

---

## Files to Modify

```
src/theme/journalTheme.ts     # NEW - journal theme definition
src/index.css                 # Texture CSS vars, global styles
src/App.tsx                   # Theme provider updates
src/components/layout/*       # Leather frame
src/components/dashboard/*    # Card styling
src/components/sections/*     # Form styling
+ Modal components            # Leather treatment
```

---

## Assets Completed

- [x] `leather-dark.webp` - Dark leather texture
- [x] `leather-light.webp` - Light/tan leather texture
- [x] `paper-cream.webp` - Aged cream paper
- [x] `paper-lined.webp` - Lined journal paper
- [x] `stitching-border.webp` - Saddle stitch detail
