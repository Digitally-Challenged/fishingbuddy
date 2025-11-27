import { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import EntryCardList from './dashboard/EntryCardList';
import JournalStats from './dashboard/JournalStats';
import RecentActivity from './dashboard/RecentActivity';
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fishing Journal Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats - Top on mobile, side on desktop */}
        <Grid item xs={12} lg={4} order={{ xs: 1, lg: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={12}>
              <JournalStats />
            </Grid>
            <Grid item xs={12} sm={6} lg={12}>
              <RecentActivity />
            </Grid>
          </Grid>
        </Grid>

        {/* Entry List */}
        <Grid item xs={12} lg={8} order={{ xs: 2, lg: 1 }}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <EntryCardList onEdit={handleEdit} />
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Modal */}
      <EditEntryModal
        entry={editEntry}
        open={editEntry !== null}
        onClose={handleCloseEdit}
      />
    </Box>
  );
}
