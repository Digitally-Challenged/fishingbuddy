import { Box, Typography, Fade } from '@mui/material';
import JournalEntryList from './dashboard/JournalEntryList';
import JournalStats from './dashboard/JournalStats';
// import RecentActivity from './dashboard/RecentActivity'; // Maybe redundant with the new list view

export default function Dashboard() {
  return (
    <Box sx={{ pb: 8 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Box sx={{ mb: 6, mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary" sx={{ 
              fontStyle: 'italic', 
              fontWeight: 500,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.4
            }}>
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
