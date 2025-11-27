import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Collapse,
} from '@mui/material';
import { Search, Filter, X } from 'lucide-react';
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
  const [filterType, setFilterType] = useState<'location' | 'species' | 'mode' | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const locations = [...new Set(state.entries.map((e) => e.streamName))].filter(Boolean).sort();
  const species = [...new Set(state.entries.map((e) => e.fishSpecies))].filter(Boolean).sort();

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, type: 'location' | 'species' | 'mode') => {
    setAnchorEl(event.currentTarget);
    setFilterType(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setFilterType(null);
  };

  const handleFilterSelect = (value: string | null) => {
    if (filterType === 'location') {
      onFiltersChange({ ...filters, location: value });
    } else if (filterType === 'species') {
      onFiltersChange({ ...filters, species: value });
    } else if (filterType === 'mode') {
      onFiltersChange({ ...filters, entryMode: value as 'all' | 'quick' | 'full' });
    }
    handleMenuClose();
  };

  const clearFilter = (type: 'location' | 'species' | 'mode') => {
    if (type === 'location') {
      onFiltersChange({ ...filters, location: null });
    } else if (type === 'species') {
      onFiltersChange({ ...filters, species: null });
    } else if (type === 'mode') {
      onFiltersChange({ ...filters, entryMode: 'all' });
    }
  };

  const activeFilters = [
    filters.location && { type: 'location' as const, label: filters.location },
    filters.species && { type: 'species' as const, label: filters.species },
    filters.entryMode !== 'all' && { type: 'mode' as const, label: filters.entryMode },
  ].filter(Boolean);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <Box sx={{ mb: 2 }}>
      {/* Search input */}
      <TextField
        placeholder="Search entries..."
        value={filters.query}
        onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
        size="small"
        fullWidth
        aria-label="Search journal entries"
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
                onClick={() => setShowFilters(!showFilters)}
                color={hasActiveFilters || showFilters ? 'primary' : 'default'}
                aria-label="Toggle filters"
              >
                <Filter size={18} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Active filter chips - always visible when filters are active */}
      {hasActiveFilters && !showFilters && (
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {activeFilters.map((filter) => filter && (
            <Chip
              key={filter.type}
              label={filter.label}
              size="small"
              color="primary"
              onDelete={() => clearFilter(filter.type)}
              deleteIcon={<X size={12} />}
            />
          ))}
        </Box>
      )}

      {/* Expanded filter options */}
      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Chip
            label={filters.location || 'Location'}
            size="small"
            variant={filters.location ? 'filled' : 'outlined'}
            color={filters.location ? 'primary' : 'default'}
            onClick={(e) => handleFilterClick(e, 'location')}
            onDelete={filters.location ? () => clearFilter('location') : undefined}
            deleteIcon={<X size={14} />}
          />
          <Chip
            label={filters.species || 'Species'}
            size="small"
            variant={filters.species ? 'filled' : 'outlined'}
            color={filters.species ? 'primary' : 'default'}
            onClick={(e) => handleFilterClick(e, 'species')}
            onDelete={filters.species ? () => clearFilter('species') : undefined}
            deleteIcon={<X size={14} />}
          />
          <Chip
            label={filters.entryMode === 'all' ? 'Entry Type' : filters.entryMode}
            size="small"
            variant={filters.entryMode !== 'all' ? 'filled' : 'outlined'}
            color={filters.entryMode !== 'all' ? 'primary' : 'default'}
            onClick={(e) => handleFilterClick(e, 'mode')}
            onDelete={filters.entryMode !== 'all' ? () => clearFilter('mode') : undefined}
            deleteIcon={<X size={14} />}
          />
        </Box>
      </Collapse>

      {/* Filter menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {filterType === 'location' && [
          <MenuItem key="all" onClick={() => handleFilterSelect(null)}>
            All Locations
          </MenuItem>,
          ...locations.map((loc) => (
            <MenuItem key={loc} onClick={() => handleFilterSelect(loc)}>
              {loc}
            </MenuItem>
          )),
        ]}
        {filterType === 'species' && [
          <MenuItem key="all" onClick={() => handleFilterSelect(null)}>
            All Species
          </MenuItem>,
          ...species.map((sp) => (
            <MenuItem key={sp} onClick={() => handleFilterSelect(sp)}>
              {sp}
            </MenuItem>
          )),
        ]}
        {filterType === 'mode' && [
          <MenuItem key="all" onClick={() => handleFilterSelect('all')}>
            All Types
          </MenuItem>,
          <MenuItem key="quick" onClick={() => handleFilterSelect('quick')}>
            Quick Entry
          </MenuItem>,
          <MenuItem key="full" onClick={() => handleFilterSelect('full')}>
            Full Entry
          </MenuItem>,
        ]}
      </Menu>
    </Box>
  );
}
