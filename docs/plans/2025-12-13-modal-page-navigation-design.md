# Modal Entry Navigation with Page Flip

**Date:** 2025-12-13
**Branch:** `feature/leather-journal-theme`
**Status:** Design Complete

## Overview

Add navigation arrows to the entry detail modal allowing users to flip through journal entries chronologically with a page turn animation.

## Features

- Arrow buttons on left/right sides of modal
- 3D page flip animation (default) or simple slide/fade (option)
- Order matches current table sort
- Arrows disabled at first/last entry
- Keyboard support (left/right arrow keys)
- Position indicator ("Entry 3 of 12")
- Animation preference toggle alongside dark mode

## Animation Styles

### 3D Page Flip (default)
- Current page rotates on left edge using `rotateY`
- `perspective: 1500px` for depth
- ~400-500ms duration, ease-out timing
- New page revealed underneath

### Simple Slide/Fade (classic)
- Current entry slides out + fades
- New entry slides in + fades
- ~300ms duration

## Implementation

### Files to Modify
- `src/components/dashboard/JournalEntryList.tsx` - Add navigation UI and logic
- `src/context/JournalContext.tsx` - Add `pageFlipAnimation` preference
- `src/components/layout/Header.tsx` - Add animation toggle

### State Changes
- Track `currentEntryIndex` in sorted entries array
- Add `pageFlipAnimation: '3d' | 'classic'` to context
- Store preference in localStorage
