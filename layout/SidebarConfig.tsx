import DashboardIcon from '@mui/icons-material/Dashboard';
import InboxIcon from '@mui/icons-material/Inbox';
import HelpIcon from '@mui/icons-material/Help';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import BusinessIcon from '@mui/icons-material/Business';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LandscapeIcon from '@mui/icons-material/Landscape';
import StoreIcon from '@mui/icons-material/Store';
import GroupIcon from '@mui/icons-material/Group';

export const UserSideBar = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />
    },
    {
        path: '/dashboard/inbox',
        title: 'Inbox',
        icon: <InboxIcon />
    }
];

export const AdminSidebar = [
    {
        path: '/admin',
        title: 'Dashboard',
        icon: <DashboardIcon />
    },
    {
        path: '/admin/business/register',
        title: 'New Business',
        icon: <LocalMallIcon />
    },
    {
        path: '/admin/business/renew',
        title: 'Business Renewal',
        icon: <StoreIcon />
    },
    {
        path: '/admin/building',
        title: 'Building Permit',
        icon: <BusinessIcon />
    },
    {
        path: '/admin/estate',
        title: 'Real Estate',
        icon: <LandscapeIcon />
    },
    {
        path: '/admin/accounts',
        title: 'Manage Accounts',
        icon: <GroupIcon />
    },
    {
        path: '/admin/zones',
        title: 'Manage Zoning',
        icon: <AddLocationAltIcon />
    }
]