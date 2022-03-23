import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

interface Props {
    children: ReactNode;
    sx: object;
}

export default function Scrollbar({ children, sx, ...other }: Props) {

  return (
    <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
    </Box>
  );
}