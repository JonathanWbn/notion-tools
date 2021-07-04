import { FunctionComponent } from 'react'
import { addToolToUser, useTools } from '../infrastructure/client/api-client'

const Tools: FunctionComponent = () => {
  const { tools } = useTools()

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
