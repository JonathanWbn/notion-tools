import { Tool } from './Tool'

export interface ToolConfig {
  id: string
  toolId: Tool['id']
  config: Record<string, unknown>
  isActive: boolean
}

export interface User {
  auth0UserId: string
  toolConfigs: ToolConfig[]
  isActive: boolean
}
