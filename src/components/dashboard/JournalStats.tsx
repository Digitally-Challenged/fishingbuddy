import { Paper, Typography, Grid, Box } from '@mui/material';
import { Fish, Droplets, Wind, MapPin } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function JournalStats() {
  const { state } = useJournal();
  
  const stats = {
    totalCatches: state.entries.reduce((sum, entry) => sum + (parseInt(entry.numberCaught) || 0), 0),
    uniqueLocations: new Set(state.entries.map(entry => entry.streamName)).size,
    uniqueSpecies: new Set(state.entries.filter(entry => entry.fishSpecies).map(entry => entry.fishSpecies)).size,
    totalTrips: state.entries.length,
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <StatBox
            icon={<Fish size={24} />}
            label="Total Catches"
            value={stats.totalCatches}
          />
        </Grid>
        <Grid item xs={6}>
          <StatBox
            icon={<MapPin size={24} />}
            label="Locations"
            value={stats.uniqueLocations}
          />
        </Grid>
        <Grid item xs={6}>
          <StatBox
            icon={<Droplets size={24} />}
            label="Species"
            value={stats.uniqueSpecies}
          />
        </Grid>
        <Grid item xs={6}>
          <StatBox
            icon={<Wind size={24} />}
            label="Total Trips"
            value={stats.totalTrips}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}