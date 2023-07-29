import { Header } from '../components/header'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Metadata } from 'next'
import { Roboto } from 'next/font/google'

const inter = Roboto({ weight: ['300', '400', '500'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notion tools',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  description:
    'Notion tools solves the problem of recurring tasks in Notion. Instead of using workarounds, you can now fully automate your workflow.',
  keywords: 'notion tools recurring tasks automation integration repeat free',
  authors: [{ name: 'Jonathan Wieben', url: 'https://jonathanwieben.com/' }],
}

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
