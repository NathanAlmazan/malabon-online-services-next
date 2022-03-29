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
import { useAuth } from '../hocs/FirebaseProvider';
import { apiPostRequest } from '../hocs/axiosRequests';
import { SelectChangeEvent } from '@mui/material/Select';

interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  mobile: string;
}

const SignupForm = dynamic(() => import('../components/authentication/SignupForm'));
const AuthSocial = dynamic(() => import('../components/authentication/AuthSocial'));

function SignupPage() {
  const { firebaseClass, currentUser } = useAuth();
  const router = useRouter();
  const [signedUp, setSignedUp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    gender: 'male',
    mobile: '',
    email: '',
    password: ''
  })

  const { email, firstName, lastName, gender, mobile, password } = formData;

  const signInWithGoogle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (firebaseClass != null) {
      firebaseClass.signInWithGoogle().then((result) => {
        const name = result.user.displayName;

        if (name != null) {
          let firstName = name;
          var lastIndex = firstName.lastIndexOf(" ");
          firstName = firstName.substring(0, lastIndex);
          const n = name.split(" ");

          const body = JSON.stringify({
            firstName: firstName,
            lastName: n[n.length - 1],
            email: result.user.email,
            uid: result.user.uid,
            provider: "google.com"
          })

          apiPostRequest('/accounts/socialSignup', body).then((response) => {
            router.push('/dashboard');
          });
        }
        
      }).catch((error) => {
        setErrorMessage(error.message);
      })
    }
  }

  const signInWithFacebook = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (firebaseClass != null) {
      firebaseClass.signInWithFacebook().then((result) => {
        const name = result.user.displayName;

        if (name != null) {
          let firstName = name;
          var lastIndex = firstName.lastIndexOf(" ");
          firstName = firstName.substring(0, lastIndex);
          const n = name.split(" ");

          const body = JSON.stringify({
            firstName: firstName,
            lastName: n[n.length - 1],
            email: result.user.email,
            uid: result.user.uid,
            provider: "facebook.com"
          })

          apiPostRequest('/accounts/socialSignup', body).then((response) => {
            router.push('/dashboard');
          });
        }

        console.log(result);
        
      }).catch((error) => {
        setErrorMessage(error.message);
        console.log(error);
      })
    }
  }

  const signInWithEmailAndPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: mobile,
      gender: gender,
      password: password
    })

    const newAccount = await apiPostRequest('/accounts/emailSignup', body);
    if (newAccount.status < 300) {
      setSignedUp(true);
    } else {
      setErrorMessage(newAccount.message);
    }
    
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMessage(null);
  }

  const handleGenderChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, gender: event.target.value });
  }

  if (currentUser != null) router.push('/');

  return (
    <>
      <Head>
        <title>
            Signup | Malabon City Online Services
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
                          Malabon City
                      </Typography>
                      <Typography variant="h4" gutterBottom component="div">
                          Online Services
                      </Typography>
                  </Grid>
              </Grid>
          </Grid>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ p: 5 }}>
            <AnimatePresence exitBeforeEnter>
              {!signedUp ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  >
                  
                    <Typography component="h1" variant="h5" color="primary" sx={{ width: '100%', pb: 5 }}>
                      <strong>Sign Up</strong>
                    </Typography>
                    <AuthSocial
                      googleSigin={signInWithGoogle}
                      facebookSigin={signInWithFacebook}
                    />
                    <SignupForm
                      firstName={firstName}
                      lastName={lastName}
                      gender={gender}
                      mobile={mobile} 
                      email={email}
                      password={password}
                      genderChange={handleGenderChange}
                      handleText={handleTextChange}
                      handleSubmit={signInWithEmailAndPassword}
                      error={errorMessage}
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
                      Email was sent to your inbox to confirm your account.
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