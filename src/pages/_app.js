import React from 'react';
import { AppProps } from 'next/app';
import '../polyfills';
import '../styles/globals.css'; // Include if you have global styles

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;