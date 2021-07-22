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
        <title>Notion Tools</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}

export default App
