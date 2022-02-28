import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { motion, AnimatePresence } from "framer-motion";

const CustomizedDialog = styled(Dialog)(({ theme }) => ({
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
    submitTrackNum: (trackNum: number) => void;
    handleClose: () => void;
}


export default function AssessmentDialog(props: Props) {
    const { open, handleClose, submitTrackNum } = props;
    const [trackingNum, setTrackingNum] = useState<string>('');

    const handleSubmitTrackNum = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      submitTrackNum(parseInt(trackingNum));
      setTrackingNum('');
    }

    const handleTrackNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTrackingNum(event.target.value);
    }

  return (
      <CustomizedDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      <form onSubmit={handleSubmitTrackNum}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Fire Safety Inspection 
          </BootstrapDialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 }, mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <Typography component="h1" variant="body1" textAlign="left">
                        TRACKING NUMBER
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField 
                        autoFocus
                        type="number"
                        name="trackNum"
                        required
                        value={trackingNum}
                        onChange={handleTrackNumChange}
                        fullWidth
                        sx={{
                          '& input[type=number]': {
                              '-moz-appearance': 'textfield'
                          },
                          '& input[type=number]::-webkit-outer-spin-button': {
                              '-webkit-appearance': 'none',
                              margin: 0
                          },
                          '& input[type=number]::-webkit-inner-spin-button': {
                              '-webkit-appearance': 'none',
                              margin: 0
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>  
          </motion.div>
        </AnimatePresence>
        <DialogActions>
          <Button autoFocus type="submit">
            Save changes
          </Button>
        </DialogActions>
        </form>
      </CustomizedDialog>
  );
}
