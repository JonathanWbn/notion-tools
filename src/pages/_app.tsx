import React, { FunctionComponent } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'

import { Header } from '../infrastructure/components/header'

interface Props {
  Component: FunctionComponent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: Record<string, any>
}

const App: FunctionComponent<Props> = ({ Component, pageProps }: Props) => {
  return (
    <UserProvider>
      <Head>
        <title>Notion tools</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script
          defer
          data-domain="notion-tools.io"
          src="https://plausible.io/js/plausible.js"
        ></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var cpm = {};
              (function(h,u,b){
              var d=h.getElementsByTagName("script")[0],e=h.createElement("script");
              e.async=true;e.src='https://cookiehub.net/c2/153365a2.js';
              e.onload=function(){u.cookiehub.load(b);}
              d.parentNode.insertBefore(e,d);
              })(document,window,cpm);
            `,
          }}
        />
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}

export default App
