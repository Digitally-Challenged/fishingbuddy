import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  InputAdornment,
  TextField
} from '@mui/material';
import { LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import JournalEntryCard from './JournalEntryCard';

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
          <Grid container spacing={3}>
            {currentEntries.map((entry, index) => {
              // Calculate original index for deletion since we're paginating/filtering
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
