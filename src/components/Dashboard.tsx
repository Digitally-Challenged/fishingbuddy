import { Box, Typography, Fade } from '@mui/material';
import JournalEntryList from './dashboard/JournalEntryList';
import JournalStats from './dashboard/JournalStats';
// import RecentActivity from './dashboard/RecentActivity'; // Maybe redundant with the new list view

export default function Dashboard() {
  return (
    <Box sx={{ pb: 8 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(45deg, #0f172a 30%, #334155 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Westfall Fishing Journal Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, fontStyle: 'italic' }}>
              "The River giveth, and the River taketh away."
            </Typography>
          </Box>
          
          <JournalStats />
          
          <JournalEntryList />
        </Box>
      </Fade>
    </Box>
  );
}
