import { v4 as uuid } from 'uuid'
import { ToolConfig, User } from '../../domain/User'
import { UserRepository } from '../repository/UserRepository'

interface CreateToolConfigRequest {
  auth0UserId: User['auth0UserId']
  toolId: ToolConfig['id']
  toolConfig: ToolConfig['config']
}

export class CreateToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateToolConfigRequest): Promise<User> {
    const toolConfig: ToolConfig = {
      id: uuid(),
      toolId: request.toolId,
      config: request.toolConfig,
      isActive: true,
      executedAt: [],
    }

    const user = await this.userRepository.addToolConfig(request.auth0UserId, toolConfig)

    return user
  }
}
