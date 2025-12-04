import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { Fish, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
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
            <Fish size={20} />
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Fishing Journal. All rights reserved.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Github size={16} />
              <Typography variant="body2">Source Code</Typography>
            </Link>
            <Link href="#" color="text.secondary">
              <Typography variant="body2">Privacy Policy</Typography>
            </Link>
            <Link href="#" color="text.secondary">
              <Typography variant="body2">Terms of Use</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}