import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { FormData } from '../../types';
import { allFishSpecies } from '../../data/fishSpecies';

interface CatchDetailsSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CatchDetailsSection({ formData, handleChange }: CatchDetailsSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <TextField
          select
          label="Species of Fish"
          name="fishSpecies"
          value={formData.fishSpecies}
          onChange={handleChange}
        >
          <MenuItem value="">Select species</MenuItem>
          {allFishSpecies.map((species) => (
            <MenuItem key={species} value={species}>
              {species}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Number Caught"
          name="numberCaught"
          type="number"
          value={formData.numberCaught}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Bait Used"
          name="baitUsed"
          value={formData.baitUsed}
          onChange={handleChange}
          placeholder="Enter bait type"
        />
      </Grid>
    </Grid>
  );
}