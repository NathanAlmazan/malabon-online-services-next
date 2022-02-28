import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
// material
import { Popover } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: 'absolute',
    borderRadius: '0 0 4px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`
  }
}));

// ----------------------------------------------------------------------

interface Props {
    children: ReactNode;
    sx: object;
    open: boolean;
    onClose: () => void;
    anchorEl: Element | null;
}

export default function MenuPopover({ open, children, sx, anchorEl, onClose }: Props) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          mt: 1.5,
          ml: 0.5,
          overflow: 'inherit',
          boxShadow: (theme) => theme.shadows[15],
          border: (theme) => `solid 1px ${theme.palette.grey[500]}`,
          width: 200,
          ...sx
        }
      }}
      onClose={onClose}
    >
      <ArrowStyle className="arrow" />

      {children}
    </Popover>
  );
}