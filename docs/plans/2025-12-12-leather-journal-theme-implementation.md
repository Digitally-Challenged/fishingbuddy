# Leather Journal Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the fishing journal app's visual styling to evoke a vintage leather-bound fishing logbook with typewriter text on aged cream paper.

**Architecture:** Create a new `journalTheme.ts` that replaces the modern theme. Add CSS custom properties for texture URLs. Update components incrementally, starting with global styles, then cards, then modals.

**Tech Stack:** MUI theming, CSS custom properties, @fontsource packages, WebP textures

**Design Doc:** `docs/plans/2025-12-12-leather-journal-theme-design.md`

---

## Task 1: Install Font Packages

**Files:**
- Modify: `package.json`

**Step 1: Install @fontsource packages**

Run:
```bash
npm install @fontsource/special-elite @fontsource/lora
```

Expected: Package installation succeeds, `package.json` updated with new dependencies

**Step 2: Verify installation**

Run:
```bash
ls node_modules/@fontsource/special-elite && ls node_modules/@fontsource/lora
```

Expected: Both directories exist with font files

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install Special Elite and Lora fonts"
```

---

## Task 2: Create Journal Theme File

**Files:**
- Create: `src/theme/journalTheme.ts`

**Step 1: Create the journal theme with color palette and typography**

Create `src/theme/journalTheme.ts`:

```typescript
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
  mutedTan: '#a89880',
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
      fontSize: '0.75rem',
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/textures/paper-cream.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
          filter: 'brightness(0.3) sepia(0.2)',
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            backgroundColor: journalPalette.darkWalnut,
            zIndex: -1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.darkParchment,
          border: `1px solid ${alpha(journalPalette.amber, 0.2)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: journalPalette.darkParchment,
          border: `2px solid ${journalPalette.darkLeather}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: journalPalette.darkParchment,
          border: `3px solid ${journalPalette.darkLeather}`,
        },
      },
    },
  },
};
```

**Step 2: Verify file created**

Run:
```bash
cat src/theme/journalTheme.ts | head -20
```

Expected: File contents displayed

**Step 3: Commit**

```bash
git add src/theme/journalTheme.ts
git commit -m "feat: create leather journal theme with color palette and typography"
```

---

## Task 3: Import Fonts in Main Entry

**Files:**
- Modify: `src/main.tsx`

**Step 1: Add font imports at the top of main.tsx**

Add after the React imports, before App import:

```typescript
// Fonts
import '@fontsource/special-elite';
import '@fontsource/lora/400.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/600.css';
import '@fontsource/lora/700.css';
```

**Step 2: Verify build works**

Run:
```bash
npm run build
```

Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: import Special Elite and Lora font packages"
```

---

## Task 4: Switch App to Journal Theme

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update theme imports**

Replace:
```typescript
import { modernTheme } from './theme/modernTheme';
import { darkThemeOverrides } from './theme/baseTheme';
```

With:
```typescript
import { journalTheme, journalDarkOverrides } from './theme/journalTheme';
```

**Step 2: Update theme creation**

Replace:
```typescript
const theme = useMemo(
  () =>
    createTheme(modernTheme, darkMode ? darkThemeOverrides : {}),
  [darkMode]
);
```

With:
```typescript
const theme = useMemo(
  () =>
    createTheme(journalTheme, darkMode ? journalDarkOverrides : {}),
  [darkMode]
);
```

**Step 3: Test in browser**

Run:
```bash
npm run dev
```

Expected: App loads with new journal styling - cream paper background, typewriter fonts visible

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: switch app to leather journal theme"
```

---

## Task 5: Add Leather Frame to Layout

**Files:**
- Modify: `src/components/layout/Layout.tsx`

**Step 1: Add leather border styling to Layout**

Replace the entire file with:

```typescript
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
      <Header onNavigate={onNavigate} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
```

**Step 2: Verify in browser**

Expected: Subtle leather border visible on desktop viewport edges

**Step 3: Commit**

```bash
git add src/components/layout/Layout.tsx
git commit -m "feat: add leather frame border to layout"
```

---

## Task 6: Style Header with Leather Accent

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Read current Header file**

Read the file to understand current structure.

**Step 2: Update header with leather styling**

Add leather-dark background, stitching detail at bottom, and typewriter title styling. Import `journalPalette` and apply:
- Background: `journalPalette.leatherDark`
- Text: `journalPalette.creamLight`
- Border bottom: `2px solid ${journalPalette.leatherDeep}`
- Optional: Add stitching border image

**Step 3: Test in browser**

Expected: Header has leather appearance with cream text

**Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: style header with leather accent and stitching"
```

---

## Task 7: Update Modal with Leather Frame

**Files:**
- Modify: `src/App.tsx` (Dialog styling)
- Modify: `src/components/dashboard/JournalEntryList.tsx` (Entry detail modal)

**Step 1: Update App.tsx Dialog PaperProps**

In the Dialog component, update PaperProps to include leather frame:

```typescript
PaperProps={{
  sx: {
    borderRadius: fullScreen ? 0 : 2,
    border: `4px solid ${journalPalette.leatherDark}`,
    backgroundImage: 'url(/textures/paper-cream.webp)',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      backgroundImage: 'url(/textures/stitching-border.webp)',
      backgroundRepeat: 'repeat-x',
      backgroundSize: 'auto 48px',
      backgroundPosition: 'center',
      opacity: 0.6,
    },
  }
}}
```

**Step 2: Update JournalEntryList.tsx entry detail modal similarly**

Apply same leather frame styling to the entry detail Dialog.

**Step 3: Test in browser**

Expected: Modals have leather border with stitching detail at top

**Step 4: Commit**

```bash
git add src/App.tsx src/components/dashboard/JournalEntryList.tsx
git commit -m "feat: add leather frame and stitching to modals"
```

---

## Task 8: Update Journal Entry Cards

**Files:**
- Modify: `src/components/dashboard/JournalEntryList.tsx`

**Step 1: Update TableContainer styling**

Replace the water caustics background effect with paper texture. Update the TableContainer Paper component:

```typescript
<TableContainer
  component={Paper}
  elevation={0}
  sx={{
    border: `2px solid ${journalPalette.leatherLight}`,
    borderRadius: 2,
    position: 'relative',
    backgroundImage: 'url(/textures/paper-cream.webp)',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  }}
>
```

**Step 2: Remove or simplify WaterCausticsBackground**

Either remove the WaterCausticsBackground component or make it optional/disabled for the journal theme.

**Step 3: Update table row hover styling**

Update hover colors to use leather tones instead of blue.

**Step 4: Test in browser**

Expected: Entry list has paper texture background with leather-toned accents

**Step 5: Commit**

```bash
git add src/components/dashboard/JournalEntryList.tsx
git commit -m "feat: update journal entry list with paper texture and leather accents"
```

---

## Task 9: Style Empty State

**Files:**
- Modify: `src/components/dashboard/JournalEntryList.tsx`

**Step 1: Update empty state styling**

Find the "No entries found" empty state and update with journal styling:

```typescript
<Box sx={{
  textAlign: 'center',
  py: 8,
  backgroundImage: 'url(/textures/paper-lined.webp)',
  backgroundRepeat: 'repeat',
  backgroundSize: '512px 512px',
  borderRadius: 2,
  border: `2px dashed ${journalPalette.leatherLight}`,
}}>
  <Typography
    variant="h6"
    sx={{
      fontFamily: '"Special Elite", monospace',
      color: journalPalette.inkFaded,
    }}
    gutterBottom
  >
    No entries found
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: journalPalette.inkFaded, mb: 3 }}
  >
    Get out there and catch some fish!
  </Typography>
</Box>
```

**Step 2: Test in browser**

Expected: Empty state has lined paper background

**Step 3: Commit**

```bash
git add src/components/dashboard/JournalEntryList.tsx
git commit -m "feat: style empty state with lined paper texture"
```

---

## Task 10: Update Dashboard Stats Cards

**Files:**
- Modify: `src/components/dashboard/JournalStats.tsx`

**Step 1: Read current file**

Understand current card structure.

**Step 2: Apply journal theme styling to stat cards**

- Background: Paper texture
- Border: Leather color
- Typography: Typewriter for numbers, serif for labels
- Import `journalPalette` and apply styling

**Step 3: Test in browser**

Expected: Stats cards match journal aesthetic

**Step 4: Commit**

```bash
git add src/components/dashboard/JournalStats.tsx
git commit -m "feat: style dashboard stats with journal theme"
```

---

## Task 11: Test Dark Mode

**Files:**
- Review all modified files

**Step 1: Toggle dark mode in app**

Test the dark mode toggle to ensure "Lamplight Study" effect works.

**Step 2: Verify contrast and readability**

Check that:
- Text is readable against dark backgrounds
- Leather tones are visible but muted
- Amber accents provide warmth

**Step 3: Fix any contrast issues**

Adjust `journalDarkOverrides` if needed.

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: adjust dark mode contrast and colors"
```

---

## Task 12: Final Verification and Cleanup

**Files:**
- All modified files

**Step 1: Run linter**

```bash
npm run lint
```

Expected: No errors

**Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds

**Step 3: Visual review**

- Light mode looks like a leather journal
- Dark mode has warm lamplight feel
- Fonts render correctly (Special Elite for headers, Lora for body)
- Textures tile smoothly
- Modals have leather frame with stitching

**Step 4: Remove unused code**

If `modernTheme.ts` is no longer used, consider keeping for reference or removing.

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: cleanup and final verification of leather journal theme"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Install font packages | package.json |
| 2 | Create journal theme | src/theme/journalTheme.ts |
| 3 | Import fonts | src/main.tsx |
| 4 | Switch to journal theme | src/App.tsx |
| 5 | Add leather frame to layout | src/components/layout/Layout.tsx |
| 6 | Style header | src/components/layout/Header.tsx |
| 7 | Style modals | src/App.tsx, JournalEntryList.tsx |
| 8 | Update entry list cards | JournalEntryList.tsx |
| 9 | Style empty state | JournalEntryList.tsx |
| 10 | Update stats cards | JournalStats.tsx |
| 11 | Test dark mode | All files |
| 12 | Final verification | All files |

**Total tasks:** 12
**Estimated commits:** 12-14
