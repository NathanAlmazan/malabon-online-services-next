import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import parseCookies from '../../../../config/parseCookie';
import { apiGetRequest } from '../../../../hocs/axiosRequests';

const RequestListTable = dynamic(() => import("../../../../components/business/admin/new/RequestTable"));
const PaymentListTable = dynamic(() => import("../../../../components/business/admin/new/PaymentTable"));
const RequestListToolbar = dynamic(() => import("../../../../components/business/admin/new/RequestToolbar"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

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

type BusinessPayments = {
  paymentId: number;
  amount: string;
  paid: boolean;
  newBusiness: boolean;
  issuedAt: Date;
  transactionId: string | null;
  paidAt: Date | null;
  receipt: string | null;
  businessId: number;
  rejected: boolean;
  rejectMessage: string | null;
}

type AdminAccount = {
  adminAccount: {
      email: string;
      userId: number;
      uid: string;
  },
  roles: string[]
}

interface Props {
  accessToken: string;
  account: AdminAccount;
  forms: {
    businessId: number;
    businessName: string;
    submittedAt: Date;
    addresses: BusinessAdresses[];
    approved: boolean;
    trackNumber: number | null;
    TIN: string;
    owners: BusinessOwners[];
    approvals: BusinessApproval[];
    payments: BusinessPayments[];
  }[];
  claimForms: {
    businessId: number;
    businessName: string;
    submittedAt: Date;
    addresses: BusinessAdresses[];
    approved: boolean;
    trackNumber: number | null;
    TIN: string;
    owners: BusinessOwners[];
    approvals: BusinessApproval[];
    payments: BusinessPayments[];
  }[];
  paymentForms: {
    businessId: number;
    businessName: string;
    submittedAt: Date;
    addresses: BusinessAdresses[];
    approved: boolean;
    trackNumber: number | null;
    TIN: string;
    owners: BusinessOwners[];
    approvals: BusinessApproval[];
    payments: BusinessPayments[];
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BusinessRequests(props: Props) {
  const { forms, claimForms, paymentForms, account } = props;
  const [searchValue, setSearchValue] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
    <Head>
      <title>
        New Business | Municipal Online Services
      </title>
    </Head>
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'red', mt: 5 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Assessment" {...a11yProps(0)} />
          <Tab label="Fire" {...a11yProps(1)} disabled={!account.roles.includes("BFP")} />
          <Tab label="Payment" {...a11yProps(2)} />
          <Tab label="Release" {...a11yProps(3)} />
        </Tabs>
      </Box>
          <TabPanel value={tabValue} index={0}>
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
            >
              <Stack direction="column" spacing={3} sx={{ mt: 2 }}>
                <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Applications for Assessment
                </Typography>
                <RequestListToolbar 
                  searchValue={searchValue}
                  handleChangeSearch={handleChangeSearch}
                />
                <RequestListTable 
                  forms={forms}
                  searchValue={searchValue}
                />
              </Stack>
            </motion.div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
            >
              <Stack direction="column" spacing={3} sx={{ mt: 4 }}>
                <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Fire Assessment
                </Typography>
                <RequestListToolbar 
                  searchValue={searchValue}
                  handleChangeSearch={handleChangeSearch}
                  fire={true}
                />
                <RequestListTable 
                  forms={forms.filter(form => form.trackNumber != null)}
                  fire={true}
                  searchValue={searchValue}
                />
              </Stack>
            </motion.div>
          </TabPanel>
       
          <TabPanel value={tabValue} index={2}>
            <motion.div
              key="assess"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
            <Stack direction="column" spacing={3} sx={{ mt: 4 }}>
              <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Verify Bank Deposits
              </Typography>
              <RequestListToolbar 
                searchValue={searchValue}
                handleChangeSearch={handleChangeSearch}
              />
                <PaymentListTable 
                  forms={paymentForms}
                />
            </Stack>
            </motion.div>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <motion.div
              key="claim"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
            <Stack direction="column" spacing={3} sx={{ mt: 4 }}>
              <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Release of Business Permit
              </Typography>
              <RequestListToolbar 
                searchValue={searchValue}
                handleChangeSearch={handleChangeSearch}
              />
                <RequestListTable 
                  forms={claimForms}
                  searchValue={searchValue}
                />
            </Stack>
            </motion.div>
          </TabPanel>

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

  const account = await apiGetRequest('/accounts/admin/search', data.loggedInUser);
  const result = await apiGetRequest('/business/new/approve/forms', data.loggedInUser);
  const paymentForms = await apiGetRequest('/payments/business/verify', data.loggedInUser);
  const claimForms = await apiGetRequest('/business/new/applications/claim', data.loggedInUser);

  if (result.status > 300 || claimForms.status > 300 || paymentForms.status > 300) {
    return {
      notFound: true
    }
  }
  

  return {
    props: {
      accessToken: data.loggedInUser,
      account: account.data,
      forms: result.data,
      claimForms: claimForms.data,
      paymentForms: paymentForms.data
    }
  }
}