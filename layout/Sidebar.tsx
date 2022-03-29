import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { AdminSidebar, UserSideBar } from './SidebarConfig';
import { useAuth } from '../hocs/FirebaseProvider';
import { apiGetRequest } from '../hocs/axiosRequests';

type AdminAccount = {
    adminAccount: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      superuser: boolean;
    },
    roles: string[];
}

type Sidebar = {
    path: string;
    title: string;
    icon: JSX.Element;
}
  

function Sidebar() {
    const theme = useTheme();
    const router = useRouter();
    const { currentUser } = useAuth();
    const [adminPaths, setAdminPaths] = useState<Sidebar[]>([]);
    

    useEffect(() => {
        const getAdminUser = async () => {
            const accountData = await apiGetRequest('/accounts/admin/search', currentUser?.accessToken);

            if (accountData.status < 300) {
                const account = accountData.data as AdminAccount;

                if (account.adminAccount.superuser) {
                    setAdminPaths(AdminSidebar);
                } else {
                    let adminList: Sidebar[] = [];
                    adminList.push(AdminSidebar.find(bar => bar.title == "Dashboard") as Sidebar);
    
                    if (Boolean(account.roles.includes("OLBO") || account.roles.includes("CHO") || account.roles.includes("CENRO") || account.roles.includes("OCMA") || account.roles.includes("BFP") || account.roles.includes("PZO") || account.roles.includes("TRSY") || account.roles.includes("BPLO"))) {
                        adminList.push(AdminSidebar.find(bar => bar.title == "New Business") as Sidebar);
                    }
    
                    if (Boolean(account.roles.includes("FENCING") || account.roles.includes("ARCHITECTURAL") || account.roles.includes("STRUCTURAL") || account.roles.includes("ELECTRICAL") || account.roles.includes("BFP") || account.roles.includes("MECHANICAL") || account.roles.includes("TRSY") || account.roles.includes("SANITARY") || account.roles.includes("PLUMBING") || account.roles.includes("INTERIOR") || account.roles.includes("ELECTRONICS"))) {
                        adminList.push(AdminSidebar.find(bar => bar.title == "Building Permit") as Sidebar);
                    }
    
                    if (Boolean(account.roles.includes("TRSY"))) {
                        adminList.push(AdminSidebar.find(bar => bar.title == "Business Renewal") as Sidebar);
                        adminList.push(AdminSidebar.find(bar => bar.title == "Real Estate") as Sidebar);
                    }

                    adminList.push(AdminSidebar.find(bar => bar.title == "Help and Support") as Sidebar);
                    
                    setAdminPaths(adminList);
                }
            }
        }

        if (currentUser && router.pathname.search("/admin") != -1) {
            getAdminUser();
        }

    }, [currentUser, router])

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
            adminPaths.map(data => {
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
