import { NotionAccess, ToolConfig, User } from '../../domain/User'

export interface UserRepository {
  create(auth0UserId: User['auth0UserId']): Promise<User>
  updateNotionAccess(userId: User['auth0UserId'], notionAccess: NotionAccess): Promise<User>
  getToolConfigById(
    userId: User['auth0UserId'],
    toolConfigId: ToolConfig['id']
  ): Promise<ToolConfig>
  addToolConfig(userId: User['auth0UserId'], toolConfig: ToolConfig): Promise<User>
  updateToolConfig(userId: User['auth0UserId'], toolConfig: ToolConfig): Promise<User>
  getById(userId: User['auth0UserId']): Promise<User>
}
