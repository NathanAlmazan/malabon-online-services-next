import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';
import { capitalCase } from "change-case";
import { useRouter } from 'next/router';
import { BusinessRegistry } from './business/new/assessment/[businessId]';
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import LandscapeIcon from '@mui/icons-material/Landscape';

const ServiceCard = dynamic(() => import('../../components/dashboard/ServiceCard'));
const AppFooter = dynamic(() => import('../../components/dashboard/homePage/AppFooter'));
const HomeBanner = dynamic(() => import('../../components/dashboard/homePage/HeroBanner'));
const CustomTypography = dynamic(() => import('../../components/dashboard/homePage/Typography'));
const ShowProcess = dynamic(() => import('../../components/dashboard/homePage/ShowProcess'));
const AskHelp = dynamic(() => import('../../components/dashboard/homePage/AskHelp'));
const NewBusinessDialog = dynamic(() => import('../../components/dashboard/newBusinessDialog'));
const BuildingPermitDialog = dynamic(() => import('../../components/dashboard/BuildingDialog'));
const RenewalDialog = dynamic(() => import('../../components/dashboard/renewalDialog'));
const RealEstateDialog = dynamic(() => import('../../components/dashboard/realEstateDialog'));
const BusinessRenewDialog = dynamic(() => import('../../components/business/client/renew/RenewDialog'));
const RealEstatePayDialog = dynamic(() => import('../../components/realEstate/realEstateDialog'));

const malabonServices = [
  {
      icon: <AddBusinessIcon sx={{ width: 80, height: 80 }} color="secondary" />,
      title: 'New Business Registration',
      description: 'Register your new business online and receive your business permit in just 5 steps.',
      applyLink: '/dashboard/business/new/zoning'
  },
  {
      icon: <RestorePageIcon sx={{ width: 80, height: 80 }} color="secondary" />,
      title: 'Renewal of Business Permit',
      description: 'Renew your business permit online anytime and anywhere in just 4 steps.',
      applyLink: '/business/renew'
  },
  {
      icon: <CorporateFareIcon sx={{ width: 80, height: 80 }} color="secondary" />,
      title: 'Building Permit Registration',
      description: 'Register your new facility online and receive your business permit in just 5 steps.',
      applyLink: '/building/register'
  },
  {
    icon: <LandscapeIcon sx={{ width: 80, height: 80 }} color="secondary" />,
    title: 'Real State Tax Payment',
    description: 'Process and pay your annual real estate tax online in just 4 simple steps.',
    applyLink: '/estate/register'
  } 
];

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

const style = {
  display: { xs: "none", sm: "block" },
  width: { xs: "20rem", sm: "25rem" },
  height: { xs: "20rem", sm: "25rem" },
  marginTop: { xs: "15rem", sm: "15rem" },
  marginRight: { lg: "5rem" }
};

export default function Dashboard(props: Props) {
  const { account, ownedBusinesses, accessToken } = props;
  const theme = useTheme();
  const router = useRouter();
  const [openNewBusiness, setOpenNewBusiness] = useState<boolean>(false);
  const [openRenewal, setOpenrenewal] = useState<boolean>(false);
  const [renewDialog, setrenewDialog] = useState<boolean>(false);
  const [openBuilding, setOpenBuilding] = useState<boolean>(false);
  const [openRealEstate, setOpenRealEstate] = useState<boolean>(false);
  const [realDialog, setRealDialog] = useState<boolean>(false);

  const openDialog = (dialog: string) => {
    if (dialog == "New Business Registration") {
      setOpenNewBusiness(true);
    } else if (dialog == "Renewal of Business Permit") {
      setOpenrenewal(true);
    } else if (dialog == "Real State Tax Payment") {
      setOpenRealEstate(true);
    } else {
      setOpenBuilding(true);
    }
  }

  const proceedToPage = (path: string) => {
    router.push(path);
  }

  const proceedRenew = () => {
    setOpenrenewal(false);
    setrenewDialog(true);
  }

  const proceedRealEstate = () => {
    setOpenRealEstate(false);
    setRealDialog(true);
  }

  return (
      <>
       <Head>
          <title>
              Home | Municipal City Online Services
          </title>
        </Head>
        <HomeBanner />
        <Container id="municipal-services" className="municipal-services" maxWidth="lg">
          <Box sx={{ pt: 10, mb: 5 }}>
            <CustomTypography color="inherit" align="center" variant="h4" marked="center">
              Municipal Services
            </CustomTypography>
          </Box>
          <Grid container spacing={2}>
              {malabonServices.map(service => (
                  <Grid item xs={12} sm={6} md={3} key={service.title} >
                      <ServiceCard details={service} openDialog={openDialog} />
                  </Grid>
              ))}
          </Grid>
        </Container>
        <ShowProcess />
        <AskHelp />
        <NewBusinessDialog open={openNewBusiness} handleClose={() => setOpenNewBusiness(false)} proceed={proceedToPage} />
        <BuildingPermitDialog open={openBuilding} handleClose={() => setOpenBuilding(false)} proceed={proceedToPage}/>
        <RenewalDialog open={openRenewal} handleClose={() => setOpenrenewal(false)} proceed={proceedRenew} />
        <RealEstateDialog open={openRealEstate} handleClose={() => setOpenRealEstate(false)} proceed={proceedRealEstate} />
        <BusinessRenewDialog open={renewDialog} handleClose={() => setrenewDialog(false)} businesses={ownedBusinesses} accessToken={accessToken} uid={account.account.uid} />
        <RealEstatePayDialog open={realDialog} handleClose={() => setRealDialog(false)} accessToken={accessToken} uid={account.account.uid} />
        <AppFooter />
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

  if (userAccount.status > 300) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  return {
    props: {
      accessToken: data.loggedInUser,
      account: userAccount.data,
      ownedBusinesses: ownedBusinesses.data
    }
  }
}