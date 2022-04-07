import React, { useState } from 'react';
import Head from 'next/head';
import Grid from "@mui/material/Grid";
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import { apiGetRequest } from '../../hocs/axiosRequests';
import { GetServerSideProps } from 'next';
import parseCookies from '../../config/parseCookie';

const ProfileCard = dynamic(() => import("../../components/dashboard/profile/ProfileCard"));
const SettingsCard = dynamic(() => import("../../components/dashboard/profile/SettingCard"));
const Copyright = dynamic(() => import("../../components/Copyright"));

type Accounts = {
    userId: number;
    uid: string;
    provider: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    gender: string | null;
    email: string;
    phoneNumber: string | null;
    isActive: boolean;
    superuser: boolean;
    officer: boolean;
}

interface Props {
    accessToken: string;
    account: {
        account: Accounts
    }
}

export default function AccountProfile(props: Props) {
    const { account, accessToken } = props;
  const [text, setText] = useState<string>("");

  return (
    <>
        <Head>
            <title>
               Your Profile | Municipal Online Services
            </title>
        </Head>
        <Grid container direction="column">
          <Grid item xs={12} md={6}>
            <Box
                component="img"
                sx={{
                    width: "100%",
                    height: "35vh",
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    position: "relative"
                }}
                src="/covers/city_hall.png"
            />
          </Grid>

          {/* COMPONENTS */}
          <Grid item xs={12} md={6}>
                <Grid
                    container
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{
                        position: "absolute",
                        maxWidth: '95vw',
                        top: "20vh",
                        left: { xs: 20, sm: "auto" },
                        px: { xs: 0, md: 7 }
                    }}
                >
                    {/* PROFILE CARD */}
                    <Grid item md={3}>
                    <ProfileCard
                        name={account.account.firstName + " " + account.account.lastName}
                        sub={account.account.officer ? "Admin" : "Tax Payer"}
                    ></ProfileCard>
                    </Grid>

                    {/* SETTINGS CARD */}
                    <Grid item md={9}>
                    <SettingsCard
                        account={account.account}
                        token={accessToken}
                    ></SettingsCard>
                    </Grid>
                </Grid>
            </Grid> 
            <Copyright />
        </Grid>
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
  
    const result = await apiGetRequest('/accounts/search', data.loggedInUser);
  
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
        account: result.data
      }
    }
  }
