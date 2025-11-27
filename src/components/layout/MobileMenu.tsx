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
import { BarChart, PlusCircle, Droplets, Cloud } from 'lucide-react';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: number) => void;
}

export default function MobileMenu({ open, onClose, onNavigate }: MobileMenuProps) {
  const handleNavigation = (tab: number) => {
    onNavigate(tab);
    onClose();
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