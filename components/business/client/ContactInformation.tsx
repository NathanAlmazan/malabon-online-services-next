import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormData } from "./businessTypes";
import InputAdornment from '@mui/material/InputAdornment';

interface Props {
    formData: FormData;
    handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editable: boolean;
}

function ContactInformation(props: Props) {
    const { formData, editable, handleValueChange } = props;
    const { email, mobile, telephone, website } = formData;
  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                CONTACT INFORMATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="email"
                            label="Email"
                            type="email"
                            value={email ? email : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="mobile"
                            label="Phone Number"
                            value={mobile ? mobile : ''}
                            type="number"
                            onChange={editable ? handleValueChange : undefined}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+63</InputAdornment>
                            }}
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
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="telephone"
                            label="Telephone"
                            value={telephone ? telephone : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            name="website"
                            label="Website"
                            type="url"
                            value={website ? website : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default ContactInformation