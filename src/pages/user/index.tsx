import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { FunctionComponent } from 'react'
import { useTools, useUser } from '../../infrastructure/client/api-client'

const User: FunctionComponent = () => {
  const { tools } = useTools()
  const { user, auth0user } = useUser()

  if (!user || !auth0user || !tools) return <h1>loading...</h1>

  return (
    <>
      <h1>Profile: {auth0user.name}</h1>
      {user.notionAccess ? (
        'Connected to Notion'
      ) : (
        <a href="https://api.notion.com/v1/oauth/authorize?client_id=e2305792-b84e-4d00-bffb-a026ebed4f56&redirect_uri=https://notion-tools.io/api/notion/connect&response_type=code">
          Connect to Notion
        </a>
      )}
      <ul>
        {user.toolConfigs.map((config) => {
          const tool = tools.find((tool) => tool.id === config.toolId)
          if (!tool) return null
          return (
            <li key={config.id}>
              {tool.name} {config.isActive ? 'Active' : 'Disabled'}{' '}
              <Link href={`/user/config/${config.id}`}>Config</Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
