import React from 'react';
import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import { mainListItems, secondaryListItems } from './ListItems';

const Sidebar = dynamic(() => import('./Sidebar'));

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: 0,
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  interface Props {
      open: boolean;
      toggleDrawer: () => void;
  }

function DrawerLayout({ open, toggleDrawer }: Props) {
  return (
    <Drawer variant="permanent" open={open}>
        <Toolbar
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
        }}
        >
        <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
        </IconButton>
        </Toolbar>
        <Divider />
        <List>
          <Sidebar />
        </List>
        <Divider />
    </Drawer>
  );
}

export default DrawerLayout;
