import { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
} from '@mui/material';
import { Plus, Save } from 'lucide-react';
import { useJournalForm } from '../hooks/useJournalForm';
import { useJournal } from '../context/JournalContext';
import { useToast } from '../context/ToastContext';

export default function QuickEntryForm() {
  const { showSuccess } = useToast();
  const [showAddAnother, setShowAddAnother] = useState(false);

  const { formData, errors, handleChange, handleSubmit, resetForm } = useJournalForm({
    mode: 'quick',
    onSuccess: () => {
      showSuccess('Entry saved!');
      setShowAddAnother(true);
    },
  });

  const { state } = useJournal();

  // Get unique locations and species from existing entries for autocomplete
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean);
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean);
  const baits = [...new Set(state.entries.map((e) => e.baitUsed))].filter(Boolean);

  const handleQuickSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const handleAddAnother = () => {
    resetForm();
    setShowAddAnother(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quick Entry
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Minimal fields for rapid entry of historical data
      </Typography>

      <Box component="form" onSubmit={handleQuickSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Date - Required */}
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />

          {/* Location - Required with autocomplete */}
          <Autocomplete
            freeSolo
            options={locations}
            value={formData.streamName}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'streamName', value } })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location / Stream"
                name="streamName"
                error={!!errors.streamName}
                helperText={errors.streamName}
                required
              />
            )}
          />

          {/* Species with autocomplete */}
          <Autocomplete
            freeSolo
            options={species}
            value={formData.fishSpecies}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'fishSpecies', value } })
            }
            renderInput={(params) => (
              <TextField {...params} label="Fish Species" name="fishSpecies" />
            )}
          />

          {/* Number Caught */}
          <TextField
            label="Number Caught"
            name="numberCaught"
            type="number"
            value={formData.numberCaught ?? ''}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'numberCaught',
                  value: e.target.value === '' ? null : parseInt(e.target.value),
                },
              })
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          {/* Bait with autocomplete */}
          <Autocomplete
            freeSolo
            options={baits}
            value={formData.baitUsed}
            onInputChange={(_, value) =>
              handleChange({ target: { name: 'baitUsed', value } })
            }
            renderInput={(params) => (
              <TextField {...params} label="Bait / Lure Used" name="baitUsed" />
            )}
          />

          {/* Notes */}
          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Paste your old journal notes here..."
            fullWidth
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save size={18} />}
              fullWidth
            >
              Save Entry
            </Button>
            {showAddAnother && (
              <Button
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={handleAddAnother}
                fullWidth
              >
                Add Another
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
