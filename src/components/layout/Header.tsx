import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, IconButton, Button, Stack, alpha, Tooltip } from '@mui/material';
import { Fish, Menu, ExternalLink, Sun, Moon, BookOpen, Layers } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useJournal } from '../../context/JournalContext';
import { journalPalette } from '../../theme/journalTheme';

interface HeaderProps {
  onNavigate: (tab: number) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state: { darkMode, pageFlipStyle }, toggleDarkMode, togglePageFlipStyle } = useJournal();

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
          borderBottom: `2px solid ${journalPalette.leatherDeep}`,
          backgroundColor: journalPalette.leatherDark,
          color: journalPalette.creamLight,
          // Stitching effect at bottom
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundImage: `repeating-linear-gradient(90deg, ${journalPalette.leatherLight} 0px, ${journalPalette.leatherLight} 8px, transparent 8px, transparent 16px)`,
            opacity: 0.4,
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '72px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: journalPalette.creamLight,
                cursor: 'pointer'
              }}
              onClick={() => onNavigate(0)}
            >
              <Box sx={{
                p: 1,
                borderRadius: '8px',
                bgcolor: alpha(journalPalette.creamLight, 0.15),
                color: journalPalette.creamLight,
                display: 'flex',
                border: `1px solid ${alpha(journalPalette.creamLight, 0.3)}`,
              }}>
                <Fish size={24} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontFamily: '"Special Elite", "Courier New", monospace',
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                  color: journalPalette.creamLight,
                }}
              >
                Westfall Fishing Journal
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    borderRadius: '8px',
                    color: journalPalette.creamLight,
                    '&:hover': {
                      bgcolor: alpha(journalPalette.creamLight, 0.1),
                    },
                  }}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
              </Tooltip>
              <Tooltip title={pageFlipStyle === '3d' ? "3D Page Flip (click for Classic)" : "Classic Flip (click for 3D)"}>
                <IconButton
                  onClick={togglePageFlipStyle}
                  sx={{
                    borderRadius: '8px',
                    mr: 1,
                    color: journalPalette.creamLight,
                    '&:hover': {
                      bgcolor: alpha(journalPalette.creamLight, 0.1),
                    },
                  }}
                >
                  {pageFlipStyle === '3d' ? <BookOpen size={20} /> : <Layers size={20} />}
                </IconButton>
              </Tooltip>
              <Button
                component="a"
                href="https://waterdata.usgs.gov/nwis/rt"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ExternalLink size={14} />}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  color: journalPalette.creamLight,
                  fontFamily: '"Special Elite", monospace',
                  '&:hover': {
                    bgcolor: alpha(journalPalette.creamLight, 0.1),
                  },
                }}
              >
                USGS Water Data
              </Button>
              <Button
                component="a"
                href="https://www.weather.gov/"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ExternalLink size={14} />}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  color: journalPalette.creamLight,
                  fontFamily: '"Special Elite", monospace',
                  '&:hover': {
                    bgcolor: alpha(journalPalette.creamLight, 0.1),
                  },
                }}
              >
                Weather
              </Button>
            </Stack>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                onClick={handleMenuOpen}
                sx={{
                  borderRadius: '8px',
                  color: journalPalette.creamLight,
                  '&:hover': {
                    bgcolor: alpha(journalPalette.creamLight, 0.1),
                  },
                }}
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
