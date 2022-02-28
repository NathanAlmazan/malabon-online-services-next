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

function BusinessOperations(props: Props) {
  const { formData, editable, handleValueChange } = props;
  const { businessArea, totalFloors, deliveryUnits, capital } = formData;

  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    BUSINESS OPERATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="businessArea"
                            label="Business Area"
                            type="number"
                            value={businessArea ? businessArea : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            type="number"
                            name="totalFloors"
                            label="Total Floors"
                            value={totalFloors ? totalFloors : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="deliveryUnits"
                            label="No. of Delivery Vehicles"
                            type="number"
                            value={deliveryUnits ? deliveryUnits : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="capital"
                            label="Capital"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>
                            }}
                            value={capital ? capital : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default BusinessOperations