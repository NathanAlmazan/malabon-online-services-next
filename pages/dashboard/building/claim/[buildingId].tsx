import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import { apiGetRequest } from '../../../../hocs/axiosRequests';
import parseCookies from '../../../../config/parseCookie';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import { useRouter } from "next/router";
import { SubmittedForm, BuildingPayments } from '../../../../components/building/buildingTypes';

const StepProgress = dynamic(() => import("../../../../components/StepProgress"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

interface Props {
    accessToken: string;
    buildingId: number;
    form: SubmittedForm;
}

export default function ClaimPermitPage(props : Props) {
  const { accessToken, buildingId, form } = props;
  const router = useRouter();
  const [appointment, setAppointment] = useState<Date | null>(null);
  const [rejectedPayment, setRejectedPayment] = useState<BuildingPayments>();

  useEffect(() => {
    const appointment = form.releaseDate;
    const rejectedPayment = form.payments.find(payment => payment.rejected);

    if (appointment) {
        setAppointment(state => appointment);
    } else if (rejectedPayment && !form.approved) {
        setRejectedPayment(state => rejectedPayment);
    }
  }, [form])

  const handleViewSubmittedFile = () => {
    window.open(form.certificateFile as string);
  }

  return (
    <>
        <Head>
        <title>Claim Permit | Building Permit</title>
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
                <StepProgress step={4} />
            </Paper>
            <Paper elevation={16} sx={{ p: 3, mt: 4 }}>
                {appointment ? (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: 2
                    }}>
                        <Image 
                            src="/icons/claim_icon.png"
                            alt='cover image'
                            width={400}
                            height={400}
                        />
                        <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                            You can now claim your building permit on
                        </Typography>
                        <Typography variant="h5" component="h1" align="center">
                            {new Date(form.releaseDate as Date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                        <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => handleViewSubmittedFile()}>
                            View Building Permit
                        </Button>
                    </Box>
                ) : (
                    rejectedPayment ? (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                        }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="h5" component="h1" color="primary" sx={{ mb: 2 }}>
                                Sorry, there is an issue in your payment
                            </Typography>
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350, mb: 4 }}>
                                {rejectedPayment.rejectMessage && rejectedPayment.rejectMessage} Please send your proof of payment again.
                            </Typography>

                            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 50 }} onClick={() => router.push('/dashboard/business/new/payment/' + buildingId)}>
                                Go Back to Payment
                            </Button>
                        </Box>

                    ) : (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: 2
                        }}>
                            <Image 
                                src="/icons/claim_icon.png"
                                alt='cover image'
                                width={400}
                                height={400}
                            />
                            <Typography variant="h5" component="h1" color="primary" sx={{ mb: 2 }}>
                                Congratulations!
                            </Typography>
                            <Typography variant="body1" component="h1" align="center" sx={{ maxWidth: 350 }}>
                                Your establishment is now registered. Please wait while we process your official business permit. The date and time when you can claim your buuilding permit will shown here.
                            </Typography>
                        </Box>
                    )
                )}
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
    
  
    return {
      props: {
        accessToken: data.loggedInUser,
        buildingId: parseInt(params.buildingId as string),
        form: result.data
      }
    }
}

