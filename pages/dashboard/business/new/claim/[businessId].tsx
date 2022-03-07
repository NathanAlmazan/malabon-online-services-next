import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import { apiGetRequest } from '../../../../../hocs/axiosRequests';
import parseCookies from '../../../../../config/parseCookie';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import { useRouter } from "next/router";

const StepProgress = dynamic(() => import("../../../../../components/StepProgress"));
const Copyright = dynamic(() => import("../../../../../components/Copyright"));

type BusinessRegistry = {
    registrationNumber: string;
    TIN: string;
    businessName: string;
    tradeName: string;
    telephone: string;
    mobile: string;
    email: string;
    website: string | null;
    orgType: string;
    filipinoEmployees: number;
    foreignEmployees: number;
    businessArea: number;
    totalFloors: number;
    maleEmployees: number;
    femaleEmployees: number;
    totalEmployees: number;
    lguEmployees: number;
    deliveryUnits: number;
    activity: string;
    capital: number;
    taxIncentive: boolean;
    rented: boolean;
    submittedAt: Date;
    certificateId: string | null;
    certificateFile: string | null;
    approved: boolean;
    taxAmount: number | null;
    archived: boolean;
    trackNumber: number | null;
    quarterPayment: boolean;
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

type BusinessAppointment = {
    appointmentId: number;
    businessId: number;
    schedule: Date;
    claimed: boolean;
}

interface Props {
    accessToken: string;
    businessId: number;
    form: BusinessRegistry & {
        appointment: BusinessAppointment | null;
        payments: BusinessPayments[];
    }
}

export default function ClaimPermitPage(props : Props) {
  const { accessToken, businessId, form } = props;
  const router = useRouter();
  const [appointment, setAppointment] = useState<BusinessAppointment>();
  const [rejectedPayment, setRejectedPayment] = useState<BusinessPayments>();

  useEffect(() => {
    const appointment = form.appointment;
    const rejectedPayment = form.payments.find(payment => payment.rejected);

    if (appointment) {
        setAppointment(state => appointment);
    } else if (rejectedPayment) {
        setRejectedPayment(state => rejectedPayment);
    }
  }, [form])

  const handleViewSubmittedFile = () => {
    if (form.certificateId) window.open(form.certificateId, "_blank");
    }

  return (
    <>
        <Head>
        <title>Tax Payment | New Business</title>
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
                            You can now claim your business permit on
                        </Typography>
                        <Typography variant="h5" component="h1" align="center">
                            {new Date(form.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                        <Button variant="outlined" startIcon={<DownloadDoneIcon />} sx={{ borderRadius: 50, mt: 3 }} onClick={() => handleViewSubmittedFile()}>
                            View Business Permit
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

                            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 50 }} onClick={() => router.push('/dashboard/business/new/payment/' + businessId)}>
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
                                Your new business is now registered. Please wait while we process your official business permit. The date and time when you can claim your business permit will shown here.
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
  
    const result = await apiGetRequest('/business/new/form/search/' + params.businessId, data.loggedInUser);
  
    if (result.status > 300) {
      return {
        notFound: true
      }
    }
    
  
    return {
      props: {
        accessToken: data.loggedInUser,
        businessId: parseInt(params.businessId as string),
        form: result.data
      }
    }
}

