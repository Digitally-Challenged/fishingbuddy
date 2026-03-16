import { ThemeOptions, alpha } from '@mui/material/styles';

// Leather Journal Color Palette
export const journalPalette = {
  // Paper colors
  creamPaper: '#f5f0e6',
  creamLight: '#faf8f3',
  // Leather colors
  leatherDark: '#5c4033',
  leatherDeep: '#3d2b1f',
  leatherLight: '#8b6b4a',
  // Ink colors
  inkBlack: '#2d2a26',
  inkFaded: '#5a544a',
  sepia: '#704214',
  lineRule: '#d4c4a8',
  // Dark mode
  darkWalnut: '#1a1512',
  darkParchment: '#2d2520',
  darkLeather: '#2a1f1a',
  warmCream: '#e8dfd0',
  mutedTan: '#bfb09a',
  amber: '#c4956a',
};

export const journalTheme: ThemeOptions = {
  palette: {
    primary: {
      main: journalPalette.leatherDark,
      dark: journalPalette.leatherDeep,
      light: journalPalette.leatherLight,
      contrastText: journalPalette.creamLight,
    },
    secondary: {
      main: journalPalette.sepia,
      dark: journalPalette.inkBlack,
      light: journalPalette.inkFaded,
      contrastText: journalPalette.creamLight,
    },
    background: {
      default: journalPalette.creamPaper,
      paper: journalPalette.creamLight,
    },
    text: {
      primary: journalPalette.inkBlack,
      secondary: journalPalette.inkFaded,
    },
    divider: journalPalette.lineRule,
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: '"Lora", Georgia, "Times New Roman", serif',
    h1: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    h2: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    h3: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    h4: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    h5: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    h6: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      fontWeight: 400,
      color: journalPalette.leatherDeep,
    },
    subtitle1: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      color: journalPalette.sepia,
    },
    subtitle2: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      color: journalPalette.sepia,
    },
    body1: {
      fontFamily: '"Lora", Georgia, serif',
      color: journalPalette.inkBlack,
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Lora", Georgia, serif',
      color: journalPalette.inkFaded,
      lineHeight: 1.6,
    },
    caption: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      color: journalPalette.inkFaded,
      fontSize: '0.8125rem',
    },
    button: {
      fontFamily: '"Special Elite", "Courier New", monospace',
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/textures/paper-cream.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: journalPalette.creamLight,
          border: `1px solid ${journalPalette.lineRule}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'url(/textures/paper-cream.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
          border: `2px solid ${journalPalette.leatherLight}`,
          boxShadow: `0 4px 12px ${alpha(journalPalette.leatherDeep, 0.15)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
        contained: {
          backgroundColor: journalPalette.leatherDark,
          color: journalPalette.creamLight,
          boxShadow: `inset 0 1px 0 ${alpha('#fff', 0.1)}, 0 2px 4px ${alpha(journalPalette.leatherDeep, 0.3)}`,
          '&:hover': {
            backgroundColor: journalPalette.leatherDeep,
          },
        },
        outlined: {
          borderColor: journalPalette.leatherDark,
          color: journalPalette.leatherDark,
          '&:hover': {
            backgroundColor: alpha(journalPalette.leatherLight, 0.1),
            borderColor: journalPalette.leatherDeep,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: journalPalette.creamLight,
            '& fieldset': {
              borderColor: journalPalette.lineRule,
            },
            '&:hover fieldset': {
              borderColor: journalPalette.leatherLight,
            },
            '&.Mui-focused fieldset': {
              borderColor: journalPalette.sepia,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Special Elite", "Courier New", monospace',
          borderColor: journalPalette.lineRule,
        },
        outlined: {
          backgroundColor: alpha(journalPalette.creamLight, 0.8),
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(journalPalette.leatherLight, 0.15),
          '& .MuiTableCell-head': {
            fontFamily: '"Special Elite", "Courier New", monospace',
            color: journalPalette.leatherDeep,
            fontWeight: 400,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${journalPalette.lineRule}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'url(/textures/paper-cream.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
          border: `3px solid ${journalPalette.leatherDark}`,
          boxShadow: `0 8px 32px ${alpha(journalPalette.leatherDeep, 0.4)}`,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.leatherDark,
          color: journalPalette.creamLight,
          '&:hover': {
            backgroundColor: journalPalette.leatherDeep,
          },
        },
      },
    },
  },
};

// Dark mode overrides for "Lamplight Study" effect
export const journalDarkOverrides: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: journalPalette.amber,
      dark: journalPalette.leatherLight,
      light: journalPalette.warmCream,
    },
    background: {
      default: journalPalette.darkWalnut,
      paper: journalPalette.darkParchment,
    },
    text: {
      primary: journalPalette.warmCream,
      secondary: journalPalette.mutedTan,
    },
    divider: alpha(journalPalette.amber, 0.2),
  },
  typography: {
    h1: { color: journalPalette.warmCream },
    h2: { color: journalPalette.warmCream },
    h3: { color: journalPalette.warmCream },
    h4: { color: journalPalette.warmCream },
    h5: { color: journalPalette.warmCream },
    h6: { color: journalPalette.warmCream },
    subtitle1: { color: journalPalette.amber },
    subtitle2: { color: journalPalette.amber },
    body1: { color: journalPalette.warmCream },
    body2: { color: journalPalette.mutedTan },
    caption: { color: journalPalette.mutedTan },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: journalPalette.darkWalnut,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.darkParchment,
          backgroundImage: 'none',
          border: `1px solid ${alpha(journalPalette.amber, 0.2)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.darkParchment,
          backgroundImage: 'none',
          border: `2px solid ${journalPalette.darkLeather}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: journalPalette.darkParchment,
          backgroundImage: 'none',
          border: `3px solid ${journalPalette.darkLeather}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(journalPalette.darkLeather, 0.5),
          '& .MuiTableCell-head': {
            color: journalPalette.warmCream,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: journalPalette.warmCream,
          borderBottom: `1px solid ${alpha(journalPalette.amber, 0.15)}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: journalPalette.warmCream,
          borderColor: alpha(journalPalette.amber, 0.4),
        },
        outlined: {
          backgroundColor: alpha(journalPalette.darkLeather, 0.5),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: journalPalette.amber,
          color: journalPalette.darkWalnut,
          '&:hover': {
            backgroundColor: journalPalette.leatherLight,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.amber,
          color: journalPalette.darkWalnut,
          '&:hover': {
            backgroundColor: journalPalette.leatherLight,
          },
        },
      },
    },
  },
};
