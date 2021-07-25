import { ToolRepository } from '../../application/repository/ToolRepository'
import { Tool } from '../../domain/Tool'

const tools: Tool[] = [
  {
    id: 'recurring-tasks',
    name: 'Recurring task',
    description: 'A simple way of automatically creating recurring tasks based on a schedule.',
    isActive: true,
  },
]

export class MemoryToolRepository implements ToolRepository {
  getById(toolId: Tool['id']): Tool {
    const tool = tools.find((tool) => tool.id === toolId)

    if (!tool) {
      throw new Error('No tool found.')
    }

    return tool
  }

  getAll(): Tool[] {
    return tools.filter((tool) => tool.isActive)
  }
}
