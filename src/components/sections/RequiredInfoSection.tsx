import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FormData, FormErrors } from '../../types';
import { getSortedStreams } from '../../data/arkansasStreams';

interface RequiredInfoSectionProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function RequiredInfoSection({ formData, errors, handleChange }: RequiredInfoSectionProps) {
  const sortedStreams = getSortedStreams();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <DatePicker
          label="Date *"
          value={formData.date ? dayjs(formData.date) : null}
          onChange={(newValue) => {
            handleChange({
              target: {
                name: 'date',
                value: newValue ? newValue.format('YYYY-MM-DD') : '',
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          slotProps={{
            textField: {
              error: !!errors.date,
              helperText: errors.date,
              fullWidth: true,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Stream Name *"
          name="streamName"
          value={formData.streamName}
          onChange={handleChange}
          error={!!errors.streamName}
          helperText={errors.streamName}
          fullWidth
        >
          <MenuItem value="">Select stream</MenuItem>
          {sortedStreams.map((stream) => (
            <MenuItem key={stream} value={stream}>
              {stream}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}