import { useMemo } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
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

  return (
    <Paper sx={{ p: 2 }}>
      {/* Horizontal stats row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
        <StatBox icon={<Fish size={18} />} label="Catches" value={stats.totalCatches} />
        <StatBox icon={<MapPin size={18} />} label="Locations" value={stats.uniqueLocations} />
        <StatBox icon={<Droplets size={18} />} label="Species" value={stats.uniqueSpecies} />
        <StatBox icon={<Calendar size={18} />} label="Trips" value={stats.totalTrips} />
        {stats.totalTrips > 0 && (
          <StatBox icon={<Award size={18} />} label="Avg/Trip" value={stats.avgCatchPerTrip} />
        )}
      </Box>

      {/* Compact insights row */}
      {stats.totalTrips > 0 && (stats.topLocation || stats.topBait || stats.topSpecies.length > 0) && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <TrendingUp size={14} />
            <Typography variant="caption">Insights:</Typography>
          </Box>
          {stats.topLocation && (
            <Chip
              icon={<MapPin size={12} />}
              label={`${stats.topLocation[0]} (${stats.topLocation[1]} trips)`}
              size="small"
              variant="outlined"
            />
          )}
          {stats.topBait && (
            <Chip
              label={`Top bait: ${stats.topBait[0]}`}
              size="small"
              variant="outlined"
            />
          )}
          {stats.topSpecies.slice(0, 2).map(([species, count]) => (
            <Chip key={species} label={`${species} (${count})`} size="small" variant="outlined" />
          ))}
        </Box>
      )}
    </Paper>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 0.5 }}>{icon}</Box>
      <Typography variant="h5" component="div">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

