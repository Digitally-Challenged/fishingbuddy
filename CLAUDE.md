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
│   ├── FishingJournalForm.tsx     # Entry creation form
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
├── data/                          # Static data and constants
│   ├── arkansasStreams.ts         # List of AR waterways
│   ├── fishSpecies.ts             # Fish species by category
│   ├── usgsStations.ts            # USGS gauge station data
│   └── sampleData.ts              # Demo/sample entries
├── utils/
│   ├── storage.ts                 # localStorage operations
│   ├── usgsUtils.ts               # USGS station lookup/matching
│   └── excelUtils.ts              # Excel export helpers
└── types/
    └── index.ts                   # TypeScript interfaces
```

### Key Data Types

The `FormData` interface in `src/types/index.ts` defines the journal entry schema with fields for:
- Date and stream location
- Weather conditions (wind, sky)
- Water conditions (clarity, temperature, flow via USGS)
- Catch details (species, count, bait)
- Photos and notes

### Theme System

MUI theming is configured in `src/theme/baseTheme.ts`:
- Light/dark mode support with smooth transitions
- Custom color palette with blue primary
- Default form component variants

### Data Sources

- **Arkansas Streams**: Comprehensive list in `src/data/arkansasStreams.ts`
- **USGS Stations**: Water gauge data in `src/data/usgsStations.ts` with utilities in `usgsUtils.ts` for matching stations to streams
- **Fish Species**: Categorized list (game fish, panfish, catfish, rough fish) in `src/data/fishSpecies.ts`

### Storage

Journal entries persist to `localStorage` under key `fishingJournalEntries`. The `storageUtils` module handles all persistence operations including import/export as JSON.
