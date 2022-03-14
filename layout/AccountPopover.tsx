import React, { useRef, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
// material
import { alpha } from '@mui/material/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@mui/material';
// components
import dynamic from "next/dynamic";
import { useAuth } from '../hocs/FirebaseProvider';

const MenuPopover = dynamic(() => import("../components/MenuPopover"));

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { firebaseClass, currentUser } = useAuth();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const history = useRouter();

  const MENU_OPTIONS = [
    {
      label: 'Home',
      icon: HomeIcon,
      linkTo: '/'
    },
    {
      label: 'Profile',
      icon: PersonIcon,
      linkTo: `/profile/` + currentUser?.user.uid
    },
    {
        label: 'Settings',
        icon: SettingsIcon,
        linkTo: `/employees/profile`
    }
  ];

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMenu = (path: string) => {
    handleClose();
    router.push(path);
  }

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (firebaseClass) {
      firebaseClass.signOut().then(res => {
        history.push('/signin');
      })
    }
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          mr: 3,
          width: 48,
          height: 48,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <Avatar src={currentUser && currentUser.user.photoURL ? currentUser.user.photoURL : "/icons/account_profile.png"} alt="photoURL" sx={{ width: 48, height: 48 }} />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={() => handleClose()}
        anchorEl={anchorRef.current}
        sx={{ width: 220, border: 'none' }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" color="primary.dark" noWrap>
            <strong>{currentUser && currentUser.user.displayName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Citizen
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            onClick={e => handleClickMenu(option.linkTo)}
            sx={{ typography: 'body2', py: 1, px: 2.5 }}
          >
            <Box
              component={option.icon}
              color="primary"
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="primary" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}