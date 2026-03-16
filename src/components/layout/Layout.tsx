import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { journalPalette } from '../../theme/journalTheme';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (tab: number) => void;
}

export default function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        // Subtle leather frame on edges
        borderLeft: { xs: 'none', md: `8px solid ${journalPalette.leatherDark}` },
        borderRight: { xs: 'none', md: `8px solid ${journalPalette.leatherDark}` },
        boxShadow: {
          xs: 'none',
          md: `inset 4px 0 8px -4px rgba(61, 43, 31, 0.3), inset -4px 0 8px -4px rgba(61, 43, 31, 0.3)`,
        },
      }}
    >
      <a
        href="#journal-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = 'static';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = 'absolute';
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
        }}
      >
        Skip to journal
      </a>
      <Header onNavigate={onNavigate} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
