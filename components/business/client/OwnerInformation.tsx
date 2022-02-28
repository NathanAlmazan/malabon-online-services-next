import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { capitalCase } from 'change-case';
import { BusinessOwners } from './businessTypes';

interface Props {
    owners: BusinessOwners[];
    addOwner: (value: BusinessOwners) => void;
    removeOwner: (name: string) => void;
    editable: boolean;
}

const initialOwner = {
    givenName: '',
    middleName: '',
    surname: '',
    suffix: null,
    gender: 'male',
    citizenship: null,
    owner: false
};

function OwnerInformation(props: Props) {
  const { owners, addOwner, editable, removeOwner } = props;
  const [ownerInfo, setOwnerInfo] = useState<BusinessOwners>(initialOwner);
  const [represent, setRepresent] = useState<boolean>(false);

  const { givenName, middleName, suffix, gender, surname, citizenship, owner } = ownerInfo;

  useEffect(() => {
    if (owners.find(owner => owner.owner)) {
        setRepresent(state => true);
    }
  }, [owners])

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerInfo({ ...ownerInfo, [event.target.name]: event.target.value });
  }

  const handleRadioChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setOwnerInfo({ ...ownerInfo, [event.target.name]: value });
  })

  const handleCheckboxChange = ((event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setOwnerInfo({ ...ownerInfo, owner: checked });
  })

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    addOwner(ownerInfo);
    setOwnerInfo(initialOwner);
  }

  return (
        <Paper variant="outlined" sx={{ mb: 3, borderColor: "red" }}>
            <Grid container spacing={3} alignItems="start" sx={{ p: 3 }}>
                <Grid item xs={12} md={4}>
                    <Typography component="h1" variant="body1" textAlign="left">
                        OWNER INFORMATION
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                    {owners.length != 0 && owners.map((owner) => (
                        <Paper variant="outlined" key={owner.givenName} sx={{ p: 3, borderColor: "grey", mb: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="surname"
                                        label="Surname"
                                        value={owner.surname}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="givenName"
                                        label="Given Name"
                                        value={owner.givenName}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="middleName"
                                        label="Middle Name"
                                        value={owner.middleName}
                                    />
                                </Grid>
                                <Grid item xs={5} md={2}>
                                    <TextField 
                                        fullWidth
                                        name="suffix"
                                        label="Suffix"
                                        value={owner.suffix ? owner.suffix : ''}
                                    />
                                </Grid>
                                <Grid item xs={7} md={4}>
                                    <TextField 
                                        fullWidth
                                        name="citizenship"
                                        label="Citizenship"
                                        value={owner.citizenship ? capitalCase(owner.citizenship) : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={owner.gender}
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel 
                                        control={<Checkbox />} 
                                        label="OIC / President" 
                                        name="owner"
                                        checked={owner.owner}
                                    />
                                </Grid>
                               {editable && (
                                    <Grid item xs={12} md={4}>
                                        <Button
                                            onClick={() => removeOwner(owner.givenName)}
                                            variant="outlined"
                                            fullWidth
                                        >
                                            Remove Owner
                                        </Button>
                                    </Grid>
                               )}
                            </Grid>
                        </Paper>
                    ))}

                    {editable && (
                        <Paper variant="outlined" sx={{ p: 3, borderColor: "red" }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="surname"
                                        label="Surname"
                                        value={surname}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="givenName"
                                        label="Given Name"
                                        value={givenName}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        fullWidth
                                        name="middleName"
                                        label="Middle Name"
                                        value={middleName}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                <Grid item xs={5} md={2}>
                                    <TextField 
                                        fullWidth
                                        name="suffix"
                                        label="Suffix"
                                        value={suffix ? suffix : ''}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                <Grid item xs={7} md={4}>
                                    <TextField 
                                        fullWidth
                                        name="citizenship"
                                        label="Citizenship"
                                        value={citizenship ? citizenship : ''}
                                        onChange={handleTextChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        value={gender}
                                        onChange={handleRadioChange}
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel 
                                        control={<Checkbox />} 
                                        label="OIC / President" 
                                        disabled={represent}
                                        name="owner"
                                        checked={owner}
                                        onChange={handleCheckboxChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        onClick={handleSubmit}
                                        variant="contained"
                                        fullWidth
                                    >
                                        Add Owner
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Paper>
  )
}

export default OwnerInformation