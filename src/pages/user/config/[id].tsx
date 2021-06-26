import { UserProfile, useUser as use0AuthUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FunctionComponent } from 'react'
import useSWR, { mutate } from 'swr'
import { User as IUser } from '../../../domain/User'
import { useTools } from '../../tools'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user, auth0user } = useUser()

  if (!user || !auth0user || !tools) return <h1>loading...</h1>

  const toolConfig = user.toolConfigs.find((config) => config.id === id)
  const tool = tools.find((tool) => tool.id === toolConfig.toolId)

  async function disableTool() {
    await axios.post(`/api/users/${user.auth0UserId}/toolConfig/${toolConfig.id}/disable`)
    mutate(`/api/users/${auth0user.sub}`)
  }

  return (
    <>
      <h1>Tool: {tool.name}</h1>
      <p>{JSON.stringify(toolConfig)}</p>
      <button onClick={disableTool}>Disable</button>
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
