import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import axios from 'axios'
import { FunctionComponent } from 'react'
import useSWR from 'swr'
import { User as IUser } from '../domain/User'

const fetcher = (url: string): Promise<IUser> => axios.get(url).then((res) => res.data)

const User: FunctionComponent = () => {
  const { user: auth0user } = useUser()
  const { data: user, error } = useSWR(`/api/users/${auth0user?.sub}`, fetcher)

  if (error) return <h1>failed to load</h1>
  if (!user || !auth0user) return <h1>loading...</h1>

  return (
    <>
      <h1>Profile: {auth0user.name}</h1>
      <p>{JSON.stringify(user, null, 4)}</p>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
