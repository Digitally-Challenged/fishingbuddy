import { Typography, Grid, Box, Card } from '@mui/material';
import { Fish, Droplets, MapPin, Calendar } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { alpha } from '@mui/material/styles';

export default function JournalStats() {
  const { state } = useJournal();
  
  const stats = {
    totalCatches: state.entries.reduce((sum, entry) => sum + (parseInt(entry.numberCaught) || 0), 0),
    uniqueLocations: new Set(state.entries.map(entry => entry.streamName)).size,
    uniqueSpecies: new Set(state.entries.filter(entry => entry.fishSpecies).map(entry => entry.fishSpecies)).size,
    totalTrips: state.entries.length,
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Fish size={24} />}
          label="Total Catches"
          value={stats.totalCatches}
          color="#0ea5e9" // primary blue
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<MapPin size={24} />}
          label="Locations"
          value={stats.uniqueLocations}
          color="#10b981" // emerald
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Droplets size={24} />}
          label="Species"
          value={stats.uniqueSpecies}
          color="#8b5cf6" // violet
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Calendar size={24} />}
          label="Total Trips"
          value={stats.totalTrips}
          color="#f59e0b" // amber
        />
      </Grid>
    </Grid>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center',
      borderLeft: `4px solid ${color}`,
      background: 'white'
    }}>
      <Box sx={{ 
        p: 1.5, 
        borderRadius: '12px', 
        bgcolor: alpha(color, 0.1), 
        color: color,
        mr: 2.5
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="500" sx={{ mt: 0.5 }}>
          {label}
        </Typography>
      </Box>
    </Card>
  );
}
