import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import Typography from './Typography';

const item: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: 'default',
  color: 'primary.dark',
  fontWeight: 'medium',
};

const image = {
  height: 55,
  width: 55,
  m: 3
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: 'flex', bgcolor: '#f5d7e4', overflow: 'hidden', mt: 10 }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 10,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src="/static/themes/onepirate/productCurvyLines.png"
          alt="curvy lines"
          sx={{
            pointerEvents: 'none',
            position: 'absolute',
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" color="inherit" sx={{ mb: 10 }}>
          How it works
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <DocumentScannerIcon sx={image} />
                <Typography variant="h5" align="center">
                  Fill up the digital form and submit all requirements.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <HourglassTopIcon sx={image} />
                <Typography variant="h5" align="center">
                  Wait patiently as we assess your application. You can view the progress in your inbox.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <SendTimeExtensionIcon sx={image} />
                <Typography variant="h5" align="center">
                  Pay the issued tax amount via cash, bank or paypal to claim your permit.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;