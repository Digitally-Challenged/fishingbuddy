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
  Divider
} from '@mui/material';
import { LayoutGrid, List as ListIcon, Search, Trash2, MapPin, Calendar, Fish, Wind, Droplets, Anchor, FileText, X, Thermometer, Gauge, Moon, CloudRain, ArrowUpDown } from 'lucide-react';
import { FormData } from '../../types';
import { useJournal } from '../../context/JournalContext';
import JournalEntryCard from './JournalEntryCard';
import dayjs from 'dayjs';

export default function JournalEntryList() {
  const { state, dispatch } = useJournal();
  const [viewMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<FormData | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table sx={{ minWidth: 1000 }} aria-label="journal entries table">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell onClick={handleSortToggle} sx={{ cursor: 'pointer', userSelect: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Date
                        <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'text-primary' : 'text-slate-400'} />
                      </Box>
                    </TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Weather & Wind</TableCell>
                    <TableCell>Water Conditions</TableCell>
                    <TableCell>Catch</TableCell>
                    <TableCell>Bait</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEntries.map((entry, index) => {
                    const originalIndex = state.entries.indexOf(entry);
                    return (
                      <TableRow
                        key={`${entry.date}-${index}`}
                        onClick={() => setSelectedEntry(entry)}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
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
                                 <Fish size={16} className="text-emerald-500" />
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
                               <Anchor size={16} className="text-slate-400" />
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
                            <IconButton onClick={() => handleDelete(originalIndex)} color="error" size="small">
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          
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
      >
        {selectedEntry && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={24} />
                <Box>
                  <Typography variant="h6">{selectedEntry.streamName}</Typography>
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
              <Grid container spacing={3}>
                {/* Catch Details */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Fish size={20} className="text-emerald-500" />
                    <Typography variant="subtitle1" fontWeight="bold">Catch Details</Typography>
                  </Box>
                  <Box sx={{ pl: 3.5 }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {selectedEntry.numberCaught || 0} fish
                    </Typography>
                    <Typography variant="body1">{selectedEntry.fishSpecies || 'No species recorded'}</Typography>
                    {selectedEntry.baitUsed && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Bait:</strong> {selectedEntry.baitUsed}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}><Divider /></Grid>

                {/* Weather Conditions */}
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FileText size={20} />
                        <Typography variant="subtitle1" fontWeight="bold">Notes</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ pl: 3.5, whiteSpace: 'pre-wrap' }}>
                        {selectedEntry.notes}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
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
