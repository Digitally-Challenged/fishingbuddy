import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Box, Tabs, Tab, useMediaQuery } from '@mui/material';
import FishingJournalForm from './components/FishingJournalForm';
import QuickEntryForm from './components/QuickEntryForm';
import Dashboard from './components/Dashboard';
import StatsView from './components/StatsView';
import JournalView from './components/JournalView';
import Settings from './components/Settings';
import Layout from './components/layout/Layout';
import BottomNav from './components/layout/BottomNav';
import { baseTheme, darkThemeOverrides } from './theme/baseTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    state: { darkMode },
  } = useJournal();

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        ...(darkMode ? darkThemeOverrides : {}),
      }),
    [darkMode]
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigate = (tab: number) => {
    setActiveTab(tab);
  };

  // Mobile view mapping: 0=Stats, 1=Quick, 2=Journal, 3=Settings
  // Desktop view mapping: 0=Dashboard, 1=Quick Entry, 2=Full Entry

  const renderMobileContent = () => {
    switch (activeTab) {
      case 0:
        return <StatsView />;
      case 1:
        return <QuickEntryForm />;
      case 2:
        return <JournalView />;
      case 3:
        return <Settings />;
      default:
        return <StatsView />;
    }
  };

  const renderDesktopContent = () => {
    switch (activeTab) {
      case 0:
        return <Dashboard />;
      case 1:
        return <QuickEntryForm />;
      case 2:
        return <FishingJournalForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onNavigate={handleNavigate}>
        <Container maxWidth="lg">
          {/* Desktop Tabs - hidden on mobile */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => handleNavigate(newValue)}
              aria-label="fishing journal navigation"
            >
              <Tab label="Dashboard" />
              <Tab label="Quick Entry" />
              <Tab label="Full Entry" />
            </Tabs>
          </Box>

          {/* Content area */}
          <Box sx={{ pb: { xs: 8, md: 0 } }}>
            {isMobile ? renderMobileContent() : renderDesktopContent()}
          </Box>
        </Container>

        {/* Mobile Bottom Navigation */}
        <BottomNav value={activeTab} onChange={handleNavigate} />
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
