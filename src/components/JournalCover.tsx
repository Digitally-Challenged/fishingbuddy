import { useState } from 'react';
import { Box, Typography, keyframes } from '@mui/material';

interface JournalCoverProps {
  onOpen: () => void;
}

// Keyframes for cover lift and rotate
const coverOpen = keyframes`
  0% {
    transform: perspective(1500px) rotateY(0deg);
    opacity: 1;
  }
  40% {
    transform: perspective(1500px) rotateY(-60deg);
    opacity: 1;
  }
  70% {
    transform: perspective(1500px) rotateY(-120deg);
    opacity: 0.5;
  }
  100% {
    transform: perspective(1500px) rotateY(-180deg);
    opacity: 0;
  }
`;

// Subtle pulse for "tap to open" hint
const pulseHint = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

export default function JournalCover({ onOpen }: JournalCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Wait for animation to complete before calling onOpen
    setTimeout(() => {
      onOpen();
    }, 800);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        cursor: isOpening ? 'default' : 'pointer',
        transformOrigin: 'left center',
        animation: isOpening ? `${coverOpen} 800ms ease-out forwards` : 'none',
      }}
    >
      {/* Background to match the wood/table aesthetic */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: '#3d2b1f',
          backgroundImage: 'radial-gradient(ellipse at center, #4a3728 0%, #2a1810 100%)',
        }}
      />

      {/* Journal cover image */}
      <Box
        component="img"
        src="/book_Images/journal-cover.jpeg"
        alt="Westfall Fishing Journal"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          // Mobile: zoom to just the book, Desktop: show full image with props
          objectFit: { xs: 'cover', md: 'contain' },
          objectPosition: { xs: 'center 30%', md: 'center' },
        }}
      />

      {/* Tap to open hint at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 40, sm: 60 },
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Special Elite", monospace',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: 'rgba(180, 150, 100, 0.8)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            animation: `${pulseHint} 2s ease-in-out infinite`,
          }}
        >
          Tap to Open
        </Typography>
      </Box>
    </Box>
  );
}
