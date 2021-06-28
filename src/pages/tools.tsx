import { FunctionComponent } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { Tool } from '../domain/Tool'
import { useUser } from '@auth0/nextjs-auth0'

const Tools: FunctionComponent = () => {
  const { user } = useUser()
  const { tools, error } = useTools()

  if (error) return <h1>failed to load</h1>
  if (!tools) return <h1>loading...</h1>

  async function addToolToUser(toolId: string) {
    await axios.post('/api/users/toolConfig', {
      auth0UserId: user.sub,
      toolConfig: {},
      toolId,
    })
  }

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          {tool.name} - {tool.description}
          {user && <button onClick={() => addToolToUser(tool.id)}>Add</button>}
        </li>
      ))}
    </ul>
  )
}

const fetcher = (url: string): Promise<Tool[]> => axios.get(url).then((res) => res.data)

export function useTools(): { tools: Tool[]; error: Error } {
  const { data, error } = useSWR('/api/tools', fetcher)

  return { tools: data, error }
}

export default Tools