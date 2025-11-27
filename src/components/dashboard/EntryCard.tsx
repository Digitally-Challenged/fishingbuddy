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
        gap: { xs: 1, md: 3 },
        py: 2,
        px: { xs: 2, md: 3 },
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1,
        },
      }}
    >
      {/* Date */}
      <Box
        sx={{
          minWidth: 70,
          textAlign: 'center',
          py: 1,
          px: 1.5,
          borderRadius: 1,
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="h6" fontWeight="bold" lineHeight={1}>
          {dayjs(entry.date).format('D')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
          {dayjs(entry.date).format('MMM')}
        </Typography>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <MapPin size={14} color="#1976d2" />
          <Typography variant="body1" fontWeight="medium" noWrap>
            {entry.streamName}
          </Typography>
        </Box>

        {/* Catch details */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {(entry.fishSpecies || entry.numberCaught !== null) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Fish size={14} />
              <Typography variant="body2" color="text.secondary">
                {entry.fishSpecies || 'Fish'}{entry.numberCaught !== null && ` × ${entry.numberCaught}`}
              </Typography>
            </Box>
          )}
          {entry.baitUsed && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              <Anchor size={14} />
              <Typography variant="body2" color="text.secondary">
                {entry.baitUsed}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Entry type */}
      <Chip
        label={entry.entryMode === 'quick' ? 'Quick' : 'Full'}
        size="small"
        color={entry.entryMode === 'full' ? 'primary' : 'default'}
        variant={entry.entryMode === 'full' ? 'filled' : 'outlined'}
        sx={{ display: { xs: 'none', md: 'flex' } }}
      />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
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
