import { v4 as uuid } from 'uuid'
import { ToolConfig, User } from '../../domain/User'
import { Tool } from '../../domain/Tool'
import { UserRepository } from '../repository/UserRepository'

interface CreateToolConfigRequest {
  auth0UserId: User['auth0UserId']
  toolId: Tool['id']
}

export class CreateToolConfig {
  constructor(private readonly userRepository: UserRepository) {}

  public async invoke(request: CreateToolConfigRequest): Promise<User> {
    const toolConfig = new ToolConfig(uuid(), request.toolId, {}, true)

    const user = await this.userRepository.addToolConfig(request.auth0UserId, toolConfig)

    return user
  }
}
