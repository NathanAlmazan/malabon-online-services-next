import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import { motion, AnimatePresence } from "framer-motion";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import { useRouter } from "next/router";
import { useAuth } from '../hocs/FirebaseProvider';
import { apiGetRequest } from '../hocs/axiosRequests';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

type Notifications = {
    notifId: number;
    notifSubject: string;
    notifDesc: string;
    read: boolean;
    userId: number;
    createdAt: Date;
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
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<Notifications[]>([]);

    useEffect(() => {
        const getNotifications = async () => {
            const result = await apiGetRequest('/notifications/user', currentUser?.accessToken);
            const notifList = result.data as Notifications[]; 

            setNotifications(state => notifList);
        }
        if (currentUser) {
            getNotifications();
        }
    }, [currentUser]);

    const handleNotifications = async () => {
        notifications.forEach(async (notif) => {
            await apiGetRequest('/notifications/read/' + notif.notifId, currentUser?.accessToken);
        })
        setNotifications(
            notifications.map((notification) => ({
              ...notification,
              read: true
            }))
        );
    }

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
                        <NotificationsPopover 
                            notifications={notifications}
                            setNotifications={handleNotifications}
                        />
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
