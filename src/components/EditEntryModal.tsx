import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
} from '@mui/material';
import { JournalEntry } from '../types';
import { useJournal } from '../context/JournalContext';
import { useToast } from '../context/ToastContext';

interface EditEntryModalProps {
  entry: JournalEntry | null;
  open: boolean;
  onClose: () => void;
}

export default function EditEntryModal({ entry, open, onClose }: EditEntryModalProps) {
  const { state, updateEntry } = useJournal();
  const { showSuccess } = useToast();
  const [formData, setFormData] = useState<JournalEntry | null>(null);

  // Get autocomplete options
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean);
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean);
  const baits = [...new Set(state.entries.map((e) => e.baitUsed))].filter(Boolean);

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry });
    }
  }, [entry]);

  const handleChange = (name: string, value: string | number | null) => {
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      updateEntry(formData);
      showSuccess('Entry updated');
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Autocomplete
            freeSolo
            options={locations}
            value={formData.streamName}
            onInputChange={(_, value) => handleChange('streamName', value)}
            renderInput={(params) => (
              <TextField {...params} label="Location / Stream" />
            )}
          />

          <Autocomplete
            freeSolo
            options={species}
            value={formData.fishSpecies}
            onInputChange={(_, value) => handleChange('fishSpecies', value)}
            renderInput={(params) => (
              <TextField {...params} label="Fish Species" />
            )}
          />

          <TextField
            label="Number Caught"
            type="number"
            value={formData.numberCaught ?? ''}
            onChange={(e) =>
              handleChange(
                'numberCaught',
                e.target.value === '' ? null : parseInt(e.target.value)
              )
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          <Autocomplete
            freeSolo
            options={baits}
            value={formData.baitUsed}
            onInputChange={(_, value) => handleChange('baitUsed', value)}
            renderInput={(params) => (
              <TextField {...params} label="Bait / Lure Used" />
            )}
          />

          <TextField
            label="Weather Conditions"
            value={formData.weatherConditions}
            onChange={(e) => handleChange('weatherConditions', e.target.value)}
            fullWidth
          />

          <TextField
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
