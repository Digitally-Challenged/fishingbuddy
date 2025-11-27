import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EntryCardList from './dashboard/EntryCardList';
import EditEntryModal from './EditEntryModal';
import { JournalEntry } from '../types';

export default function JournalView() {
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
        Journal Entries
      </Typography>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EntryCardList onEdit={handleEdit} />
      </Paper>

      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={handleCloseEdit}
      />
    </Box>
  );
}
