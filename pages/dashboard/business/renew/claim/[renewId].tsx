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

const Copyright = dynamic(() => import("../../../../../components/Copyright"));

type BusinessRenewal = {
    renewalId: number;
    renewId: number | null;
    permitNumber: string | null;
    receiptNumber: string | null;
    receiptFile: string | null;
    renewAt: Date;
    completed: boolean;
    businessName: string | null;
    appointment: Date | null;
    topFile: string | null;
    quarterly: boolean;
    accountId: number;
    certificateFile: string | null;
}

type UserAccount = {
    account: {
        email: string;
        userId: number;
        uid: string;
    }
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
    renewId: number;
    rejected: Boolean;
    rejectMessage: string | null;
}

type RenewForm = BusinessRenewal & {
  payments: BusinessPayments[];
}

interface Props {
    accessToken: string;
    renewId: number;
    form: RenewForm;
}


export default function ClaimPermitPage(props : Props) {
  const { accessToken, renewId, form } = props;
  const router = useRouter();
  const [rejectedPayment, setRejectedPayment] = useState<BusinessPayments>();

  useEffect(() => {
    const rejectedPayment = form.payments.find(payment => payment.rejected);

    if (rejectedPayment) {
        setRejectedPayment(state => rejectedPayment);
    }
  }, [form])

  const handleViewSubmittedFile = () => {
    window.open(form.certificateFile as string);
  }

  return (
    <>
        <Head>
        <title>Claim Permit | Renew Business</title>
        </Head>
        <Container>
            
            <Paper elevation={16} sx={{ p: 3, mt: 5 }}>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    mb: 5
                }}>
                    <Typography component="h1" variant="h5" color="secondary" sx={{ pr: 2 }}>
                        Claim Business Permit
                    </Typography>
                </Box>
                {form.appointment ? (
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
                            {new Date(form.appointment).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

                            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 50 }} onClick={() => router.push('/dashboard/business/renew/payment/' + renewId)}>
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
                                Your business is now renewed. Please wait while we process your new official business permit. The date and time when you can claim your business permit will shown here.
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
  
    const result = await apiGetRequest('/business/renew/assess/' + parseInt(params.renewId as string), data.loggedInUser);
  
    if (result.status > 300) {
      return {
        notFound: true
      }
    }
    
  
    return {
      props: {
        accessToken: data.loggedInUser,
        renewId: parseInt(params.renewId as string),
        form: result.data
      }
    }
}

