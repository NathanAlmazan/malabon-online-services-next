import React from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { GetServerSideProps } from 'next';
import parseCookies from '../config/parseCookie';
import { apiGetRequest } from '../hocs/axiosRequests';

export default function Home() {

  return (
      <Container sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
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

  const result = await apiGetRequest('/accounts/admin/search', data.loggedInUser as string);

  if (result.status < 300) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin"
      }
    }
  }
  

  return {
    redirect: {
      permanent: false,
      destination: "/dashboard"
    }
  }
}