import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { useJournal } from '../context/JournalContext';
import { storageUtils } from '../utils/storage';
import { useRef } from 'react';

export default function Settings() {
  const { state, exportEntries, importEntries, clearEntries, toggleDarkMode } = useJournal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = storageUtils.getStorageInfo();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importEntries(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleClear = () => {
    if (window.confirm(`This will delete all ${state.entries.length} entries. Are you sure?`)) {
      clearEntries();
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Appearance */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={state.darkMode}
              onChange={toggleDarkMode}
              icon={<Sun size={16} />}
              checkedIcon={<Moon size={16} />}
            />
          }
          label={state.darkMode ? 'Dark Mode' : 'Light Mode'}
        />
      </Paper>

      {/* Data Management */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {state.entries.length} entries stored
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={exportEntries}
            disabled={state.entries.length === 0}
          >
            Export Data (JSON)
          </Button>

          <Button
            variant="outlined"
            startIcon={<Upload size={18} />}
            onClick={handleImportClick}
          >
            Import Data
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: 'none' }}
          />

          <Divider />

          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={18} />}
            onClick={handleClear}
            disabled={state.entries.length === 0}
          >
            Clear All Data
          </Button>
        </Box>
      </Paper>

      {/* Storage Usage */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Storage Usage
        </Typography>
        <Box sx={{ mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={storageInfo.percentage}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {(storageInfo.used / 1024).toFixed(1)} KB of {(storageInfo.total / 1024 / 1024).toFixed(0)} MB used
          ({storageInfo.percentage.toFixed(1)}%)
        </Typography>
      </Paper>

      {/* About */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fishing Buddy v2.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your personal fishing journal for tracking trips and analyzing patterns.
        </Typography>
      </Paper>
    </Box>
  );
}
