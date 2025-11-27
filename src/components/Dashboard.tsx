import { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EntryCardList from './dashboard/EntryCardList';
import JournalStats from './dashboard/JournalStats';
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Fishing Journal Dashboard
      </Typography>

      {/* Compact stats bar */}
      <Box sx={{ mb: 3 }}>
        <JournalStats />
      </Box>

      {/* Entry List - full width */}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EntryCardList onEdit={handleEdit} />
      </Paper>

      {/* Edit Modal */}
      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={handleCloseEdit}
      />
    </Box>
  );
}
