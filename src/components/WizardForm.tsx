import { useState } from 'react';
import { 
  Paper, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  MobileStepper 
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  MapPin,
  Cloud,
  Droplets,
  Fish,
  Camera
} from 'lucide-react';
import WeatherSection from './sections/WeatherSection';
import WaterConditionsSection from './sections/WaterConditionsSection';
import CatchDetailsSection from './sections/CatchDetailsSection';
import RequiredInfoSection from './sections/RequiredInfoSection';
import NotesSection from './sections/NotesSection';
import PictureUpload from './sections/PictureUpload';
import WifesMoodSection from './sections/WifesMoodSection';
import { useJournalForm } from '../hooks/useJournalForm';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const steps = [
  { label: 'The Spot', icon: <MapPin size={20} /> },
  { label: 'Weather', icon: <Cloud size={20} /> },
  { label: 'Water', icon: <Droplets size={20} /> },
  { label: 'The Catch', icon: <Fish size={20} /> },
  { label: 'Memories', icon: <Camera size={20} /> },
];

export default function WizardForm() {
  const { formData, errors, handleChange, handleSubmit, handlePictureChange } = useJournalForm();
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    // Basic validation before proceeding from first step
    if (activeStep === 0) {
      if (!formData.date || !formData.streamName) {
        // Trigger validation by calling a dummy submit or manually checking
        // Since useJournalForm exposes errors but not a validate function directly for external use without submit,
        // we'll rely on the visual error state passed down.
        // For better UX, we could expose validateStep from the hook, but for now let's just alert/block if empty
        if (!formData.date || !formData.streamName) {
           alert("Please fill in the required Date and Stream Name.");
           return;
        }
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <MapPin size={24} /> Where & When?
             </Typography>
             <RequiredInfoSection formData={formData} errors={errors} handleChange={handleChange} />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Cloud size={24} /> How was the weather?
             </Typography>
            <WeatherSection formData={formData} handleChange={handleChange} />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Droplets size={24} /> Water Conditions
             </Typography>
            <WaterConditionsSection formData={formData} handleChange={handleChange} />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Fish size={24} /> What did you catch?
             </Typography>
            <CatchDetailsSection formData={formData} handleChange={handleChange} />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <Camera size={24} /> Notes & Photos
             </Typography>
            <WifesMoodSection formData={formData} handleChange={handleChange} />
            <Box sx={{ my: 3 }} />
            <NotesSection formData={formData} handleChange={handleChange} />
            <Box sx={{ my: 3 }} />
            <PictureUpload pictures={formData.pictures} onChange={handlePictureChange} />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        maxWidth: 800, 
        mx: 'auto',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {!isMobile && (
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel StepIconProps={{
                icon: step.icon
              }}>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Mobile Progress Bar */}
      {isMobile && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" align="center" gutterBottom>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
          </Typography>
          <MobileStepper
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1, bgcolor: 'transparent', p: 0 }}
            backButton={null}
            nextButton={null}
          />
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4, gap: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ChevronLeft size={18} />}
            variant="outlined"
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              sx={{ px: 4 }}
            >
              Save Entry
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={<ChevronRight size={18} />}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

