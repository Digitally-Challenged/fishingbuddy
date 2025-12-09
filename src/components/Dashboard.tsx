import { Box, Typography, Fade, Paper } from '@mui/material';
import JournalEntryList from './dashboard/JournalEntryList';
import JournalStats from './dashboard/JournalStats';

export default function Dashboard() {
  return (
    <Box sx={{ pb: 8 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              mb: 6,
              mt: 2,
              p: 4,
              borderRadius: 4,
              overflow: 'hidden',
              minHeight: { xs: 280, sm: 350, md: 420, lg: 480 },
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              textAlign: 'center',
              backgroundImage: 'url(/hero.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top', // Focus on top to crop out bottom text
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, pb: 2 }}>
              <Typography variant="h4" sx={{
                fontStyle: 'italic',
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.4
              }}>
                "The River giveth, and the River taketh away."
              </Typography>
            </Box>
          </Paper>
          
          <JournalStats />
          
          <JournalEntryList />
        </Box>
      </Fade>
    </Box>
  );
}
