import { FormData } from '../types';

const STORAGE_KEY = 'fishingJournalEntries';

export const storageUtils = {
  // Save entries to localStorage
  saveEntries: (entries: FormData[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries to localStorage:', error);
      throw new Error('Failed to save entries');
    }
  },

  // Load entries from localStorage
  loadEntries: (): FormData[] => {
    try {
      const entries = localStorage.getItem(STORAGE_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error loading entries from localStorage:', error);
      return [];
    }
  },

  // Export entries as JSON file
  exportEntries: (): void => {
    try {
      const entries = storageUtils.loadEntries();
      const dataStr = JSON.stringify(entries, null, 2);
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

  // Import entries from JSON file
  importEntries: async (file: File): Promise<FormData[]> => {
    try {
      const text = await file.text();
      const entries = JSON.parse(text);
      
      // Validate imported data
      if (!Array.isArray(entries)) {
        throw new Error('Invalid import format');
      }
      
      // Basic validation of each entry
      entries.forEach(entry => {
        if (!entry.date || !entry.streamName) {
          throw new Error('Invalid entry format');
        }
      });
      
      return entries;
    } catch (error) {
      console.error('Error importing entries:', error);
      throw new Error('Failed to import entries');
    }
  },

  // Clear all entries
  clearEntries: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing entries:', error);
      throw new Error('Failed to clear entries');
    }
  },

  // Get storage usage information
  getStorageInfo: (): { used: number; total: number; percentage: number } => {
    const used = new Blob([JSON.stringify(localStorage)]).size;
    const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
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
  }
};