import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { BuildingInformation } from "../buildingTypes";

interface Props {
    buildingInfo: BuildingInformation;
    handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editable: boolean;
    handleDateChange: (date: Date, name: string) => void;
}

function BuildingInfo(props: Props) {
    const { buildingInfo, handleTextChange, editable, handleDateChange } = props;
    const { occupancyClassified, numberOfUnits, estimatedCost, totalFloorArea, dateOfCompletion, proposedDate } = buildingInfo;

    const handleProposedChange = (newValue: Date | null) => {
        if (newValue !== null) {
            handleDateChange(newValue, "proposedDate");
        }
    }

    const handleCompletionChange = (newValue: Date | null) => {
        if (newValue !== null) {
            handleDateChange(newValue, "dateOfCompletion");
        }
    }
  return (
    <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
        <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
            <Grid item xs={12} md={4}>
                <Typography component="h1" variant="body1" textAlign="left">
                    CONSTRUCTION INFORMATION
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="occupancyClassified"
                            label="Occupancy Classified"
                            value={occupancyClassified ? occupancyClassified : ''}
                            onChange={editable ? handleTextChange : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth
                            required
                            name="numberOfUnits"
                            label="Number of Units"
                            value={numberOfUnits ? numberOfUnits : ''}
                            onChange={editable ? handleTextChange : undefined}
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
                            name="totalFloorArea"
                            label="Total Floor Area (Square Meters)"
                            value={totalFloorArea ? totalFloorArea : ''}
                            onChange={editable ? handleTextChange : undefined}
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
                            name="estimatedCost"
                            label="Estimated Cost"
                            value={estimatedCost ? estimatedCost : ''}
                            onChange={editable ? handleTextChange : undefined}
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₱</InputAdornment>
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Proposed Date of Construction"
                                inputFormat="MM/dd/yyyy"
                                value={proposedDate}
                                onChange={editable ? handleProposedChange : () => {}}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="Expected Date of Completion"
                                inputFormat="MM/dd/yyyy"
                                value={dateOfCompletion}
                                onChange={editable ? handleCompletionChange : () => {}}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Paper>
  )
}

export default BuildingInfo