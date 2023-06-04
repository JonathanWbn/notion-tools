'use client'

import { UserProvider } from '@auth0/nextjs-auth0'
import { Roboto } from "next/font/google"
import { Header } from '../infrastructure/components/header'
import '../styles/globals.css'

const inter = Roboto({ weight: ['300', '400', '500'], subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <UserProvider>
          <Header />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
