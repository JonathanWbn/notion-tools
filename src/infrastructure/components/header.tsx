import { ReactElement } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

export function Header(): ReactElement {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <header className="flex justify-between p-6 items-center">
      <h1 className="text-3xl font-bold">🧰 notion tools</h1>
      {user ? (
        <Link href="/user">
          <a className="border-b border-gray-500 opacity-60 hover:opacity-100">my tools</a>
        </Link>
      ) : (
        <div>
          <a
            className="border-b border-gray-500 opacity-60 hover:opacity-100"
            href="/api/auth/login"
          >
            login
          </a>
          {' / '}
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
