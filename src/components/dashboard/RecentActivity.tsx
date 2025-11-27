import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Calendar } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import dayjs from 'dayjs';

export default function RecentActivity() {
  const { state } = useJournal();
  const recentEntries = [...state.entries]
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
    .slice(0, 5);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List>
        {recentEntries.map((entry, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Calendar size={20} />
            </ListItemIcon>
            <ListItemText
              primary={`${entry.streamName}`}
              secondary={`${dayjs(entry.date).format('MMM D, YYYY')} - Caught ${entry.numberCaught || '0'} ${entry.fishSpecies || 'fish'}`}
            />
          </ListItem>
        ))}
        {recentEntries.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No recent activity"
              secondary="Your recent fishing trips will appear here"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}