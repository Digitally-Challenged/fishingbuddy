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
  Chip
} from '@mui/material';
import { LayoutGrid, List as ListIcon, Search, Trash2, MapPin, Calendar, Fish, Wind } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import JournalEntryCard from './JournalEntryCard';
import dayjs from 'dayjs';

export default function JournalEntryList() {
  const { state, dispatch } = useJournal();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const entriesPerPage = 9;

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
            sx={{ bgcolor: 'background.paper' }}
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
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {currentEntries.map((entry, index) => {
                const originalIndex = state.entries.indexOf(entry);
                return (
                  <Grid item xs={12} sm={6} md={4} key={`${entry.date}-${index}`}>
                    <JournalEntryCard 
                      entry={entry} 
                      onDelete={() => handleDelete(originalIndex)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="journal entries table">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Weather</TableCell>
                    <TableCell>Catch</TableCell>
                    <TableCell>Water</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEntries.map((entry, index) => {
                    const originalIndex = state.entries.indexOf(entry);
                    return (
                      <TableRow
                        key={`${entry.date}-${index}`}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Calendar size={16} className="text-slate-400" />
                            {dayjs(entry.date).format('MMM D, YYYY')}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapPin size={16} className="text-slate-400" />
                            {entry.streamName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {entry.weatherConditions && (
                            <Chip 
                              icon={<Wind size={14} />} 
                              label={entry.weatherConditions} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: 'divider' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                           {entry.fishSpecies && (
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Fish size={16} className="text-blue-500" />
                               <Typography variant="body2">
                                 {entry.numberCaught} {entry.fishSpecies}
                               </Typography>
                             </Box>
                           )}
                        </TableCell>
                        <TableCell>
                          {(entry.flowRate || entry.waterTemperature) && (
                            <Typography variant="body2" color="text.secondary">
                              {entry.flowRate && `${entry.flowRate} cfs`}
                              {entry.flowRate && entry.waterTemperature && ' • '}
                              {entry.waterTemperature && `${entry.waterTemperature}°F`}
                            </Typography>
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
          )}
          
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
    </Box>
  );
}
