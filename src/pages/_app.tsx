import React, { FunctionComponent } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'

import { Header } from '../infrastructure/components/header'

interface Props {
  Component: FunctionComponent
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
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Notion tools solves the problem of recurring tasks in Notion. Instead of using workarounds, you can now fully automate your workflow."
        />
        <meta
          name="keywords"
          content="notion tools recurring tasks automation integration repeat free"
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
