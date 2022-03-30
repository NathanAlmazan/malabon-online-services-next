import * as React from 'react';
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from './Typography';
import SupportIcon from '@mui/icons-material/Support';

function ProductSmokingHero() {
  return (
    <Container
      id="helpSupport"
      component="section"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 9, pb: 9 }}
    >
        <SupportIcon
            sx={{ width: 60, height: 60, mb: 5, mt: 3 }}
        />
      <Button
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
      >
        <Typography variant="h4" component="span">
          Got any questions? Need help?
        </Typography>
      </Button>
      
      <Stack direction="row" spacing={4} mt={5}>
        <Stack direction="column" spacing={2}>
            <Typography color="inherit" align="center" variant="h6" marked="center">
                Landline #
            </Typography>
            <Typography color="primary" align="center" variant="h4">
                736-8876
            </Typography>
        </Stack>
        <Stack direction="column" spacing={2}>
            <Typography color="inherit" align="center" variant="h6" marked="center">
                Mobile #
            </Typography>
            <Typography color="primary" align="center" variant="h4">
                9178861255
            </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ProductSmokingHero;