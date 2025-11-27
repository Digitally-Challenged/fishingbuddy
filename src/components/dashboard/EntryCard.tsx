import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Chip,
} from '@mui/material';
import { MapPin, Fish, Anchor, Cloud, Edit2, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { JournalEntry } from '../../types';
import { useToast } from '../../context/ToastContext';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function EntryCard({ entry, onEdit, onDelete, compact = false }: EntryCardProps) {
  const { showSuccess } = useToast();

  const handleDelete = () => {
    if (window.confirm(`Delete trip to ${entry.streamName} on ${dayjs(entry.date).format('MMM D, YYYY')}?`)) {
      onDelete(entry.id);
      showSuccess('Entry deleted');
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: compact ? 1 : 2 }}>
        {/* Header: Location and Date */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapPin size={16} />
            <Typography variant="subtitle1" fontWeight="bold">
              {entry.streamName}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {dayjs(entry.date).format('MMM D, YYYY')}
          </Typography>
        </Box>

        {/* Fish caught */}
        {(entry.fishSpecies || entry.numberCaught) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Fish size={14} />
            <Typography variant="body2">
              {entry.fishSpecies || 'Fish'} {entry.numberCaught !== null && `× ${entry.numberCaught}`}
            </Typography>
          </Box>
        )}

        {/* Bait */}
        {entry.baitUsed && !compact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Anchor size={14} />
            <Typography variant="body2" color="text.secondary">
              {entry.baitUsed}
            </Typography>
          </Box>
        )}

        {/* Weather */}
        {entry.weatherConditions && !compact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Cloud size={14} />
            <Typography variant="body2" color="text.secondary">
              {entry.weatherConditions}
              {entry.highTemp !== null && `, ${entry.highTemp}°F`}
            </Typography>
          </Box>
        )}

        {/* Notes preview */}
        {entry.notes && !compact && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {entry.notes}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Chip
          label={entry.entryMode === 'quick' ? 'Quick' : 'Full'}
          size="small"
          variant="outlined"
          color={entry.entryMode === 'quick' ? 'default' : 'primary'}
        />
        <Box>
          <Tooltip title="Edit entry">
            <IconButton size="small" onClick={() => onEdit(entry)}>
              <Edit2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete entry">
            <IconButton size="small" color="error" onClick={handleDelete}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}
