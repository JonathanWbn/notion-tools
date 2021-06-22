import { Tool } from '../../domain/Tool'

export interface ToolRepository {
  getById(toolId: Tool['id']): Tool
  getAll(): Tool[]
}
