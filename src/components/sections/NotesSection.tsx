import { Grid, TextField } from '@mui/material';
import { FormData } from '../../types';

interface NotesSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function NotesSection({ formData, handleChange }: NotesSectionProps) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          placeholder="Enter any additional observations, thoughts, or details about your fishing trip..."
        />
      </Grid>
    </Grid>
  );
} 