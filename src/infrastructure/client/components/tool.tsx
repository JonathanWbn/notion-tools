import { ReactElement } from 'react'
import { Tool as ITool } from '../../../domain/Tool'

interface Props {
  tool: ITool
  onAdd: (toolId: ITool['id']) => Promise<void>
}

export function Tool({ tool, onAdd }: Props): ReactElement {
  return (
    <li>
      {tool.name} - {tool.description}
      <button onClick={() => onAdd(tool.id)}>Add</button>
    </li>
  )
}
