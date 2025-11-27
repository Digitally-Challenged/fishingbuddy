import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Container, CssBaseline, Box, Tabs, Tab } from '@mui/material';
import FishingJournalForm from './components/FishingJournalForm';
import Dashboard from './components/Dashboard';
import Layout from './components/layout/Layout';
import { baseTheme, darkThemeOverrides } from './theme/baseTheme';
import { JournalProvider, useJournal } from './context/JournalContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState(0);
  const { state: { darkMode } } = useJournal();

  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        ...(darkMode ? darkThemeOverrides : {}),
      }),
    [darkMode]
  );

  const handleNavigate = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onNavigate={handleNavigate}>
        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => handleNavigate(newValue)}
              aria-label="fishing journal navigation"
            >
              <Tab label="Dashboard" />
              <Tab label="New Entry" />
            </Tabs>
          </Box>
          
          {activeTab === 0 && <Dashboard />}
          {activeTab === 1 && <FishingJournalForm />}
        </Container>
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