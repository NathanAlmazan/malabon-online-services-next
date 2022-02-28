import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { motion, AnimatePresence } from "framer-motion";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountPopover from './AccountPopover';
import { useRouter } from "next/router";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  interface Props {
      matches: boolean;
      open: boolean;
      toggleDrawer: () => void;
  }

function Appbar({ matches, open, toggleDrawer }: Props) {
    const router = useRouter();

  return (
    <AppBar position="absolute" open={open} color="inherit" sx={{ p: 0 }}>
        <Toolbar
            disableGutters
        >
        <AnimatePresence>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <Avatar alt="malabon logo" src="/icons/malabon_logo_2.png" sx={{ width: { xs: 60, md: 70 }, height: { xs: 60, md: 70 } }} variant="square" />
            </Box>
            {!Boolean(matches && open) && (
                <motion.div
                    key="iconsStack"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ flexGrow: 1 }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ ml: 2 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                ...(open && { display: 'none' }),
                            }}
                            >
                            <MenuIcon />
                        </IconButton>
                        <IconButton color="secondary">
                            <Badge badgeContent={4} color="primary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton color="secondary" onClick={() => router.push('/')}>
                            <HomeRoundedIcon />
                        </IconButton>
                    </Stack>
                </motion.div>
            )}

            {!Boolean(matches && open) && (
                <motion.div
                    key="profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <AccountPopover />
                </motion.div>
            )}
        </AnimatePresence>
        </Toolbar>
    </AppBar>
  );
}

export default Appbar;
