import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, IconButton, Button, Stack } from '@mui/material';
import { Fish, Menu, ExternalLink } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useJournal } from '../../context/JournalContext';

interface HeaderProps {
  onNavigate: (tab: number) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state: { darkMode }, toggleDarkMode } = useJournal(); // Keep for logic, but maybe hide toggle for now if theme is fixed

  const handleMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '72px' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                color: 'primary.main',
                cursor: 'pointer'
              }}
              onClick={() => onNavigate(0)}
            >
              <Box sx={{ 
                p: 1, 
                borderRadius: '12px', 
                bgcolor: 'primary.main', 
                color: 'white',
                display: 'flex' 
              }}>
                <Fish size={24} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  color: 'text.primary'
                }}
              >
                Westfall Fishing Journal
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Button
                component="a"
                href="https://waterdata.usgs.gov/nwis/rt"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                endIcon={<ExternalLink size={14} />}
                sx={{ borderRadius: '10px', px: 2 }}
              >
                USGS Water Data
              </Button>
              <Button
                component="a"
                href="https://www.weather.gov/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                endIcon={<ExternalLink size={14} />}
                sx={{ borderRadius: '10px', px: 2 }}
              >
                Weather
              </Button>
            </Stack>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open drawer"
                onClick={handleMenuOpen}
                sx={{ borderRadius: '12px' }}
              >
                <Menu />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <MobileMenu 
        open={mobileMenuOpen} 
        onClose={handleMenuClose} 
        onNavigate={onNavigate}
      />
    </>
  );
}
