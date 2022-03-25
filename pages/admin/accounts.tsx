import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { Search as SearchIcon } from '../../icons/search';
import dynamic from 'next/dynamic';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../hocs/FirebaseProvider';
import { apiGetRequest, apiPostRequest } from '../../hocs/axiosRequests';
import { capitalCase } from "change-case";

const Copyright = dynamic(() => import("../../components/Copyright"));
const ProfileCard = dynamic(() => import("../../components/accounts/ProfileCard"));
const AccountCard = dynamic(() => import("../../components/dashboard/accounts/AccountCard"));
const AccountToolbar = dynamic(() => import("../../components/accounts/AccountToolbar"));

interface AdminAccount {
  adminAccount: {
      userId: number;
      firstName: string;
      uid: string;
      lastName: string;
      officer: boolean;
      superuser: boolean;
      phoneNumber: string | null;
      gender: string;
  },
  roles: string[];
  assessed: number;
  forAssess: number;
  image?: string;
}

function getTitle(role: string) {
  switch(role) {
    case "OLBO": 
      return "Occupancy Permit";
    case "CHO":
      return "Sanitary Permit";
    case "CENRO":
      return "City Environmental Certificate";
    case "OCMA":
      return "Market Clearance";
    case "BFP":
      return "Fire Safety Inspection Certificate";
    case "TRSY": 
      return "Treasury";
    case "BPLO": 
      return "Release";
    case "PZO": 
      return "Zoning Clearance"
    default:
      return role;
  }
}

const clearance = ["PZO", "OLBO", "CHO", "CENRO", "OCMA", "BFP", "TRSY", "BPLO", "FENCING", "ARCHITECTURAL", "STRUCTURAL", "ELECTRICAL", "MECHANICAL", "SANITARY", "PLUMBING", "INTERIOR", "ELECTRONICS"];

export default function AdminAccount() {
  const { currentUser } = useAuth();
  const [searchValue, setSearchValue] = useState<string>("");
  const [notfound, setNotfound] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<AdminAccount>();
  const [userRoles, setUserRoles] = useState<readonly string[]>([]);
  const [allAccounts, setAllAccounts] = useState<AdminAccount[]>([]);
  const [adminSearch, setAdminSearch] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    const getAllAccounts = async () => {
      const accounts = await apiGetRequest('/accounts/admin/all', currentUser?.accessToken);
      setAllAccounts(state => accounts.data as AdminAccount[]);
    }

    if (currentUser) {
      getAllAccounts();
    }
  }, [currentUser])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setNotfound(false);
  }

  const handleAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminSearch(event.target.value);
  }

  const handleSearchAccount = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const account = await apiGetRequest('/accounts/manage/' + searchValue, currentUser?.accessToken);

    if (account.status < 300) {
      setUserInfo(account.data as AdminAccount);
      setUserRoles((account.data as AdminAccount).roles);
    } else {
      setNotfound(true);
    }
  }

  const handleSelectAdmin = (account: AdminAccount) => {
    setUserInfo(account);
    setUserRoles(account.roles);
  }

  const handleCheck = (event: React.MouseEvent<unknown>, role: string) => {
    const selectedIndex = userRoles.indexOf(role);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(userRoles, role);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(userRoles.slice(1));
    } else if (selectedIndex === userRoles.length - 1) {
      newSelected = newSelected.concat(userRoles.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        userRoles.slice(0, selectedIndex),
        userRoles.slice(selectedIndex + 1),
      );
    }

    setUserRoles(newSelected);
  };

  const handleCreateSuperUser = async () => {
    if (userInfo) {
      await apiGetRequest('/accounts/superuser/create/' + userInfo.adminAccount.uid, currentUser?.accessToken);
      setUserInfo(undefined);
      setUserRoles([]);
    }
  }

  const handleRemoveSuperUser = async () => {
    if (userInfo) {
      await apiGetRequest('/accounts/superuser/remove/' + userInfo.adminAccount.uid, currentUser?.accessToken);
    }
  }

  const createAdmin = async () => {
    if (userInfo) {
      const result = await apiPostRequest('/accounts/admin/create', JSON.stringify({
        uid: userInfo.adminAccount.uid,
        roles: userRoles
      }), currentUser?.accessToken);

      setUserInfo(undefined);
      setUserRoles([]);
    }
  }

  const updateAdmin = async () => {
    if (userInfo) {
      await apiPostRequest('/accounts/admin/update', JSON.stringify({
        uid: userInfo.adminAccount.uid,
        roles: userRoles
      }), currentUser?.accessToken);

      setUserInfo(undefined);
      setUserRoles([]);
    }
  }

  const deleteAdmin = async () => {
    if (userInfo) {
      await apiPostRequest('/accounts/admin/remove/' + userInfo.adminAccount.uid, JSON.stringify({
        uid: userInfo.adminAccount.uid,
        roles: userRoles
      }), currentUser?.accessToken);

      setUserInfo(undefined);
      setUserRoles([]);
    }
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
    <>
     <Head>
      <title>
        Manage Accounts | Malabon Online Services
      </title>
    </Head>
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography component="h1" fontWeight="bold" color="primary" variant="h5" textAlign="left">
          Manage Accounts
        </Typography>
      </Box>
      <Paper elevation={10} sx={{ mt: 5 }}>
       <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            sx={{ mb: 4 }}
            value={searchValue}
            error={notfound}
            helperText={notfound ? "Account not found" : null}
            type="email"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchAccount}>
                    <SvgIcon
                      color="action"
                      fontSize="small"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </IconButton>
                </InputAdornment>
              )
            }}
            placeholder="Search account by email"
            variant="outlined"
            onChange={handleSearchChange}
          />  
          <ProfileCard
            name={userInfo ? capitalCase(userInfo.adminAccount.firstName + " " + userInfo.adminAccount.lastName) : ""}
            sub={userInfo ? userInfo.adminAccount.officer ? "Admin" : userInfo.adminAccount.superuser ? "Superuser" : "Tax Payers" : "Tax Payers"}
            dt1={userInfo ? capitalCase(userInfo.adminAccount.gender) : ""}
            dt2={userInfo ? userInfo.adminAccount.phoneNumber : ""}
            image={userInfo?.image}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
            <Typography component="h1" fontWeight="bold" color="secondary" variant="h5" textAlign="left" sx={{ mb: 2 }}>
              User Roles
            </Typography>
            <IconButton onClick={deleteAdmin} disabled={Boolean(!userInfo || !userInfo.adminAccount.officer)}>
              <Tooltip title="Remove Admin">
                <DeleteIcon fontSize="medium" />
              </Tooltip>
            </IconButton>
          </Stack>
          <Divider />
          <Grid container spacing={2} justifyContent="flex-end">
            {clearance.map(role => (
              <Grid item xs={6} md={4} key={role}>
                <FormControlLabel control={<Checkbox checked={userRoles.includes(role)} onClick={(event) => handleCheck(event, role)} disabled={!userInfo} />} label={capitalCase(getTitle(role))} />
            </Grid>
            ))}
            <Grid item xs={6} md={5}>
              {userInfo?.adminAccount.superuser ? (
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleRemoveSuperUser}
              >
                Remove as Superuser
              </Button>
              ) : (
                <Button
                  variant="outlined"
                  disabled={!userInfo}
                  fullWidth
                  onClick={() => handleCreateSuperUser()}
                  sx={{ mt: 3 }}
                >
                  Set as Superuser
                </Button>
              )}
            </Grid>
            <Grid item xs={6} md={4}>
              {userInfo?.adminAccount.officer ? (
              <Button
                variant="contained"
                onClick={() => updateAdmin()}
                fullWidth
                sx={{ mt: 3 }}
                >
                 Update Roles
              </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!userInfo}
                  onClick={() => createAdmin()}
                  sx={{ mt: 3 }}
                >
                  Make Admin
                </Button>
              )}
             
            </Grid>
          </Grid>
        </Grid>
       </Grid>
      </Paper>
      <Box sx={{ mt: 5, mb: 3 }}>
        <Typography component="h1" fontWeight="bold" color="primary" variant="h5" textAlign="left">
          Admin Accounts
        </Typography>
      </Box>
      <AccountToolbar 
        searchValue={adminSearch}
        handleChangeSearch={handleAdminChange}
      />
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {allAccounts != null && allAccounts.filter(account => account.adminAccount.firstName.includes(adminSearch)).map(account => (
          <Grid item xs={12} md={3} key={account.adminAccount.uid}>
            <AccountCard account={account} select={handleSelectAdmin} />
          </Grid>
        ))}
        {Boolean(!allAccounts || allAccounts.length == 0) && (
          <Box sx={{ 
            width: '100%',
            height: 300,
            display: 'flex',
            justifyContent: 'center',
            alignCenter: 'center'
          }}>
            <CircularProgress />
          </Box>
        )}
      </Grid>
      <Copyright />
    </Container>

    <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={() => setOpenSnackbar(false)}
      message="User role was updated successfully!"
      action={action}
    />
    </>
  )
}