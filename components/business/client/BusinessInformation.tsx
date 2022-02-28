import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormData } from "./businessTypes";

interface Props {
    formData: FormData;
    handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editable: boolean;
}

function BusinessInformation(props: Props) {
  const { formData, editable, handleValueChange } = props;
  const { registrationNumber, TIN, businessName, tradeName } = formData;

  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    BUSINESS INFORMATION AND REGISTRATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="registrationNumber"
                            label="DTI / SEC / CDA Registration Number"
                            value={registrationNumber ? registrationNumber : ''}
                            onChange={editable ? handleValueChange : undefined}
                            type="number"
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
                            name="TIN"
                            label="Tax Identification Number"
                            value={TIN ? TIN : ''}
                            onChange={editable ? handleValueChange : undefined}
                            type="number"
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
                            name="businessName"
                            label="Business Name"
                            value={businessName ? businessName : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="tradeName"
                            label="Trade Name"
                            value={tradeName ? tradeName : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default BusinessInformation