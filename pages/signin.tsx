import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import { useAuth } from '../hocs/FirebaseProvider';
import { apiPostRequest } from '../hocs/axiosRequests';

interface SignInForm {
  email: string;
  password: string;
}

const SigninForm = dynamic(() => import('../components/authentication/SigninForm'));
const AuthSocial = dynamic(() => import('../components/authentication/AuthSocial'));

function SigninPage() {
  const { firebaseClass, currentUser } = useAuth();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignInForm>({
    email: '',
    password: ''
  })

  const { email, password } = formData;

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

  const signInWithEmailAndPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (firebaseClass != null) {
      firebaseClass.signInWithEmailAndPassword(email, password).then(result => {
        if (result.user.emailVerified) {
          router.push('/dashboard');
        } else {
          setErrorMessage('Unverified email. Please verify your email first.');
        }
      }).catch(error => {
        const errorMessage = (error as Error).message;
        if (errorMessage == 'Firebase: Error (auth/user-not-found).') {
          setErrorMessage('User not found.');
        } else if (errorMessage == 'Firebase: Error (auth/wrong-password).') {
          setErrorMessage('Incorrect password.');
        }
      })
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrorMessage(null);
  }

  if (currentUser != null) router.push('/');

  return (
    <>
      <Head>
        <title>
            Signin | Malabon City Online Services
        </title>
      </Head>
        <Grid container component="main" sx={{ height: '100vh' }} alignItems="center">
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("/covers/homeCover.jpg")',
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
                      <Typography variant="h2" color="white">
                          Malabon City
                      </Typography>
                      <Typography variant="h4" gutterBottom component="div" color="white">
                          Online Services
                      </Typography>
                  </Grid>
              </Grid>
          </Grid>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ p: 5 }}>
              <Typography component="h1" variant="h5" color="primary" sx={{ width: '100%', pb: 5 }}>
                <strong>Sign In</strong>
              </Typography>
              <AuthSocial
                googleSigin={signInWithGoogle}
                facebookSigin={signInWithFacebook}
              />
              <SigninForm 
                email={email}
                password={password}
                handleText={handleTextChange}
                handleSubmit={signInWithEmailAndPassword}
                error={errorMessage}
              />
          </Grid>
        </Grid>
      </>
  );
}

export default SigninPage