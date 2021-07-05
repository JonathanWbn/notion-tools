import { FunctionComponent } from 'react'
import { addToolToUser, useTools } from '../infrastructure/client/api-client'
import { Tool } from '../infrastructure/client/components/tool'

const Tools: FunctionComponent = () => {
  const { tools } = useTools()

  if (!tools) return <h1>loading...</h1>

  return (
    <ul>
      {tools.map((tool) => (
        <Tool key={tool.id} tool={tool} onAdd={addToolToUser} />
      ))}
    </ul>
  )
}

export default Tools
