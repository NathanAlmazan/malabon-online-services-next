import React from 'react';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
    handleText: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function ForgotPassword(props: Props) {
    const { email, handleText, error, handleSubmit } = props;
  return (
    <Stack component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
            <TextField
                variant="standard"
                required
                fullWidth
                type="email"
                value={email}
                onChange={handleText}
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={error != null}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
            >
                Reset Password
            </Button>
        </Stack>
        <Copyright sx={{ mt: 5 }} />
    </Stack>
  )
}

export default ForgotPassword