import { Typography, Grid, Box, Card } from '@mui/material';
import { Fish, Droplets, MapPin, Calendar } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { alpha } from '@mui/material/styles';
import { journalPalette } from '../../theme/journalTheme';

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
          color={journalPalette.sepia}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<MapPin size={24} />}
          label="Locations"
          value={stats.uniqueLocations}
          color={journalPalette.leatherDark}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Droplets size={24} />}
          label="Species"
          value={stats.uniqueSpecies}
          color={journalPalette.leatherLight}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<Calendar size={24} />}
          label="Total Trips"
          value={stats.totalTrips}
          color={journalPalette.inkFaded}
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
      backgroundImage: 'url(/textures/paper-cream.webp)',
      backgroundRepeat: 'repeat',
      backgroundSize: '512px 512px',
      border: `1px solid ${journalPalette.lineRule}`,
      borderLeftWidth: '4px',
      borderLeftColor: color,
    }}>
      <Box sx={{
        p: 1.5,
        borderRadius: '8px',
        bgcolor: alpha(color, 0.12),
        color: color,
        mr: 2.5
      }}>
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Special Elite", "Courier New", monospace',
            fontWeight: 400,
            lineHeight: 1,
            color: journalPalette.leatherDeep,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontFamily: '"Lora", Georgia, serif',
            color: journalPalette.inkFaded,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  );
}
