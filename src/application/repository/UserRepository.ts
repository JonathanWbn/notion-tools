import { ToolConfig, User } from '../../domain/User'

export interface UserRepository {
  create(auth0UserId: User['auth0UserId']): Promise<User>
  addToolConfig(userId: User['auth0UserId'], toolConfig: ToolConfig): Promise<User>
  getById(userId: User['auth0UserId']): Promise<User>
}
