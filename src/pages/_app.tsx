import React, { FunctionComponent } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import 'tailwindcss/tailwind.css'

import { Header } from '../infrastructure/components/header'

interface Props {
  Component: FunctionComponent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: Record<string, any>
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
