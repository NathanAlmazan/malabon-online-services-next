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
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import { motion, AnimatePresence } from "framer-motion";
import InputAdornment from '@mui/material/InputAdornment';

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
    currentAssessment: string | null;
    handleSubmit: (value: { approved: boolean, required: boolean, remarks: string, fee: number }) => void;
    handleClose: () => void;
}

const choices = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "notRequired", label: "Not Required" }
]


export default function AssessmentDialog(props: Props) {
    const { open, handleClose, currentAssessment, handleSubmit } = props;
    const [formData, setFormData] = useState({
      approved: "no",
      required: true,
      remarks: '',
      fee: ''
    })

    const { approved, fee, remarks } = formData;
    
    const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit({
        approved: approved == "yes" ? true : false,
        fee: fee.length > 0 ? parseFloat(fee) : 0.00,
        remarks: remarks,
        required: approved == "notRequired" ? false : true
      });

      setFormData({
        approved: "no",
        required: true,
        remarks: '',
        fee: ''
      });
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleRadioButtonChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      setFormData({ ...formData, approved: value });
    })

  return (
      <CustomizedDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      <form onSubmit={handleSubmitForm}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
            key={currentAssessment}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
        >
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {currentAssessment ? currentAssessment : ""}
          </BootstrapDialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 }, mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                      COMPLIANCE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <RadioGroup
                        row
                        value={approved}
                        onChange={handleRadioButtonChange}
                    >
                        {choices.map(choice => (
                            <FormControlLabel key={choice.value} value={choice.value} control={<Radio />} label={choice.label} />
                        ))}
                    </RadioGroup>
                  </Grid>
                </Grid>
                
                <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 }, mb: 4 }}>
                  <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                      FEE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField 
                      type="number"
                      name="fee"
                      required={Boolean(approved == "yes")}
                      value={fee}
                      onChange={handleTextChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₱</InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 } }}>
                  <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                      REMARKS
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField 
                      multiline
                      required={Boolean(approved == "no")}
                      name="remarks"
                      fullWidth
                      rows={3}
                      value={remarks}
                      onChange={handleTextChange}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
          </motion.div>
        </AnimatePresence>
        <DialogActions>
          <Button autoFocus type="submit">
            Save Assessment
          </Button>
        </DialogActions>
        </form>
      </CustomizedDialog>
  );
}
