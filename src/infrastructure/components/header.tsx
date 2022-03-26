import { ReactElement } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Header(): ReactElement {
  const { user } = useUser()
  const router = useRouter()

  return (
    <header className="flex justify-between p-6 items-center">
      <Link href={user ? '/user' : '/'}>
        <a className="text-3xl">🧰</a>
      </Link>
      {router.asPath === '/user' ? (
        // eslint-disable-next-line @next/next/no-html-link-for-pages
        <a
          className="border-b border-gray-500 opacity-60 hover:opacity-100"
          href="/api/auth/logout"
        >
          logout
        </a>
      ) : user ? (
        <Link href="/user">
          <a className="border-b border-gray-500 opacity-60 hover:opacity-100">my tools</a>
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
