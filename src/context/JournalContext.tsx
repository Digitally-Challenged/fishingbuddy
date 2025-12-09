import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { FormData } from '../types';
import { sampleEntries } from '../data/sampleData';
import { storageUtils } from '../utils/storage';

// Increment this when sample data changes to force a refresh
const SAMPLE_DATA_VERSION = 4;

interface JournalState {
  entries: FormData[];
  error: string | null;
  darkMode: boolean;
}

type JournalAction =
  | { type: 'ADD_ENTRY'; payload: FormData }
  | { type: 'DELETE_ENTRY'; payload: number }
  | { type: 'LOAD_ENTRIES'; payload: FormData[] }
  | { type: 'IMPORT_ENTRIES'; payload: FormData[] }
  | { type: 'CLEAR_ENTRIES' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: JournalState = {
  entries: storageUtils.loadEntries(),
  error: null,
  darkMode: storageUtils.loadDarkMode() ?? true,
};

const JournalContext = createContext<{
  state: JournalState;
  dispatch: React.Dispatch<JournalAction>;
  exportEntries: () => void;
  importEntries: (file: File) => Promise<void>;
  clearEntries: () => void;
  toggleDarkMode: () => void;
} | undefined>(undefined);

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
      case 'DELETE_ENTRY':
        newState = {
          ...state,
          entries: state.entries.filter((_, index) => index !== action.payload),
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

    // Save to localStorage whenever state changes
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

  const exportEntries = () => {
    try {
      storageUtils.exportEntries();
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to export entries' 
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
        payload: error instanceof Error ? error.message : 'Failed to import entries' 
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
        payload: error instanceof Error ? error.message : 'Failed to clear entries'
      });
    }
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  // Load entries from localStorage on mount, with version check
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('sampleDataVersion');
      const currentVersion = SAMPLE_DATA_VERSION.toString();

      // If version changed or no version stored, reload sample data
      if (storedVersion !== currentVersion) {
        localStorage.setItem('sampleDataVersion', currentVersion);
        storageUtils.saveEntries(sampleEntries);
        dispatch({ type: 'LOAD_ENTRIES', payload: sampleEntries });
        return;
      }

      const entries = storageUtils.loadEntries();
      if (entries.length === 0) {
        dispatch({ type: 'LOAD_ENTRIES', payload: sampleEntries });
      } else {
        dispatch({ type: 'LOAD_ENTRIES', payload: entries });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load entries'
      });
    }
  }, []);

  return (
    <JournalContext.Provider value={{
      state,
      dispatch,
      exportEntries,
      importEntries,
      clearEntries,
      toggleDarkMode
    }}>
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