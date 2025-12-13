import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from '@mui/material';
import { BarChart, PlusCircle, Droplets, Cloud, Sun, Moon } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: number) => void;
}

export default function MobileMenu({ open, onClose, onNavigate }: MobileMenuProps) {
  const { state: { darkMode }, toggleDarkMode } = useJournal();

  const handleNavigation = (tab: number) => {
    onNavigate(tab);
    onClose();
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    // Don't close menu so user can see the change immediately
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          <ListItem button onClick={() => handleNavigation(0)}>
            <ListItemIcon>
              <BarChart size={24} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation(1)}>
            <ListItemIcon>
              <PlusCircle size={24} />
            </ListItemIcon>
            <ListItemText primary="New Entry" />
          </ListItem>
          
          <ListItem button onClick={handleDarkModeToggle}>
            <ListItemIcon>
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </ListItemIcon>
            <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
          </ListItem>
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <List>
          <ListItem
            button
            component="a"
            href="https://waterdata.usgs.gov/nwis/rt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon>
              <Droplets size={24} />
            </ListItemIcon>
            <ListItemText primary="USGS Water Data" />
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://www.weather.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon>
              <Cloud size={24} />
            </ListItemIcon>
            <ListItemText primary="Weather" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}