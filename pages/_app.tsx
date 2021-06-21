import React, { FunctionComponent } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'

import Header from '../components/header'

interface Props {
  Component: FunctionComponent
  pageProps: unknown
}

const App: FunctionComponent<Props> = ({ Component, pageProps }: Props) => {
  return (
    <UserProvider>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  )
}

export default App
