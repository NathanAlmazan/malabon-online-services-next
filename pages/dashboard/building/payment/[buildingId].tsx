import { GetServerSideProps } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { styled, useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import PaymentsIcon from '@mui/icons-material/Payments';
import { motion, AnimatePresence } from "framer-motion";
import { Paypal as PaypalIcon } from '../../../../icons/paypal';
import parseCookies from '../../../../config/parseCookie';
import { apiGetRequest, apiPostRequest } from '../../../../hocs/axiosRequests';
import Stack from '@mui/material/Stack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import uploadFileToFirebase from '../../../../hocs/uploadFile';
import braintree from "braintree-web";
import { useRouter } from "next/router";
import { SubmittedForm, BuildingPayments } from '../../../../components/building/buildingTypes';

const StepProgress = dynamic(() => import("../../../../components/StepProgress"));
const PaypalContainer = dynamic(() => import("../../../../components/business/client/payment/paypal"), { ssr: false });
const BankDeposit = dynamic(() => import("../../../../components/business/client/payment/bankDeposit"));
const Copyright = dynamic(() => import("../../../../components/Copyright"));

const SeverityPillRoot = styled('span')(({ theme }: { theme: any }) => {
    const backgroundColor = "#FFFF";
    const color = theme.palette.primary.main;
  
    return {
      alignItems: 'center',
      backgroundColor,
      borderRadius: 12,
      color,
      cursor: 'default',
      display: 'inline-flex',
      flexGrow: 0,
      flexShrink: 0,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 2,
      fontWeight: 600,
      justifyContent: 'center',
      letterSpacing: 0.5,
      minWidth: 20,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    };
  });

type UserAccount = {
    account: {
        email: string;
        userId: number;
        uid: string;
    }
}

interface Props {
    accessToken: string;
    buildingId: number;
    form: SubmittedForm;
    clientKey: {
        clientKey: string;
    },
    account: UserAccount;
}

export default function RegistrationPayment(props: Props) {
  const { form, clientKey, account, accessToken, buildingId } = props;
  const theme = useTheme();
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<string>("Bank Deposit");
  const [totalTax, setTotalTax] = useState<BuildingPayments>();
  const [bankDepositSlip, setBankDepositSlip] = useState<File>();
  const [cashProof, setCashProof] = useState<File>();
  const [deviceData, setDeviceData] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    braintree.client.create({
        authorization: clientKey.clientKey
      }).then(function (clientInstance) {
      
        return braintree.dataCollector.create({
          client: clientInstance
        }).then(function (dataCollectorInstance) {

          const deviceData = dataCollectorInstance.deviceData;
          setDeviceData(state => deviceData);
        });
      }).catch(function (err) {
        setError((err as Error).message);
      });
    
    }, [clientKey])

  useEffect(() => {
    const taxAmount = form.payments.filter(payment => !payment.paid);

    setTotalTax(state => taxAmount[0]);

  }, [form])

  const handleViewFile = (pathFile: string | undefined) => {
    if (pathFile) window.open(pathFile, "_blank");
  }

    const handleSubmitBankSlip = (file: File) => {
        setBankDepositSlip(file);
    }

    const handleCashSlip = (file: File) => {
      setCashProof(file);
  }

    const handleSubmitBankDeposit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (bankDepositSlip) {
            setLoading(true);
            const uploadedFile = await uploadFileToFirebase(account.account.uid, bankDepositSlip, bankDepositSlip.name);

            if (uploadedFile && totalTax) {
                const body = JSON.stringify({
                    paymentId: totalTax.paymentId,
                    receiptURL: uploadedFile
                })
                const submitPayment = await apiPostRequest('/payments/building/bank', body, accessToken);

                if (submitPayment.status > 300) {
                    setError(submitPayment.message);
                } else {
                    router.push("/dashboard/building/claim/" + buildingId);
                }
            }
            setLoading(false);

        } else setError("Transaction proof is required.");
    }

    const handleCashSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (cashProof) {
          setLoading(true);
          const uploadedFile = await uploadFileToFirebase(account.account.uid, cashProof, cashProof.name);

          if (uploadedFile && totalTax) {
              const body = JSON.stringify({
                  paymentId: totalTax.paymentId,
                  receiptURL: uploadedFile
              })
              const submitPayment = await apiPostRequest('/payments/building/bank', body, accessToken);

              if (submitPayment.status > 300) {
                  setError(submitPayment.message);
              } else {
                  router.push("/dashboard/building/claim/" + buildingId);
              }
          }
          setLoading(false);

      } else setError("Transaction proof is required.");
    }

    const handlePaypalPayment = async (paymentNonce: string) => {
        if (totalTax && deviceData) {
            setLoading(true);
            const body = JSON.stringify({
                paymentId: totalTax.paymentId,
                paymentNonce: paymentNonce,
                amount: parseFloat(totalTax.amount),
                deviceData: deviceData
            })

            const submitPayment = await apiPostRequest('/payments/building/paypal', body, accessToken);

            if (submitPayment.status > 300) {
                setError(submitPayment.message);
            } else {
              router.push("/dashboard/building/claim/" + buildingId);
            }

            setLoading(false);
        }
    }

  return (
    <>
        <Head>
          <title>Tax Payment | Building Permit</title>
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
              <StepProgress step={3} />
          </Paper>
          <Paper elevation={16} sx={{ p: 3, mt: 4 }}>
                <Grid container spacing={5} justifyContent="center" alignItems="center">
                    <Grid item sm={12} md={5}>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            alignItems: 'center' ,
                            justifyContent: 'center'
                        }}>
                            <Paper variant="outlined" sx={{ borderColor: 'primary.main', width: 320 }}>
                                <Stack direction="column" alignItems="center" justifyContent="center" spacing={1} sx={{ height: 200, backgroundColor: "primary.main" }}>
                                    <SeverityPillRoot theme={theme}>
                                        {form.payments.length > 1 ? "Quarter Payment" : "One Time Payment"}
                                    </SeverityPillRoot>
                                    <Stack direction="row" spacing={1} alignItems="start" justifyContent="center">
                                        <Typography variant="h4" color="white" sx={{ pt: 2 }}>
                                            ₱
                                        </Typography>
                                        <Typography variant="h1" color="white">
                                            {totalTax && totalTax.amount}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ p: 3 }} spacing={2}>
                                    {form.approvals.map((approval) =>
                                        <Stack key={approval.approvalType} direction="row" justifyContent="space-between">
                                            <Typography variant="body1" sx={{ maxWidth: 200 }}>
                                                {approval.approvalType}
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontSize: 16, fontWeight: 500 }}>
                                                {"₱" + approval.approvalFee}
                                            </Typography> 
                                        </Stack>
                                    )}
                                </Stack>

                                <Box sx={{ width: '100%', p: 2 }}>
                                    <Button fullWidth variant="contained" onClick={event => handleViewFile(form.files.find(file => file.documentType == "Tax Order of Payment")?.fileURL)} size="large" sx={{ borderRadius: 50 }}>
                                        View Tax Order of Payment
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={7} sx={{ width: '100%' }}>
                        <Paper elevation={10} sx={{ p: { xs: 3, md: 4 }, mt: 4 }}>
                            <Typography 
                                component="div" 
                                variant="h4"
                                color="primary" align="center" 
                                sx={{ 
                                    minHeight: 80, 
                                    width: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center' ,
                                    justifyContent: 'start',
                                    mb: 3
                                }}>
                                <strong>{paymentMode}</strong>
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button fullWidth size="large" color="secondary" variant={paymentMode == "Bank Deposit" ? "contained" : "outlined"} onClick={() => setPaymentMode("Bank Deposit")}>
                                    <AccountBalanceIcon />
                                </Button>
                                <Button fullWidth size="large" color="secondary" variant={paymentMode == "Cashier" ? "contained" : "outlined"} onClick={() => setPaymentMode("Cashier")}>
                                    <PaymentsIcon />
                                </Button>
                                <Button fullWidth size="large" color="secondary" variant={paymentMode == "Paypal" ? "contained" : "outlined"} onClick={() => setPaymentMode("Paypal")}>
                                    <SvgIcon
                                        color="action"
                                        fontSize="large"
                                        sx={{ height: 50, width: 50, transform: 'scale(2)' }}
                                    >
                                        <PaypalIcon />
                                    </SvgIcon>
                                </Button>
                            </Stack>
                            <AnimatePresence exitBeforeEnter>
                                {paymentMode == "Paypal" ? (
                                    <motion.div
                                        key="paypal"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                    >
                                        <PaypalContainer 
                                            clientKey={clientKey.clientKey} 
                                            handlePaypalPayment={handlePaypalPayment}
                                            loading={loading}
                                            totalAmount={parseFloat(totalTax ? totalTax.amount : '0')}
                                        />
                                    </motion.div>
                                ): (
                                    paymentMode == "Cashier" ? (
                                      <motion.div
                                          key="cash"
                                          initial={{ opacity: 0, x: 100 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -100 }}
                                      >
                                          <BankDeposit 
                                              uploadFile={handleCashSlip}
                                              uploaded={Boolean(cashProof)}
                                              loading={loading}
                                              submitBankDeposit={handleCashSubmit}
                                          />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                          key="bank"
                                          initial={{ opacity: 0, x: 100 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -100 }}
                                      >
                                          <BankDeposit 
                                              uploadFile={handleSubmitBankSlip}
                                              uploaded={Boolean(bankDepositSlip)}
                                              loading={loading}
                                              submitBankDeposit={handleSubmitBankDeposit}
                                          />
                                      </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </Paper>
                    </Grid>
                </Grid>
          </Paper>

          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            message={error}
          />

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
    const clientKey = await apiGetRequest('/payments/paypal/client', data.loggedInUser);
    const account = await apiGetRequest('/accounts/search', data.loggedInUser);
  
    if (result.status > 300) {
      return {
        notFound: true
      }
    }
    
  
    return {
      props: {
        accessToken: data.loggedInUser,
        buildingId: parseInt(params.buildingId as string),
        form: result.data,
        clientKey: clientKey.data,
        account: account.data
      }
    }
}