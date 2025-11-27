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
