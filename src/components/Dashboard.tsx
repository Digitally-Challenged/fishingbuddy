import { Box, Typography, Grid } from '@mui/material';
import JournalEntryList from './dashboard/JournalEntryList';
import JournalStats from './dashboard/JournalStats';
import RecentActivity from './dashboard/RecentActivity';

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fishing Journal Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <JournalEntryList />
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <JournalStats />
            </Grid>
            <Grid item xs={12}>
              <RecentActivity />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}