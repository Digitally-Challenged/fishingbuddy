import { Box, Typography, Grid } from '@mui/material';
import JournalStats from './dashboard/JournalStats';
import RecentActivity from './dashboard/RecentActivity';

export default function StatsView() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <JournalStats />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}
