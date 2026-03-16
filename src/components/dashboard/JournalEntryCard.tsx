import { useState } from 'react';
import {
  Card, CardContent, CardActions, Box, Typography,
  IconButton, Collapse, Chip, Stack, Divider,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  ChevronDown, ChevronUp, Trash2, MapPin,
  Fish, Cloud, Droplets, Calendar,
} from 'lucide-react';
import { FormData } from '../../types';
import { journalPalette } from '../../theme/journalTheme';
import dayjs from 'dayjs';

interface JournalEntryCardProps {
  entry: FormData;
  originalIndex: number;
  onDelete: (index: number) => void;
  onClick: () => void;
}

export default function JournalEntryCard({
  entry, originalIndex, onDelete, onClick,
}: JournalEntryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const formattedDate = entry.date
    ? dayjs(entry.date).format('MMM D, YYYY')
    : 'No date';

  const catchSummary = [
    entry.numberCaught && `${entry.numberCaught} fish`,
    entry.fishSpecies,
  ].filter(Boolean).join(' — ');

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: `0 4px 16px ${alpha(journalPalette.leatherDeep, 0.2)}`,
        },
      }}
    >
      {/* Tappable header area — opens detail modal */}
      <CardContent onClick={onClick} sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: '"Special Elite", monospace',
                fontSize: '1.1rem',
                color: isDark ? journalPalette.warmCream : journalPalette.leatherDeep,
              }}
            >
              {entry.streamName || 'Unknown Stream'}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Calendar size={14} color={isDark ? journalPalette.mutedTan : journalPalette.inkFaded} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                {formattedDate}
              </Typography>
              {entry.riverStretch && (
                <>
                  <MapPin size={14} color={isDark ? journalPalette.mutedTan : journalPalette.inkFaded} />
                  <Typography variant="body2" noWrap sx={{ fontSize: '0.85rem' }}>
                    {entry.riverStretch}
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Catch summary — always visible */}
        {catchSummary && (
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Fish size={16} color={journalPalette.sepia} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: isDark ? journalPalette.warmCream : journalPalette.inkBlack }}
            >
              {catchSummary}
            </Typography>
          </Box>
        )}

        {/* Bait chip */}
        {entry.baitUsed && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={entry.baitUsed}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem', maxWidth: '100%' }}
            />
          </Box>
        )}
      </CardContent>

      {/* Actions row — expand toggle + delete */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 0 }}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
          sx={{ color: isDark ? journalPalette.mutedTan : journalPalette.inkFaded }}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
            {expanded ? 'Less' : 'More'}
          </Typography>
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(originalIndex); }}
          aria-label={`Delete entry from ${formattedDate} at ${entry.streamName}`}
          sx={{ color: 'error.main' }}
        >
          <Trash2 size={16} />
        </IconButton>
      </CardActions>

      {/* Expandable detail section */}
      <Collapse in={expanded}>
        <Divider sx={{ borderColor: journalPalette.lineRule }} />
        <CardContent sx={{ pt: 1.5 }}>
          <Stack spacing={1}>
            {entry.weatherConditions && (
              <DetailRow icon={<Cloud size={14} />} label="Weather" value={entry.weatherConditions} isDark={isDark} />
            )}
            {entry.windVelocity && (
              <DetailRow icon={<Cloud size={14} />} label="Wind" value={`${entry.windVelocity} mph ${entry.windDirection || ''}`} isDark={isDark} />
            )}
            {entry.flowRate && (
              <DetailRow icon={<Droplets size={14} />} label="Flow" value={`${entry.flowRate} cfs`} isDark={isDark} />
            )}
            {entry.waterClarity && (
              <DetailRow icon={<Droplets size={14} />} label="Clarity" value={entry.waterClarity} isDark={isDark} />
            )}
            {entry.waterTemperature && (
              <DetailRow icon={<Droplets size={14} />} label="Water Temp" value={`${entry.waterTemperature}°F`} isDark={isDark} />
            )}
            {entry.notes && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  color: isDark ? journalPalette.mutedTan : journalPalette.inkFaded,
                  lineHeight: 1.5,
                }}
              >
                {entry.notes.length > 150 ? entry.notes.substring(0, 150) + '...' : entry.notes}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
}

function DetailRow({ icon, label, value, isDark }: { icon: React.ReactNode; label: string; value: string; isDark: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant="body2" sx={{ fontSize: '0.8rem', color: isDark ? journalPalette.mutedTan : journalPalette.inkFaded }}>
        <strong>{label}:</strong> {value}
      </Typography>
    </Box>
  );
}
