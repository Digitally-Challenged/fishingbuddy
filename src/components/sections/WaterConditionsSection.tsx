import React, { useEffect, useState } from 'react';
import { Grid, TextField, MenuItem, Tooltip, IconButton } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import { FormData } from '../../types';
import { usgsStations } from '../../data/usgsStations';
import { getStationsByStreamName, formatStationName, getUSGSDataUrl } from '../../utils/usgsUtils';

interface WaterConditionsSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const WATER_CLARITY = ['Clear', 'Stained', 'Murky', 'Muddy'];

export default function WaterConditionsSection({ formData, handleChange }: WaterConditionsSectionProps) {
  const [availableStations, setAvailableStations] = useState<typeof usgsStations>([]);

  useEffect(() => {
    if (formData.streamName) {
      const filteredStations = getStationsByStreamName(formData.streamName, usgsStations);
      setAvailableStations(filteredStations);
    } else {
      setAvailableStations([]);
    }
  }, [formData.streamName]);

  const handleUSGSLinkClick = () => {
    if (formData.usgsGauge) {
      window.open(getUSGSDataUrl(formData.usgsGauge), '_blank');
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <TextField
          select
          label="Water Clarity"
          name="waterClarity"
          value={formData.waterClarity}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="">Select clarity</MenuItem>
          {WATER_CLARITY.map((clarity) => (
            <MenuItem key={clarity} value={clarity}>
              {clarity}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TextField
          select
          label="USGS Gauge Reference"
          name="usgsGauge"
          value={formData.usgsGauge}
          onChange={handleChange}
          fullWidth
          disabled={!formData.streamName}
          helperText={!formData.streamName ? "Select a stream first" : (
            availableStations.length === 0 ? "No gauges available for this stream" : ""
          )}
          InputProps={{
            endAdornment: formData.usgsGauge && (
              <Tooltip title="View USGS Data">
                <IconButton 
                  size="small" 
                  onClick={handleUSGSLinkClick}
                  sx={{ mr: 1 }}
                >
                  <ExternalLink size={16} />
                </IconButton>
              </Tooltip>
            ),
          }}
        >
          <MenuItem value="">Select gauge</MenuItem>
          {availableStations.map((station) => (
            <MenuItem key={station.stationNumber} value={station.stationNumber}>
              {formatStationName(station)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TextField
          label="Flow Rate (cfs)"
          name="flowRate"
          type="number"
          value={formData.flowRate}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0, step: 0.1 }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TextField
          label="River Depth (ft)"
          name="riverDepth"
          type="number"
          value={formData.riverDepth}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0, step: 0.1 }}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <TextField
          label="Water Temperature (°F)"
          name="waterTemperature"
          type="number"
          value={formData.waterTemperature}
          onChange={handleChange}
          fullWidth
          inputProps={{ min: 0, step: 0.1 }}
        />
      </Grid>
    </Grid>
  );
}