import { UserProvider } from '@auth0/nextjs-auth0'
import { Roboto } from "next/font/google"
import Head from 'next/head'
import React, { FunctionComponent } from 'react'
import { Header } from '../infrastructure/components/header'
import '../styles/globals.css'

const inter = Roboto({ weight: ['300', '400', '500'], subsets: ['latin'] })

interface Props {
  Component: FunctionComponent
  pageProps: Record<string, any>
}

const App: FunctionComponent<Props> = ({ Component, pageProps }: Props) => {
  return (
    <UserProvider>
      <Head>
        <title>Notion tools</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}

export default App
