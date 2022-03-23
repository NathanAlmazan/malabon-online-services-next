import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { BuildingOwner } from '../buildingTypes';

interface Props {
    owner: BuildingOwner;
    handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleGenderChange: (gender: string) => void;
    editable: boolean;
}


function ApplicantInformation(props: Props) {
    const { owner, handleTextChange, handleGenderChange, editable } = props;
    const { surname, givenName, middleName, suffix, gender, citizenship } = owner;

    const handleRadioChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        handleGenderChange(value);
    });
  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    OWNER INFORMATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            name="surname"
                            label="Surname"
                            value={surname}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            name="givenName"
                            label="Given Name"
                            value={givenName}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            name="middleName"
                            label="Middle Name"
                            value={middleName}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={5} md={2}>
                        <TextField 
                            fullWidth
                            name="suffix"
                            label="Suffix"
                            value={suffix ? suffix : ''}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={7} md={4}>
                        <TextField 
                            fullWidth
                            name="citizenship"
                            label="Citizenship"
                            value={citizenship ? citizenship : ''}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RadioGroup
                            row
                            name="gender"
                            value={gender}
                            onChange={editable ? handleRadioChange : undefined}
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default ApplicantInformation