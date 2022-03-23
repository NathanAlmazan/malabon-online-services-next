import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { capitalCase } from "change-case";

interface Props {
    choices: {
        value: string;
        label: string;
    }[];
    value: string;
    header: string;
    handleValueChange: ((event: React.ChangeEvent<HTMLInputElement>, value: string) => void) | undefined;
}

function FormRadioGroup(props: Props) {
  const { choices, value, header, handleValueChange } = props;
  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="center" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    {header}
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <RadioGroup
                    row
                    value={value}
                    onChange={handleValueChange}
                >
                    <Grid container>
                    {choices.map(choice => (
                        <Grid item xs={12} sm={6} md={4} key={choice.value}>
                            <FormControlLabel value={choice.value} control={<Radio />} label={capitalCase(choice.label)} />
                        </Grid>
                    ))}
                    </Grid>
                </RadioGroup>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default FormRadioGroup