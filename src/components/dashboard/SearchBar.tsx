import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  ListSubheader,
} from '@mui/material';
import { Search, Filter } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export interface SearchFilters {
  query: string;
  location: string | null;
  species: string | null;
  entryMode: 'all' | 'quick' | 'full';
}

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchBar({ filters, onFiltersChange }: SearchBarProps) {
  const { state } = useJournal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean).sort();
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean).sort();

  const hasActiveFilters = filters.location || filters.species || filters.entryMode !== 'all';

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setFilter = (type: 'location' | 'species' | 'entryMode', value: string | null) => {
    onFiltersChange({ ...filters, [type]: value });
    handleClose();
  };

  const clearAll = () => {
    onFiltersChange({ query: filters.query, location: null, species: null, entryMode: 'all' });
    handleClose();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        placeholder="Search entries..."
        value={filters.query}
        onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleFilterClick}
                color={hasActiveFilters ? 'primary' : 'default'}
              >
                <Filter size={18} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {hasActiveFilters && (
          <MenuItem onClick={clearAll} sx={{ color: 'error.main' }}>
            Clear all filters
          </MenuItem>
        )}

        <ListSubheader>Location</ListSubheader>
        <MenuItem
          onClick={() => setFilter('location', null)}
          selected={!filters.location}
        >
          All locations
        </MenuItem>
        {locations.map((loc) => (
          <MenuItem
            key={loc}
            onClick={() => setFilter('location', loc)}
            selected={filters.location === loc}
          >
            {loc}
          </MenuItem>
        ))}

        <ListSubheader>Species</ListSubheader>
        <MenuItem
          onClick={() => setFilter('species', null)}
          selected={!filters.species}
        >
          All species
        </MenuItem>
        {species.map((sp) => (
          <MenuItem
            key={sp}
            onClick={() => setFilter('species', sp)}
            selected={filters.species === sp}
          >
            {sp}
          </MenuItem>
        ))}

        <ListSubheader>Entry Type</ListSubheader>
        <MenuItem
          onClick={() => setFilter('entryMode', 'all')}
          selected={filters.entryMode === 'all'}
        >
          All types
        </MenuItem>
        <MenuItem
          onClick={() => setFilter('entryMode', 'quick')}
          selected={filters.entryMode === 'quick'}
        >
          Quick entries
        </MenuItem>
        <MenuItem
          onClick={() => setFilter('entryMode', 'full')}
          selected={filters.entryMode === 'full'}
        >
          Full entries
        </MenuItem>
      </Menu>
    </Box>
  );
}
