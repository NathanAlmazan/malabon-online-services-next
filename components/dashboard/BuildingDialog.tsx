import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface Props {
    open: boolean;
    handleClose: () => void;
    proceed: (value: string) => void;
}

export default function CustomizedDialogs(props: Props) {
    const { open, handleClose, proceed } = props;

  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            General Instructions
        </BootstrapDialogTitle>
        <DialogContent dividers>
            <Typography variant="h6" component="h1" gutterBottom>
                Requirements
            </Typography>
            <Typography gutterBottom>
                Before proceeding in Building Permit Application, please secure the following:
            </Typography>
            <Typography>
                1.  Proof of Land Ownership (Land Title) (Required)
            </Typography>
            <Typography>
                2.  Building Blue Print with complete approvals. (Required)
            </Typography>
            <Typography>
                3.  Scanned copy of the lead Architect or Enginner assigned in the construction of the building.
            </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => proceed('/dashboard/building/location')} variant="outlined" sx={{ borderRadius: 50, m: 2 }}>
            Proceed
          </Button>
        </DialogActions>
      </BootstrapDialog>
  );
}
