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
