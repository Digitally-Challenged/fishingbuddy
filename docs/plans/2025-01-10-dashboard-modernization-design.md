# Dashboard Modernization Design

## Overview

Modern enhancements to make the dashboard feel sleek and alive using Framer Motion animations and a cohesive water theme.

## Implementation Plan

### 1. Add Framer Motion
- Install `framer-motion` package
- No other dependencies needed

### 2. Hero Section - Parallax & Animated Gradient
**Files:** `src/components/Dashboard.tsx`

- Add parallax scroll effect on hero image (20-30% scroll translation)
- Replace static black gradient overlay with animated color gradient
- 30-second cycle: dawn blues → golden hour → dusk purples
- Keep quote readable throughout

### 3. Journal Table - Row Animations
**Files:** `src/components/dashboard/JournalEntryList.tsx`

- Wrap table rows with Framer Motion
- Staggered fade-in on load (0.05s delay between rows)
- Each row: fade + slide up (translateY: 10px → 0)
- Hover: smooth lift (translateY: -2px) with subtle shadow
- Page change: AnimatePresence for exit/enter transitions

### 4. Water Caustics Background
**Files:** `src/components/dashboard/JournalEntryList.tsx` or new component

- CSS animated SVG filter + gradient layers
- Very slow movement (~60 second cycle)
- Opacity: 5-8% (ambient, not distracting)
- Only behind journal section
- Respect dark mode (cooler blues dark, warmer light)

### 5. Entry Detail Modal Animation
**Files:** `src/components/dashboard/JournalEntryList.tsx`

- Modal entrance: scale 0.95 → 1.0 with fade (200ms)
- Backdrop blur fade-in
- Staggered content reveal:
  - Catch details (0ms)
  - Weather (100ms)
  - Water conditions (200ms)
  - Notes (300ms)
- Exit: quick fade (150ms)

## What's NOT Changing
- Stats cards stay as-is (static numbers, current design)
- No sparklines or animated counters
- Table structure/columns unchanged
- Modal content/layout unchanged

## Technical Notes
- Use Framer Motion's `useScroll` for parallax
- Use `motion.tr` for table rows (may need `motion.create('tr')` for HTML elements)
- Water caustics: CSS keyframes with SVG feTurbulence filter
- All animations should respect `prefers-reduced-motion`
