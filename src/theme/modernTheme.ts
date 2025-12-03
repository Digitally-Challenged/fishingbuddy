import { ThemeOptions, alpha } from '@mui/material/styles';

// Color Palette inspired by rivers, nature, and early morning fishing
const palette = {
  primary: {
    main: '#0ea5e9', // Sky blue/River blue
    light: '#38bdf8',
    dark: '#0284c7',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#10b981', // Nature green
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc', // Very light slate
    paper: '#ffffff',
  },
  text: {
    primary: '#0f172a', // Slate 900
    secondary: '#475569', // Slate 600
  },
  divider: alpha('#475569', 0.1),
};

export const modernTheme: ThemeOptions = {
  palette,
  shape: {
    borderRadius: 16, // Softer, more modern corners
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f1f5f9', // Slate 100
          backgroundImage: 'radial-gradient(at 50% 0%, alpha(96, 165, 250, 0.1) 0px, transparent 50%)', // Subtle gradient top glow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          '&.MuiPaper-elevation1': {
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            border: '1px solid',
            borderColor: alpha('#475569', 0.05),
          },
          '&.MuiPaper-elevation2': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          border: '1px solid',
          borderColor: alpha('#475569', 0.08),
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            borderColor: alpha('#0ea5e9', 0.4),
          },
        },
      },
    },
  },
};


