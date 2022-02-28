import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';

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
    quarterPayment: boolean;
    submitTax: (fees: number[], document: File) => void;
}

interface Payment {
    first: string;
    second: string;
    third: string;
    fourth: string;
}

export default function TaxPaymentDialog(props: Props) {
    const { open, handleClose, quarterPayment, submitTax } = props;
    const [topFile, setTopFile] = useState<File>();
    const [formData, setFormData] = useState<Payment>({
        first: '',
        second: '',
        third: '',
        fourth: ''
    })
    const { first, second, third, fourth } = formData;

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setTopFile(event.target.files[0]);
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (topFile) {
            let fees: number[] = [];

            if (quarterPayment) {
                fees.push(parseFloat(first));
                fees.push(parseFloat(second));
                fees.push(parseFloat(third));
                fees.push(parseFloat(fourth));
            } else {
                fees.push(parseFloat(first));
            }

            submitTax(fees, topFile);
        }
    }

  return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <form onSubmit={handleSubmit}>
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Tax Order of Payment
            </BootstrapDialogTitle>
            <DialogContent dividers>
                <Typography sx={{ mb: 3, fontStyle: 'italic' }}>
                    {quarterPayment ? "The applicant preffered to pay tax quarterly." : "The applicant preffered one time payment of tax."} 
                </Typography>
                <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 }, mb: 4 }}>
                    <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                        FEE
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {quarterPayment ? (
                            <>
                                <TextField 
                                    type="number"
                                    name="first"
                                    required
                                    label="First Quarter"
                                    sx={{ mb: 2 }}
                                    value={first}
                                    onChange={handleTextChange}
                                    fullWidth
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                    }}
                                />
                                <TextField 
                                    type="number"
                                    name="second"
                                    required
                                    label="Second Quarter"
                                    sx={{ mb: 2 }}
                                    value={second}
                                    onChange={handleTextChange}
                                    fullWidth
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                    }}
                                />
                                <TextField 
                                    type="number"
                                    name="third"
                                    required
                                    label="Third Quarter"
                                    sx={{ mb: 2 }}
                                    value={third}
                                    onChange={handleTextChange}
                                    fullWidth
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                    }}
                                />
                                <TextField 
                                    type="number"
                                    name="fourth"
                                    required
                                    label="Fourth Quarter"
                                    sx={{ mb: 2 }}
                                    value={fourth}
                                    onChange={handleTextChange}
                                    fullWidth
                                    InputProps={{
                                    startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                    }}
                                />
                            </>
                        ) : (
                            <TextField 
                                type="number"
                                name="first"
                                required
                                value={first}
                                onChange={handleTextChange}
                                fullWidth
                                InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>
                                }}
                            />
                        )}
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ minWidth: { xs: 100, md: 500 }, mb: 4 }}>
                    <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                        DOCUMENT
                    </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                            <Button
                                component="label"
                                fullWidth
                                variant="outlined"
                                startIcon={topFile ? <DownloadDoneIcon /> : <UploadIcon />}
                            >
                                Upload Tax Order of Payment
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                                    onChange={handleFileChange}
                                    hidden 
                                    required
                                />
                            </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
            <Button autoFocus type="submit">
                Save Tax Order of Payment
            </Button>
            </DialogActions>
        </form>
      </BootstrapDialog>
  );
}
