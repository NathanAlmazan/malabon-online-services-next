import React from 'react';
import Head from 'next/head';
import { CookiesProvider } from "react-cookie"
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import themes from '../themes';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import("../layout"));
const FirebaseProvider = dynamic(() => import("../hocs/FirebaseProvider"));

// Client-side cache, shared for the whole session of the user in the browser.
function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps  } = props;
  return (
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

          <ThemeProvider theme={themes}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
              <CookiesProvider>
                <FirebaseProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </FirebaseProvider>
              </CookiesProvider>
          </ThemeProvider>
      </CacheProvider>
  );
}