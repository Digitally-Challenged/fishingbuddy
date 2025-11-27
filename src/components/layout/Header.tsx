import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, IconButton } from '@mui/material';
import { Fish, Menu, Sun, Moon } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useJournal } from '../../context/JournalContext';

interface HeaderProps {
  onNavigate: (tab: number) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state: { darkMode }, toggleDarkMode } = useJournal();

  const handleMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Fish size={32} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                ml: 2,
                flexGrow: 1,
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              Fishing Journal
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <Typography
                component="a"
                href="https://waterdata.usgs.gov/nwis/rt"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                USGS Water Data
              </Typography>
              <Typography
                component="a"
                href="https://www.weather.gov/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Weather
              </Typography>
              <IconButton 
                onClick={toggleDarkMode}
                color="inherit"
                sx={{ ml: 1 }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open drawer"
                onClick={handleMenuOpen}
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