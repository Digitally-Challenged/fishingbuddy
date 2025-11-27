import { useState } from 'react';
import { Box, Typography } from '@mui/material';
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
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>

      {/* Stats */}
      <JournalStats />

      {/* Entry List */}
      <Box sx={{ mt: 4 }}>
        <EntryCardList onEdit={handleEdit} />
      </Box>

      {/* Edit Modal */}
      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={handleCloseEdit}
      />
    </Box>
  );
}
