import { Calendar, Droplets, Fish, Wind, MessageSquare, Camera, Heart } from 'lucide-react';
import { Paper, Typography, Button, Box, Divider } from '@mui/material';
import WeatherSection from './sections/WeatherSection';
import WaterConditionsSection from './sections/WaterConditionsSection';
import CatchDetailsSection from './sections/CatchDetailsSection';
import RequiredInfoSection from './sections/RequiredInfoSection';
import { useJournalForm } from '../hooks/useJournalForm';
import NotesSection from './sections/NotesSection';
import PictureUpload from './sections/PictureUpload';
import WifesMoodSection from './sections/WifesMoodSection';
import { useToast } from '../context/ToastContext';

export default function FishingJournalForm() {
  const { showSuccess } = useToast();
  const { formData, errors, handleChange, handleSubmit, handlePictureChange } = useJournalForm({
    mode: 'full',
    onSuccess: () => showSuccess('Journal entry saved!'),
  });

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fishing Journal Entry
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Calendar size={24} />
          <Typography variant="h6">Required Information</Typography>
        </Box>
        <RequiredInfoSection formData={formData} errors={errors} handleChange={handleChange} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Wind size={24} />
          <Typography variant="h6">Weather Conditions</Typography>
        </Box>
        <WeatherSection formData={formData} handleChange={handleChange} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Droplets size={24} />
          <Typography variant="h6">Water Conditions</Typography>
        </Box>
        <WaterConditionsSection formData={formData} handleChange={handleChange} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Fish size={24} />
          <Typography variant="h6">Catch Details</Typography>
        </Box>
        <CatchDetailsSection formData={formData} handleChange={handleChange} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Heart size={24} />
          <Typography variant="h6">Wife's Mood</Typography>
        </Box>
        <WifesMoodSection formData={formData} handleChange={handleChange} />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MessageSquare size={24} />
          <Typography variant="h6">Additional Notes</Typography>
        </Box>
        <NotesSection formData={formData} handleChange={handleChange} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Camera size={24} />
          <Typography variant="h6">Pictures</Typography>
        </Box>
        <PictureUpload pictures={formData.pictures} onChange={handlePictureChange} />
      </Box>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 2 }}
      >
        Save Journal Entry
      </Button>
    </Paper>
  );
}