import React, { ReactNode, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';

const AppBar = dynamic(() => import('./Appbar'));
const Drawer = dynamic(() => import('./Drawer'));

interface Props {
    children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        
        <AppBar 
            matches={matches}
            open={open}
            toggleDrawer={toggleDrawer}
        />

        <Drawer 
            open={open}
            toggleDrawer={toggleDrawer}
        />

        <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
        >
            <Toolbar />
            <AnimatePresence>
                {!Boolean(matches && open) && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                    >
                        {children} 
                    </motion.div>
                )}
            </AnimatePresence> 
        </Box>
        
    </Box>
    );
}