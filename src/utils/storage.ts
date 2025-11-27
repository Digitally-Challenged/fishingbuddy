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

  exportEntriesAsCSV: (): void => {
    try {
      const entries = storageUtils.loadEntries();
      if (entries.length === 0) {
        throw new Error('No entries to export');
      }

      const headers = [
        'Date',
        'Location',
        'Species',
        'Count',
        'Bait',
        'Weather',
        'Water Clarity',
        'Water Temp (°F)',
        'Flow Rate',
        'Notes',
        'Entry Type',
      ];

      const rows = entries.map((e) => [
        e.date,
        e.streamName,
        e.fishSpecies,
        e.numberCaught ?? '',
        e.baitUsed,
        e.weatherConditions,
        e.waterClarity,
        e.waterTemperature ?? '',
        e.flowRate ?? '',
        `"${(e.notes || '').replace(/"/g, '""')}"`,
        e.entryMode,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
      const fileName = `fishing-journal-${new Date().toISOString().split('T')[0]}.csv`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Failed to export CSV');
    }
  },

  copyEntriesToClipboard: async (): Promise<void> => {
    try {
      const entries = storageUtils.loadEntries();
      const text = entries
        .map(
          (e) =>
            `${e.date} - ${e.streamName}: ${e.fishSpecies || 'No catch'} ${e.numberCaught ? `(${e.numberCaught})` : ''} - ${e.baitUsed || 'N/A'}`
        )
        .join('\n');
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw new Error('Failed to copy to clipboard');
    }
  },
};
