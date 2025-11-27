import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { BarChart3, Plus, List, Settings } from 'lucide-react';

interface BottomNavProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function BottomNav({ value, onChange }: BottomNavProps) {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
      >
        <BottomNavigationAction
          label="Stats"
          icon={<BarChart3 size={24} />}
        />
        <BottomNavigationAction
          label="Quick"
          icon={<Plus size={24} />}
        />
        <BottomNavigationAction
          label="Journal"
          icon={<List size={24} />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings size={24} />}
        />
      </BottomNavigation>
    </Paper>
  );
}
