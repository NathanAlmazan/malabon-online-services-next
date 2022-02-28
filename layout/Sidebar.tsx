import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { AdminSidebar, UserSideBar } from './SidebarConfig';


function Sidebar() {
    const theme = useTheme();
    const router = useRouter();

    const handleRouteChange = (pathname: string) => {
        router.push(pathname);
    }

  return (
    <div>
        {router.pathname.search("/admin") == -1 ? (
            UserSideBar.map(data => {
                const isSelected = Boolean(router.pathname == data.path);

                return (
                    <ListItem button key={data.path} sx={{ 
                        backgroundColor: isSelected ? theme.palette.primary.dark : '#FFFF',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.light,
                        }
                        }}
                        onClick={() => handleRouteChange(data.path)}
                    >
                        <ListItemIcon sx={{ 
                            color: isSelected ? "#FFFF" : theme.palette.primary.dark
                        }}>
                            {data.icon}
                        </ListItemIcon>
                        <ListItemText primary={data.title} sx={{ 
                            color: isSelected ? "#FFFF" : theme.palette.primary.dark
                        }} />
                    </ListItem>
                )
            })
        ) : (
            AdminSidebar.map(data => {
                const isSelected = Boolean(router.pathname == data.path);

                return (
                    <ListItem button key={data.path} sx={{ 
                        backgroundColor: isSelected ? theme.palette.primary.dark : '#FFFF',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.light,
                        }
                        }}
                        onClick={() => handleRouteChange(data.path)}
                    >
                        <ListItemIcon sx={{ 
                            color: isSelected ? "#FFFF" : theme.palette.primary.dark
                        }}>
                            {data.icon}
                        </ListItemIcon>
                        <ListItemText primary={data.title} sx={{ 
                            color: isSelected ? "#FFFF" : theme.palette.primary.dark
                        }} />
                    </ListItem>
                )
            })
        )}
    </div>
  );
}

export default Sidebar;
