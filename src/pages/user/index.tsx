import { UserProfile, useUser as use0AuthUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import axios from 'axios'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import useSWR from 'swr'
import { User as IUser } from '../../domain/User'
import { useTools } from '../tools'

const User: FunctionComponent = () => {
  const { tools } = useTools()
  const { user, auth0user } = useUser()

  if (!user || !auth0user || !tools) return <h1>loading...</h1>

  return (
    <>
      <h1>Profile: {auth0user.name}</h1>
      <ul>
        {user.toolConfigs.map((config) => (
          <li key={config.id}>
            {tools.find((tool) => tool.id === config.toolId).name}{' '}
            {config.isActive ? 'Active' : 'Disabled'}{' '}
            <Link href={`/user/config/${config.id}`}>Config</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const fetcher = (url: string): Promise<IUser> => axios.get(url).then((res) => res.data)

export function useUser(): { user: IUser; auth0user: UserProfile } {
  const { user: auth0user } = use0AuthUser()
  const { data: user } = useSWR(`/api/users/${auth0user?.sub}`, fetcher)

  return { user, auth0user }
}

export const getServerSideProps = withPageAuthRequired()

export default User
