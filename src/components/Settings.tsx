import { useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Download, Upload, Trash2, Moon, Sun, FileSpreadsheet, Copy } from 'lucide-react';
import { useJournal } from '../context/JournalContext';
import { storageUtils } from '../utils/storage';

export default function Settings() {
  const { state, exportEntries, importEntries, clearEntries, toggleDarkMode } = useJournal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageInfo = storageUtils.getStorageInfo();
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importEntries(file);
        showToast('Data imported successfully!');
      } catch {
        showToast('Failed to import data', 'error');
      }
      e.target.value = '';
    }
  };

  const handleExportJSON = () => {
    try {
      exportEntries();
      showToast('JSON exported successfully!');
    } catch {
      showToast('Failed to export JSON', 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      storageUtils.exportEntriesAsCSV();
      showToast('CSV exported successfully!');
    } catch {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await storageUtils.copyEntriesToClipboard();
      showToast('Copied to clipboard!');
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleClear = () => {
    if (window.confirm(`This will delete all ${state.entries.length} entries. Are you sure?`)) {
      clearEntries();
      showToast('All data cleared');
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

      {/* Export Options */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {state.entries.length} entries available for export
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={handleExportJSON}
            disabled={state.entries.length === 0}
          >
            Export as JSON
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileSpreadsheet size={18} />}
            onClick={handleExportCSV}
            disabled={state.entries.length === 0}
          >
            Export as CSV (Excel)
          </Button>

          <Button
            variant="outlined"
            startIcon={<Copy size={18} />}
            onClick={handleCopyToClipboard}
            disabled={state.entries.length === 0}
          >
            Copy to Clipboard
          </Button>
        </Box>
      </Paper>

      {/* Import */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Import Data
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Upload size={18} />}
          onClick={handleImportClick}
          fullWidth
        >
          Import from JSON
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Import will add entries to your existing data
        </Typography>
      </Paper>

      {/* Danger Zone */}
      <Paper sx={{ p: 3, mb: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Trash2 size={18} />}
          onClick={handleClear}
          disabled={state.entries.length === 0}
          fullWidth
        >
          Clear All Data ({state.entries.length} entries)
        </Button>
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

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
