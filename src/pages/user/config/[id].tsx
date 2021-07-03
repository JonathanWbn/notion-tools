import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import type { Database } from '@notionhq/client/build/src/api-types'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FunctionComponent, useState } from 'react'
import { mutate } from 'swr'
import { disableToolConfig, useTools, useUser } from '../../../infrastructure/client/api-client'

const User: FunctionComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { tools } = useTools()
  const { user, auth0user } = useUser()
  const [databases, setDatabases] = useState<Database[]>([])

  if (!tools || !user) return <h1>loading...</h1>

  const toolConfig = user.toolConfigs.find((config) => config.id === id)
  if (!toolConfig) {
    return <h1>No config found.</h1>
  }
  const tool = tools.find((tool) => tool.id === toolConfig.toolId)
  if (!tool) {
    return <h1>No tool found.</h1>
  }

  async function showDatabases() {
    const { data } = await axios.get('/api/notion/databases')

    setDatabases(data.results)
  }

  async function disableTool() {
    if (!user || !auth0user || !toolConfig) {
      throw 'Cannot disable tool'
    }
    await disableToolConfig(toolConfig.id, user.auth0UserId)
    mutate(`/api/users/${auth0user.sub}`)
  }

  return (
    <>
      <h1>Tool: {tool.name}</h1>
      <p>{JSON.stringify(toolConfig)}</p>
      <button onClick={disableTool}>Disable</button>
      <button onClick={showDatabases}>Load databases</button>
      <select>
        {databases.map((database) => (
          <option key={database.id} value={database.id}>
            {database.title[0].plain_text}
          </option>
        ))}
      </select>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default User
