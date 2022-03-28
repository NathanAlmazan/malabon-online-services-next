import React, { useState } from 'react';
import Head from 'next/head';
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import { apiGetRequest } from '../../../hocs/axiosRequests';
import parseCookies from '../../../config/parseCookie';
import { GetServerSideProps } from 'next';
import { RealEstate } from '../../../components/realEstate/realEstateTypes';

const RequestListToolbar = dynamic(() => import("../../../components/realEstate/RequestToolbar"));
const RequestListTable = dynamic(() => import("../../../components/realEstate/RequestTable"));
const PaymentListTable = dynamic(() => import("../../../components/realEstate/PaymentTable"));
const Copyright = dynamic(() => import("../../../components/Copyright"));

type AdminAccount = {
    adminAccount: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      uid: string;
    } 
}

interface Props {
  accessToken: string;
  account: AdminAccount,
  estateForms: {
    forms: RealEstate[];
    paymentForms: RealEstate[];
    claimForms: RealEstate[];
  }
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

export default function RealEstatePage(props: Props) {
  const { estateForms, accessToken, account } = props
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
        Real Estate Tax | Malabon Online Services
      </title>
    </Head>
    <Container>
      <Box sx={{ borderBottom: 1, borderColor: 'red', mt: 5 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Assessment" {...a11yProps(0)} />
          <Tab label="Payment" {...a11yProps(1)} />
          <Tab label="Release" {...a11yProps(2)} />
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
                  Real Estate Tax Assessment
              </Typography>
              <RequestListToolbar 
                  searchValue={searchValue}
                  handleChangeSearch={handleChangeSearch}
              />
              <RequestListTable 
                  searchValue={searchValue}
                  forms={estateForms.forms}
                  token={accessToken}
                  uid={account.adminAccount.uid}
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
            <Stack direction="column" spacing={3} sx={{ mt: 2 }}>
              <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Real Estate Tax Payment
              </Typography>
              <RequestListToolbar 
                  searchValue={searchValue}
                  handleChangeSearch={handleChangeSearch}
              />
              <PaymentListTable 
                  forms={estateForms.paymentForms}
              />
            </Stack>
          </motion.div>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <motion.div
            key="all"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
          >
            <Stack direction="column" spacing={3} sx={{ mt: 2 }}>
              <Typography variant="h5" textAlign="left" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                Real Estate Tax Claim
              </Typography>
              <RequestListToolbar 
                  searchValue={searchValue}
                  handleChangeSearch={handleChangeSearch}
              />
              <RequestListTable 
                  claim={true}
                  searchValue={searchValue}
                  forms={estateForms.claimForms}
                  token={accessToken}
                  uid={account.adminAccount.uid}
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
  
    const result = await apiGetRequest('/accounts/admin/search', data.loggedInUser);
    const estateForms = await apiGetRequest('/estate/approve', data.loggedInUser);
    const paymentForms = await apiGetRequest('/payments/estate/verify', data.loggedInUser);
    const claimForms = await apiGetRequest('/estate/claim', data.loggedInUser);
  
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
        estateForms: {
          forms: estateForms.data,
          paymentForms: paymentForms.data,
          claimForms: claimForms.data
        }
      }
    }
  }