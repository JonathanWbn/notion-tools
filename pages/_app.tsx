import React, { FunctionComponent } from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'

interface Props {
  Component: FunctionComponent
  pageProps: unknown
}

const App: FunctionComponent<Props> = ({ Component, pageProps }: Props) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default App
