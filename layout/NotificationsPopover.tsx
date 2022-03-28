import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import React, { useRef, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRouter } from 'next/router';
// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Badge,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemButton
} from '@mui/material';
// components
import dynamic from "next/dynamic";

const Scrollbar = dynamic(() => import("../components/Scrollbar"));
const MenuPopover = dynamic(() => import("../components/MenuPopover"));

// ----------------------------------------------------------------------

type Notification = {
    notifId: number;
    notifSubject: string;
    notifDesc: string;
    read: boolean;
    userId: number;
    createdAt: Date;
}

function renderContent(notification: Notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.notifSubject}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.notifDesc)}
      </Typography>
    </Typography>
  );

  return {
    title
  };
}

interface NotificationItemProps {
    notification: Notification;
    admin?: boolean;
}

function NotificationItem({ notification, admin }: NotificationItemProps) {
  const { title } = renderContent(notification);
  const history = useRouter();
  const onRouterClick = () => {
    if (!admin) {
      history.push('/dashboard/inbox');
    }
  }

  return (
    <ListItemButton
      disableGutters
      onClick={e => onRouterClick()}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.read && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={WatchLaterIcon} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {new Date(notification.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

interface Props {
    notifications: Notification[];
    setNotifications: () => void;
    admin?: boolean;
}

export default function NotificationsPopover(props: Props) {
  const { notifications, setNotifications, admin } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const totalUnRead = notifications.filter((item) => !item.read).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications();
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead} disabled={admin}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.map((notification, index) => (
              <NotificationItem key={index} notification={notification} admin={admin} />
            ))}
          </List>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}