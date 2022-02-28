import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';
import { capitalCase } from "change-case";

const ServiceCard = dynamic(() => import('../../components/dashboard/ServiceCard'));

const malabonServices = [
  {
      image: '/covers/business_apply.jpg',
      title: 'Online New Business Registration',
      description: 'Register your new business online and receive your business permit in just 5 steps.',
      applyLink: '/dashboard/business/new/zoning'
  },
  {
      image: '/covers/renewal_business.jpg',
      title: 'Online Renewal of Business Permit',
      description: 'Renew your business permit online anytime and anywhere in just 5 steps.',
      applyLink: '/business/renew'
  },
  {
      image: '/covers/building_apply.jpg',
      title: 'Online Building Permit Registration',
      description: 'Register your new facility online and receive your business permit in just 5 steps.',
      applyLink: '/building/register'
  }
];

function Copyright() {
  return (
      <footer>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ m: 7 }}>
              {'Copyright © '}
              CITY GOVERNMENT OF MALABON
              {' '}
              {new Date().getFullYear()}
              {'.'}
          </Typography>
      </footer>
  );
}

interface Props {
  accessToken: string;
  account: {
      account: {
          userId: number;
          firstName: string;
          lastName: string;
      }
  }
}

export default function Dashboard(props: Props) {
  const { account } = props;
  const theme = useTheme();

  return (
      <Container>
        <Box sx={{ mt: 5, mb: 5 }}>
          <Typography component="h1" variant="h5" textAlign="left">
            Good Day, <strong style={{ color: theme.palette.primary.main }}>{account && capitalCase(account.account.firstName + ' ' + account.account.lastName)}</strong>
          </Typography>
          <Typography component="p" variant="body1" textAlign="left" sx={{ color: theme.palette.primary.dark }}>
            How can we help you?
          </Typography>
        </Box>
        <Grid container spacing={2}>
            {malabonServices.map(service => (
                <Grid item xs={12} sm={6} md={4} key={service.title} >
                    <ServiceCard details={service} />
                </Grid>
            ))}
        </Grid>

        <Copyright />

      </Container>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const data = parseCookies(req);

  if (Object.keys(data).length === 0 && data.constructor === Object) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin"
      }
    }
  }

  if (data.loggedInUser == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin"
      }
    }
  }

  const result = await apiGetRequest('/accounts/admin/search', data.loggedInUser);

  if (result.status < 300) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin"
      }
    }
  }

  const userAccount = await apiGetRequest('/accounts/search', data.loggedInUser);

  return {
    props: {
      accessToken: data.loggedInUser,
      account: userAccount.data
    }
  }
}