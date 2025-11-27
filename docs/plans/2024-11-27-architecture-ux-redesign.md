# Fishing Buddy: Architecture & UX Redesign

**Date:** 2024-11-27
**Status:** Approved
**Goal:** Transform the fishing journal into an AI-ready data platform with optimized UX for both historical data entry and on-the-water logging.

---

## Context

The app serves two primary use cases:
1. **Historical Migration** - Converting years of paper fishing journals into digital format (partial data OK)
2. **Future Logging** - Detailed trip entries while on the water (mobile-first)

Data must be structured for AI pattern analysis and backfilling of missing weather data.

---

## 1. Data Schema

### New Entry Model

```typescript
interface JournalEntry {
  // Identity
  id: string;                         // UUID - stable identifier
  createdAt: string;                  // ISO timestamp
  updatedAt: string;                  // ISO timestamp

  // Required
  date: string;                       // Trip date (ISO format)
  streamName: string;                 // Location

  // Catch Data
  fishSpecies: string;
  numberCaught: number | null;
  baitUsed: string;

  // Weather (AI-backfillable)
  weatherConditions: string;
  highTemp: number | null;
  lowTemp: number | null;
  barometricPressure: number | null;
  windVelocity: number | null;
  windDirection: string;
  moonPhase: string;
  sunrise: string;
  sunset: string;

  // Water Conditions
  waterClarity: string;
  waterTemperature: number | null;
  flowRate: number | null;
  riverDepth: number | null;
  usgsGauge: string;

  // Meta
  entryMode: 'quick' | 'full';
  notes: string;
  pictures: Picture[];
  wifesMood: string;

  // AI metadata
  aiBackfilled: string[];             // Tracks which fields AI filled
}

interface Picture {
  id: string;
  url: string;
  caption: string;
}
```

### Key Changes from Current
- Unique `id` field (UUID) - fixes index-based deletion bug
- Numeric types for measurable values
- Timestamps for audit trail
- New weather fields for AI backfill
- `entryMode` tracks how entry was created
- `aiBackfilled` array tracks AI-modified fields

---

## 2. Entry Modes

### Quick Entry Mode
Streamlined form for rapid historical data entry.

**Fields shown:**
- Date (required)
- Location/Stream (required)
- Species caught
- Number caught
- Bait used
- Notes

**UX Features:**
- "Add Another" button - stays on form after save
- Recent locations/species autocomplete
- Keyboard shortcuts (Tab, Enter to save)
- Toast notification feedback (not alert())

### Full Entry Mode
Complete form with collapsible sections.

**Sections:**
1. Trip Info - Date, location, time on water
2. Weather - Conditions, temps, barometric, wind, moon phase
3. Water - Clarity, temp, flow, depth, USGS gauge
4. Catch - Species, count, bait, techniques
5. Notes & Photos
6. Bonus - Wife's mood

**UX Features:**
- Sections remember collapsed state
- Smart defaults (today's date, last location suggested)
- Progress indicator

---

## 3. Dashboard & List View

### Card-Based Entry List
Replace table with responsive cards.

**Card Layout:**
```
┌─────────────────────────────────────┐
│ 📍 White River         Nov 15, 2024 │
│ 🐟 Rainbow Trout × 4                │
│ 🎣 Woolly Bugger                    │
│ ☀️ Partly Cloudy, 65°F              │
│                                     │
│ [Edit]  [Delete]           ● Quick  │
└─────────────────────────────────────┘
```

**Features:**
- Density toggle (Compact/Expanded)
- Swipe to delete on mobile (with undo)
- Tap for full details
- Edit capability
- Entry type badge

### Stats Dashboard
Memoized calculations with visual charts.

**Stats:**
- Total trips / Total fish caught
- Best location (most fish)
- Best bait (highest success rate)
- Fish per trip average
- Seasonal breakdown
- Simple bar charts for species/catches over time
- "Insights" section for patterns

### Search & Filter
```
[🔍 Search...] [Location ▾] [Species ▾] [Date Range ▾] [Clear]
```

- Full-text search across notes
- Multi-filter support
- Filters persist during session

---

## 4. Mobile Experience

### Bottom Navigation
Thumb-friendly nav on mobile (<768px):

```
┌─────────────────────────────────────┐
│         (Main content area)         │
├─────────────────────────────────────┤
│  📊        ➕        📋        ⚙️   │
│ Stats    Quick     Journal   Settings│
└─────────────────────────────────────┘
```

### Responsive Breakpoints
- **Mobile (<768px)**: Bottom nav, single column, stacked cards
- **Tablet (768-1024px)**: Optional side nav, 2-column grid
- **Desktop (>1024px)**: Enhanced current layout, 3-column dashboard

### Mobile Optimizations
- 44px minimum touch targets
- Pull-to-refresh
- Offline indicator
- Floating save button on forms
- Sticky section headers
- Numeric keyboard for number fields

---

## 5. Export & AI Integration

### Enhanced JSON Export Format
```json
{
  "exportedAt": "2024-11-27T10:30:00Z",
  "version": "2.0",
  "totalEntries": 247,
  "dateRange": { "earliest": "2019-03-15", "latest": "2024-11-25" },
  "schema": { /* field definitions */ },
  "entries": [...],
  "statistics": {
    "totalFish": 1247,
    "topLocations": [...],
    "topSpecies": [...],
    "monthlyBreakdown": {...}
  }
}
```

### Export Options
- Full Export (AI-ready with schema)
- Date Range Export
- CSV Export (for spreadsheets)
- Copy to Clipboard

### Import Features
- Merge vs Replace option
- Duplicate detection
- Field mapping preview
- Backfill import (mark fields as `aiBackfilled`)

---

## 6. Performance & Polish

### Performance
- Memoized components (React.memo, useMemo)
- Virtual scrolling for large lists (react-window)
- Lazy load images
- Debounced search (300ms)
- Indexed lookups for filtering
- Chunked localStorage writes

### UX Polish
- Toast notifications (replace alert())
- Skeleton loaders
- Optimistic updates

### Confirmation Dialogs
- Delete entry with context
- Clear all with count
- Import duplicate handling

### Accessibility
- ARIA labels on interactive elements
- Full keyboard navigation
- Screen reader friendly

### Settings Page
- Dark/Light mode toggle
- Default entry mode preference
- Card density preference
- Export/Import buttons
- Storage usage indicator
- Version info

---

## Storage

**Current:** localStorage (5MB limit)
**Decision:** Keep localStorage + enhanced JSON export for AI analysis externally.
**Migration path:** Architecture allows future IndexedDB or cloud backend if needed.

---

## Implementation Priority

1. **Data schema migration** - Add IDs, timestamps, new fields
2. **Quick Entry Mode** - Enable rapid historical data entry
3. **Card-based list** - Replace table, add edit/delete
4. **Mobile navigation** - Bottom nav, responsive layout
5. **Search & filter** - Enable finding entries
6. **Enhanced export** - AI-ready format
7. **Stats improvements** - Memoization, charts
8. **Polish** - Toasts, confirmations, accessibility
