import { ReactElement } from 'react'
import { Tool } from '../../../domain/Tool'

interface Props {
  tool: Tool
  onAdd: (toolId: Tool['id']) => Promise<void>
}

export function Tool({ tool, onAdd }: Props): ReactElement {
  return (
    <li>
      {tool.name} - {tool.description}
      <button onClick={() => onAdd(tool.id)}>Add</button>
    </li>
  )
}
