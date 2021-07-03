import { FunctionComponent } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { addToolToUser, useTools } from '../infrastructure/client/api-client'

const Tools: FunctionComponent = () => {
  const { user } = useUser()
  const { tools, error } = useTools()

  if (error) return <h1>failed to load</h1>
  if (!tools) return <h1>loading...</h1>

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          {tool.name} - {tool.description}
          {user && (
            <button onClick={() => user.sub && addToolToUser(tool.id, user.sub)}>Add</button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Tools
