import { useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import JournalEntryList from './dashboard/JournalEntryList';
import JournalStats from './dashboard/JournalStats';

// Animated gradient overlay component
function AnimatedGradientOverlay() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Box
      component={motion.div}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Base dark gradient for readability */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      {/* Animated color gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(139, 90, 43, 0.6), rgba(75, 46, 96, 0.7))',
          backgroundSize: '300% 300%',
          animation: prefersReducedMotion ? 'none' : 'gradientShift 10s ease-in-out infinite',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '33%': { backgroundPosition: '100% 50%' },
            '66%': { backgroundPosition: '50% 100%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      />
    </Box>
  );
}

export default function Dashboard() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, prefersReducedMotion ? 0 : 150]);

  return (
    <Box sx={{ pb: 8 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box>
          <Paper
            ref={heroRef}
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
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            {/* Parallax background image */}
            <motion.div
              style={{
                position: 'absolute',
                top: -50,
                left: 0,
                right: 0,
                bottom: -50,
                y: heroY,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/hero.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                }}
              />
            </motion.div>

            {/* Animated gradient overlay */}
            <AnimatedGradientOverlay />

            <Box sx={{ position: 'relative', zIndex: 1, pb: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Typography variant="h4" sx={{
                  fontStyle: 'italic',
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.4
                }}>
                  "The River giveth, and the River taketh away."
                </Typography>
              </motion.div>
            </Box>
          </Paper>

          <JournalStats />

          <JournalEntryList />
        </Box>
      </motion.div>
    </Box>
  );
}
