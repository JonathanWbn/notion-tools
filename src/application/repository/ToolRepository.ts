import { Tool } from '../../domain/Tool'

export type ToolCreatePayload = Pick<Tool, 'name' | 'description' | 'config'>

export type ToolUpdatePayload = Partial<Pick<Tool, 'name' | 'description' | 'config'>>

export interface ToolRepository {
  create(tool: ToolCreatePayload): Promise<Tool>
  update(toolId: Tool['id'], tool: ToolUpdatePayload): Promise<Tool>
  disable(toolId: Tool['id']): Promise<Tool>
  getById(toolId: Tool['id']): Promise<Tool>
  getAll(): Promise<Tool[]>
}
