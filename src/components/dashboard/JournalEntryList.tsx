import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Trash2, FileSpreadsheet } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import dayjs from 'dayjs';

export default function JournalEntryList() {
  const { state, deleteEntry, exportEntries } = useJournal();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Journal Entries</Typography>
        <Button
          variant="outlined"
          startIcon={<FileSpreadsheet size={18} />}
          onClick={exportEntries}
          disabled={state.entries.length === 0}
          sx={{ ml: 2 }}
        >
          Export to Excel
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Species</TableCell>
              <TableCell>Caught</TableCell>
              <TableCell>Weather</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{dayjs(entry.date).format('MMM D, YYYY')}</TableCell>
                <TableCell>{entry.streamName}</TableCell>
                <TableCell>{entry.fishSpecies || '-'}</TableCell>
                <TableCell>{entry.numberCaught ?? '0'}</TableCell>
                <TableCell>{entry.weatherConditions || '-'}</TableCell>
                <TableCell>
                  <Tooltip title="Delete entry">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {state.entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No entries yet. Start by adding your first fishing journal entry!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
