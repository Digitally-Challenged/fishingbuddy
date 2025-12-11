import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  InputAdornment,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LayoutGrid, List as ListIcon, Search, Trash2, MapPin, Calendar, Fish, Wind, Droplets, Anchor, FileText, X, Thermometer, Gauge, Moon, CloudRain, ArrowUpDown, Users, Navigation } from 'lucide-react';
import { FormData } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { groupSpeciesByCategory, categoryLabels } from '../../data/fishSpecies';
import { FishIcon } from '../FishIcon';
import { LureIcon } from '../LureIcon';
import dayjs from 'dayjs';

// Create motion components for table elements
const MotionTableRow = motion.create('tr');
const MotionBox = motion.create(Box);

// Water caustics background effect
function WaterCausticsBackground({ isDark }: { isDark: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 2,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* SVG filter for caustics effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="water-caustics" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.02"
              numOctaves="3"
              seed="5"
              result="noise"
            >
              {!prefersReducedMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="60s"
                  values="0.01 0.02;0.015 0.025;0.01 0.02"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>
      </svg>

      {/* Animated gradient layers */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.15 : 0.20,
          background: isDark
            ? 'radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 30% 20%, rgba(56, 189, 248, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(34, 211, 238, 0.4) 0%, transparent 50%)',
          backgroundSize: '200% 200%',
          animation: prefersReducedMotion ? 'none' : 'causticsMove 60s ease-in-out infinite',
          '@keyframes causticsMove': {
            '0%': { backgroundPosition: '0% 0%' },
            '50%': { backgroundPosition: '100% 100%' },
            '100%': { backgroundPosition: '0% 0%' },
          },
        }}
      />

      {/* Subtle light ripples */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isDark ? 0.08 : 0.12,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.03) 35px, rgba(255,255,255,0.03) 70px)',
          animation: prefersReducedMotion ? 'none' : 'rippleShift 45s linear infinite',
          '@keyframes rippleShift': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(70px)' },
          },
        }}
      />
    </Box>
  );
}

// Row animation variants
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// Modal content animation variants
const modalContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const modalItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Format notes into readable paragraphs
function formatNotes(notes: string): string[] {
  if (!notes) return [];

  // Split on common topic boundaries
  const paragraphs: string[] = [];
  let current = '';

  // Split into sentences
  const sentences = notes.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    // Start new paragraph on topic shifts
    const isNewTopic =
      /^(Also|Mr\.|Weather|Traffic|Two-day|Trip total|Saw \d|Great stream|Falling leaves|Walleyes caught|I caught|We caught|That evening|That night|The next|Overall|In total)/i.test(sentence);

    if (isNewTopic && current) {
      paragraphs.push(current.trim());
      current = sentence;
    } else {
      current += (current ? ' ' : '') + sentence;
    }
  }

  if (current) {
    paragraphs.push(current.trim());
  }

  return paragraphs;
}

export default function JournalEntryList() {
  const { state, dispatch } = useJournal();
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<FormData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const isDark = theme.palette.mode === 'dark';

  const entriesPerPage = 9;

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch({ type: 'DELETE_ENTRY', payload: index });
    }
  };

  const filteredEntries = state.entries.filter(entry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      entry.streamName.toLowerCase().includes(searchLower) ||
      entry.fishSpecies?.toLowerCase().includes(searchLower) ||
      entry.notes?.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    const dateA = dayjs(a.date).valueOf();
    const dateB = dayjs(b.date).valueOf();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const pageCount = Math.ceil(filteredEntries.length / entriesPerPage);
  const currentEntries = filteredEntries.slice(
    (page - 1) * entriesPerPage,
    page * entriesPerPage
  );

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4, 
        flexWrap: 'wrap', 
        gap: 2 
      }}>
        <Box>
           <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your Journal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {state.entries.length} trips recorded
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search trips..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
            sx={{ bgcolor: 'background.paper', display: 'none' }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <LayoutGrid size={18} />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ListIcon size={18} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {filteredEntries.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No entries found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get out there and catch some fish!
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ position: 'relative' }}>
            <WaterCausticsBackground isDark={isDark} />
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'relative', bgcolor: 'transparent' }}>
              <Table sx={{ minWidth: 1000 }} aria-label="journal entries table">
                <TableHead sx={{ bgcolor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.9)' }}>
                  <TableRow>
                    <TableCell onClick={handleSortToggle} sx={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Date
                        <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'text-primary' : 'text-slate-400'} />
                      </Box>
                    </TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Weather</TableCell>
                    <TableCell>Water Conditions</TableCell>
                    <TableCell>Catch</TableCell>
                    <TableCell>Bait</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody component={motion.tbody} initial="hidden" animate="visible">
                  <AnimatePresence mode="popLayout">
                  {currentEntries.map((entry, index) => {
                    const originalIndex = state.entries.indexOf(entry);
                    return (
                      <MotionTableRow
                        key={`${entry.date}-${entry.streamName}-${originalIndex}`}
                        onClick={() => setSelectedEntry(entry)}
                        custom={index}
                        variants={prefersReducedMotion ? {} : rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={prefersReducedMotion ? {} : {
                          y: -4,
                          scale: 1.01,
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                            <Calendar size={16} className="text-slate-400" />
                            {dayjs(entry.date).format('MMM D, YYYY')}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
                              <MapPin size={16} className="text-slate-400" />
                              {entry.streamName}
                            </Box>
                            {entry.usgsGauge && (
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                                Gauge: {entry.usgsGauge}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.5}>
                            {entry.weatherConditions && (
                              <Chip 
                                icon={<Wind size={14} />} 
                                label={entry.weatherConditions} 
                                size="small" 
                                variant="outlined"
                                sx={{ width: 'fit-content' }}
                              />
                            )}
                            {(entry.windVelocity || entry.windDirection) && (
                              <Typography variant="caption" color="text.secondary">
                                Wind: {entry.windVelocity || '?'} mph {entry.windDirection}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.5}>
                            {(entry.flowRate || entry.waterTemperature) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Droplets size={16} className="text-blue-400" />
                                <Typography variant="body2">
                                  {entry.flowRate ? `${entry.flowRate} cfs` : ''}
                                  {entry.flowRate && entry.waterTemperature ? ' • ' : ''}
                                  {entry.waterTemperature ? `${entry.waterTemperature}°F` : ''}
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {[
                                entry.waterClarity && `Clarity: ${entry.waterClarity}`,
                                entry.riverDepth && `Depth: ${entry.riverDepth}ft`
                              ].filter(Boolean).join(' • ')}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                           {entry.fishSpecies && (
                             <Stack spacing={0.5}>
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <FishIcon
                                   species={entry.fishSpecies}
                                   size="sm"
                                   fallback={<Fish size={16} className="text-emerald-500" />}
                                 />
                                 <Typography variant="body2" fontWeight={500}>
                                   {entry.numberCaught} {entry.fishSpecies}
                                 </Typography>
                               </Box>
                             </Stack>
                           )}
                        </TableCell>

                        <TableCell>
                          {entry.baitUsed && (
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <LureIcon
                                 bait={entry.baitUsed}
                                 size="sm"
                                 fallback={<Anchor size={16} className="text-slate-400" />}
                               />
                               <Typography variant="body2">
                                 {entry.baitUsed}
                               </Typography>
                             </Box>
                          )}
                        </TableCell>

                        <TableCell sx={{ maxWidth: 200 }}>
                          {entry.notes && (
                            <Tooltip title={entry.notes}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <FileText size={16} className="text-slate-400 shrink-0" style={{ marginTop: 2 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {entry.notes}
                                </Typography>
                              </Box>
                            </Tooltip>
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(originalIndex); }} color="error" size="small">
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </MotionTableRow>
                    );
                  })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Entry Detail Modal */}
      <Dialog
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: { enter: 200, exit: 150 },
        }}
        PaperProps={{
          component: motion.div,
          initial: prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: prefersReducedMotion ? {} : { opacity: 0 },
          transition: { duration: 0.2 },
          sx: { backdropFilter: 'blur(4px)' }
        } as object}
      >
        {selectedEntry && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={24} />
                <Box>
                  <Typography variant="h6">{selectedEntry.streamName}</Typography>
                  {selectedEntry.riverStretch && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Navigation size={14} />
                      {selectedEntry.riverStretch}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {dayjs(selectedEntry.date).format('MMMM D, YYYY')}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedEntry(null)} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <MotionBox
                variants={prefersReducedMotion ? {} : modalContentVariants}
                initial="hidden"
                animate="visible"
              >
              <Grid container spacing={3}>
                {/* Trip Members */}
                {selectedEntry.tripMembers && (
                  <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Users size={20} />
                      <Typography variant="subtitle1" fontWeight="bold">Fishing Party</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ pl: 3.5 }}>
                      {selectedEntry.tripMembers}
                    </Typography>
                  </Grid>
                )}

                {/* Catch Details */}
                <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FishIcon
                      species={selectedEntry.fishSpecies || ''}
                      size="md"
                      fallback={<Fish size={20} className="text-emerald-500" />}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">Catch Details</Typography>
                  </Box>
                  <Box sx={{ pl: 3.5 }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {selectedEntry.numberCaught || 0} fish
                    </Typography>
                    {selectedEntry.fishSpecies ? (
                      <Stack spacing={1}>
                        {(() => {
                          const grouped = groupSpeciesByCategory(selectedEntry.fishSpecies || '');
                          return Object.entries(grouped).map(([category, speciesList]) => {
                            if (speciesList.length === 0) return null;
                            const label = categoryLabels[category] || 'Other';
                            return (
                              <Box key={category}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {label}:
                                </Typography>
                                <Stack spacing={0.5} sx={{ pl: 1, mt: 0.5 }}>
                                  {speciesList.map((species) => (
                                    <Box key={species} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FishIcon species={species} size="sm" />
                                      <Typography variant="body1">{species}</Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            );
                          });
                        })()}
                      </Stack>
                    ) : (
                      <Typography variant="body1">No species recorded</Typography>
                    )}
                    {selectedEntry.baitUsed && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                          Bait Used:
                        </Typography>
                        <Stack spacing={0.5} sx={{ pl: 1 }}>
                          {selectedEntry.baitUsed.split(',').map((bait, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LureIcon
                                bait={bait.trim()}
                                size="sm"
                                fallback={<Anchor size={16} className="text-slate-400" />}
                              />
                              <Typography variant="body1">{bait.trim()}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* Weather Conditions */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Wind size={20} />
                    <Typography variant="subtitle1" fontWeight="bold">Weather</Typography>
                  </Box>
                  <Stack spacing={1.5} sx={{ pl: 3.5 }}>
                    {selectedEntry.weatherConditions && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>Sky:</Typography>
                        <Chip label={selectedEntry.weatherConditions} size="small" />
                      </Box>
                    )}
                    {(selectedEntry.airTempLow || selectedEntry.airTempHigh) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Thermometer size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 84 }}>Temp:</Typography>
                        <Typography variant="body2">{selectedEntry.airTempLow}°F – {selectedEntry.airTempHigh}°F</Typography>
                      </Box>
                    )}
                    {(selectedEntry.windVelocity || selectedEntry.windDirection) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Wind size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 84 }}>Wind:</Typography>
                        <Typography variant="body2">{selectedEntry.windVelocity} mph {selectedEntry.windDirection}</Typography>
                      </Box>
                    )}
                    {selectedEntry.barometricPressure && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Gauge size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 84 }}>Pressure:</Typography>
                        <Typography variant="body2">{selectedEntry.barometricPressure} inHg</Typography>
                      </Box>
                    )}
                    {selectedEntry.moonPhase && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Moon size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 84 }}>Moon:</Typography>
                        <Typography variant="body2">{selectedEntry.moonPhase}</Typography>
                      </Box>
                    )}
                    {selectedEntry.precipitation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CloudRain size={16} />
                        <Typography variant="body2" color="text.secondary" sx={{ width: 84 }}>Precip:</Typography>
                        <Typography variant="body2">{selectedEntry.precipitation}"</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                {/* Water Conditions */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Droplets size={20} />
                    <Typography variant="subtitle1" fontWeight="bold">Water Conditions</Typography>
                  </Box>
                  <Stack spacing={1.5} sx={{ pl: 3.5 }}>
                    {selectedEntry.waterClarity && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>Clarity:</Typography>
                        <Typography variant="body2">{selectedEntry.waterClarity}</Typography>
                      </Box>
                    )}
                    {selectedEntry.flowRate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>Flow Rate:</Typography>
                        <Typography variant="body2">{selectedEntry.flowRate} cfs</Typography>
                      </Box>
                    )}
                    {selectedEntry.riverDepth && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>Depth:</Typography>
                        <Typography variant="body2">{selectedEntry.riverDepth} ft</Typography>
                      </Box>
                    )}
                    {selectedEntry.waterTemperature && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>Water Temp:</Typography>
                        <Typography variant="body2">{selectedEntry.waterTemperature}°F</Typography>
                      </Box>
                    )}
                    {selectedEntry.usgsGauge && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 100 }}>USGS Gauge:</Typography>
                        <Typography variant="body2">{selectedEntry.usgsGauge}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                {/* Notes */}
                {selectedEntry.notes && (
                  <>
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FileText size={20} />
                        <Typography variant="subtitle1" fontWeight="bold">Notes</Typography>
                      </Box>
                      <Stack spacing={1.5} sx={{ pl: 3.5 }}>
                        {formatNotes(selectedEntry.notes).map((paragraph, idx) => (
                          <Typography key={idx} variant="body2" sx={{ lineHeight: 1.6 }}>
                            {paragraph}
                          </Typography>
                        ))}
                      </Stack>
                    </Grid>
                  </>
                )}
              </Grid>
              </MotionBox>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEntry(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
