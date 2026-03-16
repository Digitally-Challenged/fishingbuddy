import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { journalPalette } from '../../theme/journalTheme';
import dayjs from 'dayjs';

interface DeleteConfirmDialogProps {
  open: boolean;
  entryDate: string;
  entryStream: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  open, entryDate, entryStream, onConfirm, onCancel,
}: DeleteConfirmDialogProps) {
  const formattedDate = entryDate
    ? dayjs(entryDate).format('MMMM D, YYYY')
    : 'Unknown date';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="delete-confirm-title"
    >
      <DialogTitle id="delete-confirm-title" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AlertTriangle size={22} color="#C92A2A" />
          <Typography
            component="span"
            sx={{
              fontFamily: '"Special Elite", monospace',
              fontSize: '1.2rem',
              color: journalPalette.leatherDeep,
            }}
          >
            Delete Entry?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          Permanently delete your entry from{' '}
          <strong>{formattedDate}</strong> at{' '}
          <strong>{entryStream || 'Unknown Stream'}</strong>?
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, color: journalPalette.inkFaded, fontSize: '0.85rem' }}
        >
          This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          autoFocus
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            flex: 1,
            backgroundColor: '#C92A2A',
            '&:hover': { backgroundColor: '#A61E1E' },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
