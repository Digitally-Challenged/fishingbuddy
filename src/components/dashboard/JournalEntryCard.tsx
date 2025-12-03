import { Card, CardContent, CardMedia, Typography, Box, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import { MapPin, Fish, Wind, Droplets, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { FormData } from '../../types';

interface JournalEntryCardProps {
  entry: FormData;
  onDelete?: () => void;
}

export default function JournalEntryCard({ entry, onDelete }: JournalEntryCardProps) {
  // Use first picture as cover if available, otherwise a nice gradient placeholder
  const coverImage = entry.pictures && entry.pictures.length > 0 ? entry.pictures[0].url : null;
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ position: 'relative', height: 160, backgroundColor: 'primary.light', overflow: 'hidden' }}>
        {coverImage ? (
          <CardMedia
            component="img"
            height="160"
            image={coverImage}
            alt="Fishing trip"
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ 
            height: '100%', 
            width: '100%', 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            <Fish size={48} color="white" style={{ opacity: 0.5 }} />
          </Box>
        )}
        
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          bgcolor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '12px',
          px: 1.5,
          py: 0.5,
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {dayjs(entry.date).format('MMM D, YYYY')}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ lineHeight: 1.2, mb: 0.5 }}>
              {entry.streamName}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} color="text.secondary">
              <MapPin size={14} />
              <Typography variant="body2">
                {entry.usgsGauge || 'Unknown Location'}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px',
            mb: 2
          }}>
            {entry.notes || "No notes for this trip."}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {entry.fishSpecies && (
              <Chip 
                icon={<Fish size={14} />} 
                label={`${entry.numberCaught || '?'} ${entry.fishSpecies}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
            {entry.weatherConditions && (
              <Chip 
                icon={<Wind size={14} />} 
                label={entry.weatherConditions} 
                size="small" 
                variant="outlined"
              />
            )}
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
             <Stack direction="row" alignItems="center" spacing={0.5} title="Water Temp">
               <Droplets size={16} className="text-blue-500" />
               <Typography variant="caption" fontWeight="600">
                 {entry.waterTemperature ? `${entry.waterTemperature}°F` : '--'}
               </Typography>
             </Stack>
             <Stack direction="row" alignItems="center" spacing={0.5} title="Flow Rate">
               <Wind size={16} className="text-slate-500" />
               <Typography variant="caption" fontWeight="600">
                 {entry.flowRate ? `${entry.flowRate} cfs` : '--'}
               </Typography>
             </Stack>
          </Box>
          
          <Box>
            {onDelete && (
              <Tooltip title="Delete Entry">
                <IconButton size="small" color="error" onClick={onDelete}>
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}


