import { useMemo } from 'react';
import { Paper, Typography, Grid, Box, Chip } from '@mui/material';
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatBox icon={<Fish size={20} />} label="Total Catches" value={stats.totalCatches} />
        </Grid>
        <Grid item xs={6}>
          <StatBox icon={<MapPin size={20} />} label="Locations" value={stats.uniqueLocations} />
        </Grid>
        <Grid item xs={6}>
          <StatBox icon={<Droplets size={20} />} label="Species" value={stats.uniqueSpecies} />
        </Grid>
        <Grid item xs={6}>
          <StatBox icon={<Calendar size={20} />} label="Total Trips" value={stats.totalTrips} />
        </Grid>
      </Grid>

      {/* Insights */}
      {stats.totalTrips > 0 && (
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp size={14} /> Insights
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <InsightRow
              icon={<Award size={14} />}
              label="Avg catch/trip"
              value={stats.avgCatchPerTrip}
            />
            {stats.topLocation && (
              <InsightRow
                icon={<MapPin size={14} />}
                label="Most visited"
                value={stats.topLocation[0]}
                count={stats.topLocation[1]}
              />
            )}
            {stats.topBait && (
              <InsightRow
                icon={<Fish size={14} />}
                label="Top bait"
                value={stats.topBait[0]}
                count={stats.topBait[1]}
              />
            )}
          </Box>

          {stats.topSpecies.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Top species:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                {stats.topSpecies.map(([species, count]) => (
                  <Chip key={species} label={`${species} (${count})`} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
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

function InsightRow({
  icon,
  label,
  value,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  count?: number;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight="medium">
        {value}
        {count !== undefined && ` (${count})`}
      </Typography>
    </Box>
  );
}
