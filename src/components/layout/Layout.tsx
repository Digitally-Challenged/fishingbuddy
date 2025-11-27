import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

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
      }}
    >
      <Header onNavigate={onNavigate} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}