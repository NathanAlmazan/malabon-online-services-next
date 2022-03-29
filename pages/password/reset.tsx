import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useAuth } from '../../hocs/FirebaseProvider';
import { apiPostRequest } from '../../hocs/axiosRequests';
import { SelectChangeEvent } from '@mui/material/Select';

interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  mobile: string;
}

const ForgotPassword = dynamic(() => import('../../components/authentication/ForgotPassword'));

function SignupPage() {
  const { firebaseClass, currentUser } = useAuth();
  const router = useRouter();
  const [resetPass, setResetPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorMessage(null);
  }

  if (currentUser != null) router.push('/');

  const handleForgotPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firebaseClass != null) {
      firebaseClass.forgotPassword(email).then((result) => {
        setResetPass(true);
      }).catch((error) => {
        setErrorMessage(error.message);
      })
    }
  }

  return (
    <>
      <Head>
        <title>
            Signup | Municipal City Online Services
        </title>
      </Head>
    
        <Grid container component="main" sx={{ height: '100vh' }} alignItems="center">
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("/covers/city_hall.png")',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'linear-gradient(0deg, rgba(255, 0, 150, 0.3), rgba(255, 0, 150, 0.3))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%'
            }}
          >
              <Grid container 
                  justifyContent="start" 
                  alignItems="end" 
                  direction="row"
                  spacing={3}
                  sx={{ height: '100%', p: 5, display: { xs: 'none', md: 'flex' } }}
              >
                  <Grid item>
                      <Avatar alt="malabon logo" src="/icons/malabon_logo.png" sx={{ width: 120, height: 120 }}/>
                  </Grid>
                  <Grid item>
                      <Typography variant="h2">
                          Municipal City
                      </Typography>
                      <Typography variant="h4" gutterBottom component="div">
                          Online Services
                      </Typography>
                  </Grid>
              </Grid>
          </Grid>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ p: 5 }}>
            <AnimatePresence exitBeforeEnter>
              {!resetPass ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  >
                  
                    <Typography component="h1" variant="h5" color="primary" sx={{ width: '100%', pb: 5 }}>
                      <strong>Forgot Password</strong>
                    </Typography>
                   
                   <ForgotPassword 
                        email={email}
                        error={errorMessage}
                        handleText={handleTextChange}
                        handleSubmit={handleForgotPassword}
                   />
                  
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      flexDirection: 'column'
                  }}>
                    <Image 
                      src="/covers/sent_image.png"
                      alt="sent confirmation"
                      width={300}
                      height={400}
                    />
                    <Typography component="h1" variant="h6" color="primary" align="center" sx={{ width: '100%', pb: 5 }}>
                      Email was sent to your inbox to reset your password.
                    </Typography>
                  </Box>
                </motion.div>
              )}
            
            </AnimatePresence>
          </Grid>
        </Grid>
      </>
  );
}

export default SignupPage