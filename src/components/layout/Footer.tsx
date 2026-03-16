import React from 'react';
import { Box, Container, Typography, Link, alpha } from '@mui/material';
import { Fish, Github } from 'lucide-react';
import { journalPalette } from '../../theme/journalTheme';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: journalPalette.leatherDark,
        color: journalPalette.creamLight,
        borderTop: `2px solid ${journalPalette.leatherDeep}`,
        position: 'relative',
        // Stitching effect at top
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundImage: `repeating-linear-gradient(90deg, ${journalPalette.leatherLight} 0px, ${journalPalette.leatherLight} 8px, transparent 8px, transparent 16px)`,
          opacity: 0.4,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Fish size={20} color={journalPalette.creamLight} />
            <Typography
              variant="body2"
              sx={{
                color: alpha(journalPalette.creamLight, 0.8),
                fontFamily: '"Special Elite", monospace',
              }}
            >
              © {currentYear} Fishing Journal. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: alpha(journalPalette.creamLight, 0.8),
                transition: 'color 0.2s',
                '&:hover': {
                  color: journalPalette.creamLight,
                },
              }}
            >
              <Github size={16} />
              <Typography variant="body2" sx={{ fontFamily: '"Special Elite", monospace', color: 'inherit' }}>
                Source Code
              </Typography>
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: alpha(journalPalette.creamLight, 0.8),
                transition: 'color 0.2s',
                '&:hover': {
                  color: journalPalette.creamLight,
                },
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: '"Special Elite", monospace', color: 'inherit' }}>
                Privacy Policy
              </Typography>
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: alpha(journalPalette.creamLight, 0.8),
                transition: 'color 0.2s',
                '&:hover': {
                  color: journalPalette.creamLight,
                },
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: '"Special Elite", monospace', color: 'inherit' }}>
                Terms of Use
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
