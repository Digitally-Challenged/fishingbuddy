import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Fab, Dialog, DialogContent, Box, IconButton, useMediaQuery } from '@mui/material';
import { Plus, X } from 'lucide-react';
import FishingJournalForm from './components/WizardForm';
import Dashboard from './components/Dashboard';
import Layout from './components/layout/Layout';
import { modernTheme } from './theme/modernTheme';
import { darkThemeOverrides } from './theme/baseTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

function AppContent() {
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const { state: { darkMode } } = useJournal();

  const theme = useMemo(
    () =>
      // Pass arguments separately to createTheme for deep merging
      createTheme(modernTheme, darkMode ? darkThemeOverrides : {}),
    [darkMode]
  );

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (tab: number) => {
    // If user clicks "New Entry" (index 1), open modal instead of changing tab
    if (tab === 1) {
      setOpenNewEntry(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onNavigate={handleNavigate}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Dashboard />
        </Container>

        {/* Floating Action Button for New Entry */}
        <Fab 
          color="primary" 
          aria-label="add entry"
          onClick={() => setOpenNewEntry(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000
          }}
        >
          <Plus size={24} />
        </Fab>

        {/* New Entry Modal */}
        <Dialog
          open={openNewEntry}
          onClose={() => setOpenNewEntry(false)}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: fullScreen ? 0 : 3 }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setOpenNewEntry(false)}>
              <X />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 0 }}>
            <FishingJournalForm onClose={() => setOpenNewEntry(false)} />
          </DialogContent>
        </Dialog>
      </Layout>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <JournalProvider>
        <AppContent />
      </JournalProvider>
    </LocalizationProvider>
  );
}
