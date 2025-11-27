import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { MapPin, Fish, Anchor, Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { JournalEntry } from '../../types';
import { useToast } from '../../context/ToastContext';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export default function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const { showSuccess } = useToast();

  const handleDelete = () => {
    if (window.confirm(`Delete trip to ${entry.streamName} on ${dayjs(entry.date).format('MMM D, YYYY')}?`)) {
      onDelete(entry.id);
      showSuccess('Entry deleted');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        px: 2,
        borderBottom: 1,
        borderColor: 'divider',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '&:last-child': {
          borderBottom: 0,
        },
      }}
    >
      {/* Date */}
      <Box sx={{ minWidth: 90, textAlign: 'center' }}>
        <Typography variant="body2" fontWeight="bold">
          {dayjs(entry.date).format('MMM D')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dayjs(entry.date).format('YYYY')}
        </Typography>
      </Box>

      {/* Location */}
      <Box sx={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <MapPin size={14} />
        <Typography variant="body2" fontWeight="medium" noWrap>
          {entry.streamName}
        </Typography>
      </Box>

      {/* Catch */}
      <Box sx={{ minWidth: 140, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Fish size={14} />
        <Typography variant="body2" noWrap>
          {entry.fishSpecies || '—'} {entry.numberCaught !== null && `× ${entry.numberCaught}`}
        </Typography>
      </Box>

      {/* Bait */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
        {entry.baitUsed && (
          <>
            <Anchor size={14} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {entry.baitUsed}
            </Typography>
          </>
        )}
      </Box>

      {/* Entry type chip */}
      <Chip
        label={entry.entryMode === 'quick' ? 'Quick' : 'Full'}
        size="small"
        variant="outlined"
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit(entry)}>
            <Edit2 size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={handleDelete}>
            <Trash2 size={16} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
