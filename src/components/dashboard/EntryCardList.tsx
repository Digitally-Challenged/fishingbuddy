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
