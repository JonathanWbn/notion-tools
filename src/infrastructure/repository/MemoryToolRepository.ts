import { ToolRepository } from '../../application/repository/ToolRepository'
import { Tool } from '../../domain/Tool'

const tools: Tool[] = [
  {
    id: 'recurring-tasks',
    name: 'Recurring Tasks',
    description: 'A simple way of automatically creating recurring tasks based on a schedule.',
    config: {},
    isActive: true,
  },
]

export class MemoryToolRepository implements ToolRepository {
  getById(toolId: Tool['id']): Tool {
    return tools.find((tool) => tool.id === toolId)
  }

  getAll(): Tool[] {
    return tools.filter((tool) => tool.isActive)
  }
}
