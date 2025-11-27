import { useMemo } from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { Fish, MapPin, Droplets, Calendar, TrendingUp, Award } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function JournalStats() {
  const { state } = useJournal();

  const stats = useMemo(() => {
    const entries = state.entries;

    // Basic stats
    const totalCatches = entries.reduce((sum, e) => sum + (e.numberCaught ?? 0), 0);
    const uniqueLocations = new Set(entries.map((e) => e.streamName)).size;
    const uniqueSpecies = new Set(entries.filter((e) => e.fishSpecies).map((e) => e.fishSpecies)).size;
    const totalTrips = entries.length;

    // Insights
    const speciesCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const baitCounts: Record<string, number> = {};

    entries.forEach((e) => {
      if (e.fishSpecies) {
        speciesCounts[e.fishSpecies] = (speciesCounts[e.fishSpecies] || 0) + (e.numberCaught ?? 0);
      }
      locationCounts[e.streamName] = (locationCounts[e.streamName] || 0) + 1;
      if (e.baitUsed) {
        baitCounts[e.baitUsed] = (baitCounts[e.baitUsed] || 0) + (e.numberCaught ?? 0);
      }
    });

    const topSpecies = Object.entries(speciesCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];
    const topBait = Object.entries(baitCounts).sort((a, b) => b[1] - a[1])[0];

    // Average catch per trip
    const avgCatchPerTrip = totalTrips > 0 ? (totalCatches / totalTrips).toFixed(1) : '0';

    return {
      totalCatches,
      uniqueLocations,
      uniqueSpecies,
      totalTrips,
      topSpecies,
      topLocation,
      topBait,
      avgCatchPerTrip,
    };
  }, [state.entries]);

  if (stats.totalTrips === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 4 },
        flexWrap: 'wrap',
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <StatBox icon={<Fish size={20} />} label="Catches" value={stats.totalCatches} color="#2196f3" />
      <StatBox icon={<MapPin size={20} />} label="Locations" value={stats.uniqueLocations} color="#4caf50" />
      <StatBox icon={<Droplets size={20} />} label="Species" value={stats.uniqueSpecies} color="#9c27b0" />
      <StatBox icon={<Calendar size={20} />} label="Trips" value={stats.totalTrips} color="#ff9800" />
      <StatBox icon={<Award size={20} />} label="Avg/Trip" value={stats.avgCatchPerTrip} color="#f44336" />

      {/* Top performers */}
      {(stats.topLocation || stats.topBait) && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
          <TrendingUp size={16} color="#666" />
          {stats.topLocation && (
            <Chip label={`Best: ${stats.topLocation[0]}`} size="small" color="primary" variant="outlined" />
          )}
          {stats.topBait && (
            <Chip label={stats.topBait[0]} size="small" variant="outlined" />
          )}
        </Box>
      )}
    </Box>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: color || 'primary.main' }}>{icon}</Box>
      <Box>
        <Typography variant="h6" component="div" fontWeight="bold" lineHeight={1}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

