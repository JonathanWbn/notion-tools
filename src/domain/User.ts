import { Tool } from './Tool'

export interface ToolConfig {
  id: string
  toolId: Tool['id']
  config: Record<string, unknown>
  isActive: boolean
}

export interface NotionAccess {
  access_token: string
  workspace_name: string
  workspace_icon: string
  bot_id: string
}

export interface User {
  auth0UserId: string
  toolConfigs: ToolConfig[]
  notionAccess?: NotionAccess
  isActive: boolean
}
