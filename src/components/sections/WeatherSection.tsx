import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { FormData } from '../../types';

interface WeatherSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const WEATHER_CONDITIONS = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Storm'];

export default function WeatherSection({ formData, handleChange }: WeatherSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <TextField
          label="Wind Velocity (mph)"
          name="windVelocity"
          type="number"
          value={formData.windVelocity}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Wind Direction"
          name="windDirection"
          value={formData.windDirection}
          onChange={handleChange}
        >
          <MenuItem value="">Select direction</MenuItem>
          {WIND_DIRECTIONS.map((direction) => (
            <MenuItem key={direction} value={direction}>
              {direction}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Weather Conditions"
          name="weatherConditions"
          value={formData.weatherConditions}
          onChange={handleChange}
        >
          <MenuItem value="">Select conditions</MenuItem>
          {WEATHER_CONDITIONS.map((condition) => (
            <MenuItem key={condition} value={condition}>
              {condition}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}