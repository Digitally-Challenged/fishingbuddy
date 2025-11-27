import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { FileSpreadsheet } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { JournalEntry } from '../../types';
import EntryCard from './EntryCard';
import SearchBar, { SearchFilters } from './SearchBar';

interface EntryCardListProps {
  onEdit: (entry: JournalEntry) => void;
}

export default function EntryCardList({ onEdit }: EntryCardListProps) {
  const { state, deleteEntry, exportEntries } = useJournal();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: null,
    species: null,
    entryMode: 'all',
  });

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let entries = [...state.entries];

    // Apply text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.streamName.toLowerCase().includes(query) ||
          e.fishSpecies.toLowerCase().includes(query) ||
          e.baitUsed.toLowerCase().includes(query) ||
          e.notes.toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (filters.location) {
      entries = entries.filter((e) => e.streamName === filters.location);
    }

    // Apply species filter
    if (filters.species) {
      entries = entries.filter((e) => e.fishSpecies === filters.species);
    }

    // Apply entry mode filter
    if (filters.entryMode !== 'all') {
      entries = entries.filter((e) => e.entryMode === filters.entryMode);
    }

    // Sort by date, most recent first
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.entries, filters]);

  const hasActiveFilters = filters.query || filters.location || filters.species || filters.entryMode !== 'all';

  return (
    <Box>
      {/* Search Bar */}
      <SearchBar filters={filters} onFiltersChange={setFilters} />

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
        <Typography variant="body2" color="text.secondary">
          {hasActiveFilters
            ? `${filteredEntries.length} of ${state.entries.length} entries`
            : `${state.entries.length} entries`}
        </Typography>
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

      {/* Entry rows */}
      {filteredEntries.length > 0 ? (
        <Box>
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={deleteEntry}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            {hasActiveFilters
              ? 'No entries match your search. Try adjusting your filters.'
              : 'No entries yet. Start by adding your first fishing journal entry!'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
