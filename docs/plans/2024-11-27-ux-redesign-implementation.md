# Fishing Buddy UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the fishing journal into an AI-ready data platform with Quick/Full entry modes, mobile-first UI, and optimized UX.

**Architecture:** Keep React + MUI + localStorage. Add unique IDs to entries, expand schema for AI backfill fields, replace table with cards, add bottom navigation for mobile, implement search/filter.

**Tech Stack:** React 18, TypeScript, MUI 5, Vite, localStorage, dayjs, lucide-react

**Worktree:** `/Users/COLEMAN/Documents/GitHub/fishingbuddy/.worktrees/ux-redesign`

**Design Doc:** `docs/plans/2024-11-27-architecture-ux-redesign.md`

---

## Phase 1: Data Schema Migration

### Task 1.1: Create New Type Definitions

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Update the FormData interface to JournalEntry**

Replace entire contents of `src/types/index.ts`:

```typescript
// Unique identifier generator
export function generateId(): string {
  return crypto.randomUUID();
}

export interface Picture {
  id: string;
  url: string;
  caption: string;
}

export interface JournalEntry {
  // Identity
  id: string;
  createdAt: string;
  updatedAt: string;

  // Required
  date: string;
  streamName: string;

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
  aiBackfilled: string[];
}

// For backwards compatibility during migration
export type FormData = JournalEntry;

export interface FormErrors {
  [key: string]: string | undefined;
  date?: string;
  streamName?: string;
}

export type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export type CustomChangeEvent = {
  target: {
    name: string;
    value: string | number | null;
  };
};

export type FormChangeHandler = (e: FormChangeEvent | CustomChangeEvent) => void;

// Helper to create empty entry
export function createEmptyEntry(mode: 'quick' | 'full' = 'full'): JournalEntry {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    date: '',
    streamName: '',
    fishSpecies: '',
    numberCaught: null,
    baitUsed: '',
    weatherConditions: '',
    highTemp: null,
    lowTemp: null,
    barometricPressure: null,
    windVelocity: null,
    windDirection: '',
    moonPhase: '',
    sunrise: '',
    sunset: '',
    waterClarity: '',
    waterTemperature: null,
    flowRate: null,
    riverDepth: null,
    usgsGauge: '',
    entryMode: mode,
    notes: '',
    pictures: [],
    wifesMood: '',
    aiBackfilled: [],
  };
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: Type errors (we'll fix in next tasks)

**Step 3: Commit type changes**

```bash
git add src/types/index.ts
git commit -m "feat: expand JournalEntry schema for AI backfill support

- Add unique ID, timestamps, entryMode
- Add weather fields: highTemp, lowTemp, barometricPressure, moonPhase, sunrise, sunset
- Change numeric fields from string to number | null
- Add aiBackfilled tracking array
- Add createEmptyEntry helper"
```

---

### Task 1.2: Create Migration Utility

**Files:**
- Create: `src/utils/migration.ts`

**Step 1: Create migration utility**

Create `src/utils/migration.ts`:

```typescript
import { JournalEntry, generateId } from '../types';

interface LegacyEntry {
  date: string;
  streamName: string;
  windVelocity: string;
  windDirection: string;
  weatherConditions: string;
  waterClarity: string;
  usgsGauge: string;
  flowRate: string;
  riverDepth: string;
  waterTemperature: string;
  fishSpecies: string;
  numberCaught: string;
  baitUsed: string;
  notes: string;
  pictures: { id: string; url: string; caption: string }[];
  wifesMood: string;
}

function parseNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(num) ? null : num;
}

export function migrateEntry(legacy: LegacyEntry): JournalEntry {
  const now = new Date().toISOString();
  return {
    // New identity fields
    id: generateId(),
    createdAt: now,
    updatedAt: now,

    // Required (unchanged)
    date: legacy.date,
    streamName: legacy.streamName,

    // Catch data (parse numbers)
    fishSpecies: legacy.fishSpecies || '',
    numberCaught: parseNumber(legacy.numberCaught),
    baitUsed: legacy.baitUsed || '',

    // Weather (string fields stay, add new null fields)
    weatherConditions: legacy.weatherConditions || '',
    highTemp: null,
    lowTemp: null,
    barometricPressure: null,
    windVelocity: parseNumber(legacy.windVelocity),
    windDirection: legacy.windDirection || '',
    moonPhase: '',
    sunrise: '',
    sunset: '',

    // Water conditions (parse numbers)
    waterClarity: legacy.waterClarity || '',
    waterTemperature: parseNumber(legacy.waterTemperature),
    flowRate: parseNumber(legacy.flowRate),
    riverDepth: parseNumber(legacy.riverDepth),
    usgsGauge: legacy.usgsGauge || '',

    // Meta
    entryMode: 'quick', // Historical entries are effectively quick mode
    notes: legacy.notes || '',
    pictures: legacy.pictures || [],
    wifesMood: legacy.wifesMood || '',

    // AI metadata
    aiBackfilled: [],
  };
}

export function migrateEntries(legacyEntries: LegacyEntry[]): JournalEntry[] {
  return legacyEntries.map(migrateEntry);
}

export function isLegacyEntry(entry: unknown): entry is LegacyEntry {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  // Legacy entries have string numberCaught and no id field
  return typeof e.numberCaught === 'string' && !('id' in e);
}

export function needsMigration(entries: unknown[]): boolean {
  return entries.length > 0 && entries.some(isLegacyEntry);
}
```

**Step 2: Commit migration utility**

```bash
git add src/utils/migration.ts
git commit -m "feat: add data migration utility for legacy entries

- Converts string numbers to number | null
- Generates unique IDs for existing entries
- Adds timestamps and new schema fields
- Detects legacy entries automatically"
```

---

### Task 1.3: Update Storage Utils

**Files:**
- Modify: `src/utils/storage.ts`

**Step 1: Update storage.ts to handle migration**

Replace entire contents of `src/utils/storage.ts`:

```typescript
import { JournalEntry } from '../types';
import { migrateEntries, needsMigration } from './migration';

const STORAGE_KEY = 'fishingJournalEntries';
const SCHEMA_VERSION_KEY = 'fishingJournalSchemaVersion';
const CURRENT_SCHEMA_VERSION = 2;

export const storageUtils = {
  saveEntries: (entries: JournalEntry[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
    } catch (error) {
      console.error('Error saving entries to localStorage:', error);
      throw new Error('Failed to save entries');
    }
  },

  loadEntries: (): JournalEntry[] => {
    try {
      const entries = localStorage.getItem(STORAGE_KEY);
      if (!entries) return [];

      const parsed = JSON.parse(entries);

      // Check if migration needed
      if (needsMigration(parsed)) {
        console.log('Migrating legacy entries to new schema...');
        const migrated = migrateEntries(parsed);
        storageUtils.saveEntries(migrated);
        return migrated;
      }

      return parsed;
    } catch (error) {
      console.error('Error loading entries from localStorage:', error);
      return [];
    }
  },

  exportEntries: (): void => {
    try {
      const entries = storageUtils.loadEntries();
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        schemaVersion: CURRENT_SCHEMA_VERSION,
        totalEntries: entries.length,
        dateRange: entries.length > 0 ? {
          earliest: entries.reduce((min, e) => e.date < min ? e.date : min, entries[0].date),
          latest: entries.reduce((max, e) => e.date > max ? e.date : max, entries[0].date),
        } : null,
        entries,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `fishing-journal-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting entries:', error);
      throw new Error('Failed to export entries');
    }
  },

  importEntries: async (file: File): Promise<JournalEntry[]> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Handle both old format (array) and new format (object with entries)
      const entries = Array.isArray(data) ? data : data.entries;

      if (!Array.isArray(entries)) {
        throw new Error('Invalid import format');
      }

      // Validate and migrate if needed
      entries.forEach(entry => {
        if (!entry.date || !entry.streamName) {
          throw new Error('Invalid entry format: missing required fields');
        }
      });

      // Migrate legacy entries if needed
      if (needsMigration(entries)) {
        return migrateEntries(entries);
      }

      return entries;
    } catch (error) {
      console.error('Error importing entries:', error);
      throw new Error('Failed to import entries');
    }
  },

  clearEntries: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing entries:', error);
      throw new Error('Failed to clear entries');
    }
  },

  getStorageInfo: (): { used: number; total: number; percentage: number } => {
    const used = new Blob([JSON.stringify(localStorage)]).size;
    const total = 5 * 1024 * 1024;
    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  },

  loadDarkMode: (): boolean | null => {
    try {
      const darkMode = localStorage.getItem('darkMode');
      return darkMode ? JSON.parse(darkMode) : null;
    } catch {
      return null;
    }
  },

  saveDarkMode: (darkMode: boolean): void => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  },
};
```

**Step 2: Verify no TypeScript errors**

Run: `npm run build 2>&1 | head -30`

**Step 3: Commit storage updates**

```bash
git add src/utils/storage.ts
git commit -m "feat: update storage utils with auto-migration

- Auto-migrate legacy entries on load
- Enhanced export format with metadata
- Handle both old and new import formats
- Add schema version tracking"
```

---

### Task 1.4: Update Context with New Types

**Files:**
- Modify: `src/context/JournalContext.tsx`

**Step 1: Update JournalContext to use JournalEntry type**

Replace entire contents of `src/context/JournalContext.tsx`:

```typescript
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { JournalEntry } from '../types';
import { sampleEntries } from '../data/sampleData';
import { storageUtils } from '../utils/storage';

interface JournalState {
  entries: JournalEntry[];
  error: string | null;
  darkMode: boolean;
}

type JournalAction =
  | { type: 'ADD_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_ENTRY'; payload: JournalEntry }
  | { type: 'DELETE_ENTRY'; payload: string } // Changed to string ID
  | { type: 'LOAD_ENTRIES'; payload: JournalEntry[] }
  | { type: 'IMPORT_ENTRIES'; payload: JournalEntry[] }
  | { type: 'CLEAR_ENTRIES' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: JournalState = {
  entries: [],
  error: null,
  darkMode: storageUtils.loadDarkMode() ?? window.matchMedia('(prefers-color-scheme: dark)').matches,
};

interface JournalContextValue {
  state: JournalState;
  dispatch: React.Dispatch<JournalAction>;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  exportEntries: () => void;
  importEntries: (file: File) => Promise<void>;
  clearEntries: () => void;
  toggleDarkMode: () => void;
}

const JournalContext = createContext<JournalContextValue | undefined>(undefined);

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  try {
    let newState: JournalState;

    switch (action.type) {
      case 'ADD_ENTRY':
        newState = {
          ...state,
          entries: [...state.entries, action.payload],
          error: null,
        };
        break;
      case 'UPDATE_ENTRY':
        newState = {
          ...state,
          entries: state.entries.map(entry =>
            entry.id === action.payload.id
              ? { ...action.payload, updatedAt: new Date().toISOString() }
              : entry
          ),
          error: null,
        };
        break;
      case 'DELETE_ENTRY':
        newState = {
          ...state,
          entries: state.entries.filter(entry => entry.id !== action.payload),
          error: null,
        };
        break;
      case 'LOAD_ENTRIES':
        newState = {
          ...state,
          entries: action.payload,
          error: null,
        };
        break;
      case 'IMPORT_ENTRIES':
        newState = {
          ...state,
          entries: [...state.entries, ...action.payload],
          error: null,
        };
        break;
      case 'CLEAR_ENTRIES':
        newState = {
          ...state,
          entries: [],
          error: null,
        };
        break;
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
        };
      case 'TOGGLE_DARK_MODE':
        newState = {
          ...state,
          darkMode: !state.darkMode,
        };
        storageUtils.saveDarkMode(newState.darkMode);
        return newState;
      default:
        return state;
    }

    storageUtils.saveEntries(newState.entries);
    return newState;
  } catch (error) {
    console.error('Error in reducer:', error);
    return {
      ...state,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const addEntry = (entry: JournalEntry) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry });
  };

  const updateEntry = (entry: JournalEntry) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: entry });
  };

  const deleteEntry = (id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const exportEntries = () => {
    try {
      storageUtils.exportEntries();
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to export entries',
      });
    }
  };

  const importEntries = async (file: File) => {
    try {
      const entries = await storageUtils.importEntries(file);
      dispatch({ type: 'IMPORT_ENTRIES', payload: entries });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to import entries',
      });
    }
  };

  const clearEntries = () => {
    try {
      storageUtils.clearEntries();
      dispatch({ type: 'CLEAR_ENTRIES' });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to clear entries',
      });
    }
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  useEffect(() => {
    try {
      const entries = storageUtils.loadEntries();
      if (entries.length === 0) {
        dispatch({ type: 'LOAD_ENTRIES', payload: sampleEntries as JournalEntry[] });
      } else {
        dispatch({ type: 'LOAD_ENTRIES', payload: entries });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load entries',
      });
    }
  }, []);

  return (
    <JournalContext.Provider
      value={{
        state,
        dispatch,
        addEntry,
        updateEntry,
        deleteEntry,
        exportEntries,
        importEntries,
        clearEntries,
        toggleDarkMode,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
```

**Step 2: Commit context updates**

```bash
git add src/context/JournalContext.tsx
git commit -m "feat: update JournalContext with ID-based operations

- Delete by ID instead of array index
- Add updateEntry action for editing
- Add convenience methods to context value
- Type-safe with JournalEntry"
```

---

### Task 1.5: Update Sample Data

**Files:**
- Modify: `src/data/sampleData.ts`

**Step 1: Update sample data to new schema**

Replace entire contents of `src/data/sampleData.ts`:

```typescript
import { JournalEntry, generateId } from '../types';

export const sampleEntries: JournalEntry[] = [
  {
    id: generateId(),
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-15T10:00:00Z',
    date: '2024-11-15',
    streamName: 'White River',
    fishSpecies: 'Rainbow Trout',
    numberCaught: 4,
    baitUsed: 'Woolly Bugger',
    weatherConditions: 'Partly Cloudy',
    highTemp: 65,
    lowTemp: 42,
    barometricPressure: 30.12,
    windVelocity: 8,
    windDirection: 'SW',
    moonPhase: 'Waxing Gibbous',
    sunrise: '06:45',
    sunset: '17:15',
    waterClarity: 'Clear',
    waterTemperature: 52,
    flowRate: 450,
    riverDepth: 3.2,
    usgsGauge: '07055000',
    entryMode: 'full',
    notes: 'Great day on the water. Fish were active in the morning.',
    pictures: [],
    wifesMood: 'Happy',
    aiBackfilled: [],
  },
  {
    id: generateId(),
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-11-10T09:00:00Z',
    date: '2024-11-10',
    streamName: 'Buffalo River',
    fishSpecies: 'Smallmouth Bass',
    numberCaught: 2,
    baitUsed: 'Crawfish Pattern',
    weatherConditions: 'Sunny',
    highTemp: null,
    lowTemp: null,
    barometricPressure: null,
    windVelocity: 5,
    windDirection: 'N',
    moonPhase: '',
    sunrise: '',
    sunset: '',
    waterClarity: 'Slightly Stained',
    waterTemperature: 58,
    flowRate: null,
    riverDepth: null,
    usgsGauge: '',
    entryMode: 'quick',
    notes: 'Quick trip after work.',
    pictures: [],
    wifesMood: '',
    aiBackfilled: [],
  },
];
```

**Step 2: Commit sample data**

```bash
git add src/data/sampleData.ts
git commit -m "feat: update sample data with new schema

- Add full example entry with all fields
- Add quick mode example with partial fields"
```

---

### Task 1.6: Update JournalEntryList to Use ID

**Files:**
- Modify: `src/components/dashboard/JournalEntryList.tsx`

**Step 1: Update delete handler to use ID**

Replace entire contents of `src/components/dashboard/JournalEntryList.tsx`:

```typescript
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Trash2, FileSpreadsheet } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import dayjs from 'dayjs';

export default function JournalEntryList() {
  const { state, deleteEntry, exportEntries } = useJournal();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Journal Entries</Typography>
        <Button
          variant="outlined"
          startIcon={<FileSpreadsheet size={18} />}
          onClick={exportEntries}
          disabled={state.entries.length === 0}
          sx={{ ml: 2 }}
        >
          Export to Excel
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Caught</TableCell>
              <TableCell>Weather</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{dayjs(entry.date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{entry.streamName}</TableCell>
                <TableCell>{entry.fishSpecies || '-'}</TableCell>
                <TableCell>{entry.numberCaught ?? '0'}</TableCell>
                <TableCell>{entry.weatherConditions || '-'}</TableCell>
                <TableCell>
                  <Tooltip title="Delete entry">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {state.entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No entries yet. Start by adding your first fishing journal entry!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
```

**Step 2: Commit list updates**

```bash
git add src/components/dashboard/JournalEntryList.tsx
git commit -m "fix: use ID-based deletion with confirmation

- Delete by entry.id instead of array index
- Add confirmation dialog before delete
- Use context convenience methods"
```

---

### Task 1.7: Update Form Hook

**Files:**
- Modify: `src/hooks/useJournalForm.ts`

**Step 1: Update useJournalForm to use new types**

Replace entire contents of `src/hooks/useJournalForm.ts`:

```typescript
import { useState } from 'react';
import { JournalEntry, FormErrors, Picture, FormChangeHandler, createEmptyEntry } from '../types';
import { useJournal } from '../context/JournalContext';

export function useJournalForm(mode: 'quick' | 'full' = 'full') {
  const [formData, setFormData] = useState<JournalEntry>(createEmptyEntry(mode));
  const [errors, setErrors] = useState<FormErrors>({});
  const { addEntry } = useJournal();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.streamName) {
      newErrors.streamName = 'Stream name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange: FormChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString(),
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numValue as number) ? null : numValue,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addEntry({
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      setFormData(createEmptyEntry(mode));
      // TODO: Replace with toast notification
      alert('Journal entry saved successfully!');
    }
  };

  const handlePictureChange = (pictures: Picture[]) => {
    setFormData((prev) => ({
      ...prev,
      pictures,
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetForm = () => {
    setFormData(createEmptyEntry(mode));
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    handleNumberChange,
    handleSubmit,
    handlePictureChange,
    resetForm,
    setFormData,
  };
}
```

**Step 2: Commit form hook updates**

```bash
git add src/hooks/useJournalForm.ts
git commit -m "feat: update form hook with new schema support

- Use createEmptyEntry for proper initialization
- Add handleNumberChange for numeric fields
- Add resetForm method
- Support quick/full mode parameter"
```

---

### Task 1.8: Verify Build Passes

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds (may have warnings about unused imports in section components)

**Step 2: Run dev server briefly to verify**

Run: `npm run dev`
Expected: App starts without errors

**Step 3: Commit Phase 1 complete marker**

```bash
git add -A
git commit -m "chore: complete Phase 1 - data schema migration

All entry operations now use unique IDs.
Schema expanded for AI backfill fields.
Legacy data auto-migrates on load."
```

---

## Phase 2: Quick Entry Mode

### Task 2.1: Create Quick Entry Form Component

**Files:**
- Create: `src/components/QuickEntryForm.tsx`

**Step 1: Create the quick entry form**

Create `src/components/QuickEntryForm.tsx`:

```typescript
import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
} from '@mui/material';
import { Plus, Save } from 'lucide-react';
import { useJournalForm } from '../hooks/useJournalForm';
import { useJournal } from '../context/JournalContext';

export default function QuickEntryForm() {
  const { formData, errors, handleChange, handleSubmit, resetForm } = useJournalForm('quick');
  const { state } = useJournal();
  const [showAddAnother, setShowAddAnother] = useState(false);

  // Get unique locations and species from existing entries for autocomplete
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean);
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean);
  const baits = [...new Set(state.entries.map((e) => e.baitUsed))].filter(Boolean);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    setShowAddAnother(true);
  };

  const handleAddAnother = () => {
    resetForm();
    setShowAddAnother(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quick Entry
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Minimal fields for rapid entry of historical data
      </Typography>

      <Box component="form" onSubmit={handleQuickSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Date - Required */}
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          {/* Location - Required with autocomplete */}
          <Autocomplete
            freeSolo
            options={locations}
            value={formData.streamName}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'streamName', value } })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location / Stream"
                name="streamName"
                error={!!errors.streamName}
                helperText={errors.streamName}
                required
              />
            )}
          />

          {/* Species with autocomplete */}
          <Autocomplete
            freeSolo
            options={species}
            value={formData.fishSpecies}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'fishSpecies', value } })
            }
            renderInput={(params) => (
              <TextField {...params} label="Fish Species" name="fishSpecies" />
            )}
          />

          {/* Number Caught */}
          <TextField
            label="Number Caught"
            name="numberCaught"
            type="number"
            value={formData.numberCaught ?? ''}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'numberCaught',
                  value: e.target.value === '' ? null : parseInt(e.target.value),
                },
              })
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          {/* Bait with autocomplete */}
          <Autocomplete
            freeSolo
            options={baits}
            value={formData.baitUsed}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'baitUsed', value } })
            }
            renderInput={(params) => (
              <TextField {...params} label="Bait / Lure Used" name="baitUsed" />
            )}
          />

          {/* Notes */}
          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Paste your old journal notes here..."
            fullWidth
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save size={18} />}
              fullWidth
            >
              Save Entry
            </Button>
            {showAddAnother && (
              <Button
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={handleAddAnother}
                fullWidth
              >
                Add Another
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
```

**Step 2: Commit quick entry form**

```bash
git add src/components/QuickEntryForm.tsx
git commit -m "feat: add QuickEntryForm for rapid historical data entry

- Minimal fields: date, location, species, count, bait, notes
- Autocomplete from existing entries
- Add Another button for rapid sequential entry"
```

---

### Task 2.2: Add Quick Entry Tab to App

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add Quick Entry as third tab**

Replace entire contents of `src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import FishingJournalForm from './components/FishingJournalForm';
import QuickEntryForm from './components/QuickEntryForm';
import Dashboard from './components/Dashboard';
import Layout from './components/layout/Layout';
import { baseTheme, darkThemeOverrides } from './theme/baseTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    state: { darkMode },
  } = useJournal();

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        ...(darkMode ? darkThemeOverrides : {}),
      }),
    [darkMode]
  );

  const handleNavigate = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onNavigate={handleNavigate}>
        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => handleNavigate(newValue)}
              aria-label="fishing journal navigation"
            >
              <Tab label="Dashboard" />
              <Tab label="Quick Entry" />
              <Tab label="Full Entry" />
            </Tabs>
          </Box>

          {activeTab === 0 && <Dashboard />}
          {activeTab === 1 && <QuickEntryForm />}
          {activeTab === 2 && <FishingJournalForm />}
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <JournalProvider>
        <AppContent />
      </JournalProvider>
    </LocalizationProvider>
  );
}
```

**Step 2: Verify build and test**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit App changes**

```bash
git add src/App.tsx
git commit -m "feat: add Quick Entry tab to navigation

- Dashboard, Quick Entry, Full Entry tabs
- Quick Entry for historical data migration
- Full Entry for detailed new trips"
```

---

## Phase 3: Card-Based List & Edit

### Task 3.1: Create Entry Card Component

**Files:**
- Create: `src/components/dashboard/EntryCard.tsx`

**Step 1: Create the entry card**

Create `src/components/dashboard/EntryCard.tsx`:

```typescript
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
} from '@mui/material';
import { MapPin, Fish, Anchor, Cloud, Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { JournalEntry } from '../../types';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function EntryCard({ entry, onEdit, onDelete, compact = false }: EntryCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete trip to ${entry.streamName} on ${dayjs(entry.date).format('MMM D, YYYY')}?`)) {
      onDelete(entry.id);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
        {/* Header: Location and Date */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapPin size={16} />
            <Typography variant="subtitle1" fontWeight="bold">
              {entry.streamName}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {dayjs(entry.date).format('MMM D, YYYY')}
          </Typography>
        </Box>

        {/* Fish caught */}
        {(entry.fishSpecies || entry.numberCaught) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Fish size={14} />
            <Typography variant="body2">
              {entry.fishSpecies || 'Fish'} {entry.numberCaught !== null && `× ${entry.numberCaught}`}
            </Typography>
          </Box>
        )}

        {/* Bait */}
        {entry.baitUsed && !compact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Anchor size={14} />
            <Typography variant="body2" color="text.secondary">
              {entry.baitUsed}
            </Typography>
          </Box>
        )}

        {/* Weather */}
        {entry.weatherConditions && !compact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Cloud size={14} />
            <Typography variant="body2" color="text.secondary">
              {entry.weatherConditions}
              {entry.highTemp !== null && `, ${entry.highTemp}°F`}
            </Typography>
          </Box>
        )}

        {/* Notes preview */}
        {entry.notes && !compact && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {entry.notes}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Chip
          label={entry.entryMode === 'quick' ? 'Quick' : 'Full'}
          size="small"
          variant="outlined"
          color={entry.entryMode === 'quick' ? 'default' : 'primary'}
        />
        <Box>
          <Tooltip title="Edit entry">
            <IconButton size="small" onClick={() => onEdit(entry)}>
              <Edit2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete entry">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}
```

**Step 2: Commit entry card**

```bash
git add src/components/dashboard/EntryCard.tsx
git commit -m "feat: add EntryCard component for card-based list

- Displays location, date, fish, bait, weather
- Compact mode for dense view
- Edit and delete actions
- Entry mode badge (Quick/Full)"
```

---

### Task 3.2: Create Entry List with Cards

**Files:**
- Create: `src/components/dashboard/EntryCardList.tsx`

**Step 1: Create the card list component**

Create `src/components/dashboard/EntryCardList.tsx`:

```typescript
import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import { Grid3X3, List, FileSpreadsheet } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { JournalEntry } from '../../types';
import EntryCard from './EntryCard';

interface EntryCardListProps {
  onEdit: (entry: JournalEntry) => void;
}

export default function EntryCardList({ onEdit }: EntryCardListProps) {
  const { state, deleteEntry, exportEntries } = useJournal();
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'compact' | 'expanded' | null) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Sort entries by date, most recent first
  const sortedEntries = [...state.entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6">
          Journal Entries ({state.entries.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="compact" aria-label="compact view">
              <List size={18} />
            </ToggleButton>
            <ToggleButton value="expanded" aria-label="expanded view">
              <Grid3X3 size={18} />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileSpreadsheet size={16} />}
            onClick={exportEntries}
            disabled={state.entries.length === 0}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Cards Grid */}
      {sortedEntries.length > 0 ? (
        <Grid container spacing={2}>
          {sortedEntries.map((entry) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'compact' ? 12 : 6}
              md={viewMode === 'compact' ? 6 : 4}
              key={entry.id}
            >
              <EntryCard
                entry={entry}
                onEdit={onEdit}
                onDelete={deleteEntry}
                compact={viewMode === 'compact'}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            No entries yet. Start by adding your first fishing journal entry!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
```

**Step 2: Commit card list**

```bash
git add src/components/dashboard/EntryCardList.tsx
git commit -m "feat: add EntryCardList with compact/expanded view toggle

- Grid layout with responsive columns
- Sort by date (most recent first)
- Compact/expanded view toggle
- Export button in header"
```

---

### Task 3.3: Create Edit Entry Modal

**Files:**
- Create: `src/components/EditEntryModal.tsx`

**Step 1: Create edit modal**

Create `src/components/EditEntryModal.tsx`:

```typescript
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
} from '@mui/material';
import { JournalEntry } from '../types';
import { useJournal } from '../context/JournalContext';

interface EditEntryModalProps {
  entry: JournalEntry | null;
  open: boolean;
  onClose: () => void;
}

export default function EditEntryModal({ entry, open, onClose }: EditEntryModalProps) {
  const { state, updateEntry } = useJournal();
  const [formData, setFormData] = useState<JournalEntry | null>(null);

  // Get autocomplete options
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean);
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean);
  const baits = [...new Set(state.entries.map((e) => e.baitUsed))].filter(Boolean);

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry });
    }
  }, [entry]);

  const handleChange = (name: string, value: string | number | null) => {
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      updateEntry(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Autocomplete
            freeSolo
            options={locations}
            value={formData.streamName}
            onInputChange={(_, value) => handleChange('streamName', value)}
            renderInput={(params) => (
              <TextField {...params} label="Location / Stream" />
            )}
          />

          <Autocomplete
            freeSolo
            options={species}
            value={formData.fishSpecies}
            onInputChange={(_, value) => handleChange('fishSpecies', value)}
            renderInput={(params) => (
              <TextField {...params} label="Fish Species" />
            )}
          />

          <TextField
            label="Number Caught"
            type="number"
            value={formData.numberCaught ?? ''}
            onChange={(e) =>
              handleChange(
                'numberCaught',
                e.target.value === '' ? null : parseInt(e.target.value)
              )
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          <Autocomplete
            freeSolo
            options={baits}
            value={formData.baitUsed}
            onInputChange={(_, value) => handleChange('baitUsed', value)}
            renderInput={(params) => (
              <TextField {...params} label="Bait / Lure Used" />
            )}
          />

          <TextField
            label="Weather Conditions"
            value={formData.weatherConditions}
            onChange={(e) => handleChange('weatherConditions', e.target.value)}
            fullWidth
          />

          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

**Step 2: Commit edit modal**

```bash
git add src/components/EditEntryModal.tsx
git commit -m "feat: add EditEntryModal for editing existing entries

- Pre-fills form with entry data
- Autocomplete for location, species, bait
- Updates entry via context"
```

---

### Task 3.4: Update Dashboard to Use Cards

**Files:**
- Modify: `src/components/Dashboard.tsx`

**Step 1: Replace table with cards and add edit modal**

Replace entire contents of `src/components/Dashboard.tsx`:

```typescript
import { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import EntryCardList from './dashboard/EntryCardList';
import JournalStats from './dashboard/JournalStats';
import RecentActivity from './dashboard/RecentActivity';
import EditEntryModal from './EditEntryModal';
import { JournalEntry } from '../types';

export default function Dashboard() {
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);

  const handleEdit = (entry: JournalEntry) => {
    setEditEntry(entry);
  };

  const handleCloseEdit = () => {
    setEditEntry(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fishing Journal Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats - Top on mobile, side on desktop */}
        <Grid item xs={12} lg={4} order={{ xs: 1, lg: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={12}>
              <JournalStats />
            </Grid>
            <Grid item xs={12} sm={6} lg={12}>
              <RecentActivity />
            </Grid>
          </Grid>
        </Grid>

        {/* Entry List */}
        <Grid item xs={12} lg={8} order={{ xs: 2, lg: 1 }}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <EntryCardList onEdit={handleEdit} />
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Modal */}
      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={handleCloseEdit}
      />
    </Box>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit dashboard updates**

```bash
git add src/components/Dashboard.tsx
git commit -m "feat: update Dashboard with card-based list and edit modal

- Replace JournalEntryList with EntryCardList
- Add EditEntryModal integration
- Responsive grid layout
- Stats at top on mobile, side on desktop"
```

---

### Task 3.5: Phase 3 Cleanup

**Step 1: Remove old table component (keep as backup for now)**

```bash
# We'll keep JournalEntryList.tsx for reference but it's no longer used
git add -A
git commit -m "chore: complete Phase 3 - card-based list with edit capability

- Cards replace table for better mobile UX
- Compact/expanded view toggle
- Edit modal for modifying entries
- Delete with confirmation"
```

---

## Phase 4: Mobile Navigation

### Task 4.1: Create Bottom Navigation Component

**Files:**
- Create: `src/components/layout/BottomNav.tsx`

**Step 1: Create bottom navigation**

Create `src/components/layout/BottomNav.tsx`:

```typescript
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { BarChart3, Plus, List, Settings } from 'lucide-react';

interface BottomNavProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function BottomNav({ value, onChange }: BottomNavProps) {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
      >
        <BottomNavigationAction
          label="Stats"
          icon={<BarChart3 size={24} />}
        />
        <BottomNavigationAction
          label="Quick"
          icon={<Plus size={24} />}
        />
        <BottomNavigationAction
          label="Journal"
          icon={<List size={24} />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings size={24} />}
        />
      </BottomNavigation>
    </Paper>
  );
}
```

**Step 2: Commit bottom nav**

```bash
git add src/components/layout/BottomNav.tsx
git commit -m "feat: add BottomNav component for mobile navigation

- Fixed to bottom of screen
- Hidden on desktop (md and up)
- Stats, Quick, Journal, Settings tabs"
```

---

### Task 4.2: Create Settings Page

**Files:**
- Create: `src/components/Settings.tsx`

**Step 1: Create settings page**

Create `src/components/Settings.tsx`:

```typescript
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { useJournal } from '../context/JournalContext';
import { storageUtils } from '../utils/storage';
import { useRef } from 'react';

export default function Settings() {
  const { state, exportEntries, importEntries, clearEntries, toggleDarkMode } = useJournal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = storageUtils.getStorageInfo();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importEntries(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleClear = () => {
    if (window.confirm(`This will delete all ${state.entries.length} entries. Are you sure?`)) {
      clearEntries();
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Appearance */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={state.darkMode}
              onChange={toggleDarkMode}
              icon={<Sun size={16} />}
              checkedIcon={<Moon size={16} />}
            />
          }
          label={state.darkMode ? 'Dark Mode' : 'Light Mode'}
        />
      </Paper>

      {/* Data Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {state.entries.length} entries stored
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={exportEntries}
            disabled={state.entries.length === 0}
          >
            Export Data (JSON)
          </Button>

          <Button
            variant="outlined"
            startIcon={<Upload size={18} />}
            onClick={handleImportClick}
          >
            Import Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <Divider />

          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={18} />}
            onClick={handleClear}
            disabled={state.entries.length === 0}
          >
            Clear All Data
          </Button>
        </Box>
      </Paper>

      {/* Storage Usage */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Storage Usage
        </Typography>
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={storageInfo.percentage}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {(storageInfo.used / 1024).toFixed(1)} KB of {(storageInfo.total / 1024 / 1024).toFixed(0)} MB used
          ({storageInfo.percentage.toFixed(1)}%)
        </Typography>
      </Paper>

      {/* About */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fishing Buddy v2.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your personal fishing journal for tracking trips and analyzing patterns.
        </Typography>
      </Paper>
    </Box>
  );
}
```

**Step 2: Commit settings page**

```bash
git add src/components/Settings.tsx
git commit -m "feat: add Settings page

- Dark/light mode toggle
- Export/import data buttons
- Clear all data with confirmation
- Storage usage indicator
- Version info"
```

---

### Task 4.3: Create Journal View (Entry List Only)

**Files:**
- Create: `src/components/JournalView.tsx`

**Step 1: Create journal view**

Create `src/components/JournalView.tsx`:

```typescript
import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EntryCardList from './dashboard/EntryCardList';
import EditEntryModal from './EditEntryModal';
import { JournalEntry } from '../types';

export default function JournalView() {
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Journal Entries
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EntryCardList onEdit={setEditEntry} />
      </Paper>

      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={() => setEditEntry(null)}
      />
    </Box>
  );
}
```

**Step 2: Commit journal view**

```bash
git add src/components/JournalView.tsx
git commit -m "feat: add JournalView for dedicated entry list page

- Full-page entry list with cards
- Edit modal integration"
```

---

### Task 4.4: Create Stats View (Stats Only)

**Files:**
- Create: `src/components/StatsView.tsx`

**Step 1: Create stats view**

Create `src/components/StatsView.tsx`:

```typescript
import { Box, Typography, Grid } from '@mui/material';
import JournalStats from './dashboard/JournalStats';
import RecentActivity from './dashboard/RecentActivity';

export default function StatsView() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <JournalStats />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}
```

**Step 2: Commit stats view**

```bash
git add src/components/StatsView.tsx
git commit -m "feat: add StatsView for dedicated statistics page"
```

---

### Task 4.5: Update App with Mobile Navigation

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add mobile navigation and new views**

Replace entire contents of `src/App.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Box, Tabs, Tab, useMediaQuery } from '@mui/material';
import FishingJournalForm from './components/FishingJournalForm';
import QuickEntryForm from './components/QuickEntryForm';
import Dashboard from './components/Dashboard';
import StatsView from './components/StatsView';
import JournalView from './components/JournalView';
import Settings from './components/Settings';
import Layout from './components/layout/Layout';
import BottomNav from './components/layout/BottomNav';
import { baseTheme, darkThemeOverrides } from './theme/baseTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    state: { darkMode },
  } = useJournal();

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        ...(darkMode ? darkThemeOverrides : {}),
      }),
    [darkMode]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (tab: number) => {
    setActiveTab(tab);
  };

  // Mobile: Stats (0), Quick (1), Journal (2), Settings (3)
  // Desktop: Dashboard (0), Quick Entry (1), Full Entry (2)
  const renderContent = () => {
    if (isMobile) {
      switch (activeTab) {
        case 0:
          return <StatsView />;
        case 1:
          return <QuickEntryForm />;
        case 2:
          return <JournalView />;
        case 3:
          return <Settings />;
        default:
          return <StatsView />;
      }
    } else {
      switch (activeTab) {
        case 0:
          return <Dashboard />;
        case 1:
          return <QuickEntryForm />;
        case 2:
          return <FishingJournalForm />;
        case 3:
          return <Settings />;
        default:
          return <Dashboard />;
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onNavigate={handleNavigate}>
        <Container
          maxWidth="lg"
          sx={{
            pb: isMobile ? '80px' : 0, // Space for bottom nav
          }}
        >
          {/* Desktop Tabs */}
          {!isMobile && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => handleNavigate(newValue)}
                aria-label="fishing journal navigation"
              >
                <Tab label="Dashboard" />
                <Tab label="Quick Entry" />
                <Tab label="Full Entry" />
                <Tab label="Settings" />
              </Tabs>
            </Box>
          )}

          {renderContent()}
        </Container>

        {/* Mobile Bottom Navigation */}
        {isMobile && <BottomNav value={activeTab} onChange={handleNavigate} />}
      </Layout>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <JournalProvider>
        <AppContent />
      </JournalProvider>
    </LocalizationProvider>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit app navigation updates**

```bash
git add src/App.tsx
git commit -m "feat: add responsive navigation with mobile bottom nav

- Desktop: top tabs (Dashboard, Quick, Full, Settings)
- Mobile: bottom nav (Stats, Quick, Journal, Settings)
- Separate views for mobile to optimize screen space
- Bottom padding on mobile for nav clearance"
```

---

## Phase 5: Search & Filter

### Task 5.1: Create Search/Filter Bar Component

**Files:**
- Create: `src/components/dashboard/SearchFilterBar.tsx`

**Step 1: Create search filter bar**

Create `src/components/dashboard/SearchFilterBar.tsx`:

```typescript
import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Search, X } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export interface SearchFilters {
  query: string;
  location: string;
  species: string;
  entryMode: string;
}

interface SearchFilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchFilterBar({ filters, onFiltersChange }: SearchFilterBarProps) {
  const { state } = useJournal();

  // Get unique values for filters
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean).sort();
  const speciesList = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean).sort();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, query: e.target.value });
  };

  const handleSelectChange = (field: keyof SearchFilters) => (e: SelectChangeEvent) => {
    onFiltersChange({ ...filters, [field]: e.target.value });
  };

  const handleClearFilters = () => {
    onFiltersChange({ query: '', location: '', species: '', entryMode: '' });
  };

  const hasActiveFilters = filters.query || filters.location || filters.species || filters.entryMode;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Search Input */}
        <TextField
          placeholder="Search notes..."
          value={filters.query}
          onChange={handleQueryChange}
          size="small"
          sx={{ minWidth: 200, flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />

        {/* Location Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.location}
            onChange={handleSelectChange('location')}
            label="Location"
          >
            <MenuItem value="">All</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Species Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Species</InputLabel>
          <Select
            value={filters.species}
            onChange={handleSelectChange('species')}
            label="Species"
          >
            <MenuItem value="">All</MenuItem>
            {speciesList.map((sp) => (
              <MenuItem key={sp} value={sp}>
                {sp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Entry Mode Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Mode</InputLabel>
          <Select
            value={filters.entryMode}
            onChange={handleSelectChange('entryMode')}
            label="Mode"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="quick">Quick</MenuItem>
            <MenuItem value="full">Full</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            startIcon={<X size={16} />}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {filters.query && (
            <Chip
              label={`"${filters.query}"`}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, query: '' })}
            />
          )}
          {filters.location && (
            <Chip
              label={filters.location}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, location: '' })}
            />
          )}
          {filters.species && (
            <Chip
              label={filters.species}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, species: '' })}
            />
          )}
          {filters.entryMode && (
            <Chip
              label={filters.entryMode === 'quick' ? 'Quick entries' : 'Full entries'}
              size="small"
              onDelete={() => onFiltersChange({ ...filters, entryMode: '' })}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
```

**Step 2: Commit search filter bar**

```bash
git add src/components/dashboard/SearchFilterBar.tsx
git commit -m "feat: add SearchFilterBar component

- Text search across notes
- Location, species, entry mode filters
- Active filter chips with individual clear
- Clear all button"
```

---

### Task 5.2: Integrate Search into Entry Card List

**Files:**
- Modify: `src/components/dashboard/EntryCardList.tsx`

**Step 1: Add search/filter integration**

Replace entire contents of `src/components/dashboard/EntryCardList.tsx`:

```typescript
import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from '@mui/material';
import { Grid3X3, List, FileSpreadsheet } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { JournalEntry } from '../../types';
import EntryCard from './EntryCard';
import SearchFilterBar, { SearchFilters } from './SearchFilterBar';

interface EntryCardListProps {
  onEdit: (entry: JournalEntry) => void;
}

export default function EntryCardList({ onEdit }: EntryCardListProps) {
  const { state, deleteEntry, exportEntries } = useJournal();
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    species: '',
    entryMode: '',
  });

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: 'compact' | 'expanded' | null
  ) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return state.entries
      .filter((entry) => {
        // Text search in notes
        if (filters.query) {
          const query = filters.query.toLowerCase();
          const searchFields = [
            entry.notes,
            entry.streamName,
            entry.fishSpecies,
            entry.baitUsed,
          ].join(' ').toLowerCase();
          if (!searchFields.includes(query)) return false;
        }

        // Location filter
        if (filters.location && entry.streamName !== filters.location) return false;

        // Species filter
        if (filters.species && entry.fishSpecies !== filters.species) return false;

        // Entry mode filter
        if (filters.entryMode && entry.entryMode !== filters.entryMode) return false;

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.entries, filters]);

  return (
    <Box>
      {/* Search & Filter */}
      <SearchFilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6">
          {filteredEntries.length === state.entries.length
            ? `Journal Entries (${state.entries.length})`
            : `Showing ${filteredEntries.length} of ${state.entries.length}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="compact" aria-label="compact view">
              <List size={18} />
            </ToggleButton>
            <ToggleButton value="expanded" aria-label="expanded view">
              <Grid3X3 size={18} />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileSpreadsheet size={16} />}
            onClick={exportEntries}
            disabled={state.entries.length === 0}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Cards Grid */}
      {filteredEntries.length > 0 ? (
        <Grid container spacing={2}>
          {filteredEntries.map((entry) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'compact' ? 12 : 6}
              md={viewMode === 'compact' ? 6 : 4}
              key={entry.id}
            >
              <EntryCard
                entry={entry}
                onEdit={onEdit}
                onDelete={deleteEntry}
                compact={viewMode === 'compact'}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            {state.entries.length === 0
              ? 'No entries yet. Start by adding your first fishing journal entry!'
              : 'No entries match your filters.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit search integration**

```bash
git add src/components/dashboard/EntryCardList.tsx
git commit -m "feat: integrate search and filter into entry list

- Memoized filtered results
- Search across notes, location, species, bait
- Filter count display
- Empty state for no matches"
```

---

## Phase 6-8: Remaining Tasks (Summary)

The remaining phases follow the same pattern. Here's a summary of what's left:

### Phase 6: Enhanced Export
- Task 6.1: Add CSV export to storage utils
- Task 6.2: Add copy-to-clipboard functionality
- Task 6.3: Update Settings with export options

### Phase 7: Stats & Performance
- Task 7.1: Add useMemo to JournalStats calculations
- Task 7.2: Add simple charts (optional - could use recharts)
- Task 7.3: Add insights section

### Phase 8: Polish
- Task 8.1: Add toast notification system (Snackbar)
- Task 8.2: Replace all alert() calls with toasts
- Task 8.3: Add confirmation dialogs
- Task 8.4: Final accessibility pass

---

## Verification Checklist

After completing all phases, verify:

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run lint` passes
- [ ] App works on desktop (Dashboard view)
- [ ] App works on mobile (bottom nav, views)
- [ ] Quick entry saves entries correctly
- [ ] Full entry saves entries correctly
- [ ] Edit modal updates entries
- [ ] Delete removes entries with confirmation
- [ ] Search filters entries
- [ ] Export produces valid JSON
- [ ] Import works with exported data
- [ ] Dark mode toggles correctly
- [ ] Settings page functions

---

## Git Summary

After all commits, the branch should have:

```
feat: expand JournalEntry schema for AI backfill support
feat: add data migration utility for legacy entries
feat: update storage utils with auto-migration
feat: update JournalContext with ID-based operations
feat: update sample data with new schema
fix: use ID-based deletion with confirmation
feat: update form hook with new schema support
chore: complete Phase 1 - data schema migration
feat: add QuickEntryForm for rapid historical data entry
feat: add Quick Entry tab to navigation
feat: add EntryCard component for card-based list
feat: add EntryCardList with compact/expanded view toggle
feat: add EditEntryModal for editing existing entries
feat: update Dashboard with card-based list and edit modal
chore: complete Phase 3 - card-based list with edit capability
feat: add BottomNav component for mobile navigation
feat: add Settings page
feat: add JournalView for dedicated entry list page
feat: add StatsView for dedicated statistics page
feat: add responsive navigation with mobile bottom nav
feat: add SearchFilterBar component
feat: integrate search and filter into entry list
```
