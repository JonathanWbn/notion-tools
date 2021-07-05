import { ReactElement } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'

export function Header(): ReactElement {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (user) {
    return (
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/user">Profile</Link>
            </li>
            <li>
              <Link href="/tools">Tools</Link>
            </li>
            <li>
              <a href="/api/auth/logout">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }

  return <a href="/api/auth/login">Login</a>
}
