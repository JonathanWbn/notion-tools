import { User } from '../../domain/User'

export interface UserRepository {
  create(auth0UserId: User['auth0UserId']): Promise<User>
  // addToolConfig(userId: User['id'], config: ToolConfig['config']): Promise<User>
  // updateToolConfig(
  //   userId: User['id'],
  //   toolConfigId: ToolConfig['id'],
  //   config: ToolConfig['config']
  // ): Promise<User>
  // disableToolConfig(userId: User['id'], toolConfigId: ToolConfig['id']): Promise<User>
  // disable(userId: User['id']): Promise<User>
  getById(userId: User['auth0UserId']): Promise<User>
}
