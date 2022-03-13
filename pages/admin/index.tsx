import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import parseCookies from '../../config/parseCookie';
import { apiGetRequest } from '../../hocs/axiosRequests';
import Box from '@mui/material/Box';
import { capitalCase } from 'change-case';
import { useRouter } from "next/router";

const NewBusinessStats = dynamic(() => import("../../components/dashboard/NewBusiness"));
const TotalCustomers = dynamic(() => import("../../components/dashboard/Customers"));
const TasksProgress = dynamic(() => import("../../components/dashboard/Progress"));
const LatestRequest = dynamic(() => import("../../components/dashboard/LatestRequest"));
const RenewRequest = dynamic(() => import("../../components/dashboard/RenewRequest"));
const Copyright = dynamic(() => import("../../components/Copyright"));

type BusinessApproval = {
  approvalId: number;
  businessId: number;
  approved: boolean;
  approvalType: string;
  approvedAt: Date;
  officialId: number;
  remarks: string | null;
  trackNumber: number | null;
  required: boolean;
  approvalFee: number | null;
}

type BusinessOwners = {
  ownerId: number;
  surname: string;
  givenName: string;
  middleName: string;
  suffix: string | null;
  owner: boolean;
  citizenship: string | null;
  gender: string;
}

type BusinessAdresses = {
  addressId: number;
  bldgNumber: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: number;
  mainOffice: boolean;
}

type AdminAccount = {
  adminAccount: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  } 
}

interface Props {
    accessToken: string;
    account: AdminAccount,
    newBusiness: {
      forms: {
        businessId: number;
        businessName: string;
        submittedAt: Date;
        addresses: BusinessAdresses[];
        TIN: string;
        owners: BusinessOwners[];
        approvals: BusinessApproval[];
      }[]
    },
    renewForms: {
      forms: {
        business: {
          businessId: number;
          businessName: string;
          TIN: string;
          certificateId: string;
        },
        renewalId: number;
        businessId: number | null;
        permitNumber: string | null;
        receiptNumber: string | null;
        renewAt: Date;
        completed: boolean;
        businessName: string | null;
      }[];
    }
}

export default function AdminDashboard(props: Props) {
  const { account, newBusiness, renewForms } = props;
  const theme = useTheme();
  const router = useRouter();

  const handleRedirect = (path: string) => {
    router.push(path);
  }

  console.log(renewForms.forms);

  return (
    <>
     <Head>
      <title>
        Admin Dashboard | Malabon Online Services
      </title>
    </Head>
    <Container>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid
            item
            xl={12}
            lg={12}
            sm={12}
            xs={12}
          >
            <Box sx={{ mt: 3 }}>
              <Typography component="h1" variant="h5" textAlign="left">
                Good Day, <strong style={{ color: theme.palette.primary.main }}>{account && capitalCase(account.adminAccount.firstName + ' ' + account.adminAccount.lastName)}</strong>
              </Typography>
              <Typography component="p" variant="body1" textAlign="left" sx={{ color: theme.palette.primary.dark }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xl={12}
            lg={12}
            sm={12}
            xs={12}
          >
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <NewBusinessStats 
              value={newBusiness.forms.length}
            />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalCustomers 
              title="BUSINESS RENEWAL"
            />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
             <TotalCustomers 
              title="BUILING PERMIT"
            />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TasksProgress 
              value={42}
            />
          </Grid>
          <Grid
            item
            xl={12}
            lg={12}
            sm={12}
            xs={12}
          >
            <LatestRequest 
              forms={newBusiness.forms}
              viewAll={() => handleRedirect('/admin/business/register')}
            />
          </Grid>
          <Grid
            item
            xl={12}
            lg={12}
            sm={12}
            xs={12}
          >
            <RenewRequest 
              forms={renewForms.forms}
              viewAll={() => handleRedirect('/admin/business/renew')}
            />
          </Grid>
        </Grid>
        <Copyright />
    </Container>
    </>
  )
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

  const result = await apiGetRequest('/accounts/admin/search', data.loggedInUser);
  const forms = await apiGetRequest('/business/new/approve/forms', data.loggedInUser);
  const renewForms = await apiGetRequest('/business/renew/requests', data.loggedInUser);

  if (result.status > 300) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }

  return {
    props: {
      accessToken: data.loggedInUser,
      account: result.data,
      newBusiness: {
        forms: forms.data,
      },
      renewForms: {
        forms: renewForms.data
      }
    }
  }
}