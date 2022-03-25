import React, { useRef, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import Tooltip from '@mui/material/Tooltip';
// material
import { Box, MenuItem, IconButton } from '@mui/material';
// components
import dynamic from "next/dynamic";

const MenuPopover = dynamic(() => import("../../MenuPopover"));

// ----------------------------------------------------------------------

type Filter = "assessment" | "approved" | "new" | "renew" | "building" | "all";

interface Props {
    selectFilter: (value: Filter) => void;
    filter: Filter;
  }

export default function InboxMenu(props: Props) {
  const { selectFilter, filter } = props;
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const MENU_OPTIONS = [
    {
      value: "all",
      label: "All"
    },
    {
      value: "assessment",
      label: "Under Assessment"
    },
    {
      value: "approved",
      label: "Approved"
    },
    {
      value: "new",
      label: "New Business"
    },
    {
      value: "renew",
      label: "Renew Business"
    },
    {
      value: "building",
      label: "Building Permit"
    },
  ]

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (value: Filter) => {
    selectFilter(value);
    setOpen(false);
  }

  return (
    <>
      <Tooltip title="Filter list">
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>

      <MenuPopover
        open={open}
        onClose={() => handleClose()}
        anchorEl={anchorRef.current}
        sx={{ width: 220, border: 'none' }}
      >

        {MENU_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={e => handleClick(option.value as Filter)}
            sx={{ typography: 'body2', py: 1, px: 2.5, bgcolor: filter == option.value ? '#ff558f' : '#fff', color: filter == option.value ? '#fff' : '#000' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}