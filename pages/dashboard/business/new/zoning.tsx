import React from 'react';
import Head from "next/head";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import parseCookies from '../../../../config/parseCookie';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

const StepProgress = dynamic(() => import("../../../../components/StepProgress"));
const ZoningPage = dynamic(() => import("../../../../components/business/client/zoning"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

interface Props {
  accessToken: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface BusinessTypes {
  typeId: number;
  typeName: string;
  zoneId: number;
}

export default function ZoningBusiness({ accessToken }: Props) {
  const [cookie, setCookie] = useCookies(["registerBusiness"]);
  const router = useRouter();

  const handleSubmit = (location: Location, business: BusinessTypes) => {
    setCookie("registerBusiness", JSON.stringify({
      location: location,
      business: business
    }), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    })

    router.push("/dashboard/business/new/form");
  }

  return (
    <>
        <Head>
          <title>Zoning | New Business</title>
        </Head>
        <Container>
          <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              mt: 5, 
              mb: 5
            }}>
                <Typography component="h1" variant="h5" color="secondary" sx={{ pr: 2 }}>
                  Application for New Business Permit
                </Typography>
          </Box>
          <Paper elevation={16} sx={{ p: 2 }}>
              <StepProgress step={0} />
          </Paper>
          <Paper elevation={16} sx={{ p: 2, mt: 4 }}>
              <ZoningPage accessToken={accessToken} mapsKey="AIzaSyBampCnnbMpDkGIkQmZRGjU8YFARfo13Ns" onSubmit={handleSubmit} />
          </Paper>

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

  return {
    props: {
      accessToken: data.loggedInUser
    }
  }
}