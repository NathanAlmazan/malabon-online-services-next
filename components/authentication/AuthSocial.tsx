import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props {
    googleSigin: (event: React.MouseEvent<HTMLButtonElement>) => void;
    facebookSigin: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AuthSocial({ googleSigin, facebookSigin }: Props) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={googleSigin}>
          <Icon icon={googleFill} color="#DF3E30" height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={facebookSigin}>
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}