import React, { useState } from 'react';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
          CITY GOVERNMENT OF MALABON
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

interface Props {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  mobile: string;
  password: string;
  handleText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  genderChange: ((event: SelectChangeEvent<string>) => void);
  error: string | null;
}

export default function SignupForm({ email, firstName, lastName, gender, mobile, password, error, handleText, handleSubmit, genderChange }: Props) {
    const [visible, setVisible] = useState<boolean>(false);
    const [agreeInTerms, setAgreeInTerms] = useState<boolean>(true);
    
  return (
    <Stack component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <TextField
                    variant="standard"
                    required
                    fullWidth
                    value={firstName}
                    onChange={handleText}
                    label="First Name"
                    name="firstName"
                    autoFocus
                    error={error != null}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    variant="standard"
                    required
                    fullWidth
                    value={lastName}
                    onChange={handleText}
                    label="Last Name"
                    name="lastName"
                    error={error != null}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Select
                    name="gender"
                    value={gender}
                    fullWidth
                    label="Gender"
                    onChange={genderChange}
                >
                    <MenuItem value={'male'}>Male</MenuItem>
                    <MenuItem value={'female'}>Female</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    variant="standard"
                    required
                    fullWidth
                    value={mobile}
                    onChange={handleText}
                    label="Mobile Number"
                    name="mobile"
                    type="number"
                    error={error != null}
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
            <Grid item xs={12} md={12}>
                <TextField
                    variant="standard"
                    required
                    fullWidth
                    value={email}
                    onChange={handleText}
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={error != null}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    variant="standard"
                    required
                    fullWidth
                    value={password}
                    onChange={handleText}
                    name="password"
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    type={visible ? "text" : "password"}
                    error={error != null}
                    helperText={error}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton onClick={() => setVisible(!visible)}>
                                {visible ? <VisibilityOffIcon /> : <VisibilityIcon /> }
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox checked={agreeInTerms} onChange={() => setAgreeInTerms(!agreeInTerms)} color="primary" />}
                    label={<p>I agree to the <Link href="/termsAndConditions"><a style={{ color: "#ff558f" }}>Terms and Conditions</a></Link> of Malabon Online Services.</p>}
                />
                {!agreeInTerms && <span style={{ color: "#ff558f", marginLeft: 30, fontStyle: 'italic', fontSize: 12 }}>*This field is required.</span>}
            </Grid>
        </Grid>

        <Stack direction="column" spacing={1}>        
       
        <Button
            type="submit"
            fullWidth
            variant="contained"
        >
            Sign Up
        </Button>

        <Link variant="subtitle2" href="/signin">
            Already have an account?
          </Link>
        </Stack>
    
        <Copyright sx={{ mt: 3 }} />
    </Stack>
  )
}