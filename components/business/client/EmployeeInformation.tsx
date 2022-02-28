import React, { useEffect, useState } from 'react';
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

function EmployeeInformation(props: Props) {
  const { formData, handleValueChange, editable } = props;
  const { maleEmployees, femaleEmployees, filipinoEmployees, lguEmployees, foreignEmployees } = formData;
  const [totalEmployees, setTotalEmployees] = useState<string>('');

  useEffect(() => {
    if (maleEmployees && femaleEmployees) {
        const male: number = parseInt(maleEmployees);
        const female: number = parseInt(femaleEmployees);
        if (!isNaN(male) && !isNaN(female)) {
            setTotalEmployees(state => (male + female).toString());
        }
    }
  }, [maleEmployees, femaleEmployees])

  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    EMPLOYEES INFORMATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="maleEmployees"
                            label="Male Employees"
                            type="number"
                            value={maleEmployees ? maleEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="femaleEmployees"
                            label="Female employees"
                            type="number"
                            value={femaleEmployees ? femaleEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="totalEmployees"
                            label="Total Employees"
                            type="number"
                            value={totalEmployees ? totalEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="lguEmployees"
                            label="Employees residing in Malabon"
                            type="number"
                            value={lguEmployees ? lguEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="filipinoEmployees"
                            label="Filipino Employees"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            value={filipinoEmployees ? filipinoEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="foreignEmployees"
                            label="Foreign Employees"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            value={foreignEmployees ? foreignEmployees : ''}
                            onChange={editable ? handleValueChange : undefined}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default EmployeeInformation