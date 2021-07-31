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
        <meta
          name="description"
          content="A set of tools to automate things in Notion (e.g. recurring tasks)"
        />
        <meta
          name="keywords"
          content="notion tools recurring tasks automation integration repeat"
        />
        <meta name="author" content="Jonathan Wieben" />
        <meta
          name="google-site-verification"
          content="42MP1RP9DRZu3YefHgPeqdmpnI9WQfrHCS2sAbTlbMI"
        />
        <script
          defer
          data-domain="notion-tools.io"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}

export default App
