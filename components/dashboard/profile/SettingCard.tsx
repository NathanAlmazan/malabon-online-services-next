// IMPORTS
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from "@mui/material/Snackbar";
import { apiPostRequest } from "../../../hocs/axiosRequests";

type Accounts = {
    userId: number;
    uid: string;
    provider: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    gender: string | null;
    email: string;
    phoneNumber: string | null;
    isActive: boolean;
    superuser: boolean;
    officer: boolean;
}

interface Props {
    account: Accounts
    token: string;
}

export default function SettingsCard(props: Props) {
    const { account, token } = props;
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstName: account.firstName,
        middleName: account.middleName,
        lastName: account.lastName,
        gender: account.gender,
        phoneNumber: account.phoneNumber
    });
    const [loading, setLoading] = useState<boolean>(false);

    const { firstName, middleName, lastName, gender, phoneNumber } = formData;

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const handleGenderChange = ((event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        setFormData({ ...formData, gender: value });
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);
        const body = JSON.stringify({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            email: account.email,
            phoneNumber: phoneNumber,
            gender: gender
        })

        const updateAccount = await apiPostRequest('/accounts/update/' + account.uid, body, token);
        setLoading(false);
        setOpenSnackbar(true);
    }

    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => setOpenSnackbar(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%", textAlign: "center" }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        My Profile
      </Typography>
      <Divider></Divider>

      {/* MAIN CONTENT CONTAINER */}
      <form onSubmit={handleSubmit}>
        <CardContent>
            <Grid
              container
              direction={{ xs: "column", md: "row" }}
              columnSpacing={5}
              rowSpacing={3}
            >
              {/* ROW 1: FIRST NAME */}
              <Grid item xs={6}>
                <TextField 
                    fullWidth
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={handleTextChange}
                />
              </Grid>

              {/* ROW 1: LAST NAME */}
              <Grid item xs={6}>
                <TextField 
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={handleTextChange}
                />
              </Grid>

              {/* ROW 2: MIDDLE NAME */}
              <Grid item xs={6}>
                <TextField 
                    fullWidth
                    name="middleName"
                    label="Middle Name"
                    variant="outlined"
                    value={middleName ? middleName : ''}
                    onChange={handleTextChange}
                />
              </Grid>

              {/* ROW 2: GENDER */}
              <Grid item xs={6} sx={{margin: "auto"}}>
                <RadioGroup
                    row
                    name="gender"
                    value={gender}
                    onChange={handleGenderChange}
                >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </Grid>

              {/* ROW 3: PHONE */}
              <Grid item xs={6}>
                <TextField 
                    fullWidth
                    name="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    value={phoneNumber ? phoneNumber : ''}
                    onChange={handleTextChange}
                    type="number"
                    inputProps={{ max: 9999999999, min: 0 }}
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

              {/* BUTTON */}
              <Grid
                container
                justifyContent={{ xs: "center", md: "flex-end" }}
                item
                xs={6}
              >
                <LoadingButton
                  sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                  type="submit"
                  size="large"
                  loading={loading}
                  variant="contained"
                  color="secondary"
                >
                  Update
                </LoadingButton>
              </Grid>
            </Grid>
        </CardContent>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Your profile was updated successfully!"
        action={action}
      />
    </Card>
  );
}
