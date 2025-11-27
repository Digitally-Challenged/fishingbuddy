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
