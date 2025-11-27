import { Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { FormData } from '../../types';
import { MOOD_OPTIONS } from '../../constants/moodOptions';

interface WifesMoodSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function WifesMoodSection({ formData, handleChange }: WifesMoodSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ToggleButtonGroup
          value={formData.wifesMood}
          exclusive
          onChange={(_, newValue) => {
            handleChange({
              target: {
                name: 'wifesMood',
                value: newValue || ''
              }
            } as React.ChangeEvent<HTMLInputElement>)
          }}
          aria-label="wife's mood"
        >
          {MOOD_OPTIONS.map(({ emoji, label }) => (
            <ToggleButton 
              key={label} 
              value={emoji} 
              aria-label={label}
              sx={{ p: 2 }}
            >
              <Typography sx={{ fontSize: '2rem' }}>
                {emoji}
              </Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
} 