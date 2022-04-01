import * as React from 'react';
import Typography from './Typography';
import { experimentalStyled as styled } from '@mui/material/styles';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import ProductHeroLayout from "./ProductHeroLayout";
import Box from '@mui/material/Box';

const backgroundImage =
  '/covers/city_hall.png';

  const ButtonRoot = styled(MuiButton)(({ theme, size }) => ({
    borderRadius: 0,
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: theme.typography.h1.fontFamily,
    padding: theme.spacing(2, 4),
    fontSize: theme.typography.pxToRem(14),
    boxShadow: 'none',
    '&:active, &:focus': {
      boxShadow: 'none',
    },
    ...(size === 'small' && {
      padding: theme.spacing(1, 3),
      fontSize: theme.typography.pxToRem(13),
    }),
    ...(size === 'large' && {
      padding: theme.spacing(2, 5),
      fontSize: theme.typography.pxToRem(16),
    }),
  }));
  
  // See https://mui.com/guides/typescript/#usage-of-component-prop for why the types uses `C`.
  export function Button<C extends React.ElementType>(
    props: ButtonProps<C, { component?: C }>,
  ) {
    return <ButtonRoot {...props} />;
  }

export default function HeroBanner() {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <Box
        component="img"
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Municipal Online Services
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { xs: 5, md: 10 } }}
      >
        Secure, Fast and Convenient way to process your permits
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="large"
        component="a"
        href="#municipal-services"
        sx={{ minWidth: 200 }}
      >
        Start
      </Button>
    </ProductHeroLayout>
  );
}