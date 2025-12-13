import React, { useState, useMemo, useCallback } from 'react';
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
  useTheme,
  Collapse,
  Autocomplete,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { keyframes } from '@mui/material';
import { LayoutGrid, List as ListIcon, Search, Trash2, MapPin, Calendar, Fish, Wind, Droplets, Anchor, FileText, X, ArrowUpDown, Users, Navigation, ChevronDown, ChevronLeft, ChevronRight, Edit2, Save, Camera } from 'lucide-react';
import { FormData } from '../../types';
import { useJournal } from '../../context/JournalContext';
import { journalPalette } from '../../theme/journalTheme';
import { FishIcon } from '../FishIcon';
import { LureIcon } from '../LureIcon';
import { useFormValidation } from '../../hooks/useFormValidation';
import { allArkansasStreams } from '../../data/arkansasStreams';
import dayjs from 'dayjs';

// Create motion components for table elements
const MotionTableRow = motion.create('tr');
const MotionBox = motion.create(Box);

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

// Page flip animations
const pageFlip3dNext = keyframes`
  0% { transform: perspective(1500px) rotateY(0deg); opacity: 1; }
  50% { transform: perspective(1500px) rotateY(-90deg); opacity: 0.5; }
  100% { transform: perspective(1500px) rotateY(-180deg); opacity: 0; }
`;

const pageFlip3dPrev = keyframes`
  0% { transform: perspective(1500px) rotateY(0deg); opacity: 1; }
  50% { transform: perspective(1500px) rotateY(90deg); opacity: 0.5; }
  100% { transform: perspective(1500px) rotateY(180deg); opacity: 0; }
`;

const slideOutLeft = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-30px); opacity: 0; }
`;

const slideOutRight = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(30px); opacity: 0; }
`;

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
  const { pageFlipStyle } = state;
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<FormData | null>(null);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<FormData | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [navDirection, setNavDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption: string } | null>(null);
  const isDark = theme.palette.mode === 'dark';

  // Validation for edit form
  const validationRules = useMemo(() => ({
    date: {
      required: true,
      requiredMessage: 'Date is required',
      validate: (value: unknown) => {
        if (value && dayjs(value as string).isAfter(dayjs())) {
          return 'Date cannot be in the future';
        }
        return null;
      }
    },
    streamName: {
      required: true,
      requiredMessage: 'Stream name is required'
    }
  }), []);

  const { errors, validate, validateField, clearError } = useFormValidation(validationRules);

  const toggleRowExpansion = (rowKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  };

  const handleOpenEntry = (entry: FormData, index: number) => {
    setSelectedEntry(entry);
    setSelectedEntryIndex(index);
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleStartEdit = () => {
    if (selectedEntry) {
      setEditFormData({ ...selectedEntry });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleSaveEdit = () => {
    if (!editFormData || selectedEntryIndex === null) return;

    const isValid = validate(editFormData as unknown as Record<string, unknown>);
    if (!isValid) return;

    dispatch({
      type: 'UPDATE_ENTRY',
      payload: { index: selectedEntryIndex, entry: editFormData }
    });

    setSelectedEntry(editFormData);
    setIsEditing(false);
    setEditFormData(null);
    setSnackbar({ open: true, message: 'Entry updated successfully', severity: 'success' });
  };

  const handleEditFieldChange = (field: keyof FormData, value: string | number) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, [field]: value });
    clearError(field);
  };

  const entriesPerPage = 9;

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      dispatch({ type: 'DELETE_ENTRY', payload: index });
    }
  };

  // Computed filtered entries for navigation
  const filteredEntriesForNav = useMemo(() => {
    return state.entries.filter(entry => {
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
  }, [state.entries, searchTerm, sortOrder]);

  // Get current position in filtered entries
  const currentNavIndex = useMemo(() => {
    if (!selectedEntry) return -1;
    return filteredEntriesForNav.findIndex(e =>
      e.date === selectedEntry.date && e.streamName === selectedEntry.streamName
    );
  }, [selectedEntry, filteredEntriesForNav]);

  const canGoPrev = currentNavIndex > 0;
  const canGoNext = currentNavIndex < filteredEntriesForNav.length - 1 && currentNavIndex !== -1;

  const handleNavPrev = useCallback(() => {
    if (!canGoPrev || isFlipping || isEditing) return;
    setNavDirection('prev');
    setIsFlipping(true);

    const animDuration = pageFlipStyle === '3d' ? 400 : 250;
    setTimeout(() => {
      const prevEntry = filteredEntriesForNav[currentNavIndex - 1];
      const originalIndex = state.entries.indexOf(prevEntry);
      setSelectedEntry(prevEntry);
      setSelectedEntryIndex(originalIndex);
      setIsFlipping(false);
    }, animDuration);
  }, [canGoPrev, isFlipping, isEditing, pageFlipStyle, filteredEntriesForNav, currentNavIndex, state.entries]);

  const handleNavNext = useCallback(() => {
    if (!canGoNext || isFlipping || isEditing) return;
    setNavDirection('next');
    setIsFlipping(true);

    const animDuration = pageFlipStyle === '3d' ? 400 : 250;
    setTimeout(() => {
      const nextEntry = filteredEntriesForNav[currentNavIndex + 1];
      const originalIndex = state.entries.indexOf(nextEntry);
      setSelectedEntry(nextEntry);
      setSelectedEntryIndex(originalIndex);
      setIsFlipping(false);
    }, animDuration);
  }, [canGoNext, isFlipping, isEditing, pageFlipStyle, filteredEntriesForNav, currentNavIndex, state.entries]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEntry || isEditing) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry, isEditing, handleNavPrev, handleNavNext]);

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
      ) : (
        <>
          <Box sx={{ position: 'relative' }}>
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
              <Table sx={{ minWidth: 1000 }} aria-label="journal entries table">
                <TableHead sx={{
                  bgcolor: isDark
                    ? 'rgba(42, 31, 26, 0.8)'
                    : `rgba(139, 107, 74, 0.15)`,
                  '& .MuiTableCell-head': {
                    fontFamily: '"Special Elite", "Courier New", monospace',
                    color: isDark ? journalPalette.warmCream : journalPalette.leatherDeep,
                  },
                }}>
                  <TableRow>
                    <TableCell sx={{ width: 40, p: 1 }}></TableCell>
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
                    const rowKey = `${entry.date}-${entry.streamName}-${originalIndex}`;
                    const isExpanded = expandedRows.has(rowKey);
                    const hasMultipleSpecies = entry.fishSpecies && entry.fishSpecies.includes(',');
                    const hasMultipleBaits = entry.baitUsed && entry.baitUsed.includes(',');
                    const canExpand = hasMultipleSpecies || hasMultipleBaits;

                    return (
                      <React.Fragment key={rowKey}>
                      <MotionTableRow
                        onClick={() => handleOpenEntry(entry, originalIndex)}
                        custom={index}
                        variants={prefersReducedMotion ? {} : rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={prefersReducedMotion ? {} : {
                          y: -2,
                          scale: 1.005,
                          boxShadow: `0 4px 16px rgba(92, 64, 51, 0.2)`,
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isDark ? 'rgba(45, 37, 32, 0.8)' : 'rgba(250, 248, 243, 0.9)',
                        }}
                      >
                        <TableCell sx={{ p: 1, width: 40 }}>
                          {canExpand && (
                            <IconButton
                              size="small"
                              onClick={(e) => toggleRowExpansion(rowKey, e)}
                              sx={{
                                transition: 'transform 0.2s',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                              }}
                            >
                              <ChevronDown size={18} />
                            </IconButton>
                          )}
                        </TableCell>
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

                      {/* Expandable row for fish and lures */}
                      {canExpand && (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            sx={{
                              py: 0,
                              borderBottom: isExpanded ? `1px solid ${journalPalette.lineRule}` : 'none',
                              bgcolor: isDark ? 'rgba(45, 37, 32, 0.5)' : 'rgba(245, 240, 230, 0.7)',
                            }}
                          >
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ py: 2, px: 3 }}>
                                <Grid container spacing={4}>
                                  {/* All Fish Species */}
                                  {hasMultipleSpecies && (
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Fish size={18} className="text-emerald-500" />
                                        All Species Caught ({entry.numberCaught} total)
                                      </Typography>
                                      <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {entry.fishSpecies?.split(',').map((species, idx) => (
                                          <Chip
                                            key={idx}
                                            icon={<FishIcon species={species.trim()} size="sm" />}
                                            label={species.trim()}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              borderColor: isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                                              '& .MuiChip-icon': { ml: 0.5 }
                                            }}
                                          />
                                        ))}
                                      </Stack>
                                    </Grid>
                                  )}

                                  {/* All Baits/Lures */}
                                  {hasMultipleBaits && (
                                    <Grid item xs={12} md={6}>
                                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Anchor size={18} className="text-slate-400" />
                                        All Baits Used
                                      </Typography>
                                      <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {entry.baitUsed?.split(',').map((bait, idx) => (
                                          <Chip
                                            key={idx}
                                            icon={<LureIcon bait={bait.trim()} size="sm" fallback={<Anchor size={14} />} />}
                                            label={bait.trim()}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                              borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)',
                                              '& .MuiChip-icon': { ml: 0.5 }
                                            }}
                                          />
                                        ))}
                                      </Stack>
                                    </Grid>
                                  )}
                                </Grid>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                      </React.Fragment>
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
        onClose={() => { setSelectedEntry(null); setIsEditing(false); setEditFormData(null); setLightboxOpen(false); setLightboxPhoto(null); }}
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
          sx: {
            backdropFilter: 'blur(4px)',
            border: `4px solid ${journalPalette.leatherDark}`,
            backgroundImage: 'url(/textures/paper-cream.webp)',
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
            position: 'relative',
            overflow: 'hidden',
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
              opacity: 0.5,
              pointerEvents: 'none',
            },
          }
        } as object}
      >
        {selectedEntry && (
          <>
            {/* Navigation Arrows */}
            {!isEditing && (
              <>
                {/* Left Arrow */}
                <IconButton
                  onClick={handleNavPrev}
                  disabled={!canGoPrev || isFlipping}
                  sx={{
                    position: 'fixed',
                    left: { xs: 8, sm: 16, md: 'calc(50% - 500px)' },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1400,
                    bgcolor: journalPalette.leatherMid,
                    color: journalPalette.creamLight,
                    border: `2px solid ${journalPalette.leatherLight}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    '&:hover': {
                      bgcolor: journalPalette.leatherDark,
                    },
                    '&.Mui-disabled': {
                      opacity: 0.3,
                      bgcolor: journalPalette.leatherMid,
                    },
                  }}
                >
                  <ChevronLeft size={24} />
                </IconButton>

                {/* Right Arrow */}
                <IconButton
                  onClick={handleNavNext}
                  disabled={!canGoNext || isFlipping}
                  sx={{
                    position: 'fixed',
                    right: { xs: 8, sm: 16, md: 'calc(50% - 500px)' },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1400,
                    bgcolor: journalPalette.leatherMid,
                    color: journalPalette.creamLight,
                    border: `2px solid ${journalPalette.leatherLight}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    '&:hover': {
                      bgcolor: journalPalette.leatherDark,
                    },
                    '&.Mui-disabled': {
                      opacity: 0.3,
                      bgcolor: journalPalette.leatherMid,
                    },
                  }}
                >
                  <ChevronRight size={24} />
                </IconButton>
              </>
            )}

            <DialogTitle sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 7,
              bgcolor: isDark ? 'rgba(42, 31, 26, 0.9)' : 'rgba(139, 107, 74, 0.12)',
              borderBottom: `2px solid ${journalPalette.leatherLight}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Calendar size={24} color={isDark ? journalPalette.amber : journalPalette.leatherDark} />
                <Box>
                  {isEditing ? (
                    <Typography variant="h6" color="primary">Editing Entry</Typography>
                  ) : (
                    <>
                      <Typography
                        variant="h5"
                        sx={{
                          color: isDark ? journalPalette.warmCream : journalPalette.leatherDeep,
                          fontWeight: 500,
                          textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {dayjs(selectedEntry.date).format('MMMM D, YYYY')}
                      </Typography>
                      {filteredEntriesForNav.length > 1 && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDark ? journalPalette.mutedTan : journalPalette.leatherDark,
                            fontFamily: '"Special Elite", monospace',
                            mt: 0.5,
                          }}
                        >
                          Entry {currentNavIndex + 1} of {filteredEntriesForNav.length}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isEditing && (
                  <Tooltip title="Edit entry">
                    <IconButton onClick={handleStartEdit} size="small" color="primary">
                      <Edit2 size={20} />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton onClick={() => { setSelectedEntry(null); setIsEditing(false); setEditFormData(null); setLightboxOpen(false); setLightboxPhoto(null); }} size="small">
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                transformOrigin: navDirection === 'next' ? 'left center' : 'right center',
                animation: isFlipping
                  ? pageFlipStyle === '3d'
                    ? `${navDirection === 'next' ? pageFlip3dNext : pageFlip3dPrev} 400ms ease-out forwards`
                    : `${navDirection === 'next' ? slideOutLeft : slideOutRight} 250ms ease-out forwards`
                  : 'none',
              }}
            >
              {isEditing && editFormData ? (
                /* Edit Mode Form */
                <Grid container spacing={3}>
                  {/* Required Fields */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      required
                      value={editFormData.date}
                      onChange={(e) => handleEditFieldChange('date', e.target.value)}
                      onBlur={() => validateField('date', editFormData.date)}
                      error={!!errors.date}
                      helperText={errors.date}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      options={allArkansasStreams}
                      value={editFormData.streamName}
                      onChange={(_, newValue) => handleEditFieldChange('streamName', newValue || '')}
                      onInputChange={(_, newValue) => handleEditFieldChange('streamName', newValue)}
                      onBlur={() => validateField('streamName', editFormData.streamName)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Stream Name"
                          required
                          error={!!errors.streamName}
                          helperText={errors.streamName}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="River Stretch"
                      fullWidth
                      value={editFormData.riverStretch || ''}
                      onChange={(e) => handleEditFieldChange('riverStretch', e.target.value)}
                      placeholder="e.g., Dalton to Highway 90 Bridge"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Fishing Party"
                      fullWidth
                      value={editFormData.tripMembers || ''}
                      onChange={(e) => handleEditFieldChange('tripMembers', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}><Divider><Typography variant="caption">Catch Details</Typography></Divider></Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Number Caught"
                      type="number"
                      fullWidth
                      value={editFormData.numberCaught || ''}
                      onChange={(e) => handleEditFieldChange('numberCaught', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Fish Species"
                      fullWidth
                      value={editFormData.fishSpecies || ''}
                      onChange={(e) => handleEditFieldChange('fishSpecies', e.target.value)}
                      placeholder="e.g., Walleye, Smallmouth Bass"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Bait Used"
                      fullWidth
                      value={editFormData.baitUsed || ''}
                      onChange={(e) => handleEditFieldChange('baitUsed', e.target.value)}
                      placeholder="e.g., Shad Rap, Jig and Pig"
                    />
                  </Grid>

                  <Grid item xs={12}><Divider><Typography variant="caption">Weather</Typography></Divider></Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Weather Conditions"
                      fullWidth
                      value={editFormData.weatherConditions || ''}
                      onChange={(e) => handleEditFieldChange('weatherConditions', e.target.value)}
                      placeholder="e.g., Sunny, Cloudy"
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Air Temp Low (°F)"
                      type="number"
                      fullWidth
                      value={editFormData.airTempLow || ''}
                      onChange={(e) => handleEditFieldChange('airTempLow', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Air Temp High (°F)"
                      type="number"
                      fullWidth
                      value={editFormData.airTempHigh || ''}
                      onChange={(e) => handleEditFieldChange('airTempHigh', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Wind Velocity (mph)"
                      fullWidth
                      value={editFormData.windVelocity || ''}
                      onChange={(e) => handleEditFieldChange('windVelocity', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Wind Direction"
                      fullWidth
                      value={editFormData.windDirection || ''}
                      onChange={(e) => handleEditFieldChange('windDirection', e.target.value)}
                      placeholder="e.g., NW, SE"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Moon Phase"
                      fullWidth
                      value={editFormData.moonPhase || ''}
                      onChange={(e) => handleEditFieldChange('moonPhase', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}><Divider><Typography variant="caption">Water Conditions</Typography></Divider></Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Water Clarity"
                      fullWidth
                      value={editFormData.waterClarity || ''}
                      onChange={(e) => handleEditFieldChange('waterClarity', e.target.value)}
                      placeholder="e.g., Clear, Stained"
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Flow Rate (cfs)"
                      fullWidth
                      value={editFormData.flowRate || ''}
                      onChange={(e) => handleEditFieldChange('flowRate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      label="Gauge Height (ft)"
                      fullWidth
                      value={editFormData.gaugeHeight || ''}
                      onChange={(e) => handleEditFieldChange('gaugeHeight', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}><Divider><Typography variant="caption">Notes</Typography></Divider></Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Notes"
                      fullWidth
                      multiline
                      rows={4}
                      value={editFormData.notes || ''}
                      onChange={(e) => handleEditFieldChange('notes', e.target.value)}
                    />
                  </Grid>
                </Grid>
              ) : (
              /* View Mode */
              <MotionBox
                variants={prefersReducedMotion ? {} : modalContentVariants}
                initial="hidden"
                animate="visible"
              >
              <Grid container spacing={3}>
                {/* River Name */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={20} className="text-slate-400" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">River</Typography>
                      <Typography variant="h6">{selectedEntry.streamName}</Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* River Stretch */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  {selectedEntry.riverStretch ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Navigation size={20} className="text-slate-400" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Stretch</Typography>
                        <Typography variant="body1">{selectedEntry.riverStretch}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.5 }}>
                      <Navigation size={20} className="text-slate-400" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Stretch</Typography>
                        <Typography variant="body2" color="text.secondary">Not specified</Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* Fishing Party */}
                <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={20} className="text-slate-400" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Fishing Party</Typography>
                      {selectedEntry.tripMembers ? (
                        <Typography variant="body1">{selectedEntry.tripMembers}</Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5 }}>Solo trip</Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* Catch Details Header */}
                <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Fish size={20} className="text-slate-400" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Catch Details</Typography>
                      <Typography variant="h6">
                        {selectedEntry.numberCaught || 0} fish
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Species Caught - Left Column */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Typography variant="caption" color="text.secondary">Species Caught</Typography>
                  {selectedEntry.fishSpecies ? (
                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                      {selectedEntry.fishSpecies.split(',').map((species, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FishIcon species={species.trim()} size="sm" />
                          <Typography variant="body1">{species.trim()}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>No species recorded</Typography>
                  )}
                </Grid>

                {/* Bait Used - Right Column */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Typography variant="caption" color="text.secondary">Bait Used</Typography>
                  {selectedEntry.baitUsed ? (
                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
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
                  ) : (
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>No bait recorded</Typography>
                  )}
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* Weather Conditions */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wind size={20} className="text-slate-400" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Weather</Typography>
                      {selectedEntry.weatherConditions && (
                        <Typography variant="h6">{selectedEntry.weatherConditions}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {(selectedEntry.airTempLow || selectedEntry.airTempHigh) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>Temp:</Typography>
                        <Typography variant="body1">{selectedEntry.airTempLow}°F – {selectedEntry.airTempHigh}°F</Typography>
                      </Box>
                    )}
                    {(selectedEntry.windVelocity || selectedEntry.windDirection) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>Wind:</Typography>
                        <Typography variant="body1">{selectedEntry.windVelocity} mph {selectedEntry.windDirection}</Typography>
                      </Box>
                    )}
                    {selectedEntry.barometricPressure && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>Pressure:</Typography>
                        <Typography variant="body1">{selectedEntry.barometricPressure} inHg</Typography>
                      </Box>
                    )}
                    {selectedEntry.moonPhase && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>Moon:</Typography>
                        <Typography variant="body1">{selectedEntry.moonPhase}</Typography>
                      </Box>
                    )}
                    {selectedEntry.precipitation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>Precip:</Typography>
                        <Typography variant="body1">{selectedEntry.precipitation}"</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                {/* Water Conditions */}
                <Grid item xs={12} md={6} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Droplets size={20} className="text-slate-400" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Water Conditions</Typography>
                      {selectedEntry.waterClarity && (
                        <Typography variant="h6">{selectedEntry.waterClarity}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {selectedEntry.flowRate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Flow Rate:</Typography>
                        <Typography variant="body1">{selectedEntry.flowRate} cfs</Typography>
                      </Box>
                    )}
                    {selectedEntry.riverDepth && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Depth:</Typography>
                        <Typography variant="body1">{selectedEntry.riverDepth} ft</Typography>
                      </Box>
                    )}
                    {selectedEntry.waterTemperature && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>Water Temp:</Typography>
                        <Typography variant="body1">{selectedEntry.waterTemperature}°F</Typography>
                      </Box>
                    )}
                    {selectedEntry.usgsGauge && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>USGS Gauge:</Typography>
                        <Typography variant="body1">{selectedEntry.usgsGauge}</Typography>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                {/* Notes */}
                {selectedEntry.notes && (
                  <>
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <FileText size={20} className="text-slate-400" style={{ marginTop: 2 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">Notes</Typography>
                          <Stack spacing={1} sx={{ mt: 0.5 }}>
                            {formatNotes(selectedEntry.notes).map((paragraph, idx) => (
                              <Typography key={idx} variant="body1" sx={{ lineHeight: 1.6 }}>
                                {paragraph}
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}

                {/* Photos */}
                {selectedEntry.pictures && selectedEntry.pictures.length > 0 && (
                  <>
                    <Grid item xs={12}><Divider /></Grid>
                    <Grid item xs={12} component={motion.div} variants={prefersReducedMotion ? {} : modalItemVariants}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Camera size={20} className="text-slate-400" />
                        <Typography variant="caption" color="text.secondary">
                          Photos ({selectedEntry.pictures.length})
                        </Typography>
                      </Box>
                      <ImageList
                        sx={{
                          width: '100%',
                          maxHeight: 400,
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                        cols={selectedEntry.pictures.length === 1 ? 1 : selectedEntry.pictures.length === 2 ? 2 : 3}
                        rowHeight={200}
                      >
                        {selectedEntry.pictures.map((picture) => (
                          <ImageListItem
                            key={picture.id}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.9 }
                            }}
                            onClick={() => {
                              setLightboxPhoto({ url: picture.url, caption: picture.caption });
                              setLightboxOpen(true);
                            }}
                          >
                            <img
                              src={picture.url}
                              alt={picture.caption || 'Fishing trip photo'}
                              loading="lazy"
                              style={{
                                objectFit: 'cover',
                                height: '100%',
                                width: '100%',
                                borderRadius: 4
                              }}
                            />
                            {picture.caption && (
                              <ImageListItemBar
                                title={picture.caption}
                                sx={{
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                  '& .MuiImageListItemBar-title': {
                                    fontSize: '0.75rem'
                                  }
                                }}
                              />
                            )}
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Grid>
                  </>
                )}
              </Grid>
              </MotionBox>
              )}
            </DialogContent>
            <DialogActions>
              {isEditing ? (
                <>
                  <Button onClick={handleCancelEdit}>Cancel</Button>
                  <Button onClick={handleSaveEdit} variant="contained" startIcon={<Save size={18} />}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => { setSelectedEntry(null); setIsEditing(false); setLightboxOpen(false); setLightboxPhoto(null); }}>Close</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Photo Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: -40,
              right: 0,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <X size={24} />
          </IconButton>
          {lightboxPhoto && (
            <Box>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption || 'Fishing trip photo'}
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
              {lightboxPhoto.caption && (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    mt: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {lightboxPhoto.caption}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
