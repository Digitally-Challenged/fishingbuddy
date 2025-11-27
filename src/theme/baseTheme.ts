import { ThemeOptions } from '@mui/material/styles';

export const baseTheme: ThemeOptions = {
  palette: {
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#3b82f6',
    },
    secondary: {
      main: '#64748b',
      dark: '#475569',
      light: '#94a3b8',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
};

// Dark mode overrides
export const darkThemeOverrides: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: '#334155',
  },
}; 