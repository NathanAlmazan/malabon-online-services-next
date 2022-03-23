import React from 'react';
import Head from "next/head";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import { apiGetRequest } from '../../../../hocs/axiosRequests';
import parseCookies from '../../../../config/parseCookie';
import { SubmittedForm } from '../../../../components/building/buildingTypes';
import Stack from '@mui/material/Stack';

const StepProgress = dynamic(() => import("../../../../components/StepProgress"));
const AssessmentProgress = dynamic(() => import("../../../../components/building/assessment"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

interface Props {
    accessToken: string;
    buildingId: number;
    form: SubmittedForm;
}

export default function AsessmentPage(props: Props) {
    const { form, buildingId } = props;
  return (
    <>
        <Head>
          <title>Assessment | Building Permit</title>
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
                  Application for Building Permit
                </Typography>
          </Box>
          <Paper elevation={16} sx={{ p: 2 }}>
              <StepProgress step={2} />
          </Paper>
          <Paper elevation={16} sx={{ p: 2, mt: 4 }}>
                <Grid container spacing={5}>
                    <Grid item sm={12} md={5}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center' ,
                            justifyContent: 'center'
                        }}>
                          <Stack spacing={2}>
                              <Image 
                                  src="/icons/assess_icon.png"
                                  alt='cover image'
                                  width={300}
                                  height={300}
                              />

                              <Typography 
                                component="div" 
                                variant={'h5'} 
                                color="primary" align="center">
                                <strong>Application Assessment</strong>
                            </Typography>
                              <Typography 
                                component="div" 
                                variant="body1"
                                align="center"
                                sx={{ maxWidth: 300, fontSize: 14 }}
                              >
                                Your building application is currently being reviewed. You can vew the status of your application in this page. Thank you!
                            </Typography>
                          </Stack>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={7}>
                        <Paper elevation={18} sx={{ p: { xs: 3, md: 4 }, mt: 4 }}>
                            <AssessmentProgress approvals={form.approvals} buildingId={buildingId} />
                        </Paper>
                    </Grid>
                </Grid>
          </Paper>

          <Copyright />
        </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, params } = context;

    if (!params) return { notFound: true };
  
    const data = parseCookies(req);
  
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return {
        redirect: {
          permanent: false,
          destination: "/signin"
        }
      }
    }
  
    const result = await apiGetRequest('/building/view/' + params.buildingId, data.loggedInUser);
  
    if (result.status > 300) {
      return {
        notFound: true
      }
    }

    const formData = result.data as SubmittedForm;

    const paidPayment = formData.payments.find(payment => payment.paid || payment.rejected);

    if (paidPayment) {
      return {
        redirect: {
          permanent: false,
          destination: "/dashboard/building/claim/" + params.buildingId
        }
      }
    } 


    return {
      props: {
        accessToken: data.loggedInUser,
        buildingId: parseInt(params.buildingId as string),
        form: result.data
      }
    }
}