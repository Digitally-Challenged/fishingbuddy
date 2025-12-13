import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Fab, Dialog, DialogContent, Box, IconButton, useMediaQuery, alpha } from '@mui/material';
import { Feather, X } from 'lucide-react';
import FishingJournalForm from './components/WizardForm';
import Dashboard from './components/Dashboard';
import Layout from './components/layout/Layout';
import JournalCover from './components/JournalCover';
import { journalTheme, journalDarkOverrides, journalPalette } from './theme/journalTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

const SESSION_KEY = 'journalOpened';

function AppContent() {
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false); // DEV: always show cover
  const { state: { darkMode } } = useJournal();

  const handleOpenJournal = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsJournalOpen(true);
  };

  const theme = useMemo(
    () =>
      createTheme(journalTheme, darkMode ? journalDarkOverrides : {}),
    [darkMode]
  );

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (tab: number) => {
    if (tab === 1) {
      setOpenNewEntry(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isJournalOpen && <JournalCover onOpen={handleOpenJournal} />}
      <Layout onNavigate={handleNavigate}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Dashboard />
        </Container>

        <Fab
          color="primary"
          aria-label="add entry"
          onClick={() => setOpenNewEntry(true)}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            '& svg': {
              transition: 'transform 0.3s ease',
            },
            '&:hover': {
              transform: 'scale(1.1)',
              '& svg': {
                transform: 'rotate(-15deg)',
              },
            },
          }}
        >
          <Feather size={24} />
        </Fab>

        <Dialog
          open={openNewEntry}
          onClose={() => setOpenNewEntry(false)}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: fullScreen ? 0 : 2,
              border: `4px solid ${journalPalette.leatherDark}`,
              backgroundImage: 'url(/textures/paper-cream.webp)',
              backgroundRepeat: 'repeat',
              backgroundSize: '512px 512px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '48px',
                backgroundImage: 'url(/textures/stitching-border.webp)',
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 48px',
                backgroundPosition: 'center',
                opacity: 0.5,
                pointerEvents: 'none',
              },
              boxShadow: `0 8px 32px ${alpha(journalPalette.leatherDeep, 0.4)}`,
            }
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
