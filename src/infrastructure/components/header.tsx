'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactElement } from 'react'

export function Header(): ReactElement {
  const { user } = useUser()
  const pathname = usePathname()

  return (
    <header className="flex justify-between p-6 items-center">
      <Link href={user ? '/user' : '/'} className="text-3xl">
        🧰
      </Link>
      {pathname === '/user' ? (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="/api/auth/logout"
        >
          logout
        </a>
      ) : user ? (
        <Link href="/user" className="border-b border-gray-500 opacity-60 hover:opacity-100">
          my tools
        </Link>
      ) : (
        <div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className="border-b border-gray-500 opacity-60 hover:opacity-100"
            href="/api/auth/login?returnTo=/user"
          >
            login
          </a>
          {' / '}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className="border-b border-gray-500 opacity-60 hover:opacity-100"
            href="/api/auth/signup"
          >
            signup
          </a>
        </div>
      )}
    </header>
  )
}
