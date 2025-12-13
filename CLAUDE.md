# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture Overview

This is a **React + TypeScript + Vite** fishing journal application focused on Arkansas streams. The app allows anglers to log fishing trips with detailed conditions data and integrates with USGS water data.

### Core Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **MUI (Material-UI)** for components
- **Tailwind CSS** for utility styling
- **dayjs** for date handling
- **xlsx** for Excel export functionality
- **lucide-react** for icons

### State Management

The app uses React Context with `useReducer` for global state:

- `src/context/JournalContext.tsx` - Central state management for journal entries, dark mode, import/export operations
- `src/hooks/useJournalForm.ts` - Form state and validation logic
- `src/hooks/useLocalStorage.ts` - localStorage persistence hook

The `JournalContext` provides:
- Entry CRUD operations via reducer actions (`ADD_ENTRY`, `DELETE_ENTRY`, `LOAD_ENTRIES`, `IMPORT_ENTRIES`, `CLEAR_ENTRIES`)
- Dark mode toggle with system preference detection
- JSON import/export functionality

### Component Structure

```
src/
├── components/
│   ├── Dashboard.tsx              # Main dashboard view
│   ├── FishingJournalForm.tsx     # Entry creation form (single-page)
│   ├── WizardForm.tsx             # Multi-step wizard form (mobile-friendly)
│   ├── FishIcon.tsx               # Fish species icon component
│   ├── LureIcon.tsx               # Lure/bait icon component
│   ├── dashboard/                 # Dashboard sub-components
│   │   ├── JournalEntryList.tsx
│   │   ├── JournalStats.tsx
│   │   └── RecentActivity.tsx
│   ├── layout/                    # App shell components
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   └── sections/                  # Form section components
│       ├── RequiredInfoSection.tsx
│       ├── WeatherSection.tsx
│       ├── WaterConditionsSection.tsx
│       ├── CatchDetailsSection.tsx
│       ├── WifesMoodSection.tsx
│       ├── NotesSection.tsx
│       └── PictureUpload.tsx
├── constants/
│   └── moodOptions.ts             # Mood selection options
├── data/                          # Static data and constants
│   ├── arkansasStreams.ts         # List of AR waterways
│   ├── fishSpecies.ts             # Fish species by category
│   ├── usgsStations.ts            # USGS gauge station data
│   └── sampleData.ts              # Demo/sample entries (with "Old Hand" voice)
├── utils/
│   ├── storage.ts                 # localStorage operations
│   ├── usgsUtils.ts               # USGS station lookup/matching
│   ├── excelUtils.ts              # Excel export helpers
│   └── fishIcons.ts               # Fish/lure icon path utilities
├── types/
│   ├── index.ts                   # Main TypeScript interfaces (FormData)
│   ├── types.ts                   # Additional type definitions
│   └── diary.ts                   # DiaryEntry interface for parsed entries
└── theme/
    ├── baseTheme.ts               # Base MUI theme configuration
    └── modernTheme.ts             # Modern theme variant
```

### Key Data Types

**FormData** (`src/types/index.ts`) - Journal entry schema:
- Date and stream location
- Weather conditions (wind, sky)
- Water conditions (clarity, temperature, flow via USGS)
- Catch details (species, count, bait)
- Photos and notes

**DiaryEntry** (`src/types/diary.ts`) - Parsed diary format for imported entries:
- Original text with extracted structured data
- Support for multi-day trips
- Flexible details (weather, water, lures, species caught)

### Icon System

The app uses optimized WebP/PNG icons for fish species and lures:

- **Location**: `public/icons/{sm,md,lg}/` (24px, 40px, 64px sizes)
- **Utilities**: `src/utils/fishIcons.ts` provides `getFishIconPath()` and `getLureIconPath()`
- **Components**: `FishIcon.tsx` and `LureIcon.tsx` render icons with fallbacks

Icon mapping supports:
- Fish species (largemouth bass, crappie, catfish, etc.)
- Lure types with keyword matching (crankbaits, jigs, soft plastics, etc.)
- Color variants for specific lures (cotton candy centipede, green pumpkin jig, etc.)

### Theme System

MUI theming is configured in `src/theme/`:
- `baseTheme.ts` - Light/dark mode with smooth transitions, blue primary palette
- `modernTheme.ts` - Modern design variant
- Default form component variants

### Data Sources

- **Arkansas Streams**: Comprehensive list in `src/data/arkansasStreams.ts`
- **USGS Stations**: Water gauge data in `src/data/usgsStations.ts` with utilities in `usgsUtils.ts` for matching stations to streams
- **Fish Species**: Categorized list (game fish, panfish, catfish, rough fish) in `src/data/fishSpecies.ts`
- **Sample Data**: Demo entries in `src/data/sampleData.ts` written in "Old Hand" fishing diary voice

### Storage

Journal entries persist to `localStorage` under key `fishingJournalEntries`. The `storageUtils` module handles all persistence operations including import/export as JSON.
