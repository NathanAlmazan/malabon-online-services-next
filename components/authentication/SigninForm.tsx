import React, { useState } from 'react';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
          CITY GOVERNMENT MUNICIPALITY
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

interface Props {
  email: string;
  password: string;
  handleText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

export default function SigninForm({ email, password, error, handleText, handleSubmit }: Props) {
    const [visible, setVisible] = useState<boolean>(false);
    
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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Link variant="subtitle2" href="/signup">
            {"Don't have account?"}
          </Link>

          <Link variant="subtitle2" href="/password/reset">
            Forgot password?
          </Link>
        </Stack>
        
       
        <Button
            type="submit"
            fullWidth
            variant="contained"
        >
            Sign In
        </Button>
    
        <Copyright sx={{ mt: 5 }} />
    </Stack>
  )
}