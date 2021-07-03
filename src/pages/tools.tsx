import { FunctionComponent } from 'react'
import { addToolToUser, useTools } from '../infrastructure/client/api-client'

const Tools: FunctionComponent = () => {
  const { tools, error } = useTools()

  if (error) return <h1>failed to load</h1>
  if (!tools) return <h1>loading...</h1>

  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          {tool.name} - {tool.description}
          <button onClick={() => addToolToUser(tool.id)}>Add</button>
        </li>
      ))}
    </ul>
  )
}

export default Tools
