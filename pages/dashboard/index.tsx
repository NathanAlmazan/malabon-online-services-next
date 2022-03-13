import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';
import { capitalCase } from "change-case";
import { useRouter } from 'next/router';
import { BusinessRegistry } from './business/new/assessment/[businessId]';

const ServiceCard = dynamic(() => import('../../components/dashboard/ServiceCard'));
const NewBusinessDialog = dynamic(() => import('../../components/dashboard/newBusinessDialog'));
const RenewalDialog = dynamic(() => import('../../components/dashboard/renewalDialog'));
const BusinessRenewDialog = dynamic(() => import('../../components/business/client/renew/RenewDialog'));

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
  ownedBusinesses: BusinessRegistry[];
  accessToken: string;
  account: {
      account: {
          userId: number;
          firstName: string;
          lastName: string;
          uid: string;
      }
  }
}

export default function Dashboard(props: Props) {
  const { account, ownedBusinesses, accessToken } = props;
  const theme = useTheme();
  const router = useRouter();
  const [openNewBusiness, setOpenNewBusiness] = useState<boolean>(false);
  const [openRenewal, setOpenrenewal] = useState<boolean>(false);
  const [renewDialog, setrenewDialog] = useState<boolean>(false);

  const openDialog = (dialog: string) => {
    if (dialog == "Online New Business Registration") {
      setOpenNewBusiness(true);
    } else if (dialog == "Online Renewal of Business Permit") {
      setOpenrenewal(true);
    }
  }

  const proceedToPage = (path: string) => {
    router.push(path);
  }

  const proceedRenew = () => {
    setOpenrenewal(false);
    setrenewDialog(true);
  }

  return (
      <>
       <Head>
          <title>
              Home | Malabon City Online Services
          </title>
        </Head>
        <Box sx={{
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'flex-start',
          wisth: '100vw',
          height: 400,
          backgroundImage: 'url("/covers/city_hall.png")',
          backgroundRepeat: 'no-repeat',
          background: 'linear-gradient(0deg, rgba(255, 0, 150, ), rgba(255, 0, 150, 0.5))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
            <Box sx={{ ml: 5, pb: 3 }}>
              <Typography variant="h5" sx={{ color: theme.palette.primary.dark }}>
                Welcome to
              </Typography>
              <Typography variant="h3" align="center" sx={{ color: theme.palette.primary.main }}>
                Malabon City Online Services
              </Typography>
            </Box>
        </Box>
        <Container maxWidth="lg">
          <Box sx={{ mt: 8, mb: 5 }}>
            <Typography component="p" variant="h5" textAlign="center" sx={{ color: theme.palette.primary.dark }}>
              How can we help you today, <strong style={{ color: theme.palette.primary.main }}>{account && capitalCase(account.account.firstName + ' ' + account.account.lastName)}</strong>?
            </Typography>
          </Box>
          <Grid container spacing={2}>
              {malabonServices.map(service => (
                  <Grid item xs={12} sm={6} md={4} key={service.title} >
                      <ServiceCard details={service} openDialog={openDialog} />
                  </Grid>
              ))}
          </Grid>
        </Container>
        <NewBusinessDialog open={openNewBusiness} handleClose={() => setOpenNewBusiness(false)} proceed={proceedToPage} />
        <RenewalDialog open={openRenewal} handleClose={() => setOpenrenewal(false)} proceed={proceedRenew} />
        <BusinessRenewDialog open={renewDialog} handleClose={() => setrenewDialog(false)} businesses={ownedBusinesses} accessToken={accessToken} uid={account.account.uid} />
        <Copyright />
      </>
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
  const ownedBusinesses = await apiGetRequest('/business/renew/owned', data.loggedInUser);

  return {
    props: {
      accessToken: data.loggedInUser,
      account: userAccount.data,
      ownedBusinesses: ownedBusinesses.data
    }
  }
}